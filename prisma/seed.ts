import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.urls.deleteMany();
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
