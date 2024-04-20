import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const packages = await prisma.packageData.findMany();
                res.status(200).json(packages);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the package data" });
            }
            break;
        case 'POST':
            try {
                // Assuming req.body is structured correctly
                const packageData = await prisma.packageData.create({
                    data: req.body,
                });
                res.status(201).json(packageData);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the package data" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
