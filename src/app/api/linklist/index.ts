import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const links = await prisma.linkListData.findMany();
                res.status(200).json(links);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'An error occurred while fetching links' });
            }
            break;
        case 'POST':
            const { title, origUrl, shortUrl, pathShortUrl, userId } = req.body;
            try {
                const link = await prisma.linkListData.create({
                    data: {
                        title,
                        origUrl,
                        shortUrl,
                        pathShortUrl,
                        createdBy: 'system', // Assume a default system user
                        updateBy: 'system',
                        userId
                    }
                });
                res.status(201).json(link);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'An error occurred while creating the link' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}