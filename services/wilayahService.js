const prisma = require('../configs/prisma');

// Fungsi untuk menambahkan wilayah baru
const createWilayah = async (nama, userId) => {
  try {
    // Periksa apakah wilayah dengan nama yang sama sudah ada
    const existingWilayah = await prisma.wilayah.findUnique({
      where: { nama }
    });

    if (existingWilayah) {
      throw new Error('Wilayah dengan nama tersebut sudah ada');
    }

    // Buat wilayah baru
    const wilayah = await prisma.wilayah.create({
      data: {
        nama,
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

// Fungsi untuk mendapatkan wilayah berdasarkan ID
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

// Fungsi untuk menghapus wilayah
const deleteWilayah = async (wilayahId) => {
  try {
    // Periksa apakah wilayah ada
    const wilayah = await prisma.wilayah.findUnique({
      where: { id: wilayahId },
      include: {
        daftarPantis: true
      }
    });

    if (!wilayah) {
      throw new Error('Wilayah tidak ditemukan');
    }

    // Periksa apakah wilayah memiliki daftar panti yang terkait
    if (wilayah.daftarPantis.length > 0) {
      throw new Error('Tidak dapat menghapus wilayah yang memiliki daftar panti terkait');
    }

    // Hapus wilayah
    const deletedWilayah = await prisma.wilayah.delete({
      where: { id: wilayahId }
    });

    return deletedWilayah;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk memperbarui wilayah pada daftar panti
const updateDaftarPantiWilayah = async (daftarPantiId, wilayahId) => {
  try {
    // Periksa apakah daftar panti ada
    const daftarPanti = await prisma.daftarPanti.findUnique({
      where: { id: daftarPantiId }
    });

    if (!daftarPanti) {
      throw new Error('Daftar panti tidak ditemukan');
    }

    // Periksa apakah wilayah ada (jika wilayahId tidak null)
    if (wilayahId) {
      const wilayah = await prisma.wilayah.findUnique({
        where: { id: wilayahId }
      });

      if (!wilayah) {
        throw new Error('Wilayah tidak ditemukan');
      }
    }

    // Update wilayah pada daftar panti
    const updatedDaftarPanti = await prisma.daftarPanti.update({
      where: { id: daftarPantiId },
      data: { wilayahId }
    });

    return updatedDaftarPanti;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createWilayah,
  getAllWilayah,
  getWilayahById,
  deleteWilayah,
  updateDaftarPantiWilayah
};