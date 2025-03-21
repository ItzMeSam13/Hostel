import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";
import supabase from "../utils/supabase.js";

const prisma = new PrismaClient();

// **User Signup**
export async function create_user(req, res) {
    const { email, phone, name, password } = req.body;

    // Validate inputs
    if (!email || !phone || !name || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email" });
    }
    if (!validator.isMobilePhone(phone)) {
        return res.status(400).json({ error: "Invalid phone number" });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
        // Register user in Supabase
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Store user details in Prisma (except password, since Supabase handles it)
        const user = await prisma.user.create({
            data: {
                email,
				password,
                phone,
                name,
                supabase_id: data.user.id, // Store Supabase ID
            },
        });

        return res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// **User Login**
export async function login_user(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Login using Supabase authentication
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Fetch user details from Prisma
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found in database" });
        }

        return res.status(200).json({ message: "Login successful", user, session: data.session });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
