import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.customer.deleteMany();
  const bob = await prisma.customer.upsert({
    where: { userCustomer: "55812" },
    update: {},
    create: {
      userCustomer: "55812",
      tel: "0918136426"
    },
  });

  console.log({ bob });
  console.log(
    JSON.stringify(
      await prisma.customer.findMany({ include: { urls: true } }),
      null,
      2
    )
  );
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
