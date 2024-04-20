import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const users = await prisma.userData.findMany({
                    include: {
                        LinkListData: true,
                        PaymentData: true,
                    },
                });
                res.status(200).json(users);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the users data" });
            }
            break;
        case 'POST':
            try {
                // Assuming req.body is structured correctly
                const user = await prisma.userData.create({
                    data: req.body,
                });
                res.status(201).json(user);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the user" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
