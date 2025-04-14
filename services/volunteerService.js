const prisma = require('../configs/prisma');
const bcrypt = require('bcryptjs');

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

// Fungsi untuk mendapatkan relawan dengan status ACTIVE saja
const getActiveVolunteers = async () => {
  try {
    const activeVolunteers = await prisma.volunteer.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        wilayah: {
          select: {
            id: true,
            nama: true
          }
        }
      },
      orderBy: {
        namaLengkap: 'asc'
      }
    });

    return activeVolunteers;
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
    
    // Update volunteer status (don't delete even if inactive)
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

// Fungsi baru untuk membuat admin dari volunteer
const createAdminFromVolunteer = async (volunteerId, superAdminId) => {
  try {
    // Cek apakah requester adalah SUPERADMIN
    const superAdmin = await prisma.user.findUnique({
      where: { id: superAdminId }
    });

    if (!superAdmin || superAdmin.role !== 'SUPERADMIN') {
      throw new Error('Hanya SUPERADMIN yang dapat membuat admin dari relawan');
    }

    // Cek apakah volunteer ada dan statusnya ACTIVE
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId },
      include: {
        wilayah: true
      }
    });

    if (!volunteer) {
      throw new Error('Relawan tidak ditemukan');
    }

    if (volunteer.status !== 'ACTIVE') {
      throw new Error('Hanya relawan dengan status ACTIVE yang dapat dijadikan admin');
    }

    // Cek apakah sudah ada user dengan email tersebut
    const existingUser = await prisma.user.findUnique({
      where: { email: volunteer.email }
    });

    if (existingUser) {
      throw new Error('Relawan ini sudah terdaftar sebagai user');
    }

    // Create new admin user with default password
    const defaultPassword = "admin123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    const newAdmin = await prisma.user.create({
      data: {
        email: volunteer.email,
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    // Return volunteer info with new admin
    return {
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status
      },
      volunteer: volunteer
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerVolunteer,
  getAllVolunteers,
  getActiveVolunteers,
  getVolunteerById,
  updateVolunteerStatus,
  createAdminFromVolunteer
};