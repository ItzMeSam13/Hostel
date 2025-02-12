import { PrismaClient } from "@prisma/client";
import bcrypt, { compare } from "bcrypt";
import validator from "validator";

const prisma = new PrismaClient();

export async function create_user(req, res) {
	const { email, phone, name, password } = req.body;

	if (!email || !phone || !name || !password) {
		return res.status(400).json({ error: "All fields are required" });
	}

	if (!validator.isEmail(email)) {
		return res.status(400).json({ error: "Invalid email" });
	}

	if (!validator.isMobilePhone(phone)) {
		return res.status(400).json({ error: "Invalid phone na umber" });
	}

	if (password.length < 6) {
		return res
			.status(400)
			.json({ error: "Password must be at least 6 characters" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const user = await prisma.user.create({
			data: {
				email,
				phone,
				name,
				password: hashedPassword,
			},
		});

		console.log(user);

		return res.status(201).json({ message: "User created successfully", user });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function login_user(req, res) {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: "All fields are required" });
	}
	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid password" });
		}
		return res.status(201).json({ message: "Login successful", user });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
