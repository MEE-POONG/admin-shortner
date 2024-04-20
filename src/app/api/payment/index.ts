import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const payments = await prisma.paymentData.findMany({
                    include: {
                        packageData: true,
                        user: true,
                    },
                });
                res.status(200).json(payments);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the payment data" });
            }
            break;
        case 'POST':
            try {
                const payment = await prisma.paymentData.create({
                    data: {
                        ...req.body,
                        packageId: req.body.packageId || null, // Handle optional packageId
                        userId: req.body.userId || null, // Handle optional userId
                    },
                });
                res.status(201).json(payment);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the payment data" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
