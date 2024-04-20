import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                const payment = await prisma.paymentData.findUnique({
                    where: {
                        id: id as string,
                    },
                    include: {
                        packageData: true,
                        user: true,
                    },
                });
                res.status(200).json(payment);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the payment data" });
            }
            break;
        case 'PUT':
            try {
                const payment = await prisma.paymentData.update({
                    where: {
                        id: id as string,
                    },
                    data: req.body,
                });
                res.status(200).json(payment);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while updating the payment data" });
            }
            break;
        case 'DELETE':
            try {
                await prisma.paymentData.delete({
                    where: {
                        id: id as string,
                    },
                });
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: "An error occurred while deleting the payment data" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
