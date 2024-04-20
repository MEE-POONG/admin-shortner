import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'POST':
            const { username, password } = req.body;

            try {
                const user = await prisma.userData.findUnique({
                    where: { username }
                });

                if (!user || !user.password) {
                    // Handle cases where user is not found or password is null
                    res.status(404).json({ error: 'User not found or no password set.' });
                    return;
                }

                const isPasswordValid = user.password && await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({ error: 'Invalid credentials.' });
                    return;
                }

                // สร้างข้อมูลที่ต้องการส่งกลับไปหลังจากผู้ใช้เข้าสู่ระบบสำเร็จ
                const userDataToSend = {
                    id: user.id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    tel: user.tel,
                    image: user.image,
                    createdAt: user.createdAt,
                    createdBy: user.createdBy,
                    updateAt: user.updateAt,
                    updateBy: user.updateBy
                };

                res.status(200).json({ message: 'Login successful. User authenticated.', user: userDataToSend });

            } catch (error) {
                res.status(500).json({ error: 'Server error during login process.' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
