import Logger from "@/lib/logger";
import { PrismaClient } from "@prisma/client";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession<AuthOptions>(authOptions);

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, statusText: "Unauthorized" }
    );
  }

  const {
    user: { id, email, name },
  } = session;

  Logger(`GET: /api/customers id: ${id} email: ${email} name: ${name}`);

  const result = await prisma.customer.findMany({
    include: {
      urls: true,
    },
  });
  return Response.json({ result });
}
export async function POST(request: Request) {
  const session = await getServerSession<AuthOptions>(authOptions);

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, statusText: "Unauthorized" }
    );
  }

  const {
    user: { id, email, name },
  } = session;

  const res = await request.json();

  Logger(
    `POST /api/customers id: ${id} email: ${email} name: ${name} \nBODY: ${JSON.stringify(
      res,
      null,
      2
    )}`
  );

  const result = await prisma.customer.upsert({
    where: {
      userCustomer: res.userCustomer || undefined,
    },
    include: {
      urls: true,
    },
    update: {
      userCustomer: res.userCustomer,
      tel: res.tel,
    },
    create: {
      userCustomer: res.userCustomer,
      username: res.tel,
      tel: res.tel,
    },
  });
  await prisma.user.upsert({
    where: { username: result.username },
    update: {},
    create: {
      username: result.tel,
      name: result.userCustomer,
      password: "123456",
      email: result.tel + "@thpsd.com",
      image: "https://avatars.dicebear.com/api/initials/jsmith.svg",
    },
  });
  return Response.json({ result });
}
