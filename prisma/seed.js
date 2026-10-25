// Creates the rows a fresh database needs. Safe to run on every start.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  for (const name of ["gpt-3", "gpt-4"]) {
    const exists = await prisma.gptModel.findFirst({ where: { name } });
    if (!exists) await prisma.gptModel.create({ data: { name } });
  }

  const price = await prisma.plansSlides.findFirst();
  if (!price) await prisma.plansSlides.create({ data: { price: 2000 } });

  console.log("Seed: ok");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
