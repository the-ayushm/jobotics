// app/api/extract-skills/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { client } from "@/lib/prisma";

// PDF parsing library
import pdf from 'pdf-parse';
// DOCX parsing library
import mammoth from 'mammoth';

console.log("Loaded /api/extract-skills route");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    console.log("--- API: /api/extract-skills POST request received ---");
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'user' || !session.user.id) {
            console.warn("Unauthorized attempt to extract skills.");
            return NextResponse.json({ message: 'Unauthorized: Only authenticated users can extract skills.' }, { status: 401 });
        }

        const userId = session.user.id;
        const { resumeUrl, mimeType } = await req.json(); // NEW: Receive mimeType

        if (!resumeUrl || !mimeType) { // mimeType is now required
            return NextResponse.json({ message: 'Resume URL and MIME type are required for skill extraction.' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not set in environment variables.");
            return NextResponse.json({ message: 'Server configuration error: Gemini API key missing.' }, { status: 500 });
        }

        // 1. Fetch Resume Content (binary for parsing)
        let resumeTextContent = '';
        try {
            const resumeResponse = await fetch(resumeUrl);
            if (!resumeResponse.ok) {
                throw new Error(`Failed to fetch resume from URL: ${resumeResponse.statusText}`);
            }
            const arrayBuffer = await resumeResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Node.js Buffer

            // 2. Parse content based on MIME type
            if (mimeType === 'application/pdf') {
                const data = await pdf(buffer);
                resumeTextContent = data.text;
            } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
                // For DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document)
                // For DOC (application/msword) - mammoth might need extra setup or conversion
                const result = await mammoth.extractRawText({ buffer: buffer });
                resumeTextContent = result.value;
            } else if (mimeType.startsWith('text/')) {
                resumeTextContent = buffer.toString('utf8'); // Assume it's plain text
            } else {
                return NextResponse.json({ message: `Unsupported resume MIME type: ${mimeType}` }, { status: 400 });
            }
            
            if (resumeTextContent.length < 50) {
                console.warn("Fetched resume content is very short, might be invalid or empty.");
                // Decide whether to return error or proceed with limited content
                // For now, allow to proceed but warn.
            }

        } catch (fetchParseError: any) {
            console.error("Error fetching or parsing resume content:", fetchParseError.message);
            return NextResponse.json({ message: `Failed to read or parse resume content: ${fetchParseError.message}. Ensure it's a valid PDF/DOCX.` }, { status: 400 });
        }

        // 3. Use Gemini API to Extract Skills
        let extractedSkills: string[] = [];
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Extract a comprehensive list of distinct technical skills, programming languages, frameworks, tools, and soft skills from the following resume text. Return the skills as a JSON array of strings. Do not include any other text or formatting. If no skills are found, return an empty array [].

Resume Text:
"${resumeTextContent}"

Example Output:
["JavaScript", "React", "Node.js", "Express.js", "MongoDB", "SQL", "Python", "Django", "AWS", "Docker", "Git", "Agile", "Communication", "Problem-solving"]
`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            try {
                extractedSkills = JSON.parse(text);
                if (!Array.isArray(extractedSkills) || !extractedSkills.every(s => typeof s === 'string')) {
                    throw new Error("Gemini did not return a valid JSON array of strings.");
                }
            } catch (parseError) {
                console.error("Failed to parse Gemini's JSON response, attempting fallback:", text);
                // Fallback if Gemini doesn't return perfect JSON: try to split by common delimiters
                extractedSkills = text.split(/[\n,;]+/).map(s => s.trim()).filter(s => s.length > 0);
            }

            console.log("Extracted Skills from Gemini:", extractedSkills);

        } catch (geminiError: any) {
            console.error("Error calling Gemini API:", geminiError.message);
            return NextResponse.json({ message: `Failed to extract skills using AI: ${geminiError.message}` }, { status: 500 });
        }

        // 4. Save Extracted Skills to User Profile in Database
        await client.user.update({
            where: { id: userId },
            data: {
                skills: extractedSkills,
            },
        });

        console.log(`Skills extracted and saved for user ${userId}.`);
        return NextResponse.json({ message: 'Skills extracted and saved successfully!', skills: extractedSkills }, { status: 200 });

    } catch (error: any) {
        console.error("Error in skill extraction API:", error);
        return NextResponse.json(
            { message: 'Failed to extract skills.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    } 
}
