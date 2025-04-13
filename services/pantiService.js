const prisma = require('../configs/prisma');
const imagekit = require('../configs/imagekit');

// Fungsi untuk menambahkan daftar panti
const createDaftarPanti = async (data, userId, gambarFile = null) => {
  try {
    let gambarUrl = null;
    
    // Upload gambar ke ImageKit jika ada
    if (gambarFile) {
      try {
        // Dengan memory storage, gambarFile.buffer sudah berisi data file
        const fileContent = gambarFile.buffer.toString('base64');
        
        const uploadResponse = await imagekit.upload({
          file: fileContent,
          fileName: `panti-${Date.now()}`,
          folder: '/daftar-panti'
        });
        
        gambarUrl = uploadResponse.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload panti image');
      }
    }

// Buat daftar panti baru
const daftarPanti = await prisma.daftarPanti.create({
    data: {
      judul: data.judul,
      subjudul: data.subjudul,
      gambarUrl: gambarUrl,
      konten: data.konten,
      penulisId: userId
    }
  });

  return daftarPanti;
} catch (error) {
  throw error;
}
};

// Fungsi untuk menambahkan detail panti
const createDetailPanti = async (data, daftarPantiId) => {
    try {
      // Periksa apakah daftar panti ada
      const daftarPanti = await prisma.daftarPanti.findUnique({
        where: { id: daftarPantiId }
      });
  
      if (!daftarPanti) {
        throw new Error('Daftar panti tidak ditemukan');
      }
  
      // Buat detail panti baru
      const detailPanti = await prisma.detailPanti.create({
        data: {
          namaPanti: data.namaPanti,
          yayasanPenaung: data.yayasanPenaung,
          fokusPelayanPanti: data.fokusPelayanPanti,
          alamatPanti: data.alamatPanti,
          jumlahPengasuh: parseInt(data.jumlahPengasuh),
          jumlahPenghuni: parseInt(data.jumlahPenghuni),
          karakteristikPenghuni: data.karakteristikPenghuni,
          jenisSumbangan: data.jenisSumbangan,
          kebutuhanBantuan: data.kebutuhanBantuan,
          nomorKontak: data.nomorKontak,
          daftarPantiId: daftarPantiId
        }
      });
  
      return detailPanti;
    } catch (error) {
      throw error;
    }
  };
  

