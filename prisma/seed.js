const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // Create SUPERADMIN
  const hashedPassword = await bcrypt.hash('1408Hoka', 10);
  
  // Check if superadmin already exists
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { 
      email: 'superadmin@example.com',
      role: 'SUPERADMIN'
    }
  });

  let superadmin;
  if (!existingSuperAdmin) {
    console.log('Creating SUPERADMIN...');
    superadmin = await prisma.user.create({
      data: {
        email: 'hoka1@gmail.com',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });
    console.log('SUPERADMIN created:', superadmin.id);
  } else {
    superadmin = existingSuperAdmin;
    console.log('SUPERADMIN already exists, using existing one:', superadmin.id);
  }

  // Create wilayah data
  const wilayahData = [
    { nama: 'Jakarta Pusat' },
    { nama: 'Jakarta Utara' },
    { nama: 'Jakarta Selatan' },
    { nama: 'Jakarta Barat' },
    { nama: 'Jakarta Timur' },
    { nama: 'Bogor' },
    { nama: 'Depok' },
    { nama: 'Tangerang' },
    { nama: 'Bekasi' },
    { nama: 'Bandung' },
    { nama: 'Manado' },

  ];

  console.log('Creating wilayah records...');
  
  // Create each wilayah record if it doesn't exist
  for (const wilayah of wilayahData) {
    const existingWilayah = await prisma.wilayah.findFirst({
      where: { nama: wilayah.nama }
    });

    if (!existingWilayah) {
      await prisma.wilayah.create({
        data: {
          nama: wilayah.nama,
          createdById: superadmin.id,
        },
      });
      console.log(`Wilayah created: ${wilayah.nama}`);
    } else {
      console.log(`Wilayah already exists: ${wilayah.nama}`);
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client connection
    await prisma.$disconnect();
  });