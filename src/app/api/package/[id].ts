import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                const packageData = await prisma.packageData.findUnique({
                    where: {
                        id: id as string,
                    },
                });
                res.status(200).json(packageData);

            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the package data" });
            }
            break;
        case 'PUT':
            try {
                const packageData = await prisma.packageData.update({
                    where: {
                        id: id as string,
                    },
                    data: req.body,
                });
                res.status(200).json(packageData);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while updating the package data" });
            }
            break;
        case 'DELETE':
            try {
                await prisma.packageData.delete({
                    where: {
                        id: id as string,
                    },
                });
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: "An error occurred while deleting the package data" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
