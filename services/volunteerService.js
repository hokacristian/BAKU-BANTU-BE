const prisma = require('../configs/prisma');
const bcrypt = require('bcryptjs');
const authService = require('./authService');

// Fungsi untuk mendaftarkan relawan baru
const registerVolunteer = async (volunteerData) => {
  try {
    // Check if email already exists in volunteers or users
    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { email: volunteerData.email }
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: volunteerData.email }
    });

    if (existingVolunteer || existingUser) {
      throw new Error('Email sudah terdaftar');
    }

    // Create new volunteer with PENDING status
    const volunteer = await prisma.volunteer.create({
      data: {
        namaLengkap: volunteerData.namaLengkap,
        jenisKelamin: volunteerData.jenisKelamin,
        tempatLahir: volunteerData.tempatLahir,
        tanggalLahir: new Date(volunteerData.tanggalLahir),
        alamatDomisili: volunteerData.alamatDomisili,
        kewarganegaraan: volunteerData.kewarganegaraan,
        nomorHP: volunteerData.nomorHP,
        email: volunteerData.email,
        wilayahId: volunteerData.wilayahId,
        status: 'PENDING'
      }
    });

    return volunteer;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mendapatkan semua relawan
const getAllVolunteers = async () => {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: {
        wilayah: {
          select: {
            id: true,
            nama: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return volunteers;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mendapatkan detail relawan berdasarkan ID
const getVolunteerById = async (volunteerId) => {
  try {
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId },
      include: {
        wilayah: {
          select: {
            id: true,
            nama: true
          }
        }
      }
    });

    if (!volunteer) {
      throw new Error('Relawan tidak ditemukan');
    }

    return volunteer;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mengubah status relawan
const updateVolunteerStatus = async (volunteerId, newStatus) => {
  try {
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId }
    });

    if (!volunteer) {
      throw new Error('Relawan tidak ditemukan');
    }

    // Jika status diubah menjadi ACTIVE, buat user admin
    if (newStatus === 'ACTIVE') {
      // Buat user baru dengan role ADMIN
      const defaultPassword = "admin123";
      
      // Cek apakah email sudah terdaftar sebagai user
      const existingUser = await prisma.user.findUnique({
        where: { email: volunteer.email }
      });
      
      if (existingUser) {
        throw new Error('Email sudah terdaftar sebagai user');
      }
      
      // Create new admin user
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const newUser = await prisma.user.create({
        data: {
          email: volunteer.email,
          password: hashedPassword,
          role: 'ADMIN',
          profile: {
            create: {
              namaLengkap: volunteer.namaLengkap,
              jenisKelamin: volunteer.jenisKelamin,
              tempatLahir: volunteer.tempatLahir,
              tanggalLahir: volunteer.tanggalLahir,
              alamatDomisili: volunteer.alamatDomisili,
              kewarganegaraan: volunteer.kewarganegaraan,
              nomorHP: volunteer.nomorHP,
              wilayahId: volunteer.wilayahId
            }
          }
        },
        include: {
          profile: true
        }
      });
    }
    
    // Jika status diubah menjadi INACTIVE, hapus volunteer
    if (newStatus === 'INACTIVE') {
      // Delete volunteer
      const deletedVolunteer = await prisma.volunteer.delete({
        where: { id: volunteerId }
      });
      
      return deletedVolunteer;
    }
    
    // Update volunteer status
    const updatedVolunteer = await prisma.volunteer.update({
      where: { id: volunteerId },
      data: { status: newStatus },
      include: {
        wilayah: {
          select: {
            id: true,
            nama: true
          }
        }
      }
    });

    return updatedVolunteer;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteerStatus
};