import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'POST':
            try {
                const { username, firstname, lastname, email, password, tel, image } = req.body;

                // Check for existing user
                const existingUser = await prisma.userData.findFirst({
                    where: {
                        OR: [
                            { username },
                            { email }
                        ]
                    }
                });

                if (existingUser) {
                    const field = existingUser.username === username ? 'username' : 'email';
                    res.status(409).json({ error: `มีบัญชีที่ใช้ ${field} อยู่แล้ว` });
                    return;
                }

                // Create new user
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await prisma.userData.create({
                    data: {
                        username,
                        firstname,
                        lastname,
                        email,
                        password: hashedPassword,
                        tel,
                        image,
                        createdBy: 'system',
                        updateBy: 'system'
                    },
                });

                // Prepare data to send back
                const userDataToSend = {
                    id: newUser.id,
                    username: newUser.username,
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    email: newUser.email,
                    tel: newUser.tel,
                    image: newUser.image,
                    createdAt: newUser.createdAt,
                    createdBy: newUser.createdBy,
                    updateAt: newUser.updateAt,
                    updateBy: newUser.updateBy
                };

                res.status(201).json({ message: 'User created successfully', user: userDataToSend });
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the user." });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
