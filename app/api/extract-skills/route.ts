// app/api/extract-skills/route.ts
export const dynamic = "force-dynamic";

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
        const { resumeUrl, mimeType } = await req.json();

        if (!resumeUrl || !mimeType) {
            return NextResponse.json({ message: 'Resume URL and MIME type are required for skill extraction.' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not set in environment variables.");
            return NextResponse.json({ message: 'Server configuration error: Gemini API key missing.' }, { status: 500 });
        }

        let resumeTextContent = '';
        let buffer: Buffer;

        // 1. Fetch Resume Content (binary)
        try {
            console.log(`Fetching resume from: ${resumeUrl}`);
            const resumeResponse = await fetch(resumeUrl);
            if (!resumeResponse.ok) {
                throw new Error(`HTTP error! status: ${resumeResponse.status}`);
            }
            const arrayBuffer = await resumeResponse.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
            console.log(`Resume fetched. Size: ${buffer.length} bytes. MIME Type: ${mimeType}`);

        } catch (fetchError: any) {
            console.error("Error fetching resume content from Vercel Blob:", fetchError.message);
            return NextResponse.json({ message: `Failed to download resume: ${fetchError.message}` }, { status: 400 });
        }

        // 2. Parse content based on MIME type
        try {
            if (mimeType === 'application/pdf') {
                console.log("Attempting to parse PDF...");
                const data = await pdf(buffer);
                resumeTextContent = data.text;
                console.log(`PDF parsed. Length: ${resumeTextContent.length}`);
            } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                console.log("Attempting to parse DOCX...");
                const result = await mammoth.extractRawText({ buffer: buffer });
                resumeTextContent = result.value;
                console.log(`DOCX parsed. Length: ${resumeTextContent.length}`);
            } else if (mimeType === 'application/msword') {
                console.warn("Attempting to parse DOC (older Word format). This might fail. Consider converting to DOCX.");
                const result = await mammoth.extractRawText({ buffer: buffer });
                resumeTextContent = result.value;
                console.log(`DOC parsed. Length: ${resumeTextContent.length}`);
            } else if (mimeType.startsWith('text/')) {
                console.log("Assuming plain text resume...");
                resumeTextContent = buffer.toString('utf8');
            } else {
                console.error(`Unsupported resume MIME type: ${mimeType}`);
                return NextResponse.json({ message: `Unsupported resume file type. Please upload PDF, DOCX, or plain text.` }, { status: 400 });
            }
            
            if (resumeTextContent.length < 50) {
                console.warn("Parsed resume content is very short. It might be empty or unparseable.");
            }

        } catch (parseError: any) {
            console.error(`Error parsing resume content (MIME: ${mimeType}):`, parseError.message);
            return NextResponse.json({ message: `Failed to parse resume content. Ensure it's a valid and readable PDF/DOCX. Error: ${parseError.message}` }, { status: 400 });
        }

        // 3. Use Gemini API to Extract Skills
        let extractedSkills: string[] = [];
        if (resumeTextContent.length > 0) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

                const prompt = `Extract a comprehensive list of distinct technical skills, programming languages, frameworks, tools, and soft skills from the following resume text. Return the skills as a JSON array of strings. Do not include any markdown formatting, backticks, or other text. If no skills are found, return an empty array [].

Resume Text:
"${resumeTextContent}"

Example Output:
["JavaScript", "React", "Node.js", "Express.js", "MongoDB", "SQL", "Python", "Django", "AWS", "Docker", "Git", "Agile", "Communication", "Problem-solving"]
`;
                console.log("Calling Gemini API for skill extraction...");
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().trim();

                // Strip any markdown code fence wrapping if present
                const cleanedText = text
                    .replace(/^```json\s*/i, '')
                    .replace(/^```\s*/i, '')
                    .replace(/\s*```$/i, '')
                    .trim();

                try {
                    extractedSkills = JSON.parse(cleanedText);
                    if (!Array.isArray(extractedSkills) || !extractedSkills.every(s => typeof s === 'string')) {
                        throw new Error("Gemini did not return a valid JSON array of strings.");
                    }
                } catch (parseError) {
                    console.error("Failed to parse Gemini's JSON response, attempting fallback:", cleanedText);
                    extractedSkills = cleanedText.split(/[\n,;]+/).map(s => s.replace(/["'\[\]]/g, '').trim()).filter(s => s.length > 0);
                }

                console.log("Extracted Skills from Gemini:", extractedSkills);

            } catch (geminiError: any) {
                console.error("Error calling Gemini API:", geminiError.message);
                return NextResponse.json({ message: `Failed to extract skills using AI: ${geminiError.message}. Check Gemini API key or quota.` }, { status: 500 });
            }
        } else {
            console.warn("Resume text content was empty after parsing. Skipping Gemini API call.");
            extractedSkills = [];
        }

        // 4. Save Extracted Skills to User Profile in Database (merge with existing)
        const currentUser = await client.user.findUnique({
            where: { id: userId },
            select: { skills: true },
        });
        const updatedSkills = Array.from(new Set([...(currentUser?.skills || []), ...extractedSkills]));

        await client.user.update({
            where: { id: userId },
            data: {
                skills: updatedSkills,
            },
        });

        console.log(`Skills extracted and saved for user ${userId}.`);
        return NextResponse.json({ message: 'Skills extracted and saved successfully!', skills: updatedSkills }, { status: 200 });

    } catch (error: any) {
        console.error("Error in skill extraction API:", error);
        return NextResponse.json(
            { message: 'Failed to extract skills.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
