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
      email: 'hoka1@gmail.com',
      role: 'SUPERADMIN'
    }
  });

  let superadmin;
  if (!existingSuperAdmin) {
    console.log('Creating SUPERADMIN user...');
    superadmin = await prisma.user.create({
      data: {
        email: 'hoka1@gmail.com',
        password: hashedPassword,
        role: 'SUPERADMIN',
        status: 'ACTIVE'
      },
    });
    console.log('SUPERADMIN user created:', superadmin.id);
    
    // Check if volunteer record exists for this superadmin
    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { email: 'hoka1@gmail.com' }
    });
    
    if (!existingVolunteer) {
      console.log('Creating SUPERADMIN volunteer record...');
      // Create corresponding volunteer record
      const superadminVolunteer = await prisma.volunteer.create({
        data: {
          namaLengkap: 'Super Admin',
          jenisKelamin: 'MALE',
          tempatLahir: 'Jakarta',
          tanggalLahir: new Date('1990-01-01'),
          alamatDomisili: 'Jakarta',
          kewarganegaraan: 'Indonesia',
          nomorHP: '08123456789',
          email: 'hoka1@gmail.com',
          status: 'ACTIVE'
        }
      });
      console.log('SUPERADMIN volunteer record created:', superadminVolunteer.id);
    } else {
      console.log('SUPERADMIN volunteer record already exists');
    }
  } else {
    superadmin = existingSuperAdmin;
    console.log('SUPERADMIN user already exists, using existing one:', superadmin.id);
    
    // Check if volunteer record exists for this superadmin
    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { email: 'hoka1@gmail.com' }
    });
    
    if (!existingVolunteer) {
      console.log('Creating SUPERADMIN volunteer record...');
      // Create corresponding volunteer record
      const superadminVolunteer = await prisma.volunteer.create({
        data: {
          namaLengkap: 'Super Admin',
          jenisKelamin: 'MALE',
          tempatLahir: 'Jakarta',
          tanggalLahir: new Date('1990-01-01'),
          alamatDomisili: 'Jakarta',
          kewarganegaraan: 'Indonesia',
          nomorHP: '08123456789',
          email: 'hoka1@gmail.com',
          status: 'ACTIVE',
        }
      });
      console.log('SUPERADMIN volunteer record created:', superadminVolunteer.id);
    } else {
      console.log('SUPERADMIN volunteer record already exists');
    }
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