// Fungsi untuk mendapatkan semua daftar panti
const getAllDaftarPanti = async () => {
    try {
      const daftarPantis = await prisma.daftarPanti.findMany({
        include: {
          penulis: {
            select: {
              id: true,
              username: true,
              email: true,
              profileImage: true
            }
          },
          detailPantis: true // Include semua detail panti
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
  
      return daftarPantis;
    } catch (error) {
      throw error;
    }
  };
  
  // Fungsi untuk mendapatkan detail daftar panti berdasarkan ID
  const getDaftarPantiById = async (daftarPantiId) => {
    try {
      const daftarPanti = await prisma.daftarPanti.findUnique({
        where: { id: daftarPantiId },
        include: {
          penulis: {
            select: {
              id: true,
              username: true,
              email: true,
              profileImage: true
            }
          },
          detailPantis: true
        }
      });
  
      if (!daftarPanti) {
        throw new Error('Daftar panti tidak ditemukan');
      }
  
      return daftarPanti;
    } catch (error) {
      throw error;
    }
  };

// Fungsi untuk mendapatkan detail panti berdasarkan ID
const getDetailPantiById = async (detailPantiId) => {
  try {
    const detailPanti = await prisma.detailPanti.findUnique({
      where: { id: detailPantiId },
      include: {
        daftarPanti: {
          include: {
            penulis: {
              select: {
                id: true,
                username: true,
                email: true,
                profileImage: true
              }
            }
          }
        }
      }
    });

    if (!detailPanti) {
      throw new Error('Detail panti tidak ditemukan');
    }

    return detailPanti;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk menambahkan banyak detail panti sekaligus
const createManyDetailPanti = async (detailsArray, daftarPantiId) => {
  try {
    // Periksa apakah daftar panti ada
    const daftarPanti = await prisma.daftarPanti.findUnique({
      where: { id: daftarPantiId }
    });

    if (!daftarPanti) {
      throw new Error('Daftar panti tidak ditemukan');
    }

    // Validasi setiap item dalam array
    detailsArray.forEach((detail, index) => {
      if (!detail.namaPanti || !detail.yayasanPenaung || !detail.fokusPelayanPanti || 
          !detail.alamatPanti || !detail.jumlahPengasuh || !detail.jumlahPenghuni) {
        throw new Error(`Data tidak lengkap pada item ke-${index+1}. Harap isi semua field yang diperlukan`);
      }
    });

    // Persiapkan data untuk createMany
    const dataToCreate = detailsArray.map(detail => {
      // Proses jenisSumbangan - konversi string menjadi objek JSON jika diperlukan
      let processedJenisSumbangan = detail.jenisSumbangan;
      
      // Jika jenisSumbangan adalah string, coba konversi ke format objek
      if (detail.jenisSumbangan && typeof detail.jenisSumbangan === 'string') {
        const jenisSumbanganObj = {};
        const items = detail.jenisSumbangan.split(';').map(item => item.trim());
        
        items.forEach(item => {
          if (item.toLowerCase().includes('pangan')) {
            jenisSumbanganObj.pangan = item;
          } else if (item.toLowerCase().includes('sandang')) {
            jenisSumbanganObj.sandangan = item;
          } else if (item.toLowerCase().includes('tunai')) {
            jenisSumbanganObj.tunai = item;
          } else if (item.toLowerCase().includes('kebutuhan asuh')) {
            jenisSumbanganObj.kebutuhanAsuh = item;
          } else {
            jenisSumbanganObj.lainnya = jenisSumbanganObj.lainnya ? 
              `${jenisSumbanganObj.lainnya}; ${item}` : item;
          }
        });
        
        processedJenisSumbangan = jenisSumbanganObj;
      }

      // Proses nomorKontak - konversi string menjadi array objek JSON jika diperlukan
      let processedNomorKontak = detail.nomorKontak;
      
      // Jika nomorKontak adalah string, coba konversi ke format array objek
      if (detail.nomorKontak && typeof detail.nomorKontak === 'string') {
        // Split string berdasarkan titik koma atau titik koma + spasi
        const items = detail.nomorKontak.split(/;\s*/).filter(item => item.trim() !== '');
        
        // Ubah menjadi array objek
        const kontakArray = items.map(item => {
          // Coba ekstrak nama dan nomor
          const match = item.match(/(\d+)\s*\(([^)]+)\)/);
          
          if (match) {
            // Format: "08123456789 (Nama)"
            return {
              nomorKontak: match[1].trim(),
              namaKontak: match[2].trim()
            };
          } else if (item.includes(':')) {
            // Format alternatif: "Nama: 08123456789"
            const [nama, nomor] = item.split(':').map(part => part.trim());
            return {
              nomorKontak: nomor,
              namaKontak: nama
            };
          } else {
            // Hanya nomor tanpa nama
            return {
              nomorKontak: item.trim(),
              namaKontak: "Kontak"
            };
          }
        });
        
        processedNomorKontak = kontakArray;
      }

      return {
        namaPanti: detail.namaPanti,
        yayasanPenaung: detail.yayasanPenaung,
        fokusPelayanPanti: detail.fokusPelayanPanti,
        alamatPanti: detail.alamatPanti,
        jumlahPengasuh: parseInt(detail.jumlahPengasuh),
        jumlahPenghuni: parseInt(detail.jumlahPenghuni),
        karakteristikPenghuni: detail.karakteristikPenghuni,
        jenisSumbangan: processedJenisSumbangan,
        kebutuhanBantuan: detail.kebutuhanBantuan,
        nomorKontak: processedNomorKontak,
        daftarPantiId: daftarPantiId
      };
    });

    // Buat banyak detail panti sekaligus
    const result = await prisma.detailPanti.createMany({
      data: dataToCreate
    });

    // Dapatkan semua detail panti yang baru dibuat
    const createdDetailPantis = await prisma.detailPanti.findMany({
      where: {
        daftarPantiId: daftarPantiId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: dataToCreate.length
    });

    return {
      count: result.count,
      details: createdDetailPantis
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createDaftarPanti,
  createDetailPanti,
  getAllDaftarPanti,
  getDaftarPantiById,
  getDetailPantiById,
  createManyDetailPanti
};