import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                const link = await prisma.linkListData.findUnique({
                    where: {
                        id: id as string,
                    },
                    include: {
                        user: true, // Include related user data
                    },
                });
                res.status(200).json(link);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the link data" });
            }
            break;
        case 'PUT':
            try {
                const link = await prisma.linkListData.update({
                    where: {
                        id: id as string,
                    },
                    data: req.body,
                });
                res.status(200).json(link);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while updating the link data" });
            }
            break;
        case 'DELETE':
            try {
                await prisma.linkListData.delete({
                    where: {
                        id: id as string,
                    },
                });
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: "An error occurred while deleting the link data" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
