// app/api/user/signup/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod"; // Ensure you have zod installed

const client = new PrismaClient();

// Define a Zod schema for input validation for regular user signup
const userSignupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email format"),
    // If phone is REQUIRED, remove .optional().or(z.literal(''))
    phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number format (10-15 digits, optional +)"), // Phone is now REQUIRED by Zod
    password: z.string().min(8, "Password must be at least 8 characters long"),
    // 'company' field is explicitly omitted for regular user signup
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log("Backend received signup body:", body); // Debugging: Check incoming payload

        const validationResult = userSignupSchema.safeParse(body);
        if (!validationResult.success) {
            console.error("Zod Validation Errors:", validationResult.error.flatten().fieldErrors);
            return NextResponse.json(
                { message: "Validation Error", errors: validationResult.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        // Destructure data. Since phone is required by schema, it will always be here.
        const { name, email, phone, password } = validationResult.data;

        // Check for existing user by email in the single User table
        const existingUser = await client.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "A user with this email already exists!" }, { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        // *** Setting the role to "user" for regular user signups ***
        const newUser = await client.user.create({
            data: {
                name,
                email,
                phone, // <--- Now phone is directly used, as it's a required string
                password: hashedPassword,
                role: "user", // Explicitly set role to "user"
                // 'company' field is not included here, as it's optional in schema and not provided by user signup
            },
            select: { // Select only safe fields to return
                id: true,
                name: true,
                email: true,
                role: true,
                // Do NOT return password
            }
        });

        return NextResponse.json({
            message: "User account added successfully! Please sign in.",
            user: newUser,
        }, { status: 201 });

    } catch (err: any) {
        console.error("General Server Error in /api/user/signup:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
