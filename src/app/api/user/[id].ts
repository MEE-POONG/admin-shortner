import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                const user = await prisma.userData.findUnique({
                    where: {
                        id: id as string,
                    },
                    include: {
                        LinkListData: true,
                        PaymentData: true,
                    },
                });
                res.status(200).json(user);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the user data" });
            }
            break;
        case 'PUT':
            try {
                const user = await prisma.userData.update({
                    where: {
                        id: id as string,
                    },
                    data: req.body,
                });
                res.status(200).json(user);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while updating the user" });
            }
            break;
        case 'DELETE':
            try {
                await prisma.userData.delete({
                    where: {
                        id: id as string,
                    },
                });
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: "An error occurred while deleting the user" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
