import Logger from "@/lib/logger";
import { nanoid } from "nanoid";

import { PrismaClient } from "@prisma/client";
import { validateUrl } from "@/lib/validate-url";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

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

  try {
    const res = await request.json();
    Logger(
      `POST /api/short-url id: ${id} email: ${email} name: ${name} \nBODY: ${JSON.stringify(
        res,
        null,
        2
      )}`
    );

    const { origUrl, customerId } = res;
    const base = "https://thpsd.com";

    const urlId = nanoid(4);

    if (validateUrl(origUrl)) {
      let url = await prisma.uRLsData.findFirst({ where: { origUrl } });
      if (url) {
        await prisma.uRLsData.update({
          where: { origUrl },
          data: {
            origUrl,
            customerId,
            v: url.v + 1,
          },
        });
        return Response.json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;

        const data = await prisma.uRLsData.create({
          data: {
            origUrl,
            shortUrl,
            urlId,
            date: new Date().toISOString(),
            v: 0,
            clicks: 0,
            customerId,
          },
        });

        Logger(`Response JSON: ${JSON.stringify(data, null, 2)}`);
        return Response.json(data);
      }
    } else {
      Logger(`Invalid URL: ${origUrl}`);
      return Response.json("Invalid Original Url", {
        status: 400,
        statusText: "Bad Request",
      });
    }
  } catch (err) {
    Logger(`Error: ${err}`);
    return Response.json("Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
