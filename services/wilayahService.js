const prisma = require('../configs/prisma');

// Function to add a new region
const createWilayah = async (nama, userId) => {
  try {
    // Check if a region with the same name already exists
    const existingWilayah = await prisma.wilayah.findUnique({
      where: { nama }
    });

    if (existingWilayah) {
      throw new Error('Wilayah dengan nama tersebut sudah ada');
    }

    // Create a new region with ACTIVE status by default
    const wilayah = await prisma.wilayah.create({
      data: {
        nama,
        status: 'ACTIVE' // Set status to ACTIVE by default
      }
    });

    return wilayah;
  } catch (error) {
    throw error;
  }
};

// Updated getAllWilayah function
const getAllWilayah = async () => {
  try {
    // Get all wilayah records
    const wilayahs = await prisma.wilayah.findMany({
      orderBy: {
        nama: 'asc'
      }
    });
    
    // For each wilayah, get volunteer count and names
    const wilayahsWithCounts = await Promise.all(wilayahs.map(async (wilayah) => {
      // Count volunteers in this wilayah
      const volunteersCount = await prisma.volunteer.count({
        where: {
          wilayahId: wilayah.id
        }
      });
      
      // Get volunteer names in this wilayah
      const volunteers = await prisma.volunteer.findMany({
        where: {
          wilayahId: wilayah.id
        },
        select: {
          id: true,
          namaLengkap: true,
          email: true,
          status: true
        }
      });
      
      // Return wilayah with volunteer data
      // totalCount is now just the volunteersCount
      return {
        ...wilayah,
        volunteersCount,
        totalCount: volunteersCount,
        volunteers
      };
    }));
    
    return wilayahsWithCounts;
  } catch (error) {
    throw error;
  }
};

// Function to get active wilayah without authentication
const getActiveWilayah = async () => {
  try {
    // Get all active wilayah records
    const wilayahs = await prisma.wilayah.findMany({
      where: {
        status: 'ACTIVE'
      },
      orderBy: {
        nama: 'asc'
      }
    });
    
    return wilayahs;
  } catch (error) {
    throw error;
  }
};

// Function to get a region by ID
const getWilayahById = async (wilayahId) => {
  try {
    const wilayah = await prisma.wilayah.findUnique({
      where: { id: wilayahId },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        daftarPantis: true
      }
    });

    if (!wilayah) {
      throw new Error('Wilayah tidak ditemukan');
    }

    return wilayah;
  } catch (error) {
    throw error;
  }
};

// Function to delete a region
const deleteWilayah = async (wilayahId) => {
  try {
    // Check if the region exists
    const wilayah = await prisma.wilayah.findUnique({
      where: { id: wilayahId },
      include: {
        daftarPantis: true
      }
    });

    if (!wilayah) {
      throw new Error('Wilayah tidak ditemukan');
    }

    // Check if the region has associated orphanage lists
    if (wilayah.daftarPantis.length > 0) {
      throw new Error('Tidak dapat menghapus wilayah yang memiliki daftar panti terkait');
    }

    // Delete the region
    const deletedWilayah = await prisma.wilayah.delete({
      where: { id: wilayahId }
    });

    return deletedWilayah;
  } catch (error) {
    throw error;
  }
};

// Function to update the region of an orphanage list
const updateDaftarPantiWilayah = async (daftarPantiId, wilayahId) => {
  try {
    // Check if the orphanage list exists
    const daftarPanti = await prisma.daftarPanti.findUnique({
      where: { id: daftarPantiId }
    });

    if (!daftarPanti) {
      throw new Error('Daftar panti tidak ditemukan');
    }

    // Check if the region exists (if wilayahId is not null)
    if (wilayahId) {
      const wilayah = await prisma.wilayah.findUnique({
        where: { id: wilayahId }
      });

      if (!wilayah) {
        throw new Error('Wilayah tidak ditemukan');
      }
    }

    // Update the region of the orphanage list
    const updatedDaftarPanti = await prisma.daftarPanti.update({
      where: { id: daftarPantiId },
      data: { wilayahId }
    });

    return updatedDaftarPanti;
  } catch (error) {
    throw error;
  }
};

// Function to update wilayah status
const updateWilayahStatus = async (wilayahId, status) => {
  try {
    // Check if the region exists
    const wilayah = await prisma.wilayah.findUnique({
      where: { id: wilayahId }
    });

    if (!wilayah) {
      throw new Error('Wilayah tidak ditemukan');
    }

    // Update the status
    const updatedWilayah = await prisma.wilayah.update({
      where: { id: wilayahId },
      data: { status }
    });

    return updatedWilayah;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createWilayah,
  getAllWilayah,
  getActiveWilayah,
  getWilayahById,
  deleteWilayah,
  updateDaftarPantiWilayah,
  updateWilayahStatus
};