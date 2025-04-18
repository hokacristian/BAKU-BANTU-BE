const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting volunteer seed process...');

  // First, we'll get all wilayahs to randomly assign to volunteers
  let wilayahs = [];
  try {
    wilayahs = await prisma.wilayah.findMany();
    if (wilayahs.length === 0) {
      console.log('No wilayahs found! Creating default wilayahs...');
      
      // Create default wilayahs if none exist
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
      
      for (const wilayah of wilayahData) {
        await prisma.wilayah.create({
          data: {
            nama: wilayah.nama,
            status: 'ACTIVE'
          }
        });
        console.log(`Created wilayah: ${wilayah.nama}`);
      }
      
      // Fetch the newly created wilayahs
      wilayahs = await prisma.wilayah.findMany();
    }
    
    console.log(`Found ${wilayahs.length} wilayahs to use for volunteers`);
  } catch (error) {
    console.error('Error fetching wilayahs:', error);
    process.exit(1);
  }

  // Random date generator for birthdays between 1985 and 2000
  const getRandomBirthDate = () => {
    const start = new Date('1985-01-01');
    const end = new Date('2000-12-31');
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  // Random phone number generator
  const getRandomPhone = () => {
    return `08${Math.floor(10000000 + Math.random() * 90000000)}`;
  };

  // Array of possible domicile addresses
  const domiciles = [
    'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Makassar', 
    'Manado', 'Yogyakarta', 'Semarang', 'Denpasar', 'Palembang'
  ];

  // Function to get a random value from an array
  const getRandomValue = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Function to get a random wilayah ID
  const getRandomWilayahId = () => {
    if (wilayahs.length === 0) return null;
    return wilayahs[Math.floor(Math.random() * wilayahs.length)].id;
  };

  // Array of volunteer data from the screenshots
  const volunteersData = [
    {
      namaLengkap: 'Rahel Sverin Mokalu',
      jabatan: 'Enumerator Minahasa',
      jenisKelamin: 'FEMALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/rahel-sverin-mokalu.jpg',
      email: 'rahel.sverin@bakubantu.id'
    },
    {
      namaLengkap: 'Mark Puyun Wowor Roring',
      jabatan: 'Enumerator Minahasa',
      jenisKelamin: 'MALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/mark-puyun-wowor-roring.jpg',
      email: 'mark.puyun@bakubantu.id'
    },
    {
      namaLengkap: 'Cliff Matthew M. Sumangkut',
      jabatan: 'Enumerator Minahasa',
      jenisKelamin: 'MALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/cliff-matthew-sumangkut.jpg',
      email: 'cliff.matthew@bakubantu.id'
    },
    {
      namaLengkap: 'Luisa Lantang',
      jabatan: 'Enumerator Minahasa',
      jenisKelamin: 'FEMALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/luisa-lantang.jpg',
      email: 'luisa.lantang@bakubantu.id'
    },
    {
      namaLengkap: 'Wilbert Agrazani Roring',
      jabatan: 'Enumerator Minahasa',
      jenisKelamin: 'MALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/wilbert-agrazani-roring.jpg',
      email: 'wilbert.agrazani@bakubantu.id'
    },
    {
      namaLengkap: 'Wulan Wenas',
      jabatan: 'Enumerator Minahasa',
      jenisKelamin: 'FEMALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/wulan-wenas.jpg',
      email: 'wulan.wenas@bakubantu.id'
    },
    {
      namaLengkap: 'Yosua Mamudi',
      jabatan: 'Enumerator Minahasa',
      jenisKelamin: 'MALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/yosua-mamudi.jpg',
      email: 'yosua.mamudi@bakubantu.id'
    },
    {
      namaLengkap: 'Hana Mamudi',
      jabatan: 'Enumerator Minahasa',
      jenisKelamin: 'FEMALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/hana-mamudi.jpg',
      email: 'hana.mamudi@bakubantu.id'
    },
    {
      namaLengkap: 'Ganesha Hizkia Ticonuwu',
      jabatan: 'Enumerator Tomohon & Minahasa',
      jenisKelamin: 'MALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/ganesha-hizkia-ticonuwu.jpg',
      email: 'ganesha.hizkia@bakubantu.id'
    },
    {
      namaLengkap: 'Dea Kurnia Tampi',
      jabatan: 'Enumerator Tomohon & Minahasa',
      jenisKelamin: 'FEMALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/dea-kurnia-tampi.jpg',
      email: 'dea.kurnia@bakubantu.id'
    },
    {
      namaLengkap: 'Kristi Airin Sangari',
      jabatan: 'Publikator & Editor',
      jenisKelamin: 'FEMALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/kristi-airin-sangari.jpg',
      email: 'kristi.airin@bakubantu.id'
    },
    {
      namaLengkap: 'Hizkia Posumah',
      jabatan: 'Enumerator Minahasa Selatan',
      jenisKelamin: 'MALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/hizkia-posumah.jpg',
      email: 'hizkia.posumah@bakubantu.id'
    },
    {
      namaLengkap: 'Desty Tumuju',
      jabatan: 'Enumerator Minahasa Selatan',
      jenisKelamin: 'FEMALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/desty-tumuju.jpg',
      email: 'desty.tumuju@bakubantu.id'
    },
    {
      namaLengkap: 'Christian Nathanael S. Pepah',
      jabatan: 'Enumerator Minahasa',
      jenisKelamin: 'MALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/christian-nathanael-pepah.jpg',
      email: 'christian.nathanael@bakubantu.id'
    },
    {
      namaLengkap: 'Nathania Trixie Lomboan',
      jabatan: 'Enumerator Minahasa',
      jenisKelamin: 'FEMALE',
      profileImage: 'https://ik.imagekit.io/bakubantu/volunteers/nathania-trixie-lomboan.jpg',
      email: 'nathania.trixie@bakubantu.id'
    }
  ];

  // Create or update each volunteer
  for (const volunteerData of volunteersData) {
    try {
      // Check if volunteer already exists by email
      const existingVolunteer = await prisma.volunteer.findUnique({
        where: { email: volunteerData.email }
      });

      // Generate required randomized data for each volunteer
      const completeVolunteerData = {
        ...volunteerData,
        tempatLahir: getRandomValue(domiciles),
        tanggalLahir: getRandomBirthDate(),
        alamatDomisili: getRandomValue(domiciles),
        kewarganegaraan: 'Indonesia',
        nomorHP: getRandomPhone(),
        wilayahId: getRandomWilayahId(),
        status: 'ACTIVE'
      };

      if (!existingVolunteer) {
        // Create new volunteer
        const volunteer = await prisma.volunteer.create({
          data: completeVolunteerData
        });
        console.log(`Created volunteer: ${volunteer.namaLengkap}`);
      } else {
        // Update existing volunteer
        const volunteer = await prisma.volunteer.update({
          where: { id: existingVolunteer.id },
          data: completeVolunteerData
        });
        console.log(`Updated volunteer: ${volunteer.namaLengkap}`);
      }
    } catch (error) {
      console.error(`Error processing volunteer ${volunteerData.namaLengkap}:`, error);
    }
  }

  console.log('Volunteer seed completed successfully!');
  console.log('Starting superadmin seed process...');

  // Create SUPERADMIN
  const hashedPassword = await bcrypt.hash('1408Hoka', 10);
  
  // Superadmin email
  const superadminEmail = 'hoka1@gmail.com';
  
  // Check if superadmin user already exists
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { 
      email: superadminEmail,
      role: 'SUPERADMIN'
    }
  });
  
  let superadmin;
  // Create or update superadmin user
  if (!existingSuperAdmin) {
    console.log('Creating SUPERADMIN user...');
    superadmin = await prisma.user.create({
      data: {
        email: superadminEmail,
        password: hashedPassword,
        role: 'SUPERADMIN',
        status: 'ACTIVE'
      },
    });
    console.log('SUPERADMIN user created:', superadmin.id);
  } else {
    superadmin = existingSuperAdmin;
    console.log('SUPERADMIN user already exists:', superadmin.id);
  }
  
  // Check if volunteer record exists for this superadmin
  const existingVolunteer = await prisma.volunteer.findUnique({
    where: { email: superadminEmail }
  });
  
  // Volunteer data for the superadmin
  const superadminVolunteerData = {
    namaLengkap: 'Krisan Valerie Sangari',
    jenisKelamin: 'FEMALE',
    tempatLahir: 'Jakarta',
    tanggalLahir: new Date('1990-01-01'),
    alamatDomisili: 'Jakarta',
    kewarganegaraan: 'Indonesia',
    nomorHP: '08123456789',
    email: superadminEmail,
    jabatan: 'Koordinator/Inisiator',
    wilayahId: getRandomWilayahId(),
    profileImage: 'https://ik.imagekit.io/swvbgy6po/volunteer-profiles/tmphm27pf-u06mqht8le7-3487f597434d-512.png',
    status: 'ACTIVE'
  };
  
  // Create or update volunteer record
  if (!existingVolunteer) {
    console.log('Creating SUPERADMIN volunteer record...');
    const superadminVolunteer = await prisma.volunteer.create({
      data: superadminVolunteerData
    });
    console.log('SUPERADMIN volunteer record created:', superadminVolunteer.id);
  } else {
    console.log('Updating SUPERADMIN volunteer record...');
    const updatedVolunteer = await prisma.volunteer.update({
      where: { id: existingVolunteer.id },
      data: superadminVolunteerData
    });
    console.log('SUPERADMIN volunteer record updated:', updatedVolunteer.id);
  }
  
  console.log('Superadmin seed completed successfully!');

}



main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });