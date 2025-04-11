const pantiService = require('../services/pantiService');

// Controller untuk menambahkan daftar panti
const createDaftarPanti = async (req, res) => {
    try {
      const { judul, subjudul, konten } = req.body;
      const gambarFile = req.file;
      const userId = req.user.id;
  
      if (!judul || !konten) {
        return res.status(400).json({ message: 'Judul dan konten wajib diisi' });
      }
  
      const daftarPanti = await pantiService.createDaftarPanti(
        { judul, subjudul, konten },
        userId,
        gambarFile
      );
  
      res.status(201).json({
        message: 'Daftar panti berhasil dibuat',
        data: daftarPanti
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Controller untuk menambahkan detail panti
const createDetailPanti = async (req, res) => {
    try {
      const { daftarPantiId } = req.params;
      const detailData = req.body;
  
      if (!detailData.namaPanti || !detailData.yayasanPenaung || !detailData.fokusPelayanPanti || 
          !detailData.alamatPanti || !detailData.jumlahPengasuh || !detailData.jumlahPenghuni) {
        return res.status(400).json({ 
          message: 'Data tidak lengkap. Harap isi semua field yang diperlukan' 
        });
      }
  
      const detailPanti = await pantiService.createDetailPanti(detailData, daftarPantiId);
  
      res.status(201).json({
        message: 'Detail panti berhasil dibuat',
        data: detailPanti
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Controller untuk mendapatkan semua daftar panti
const getAllDaftarPanti = async (req, res) => {
    try {
      const daftarPantis = await pantiService.getAllDaftarPanti();
  
      res.status(200).json({
        message: 'Daftar panti berhasil diambil',
        data: daftarPantis
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Controller untuk mendapatkan detail daftar panti berdasarkan ID
  const getDaftarPantiById = async (req, res) => {
    try {
      const { daftarPantiId } = req.params;
      const daftarPanti = await pantiService.getDaftarPantiById(daftarPantiId);
  
      res.status(200).json({
        message: 'Daftar panti berhasil diambil',
        data: daftarPanti
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
  // Controller untuk mendapatkan detail panti berdasarkan ID
  const getDetailPantiById = async (req, res) => {
    try {
      const { detailPantiId } = req.params;
      const detailPanti = await pantiService.getDetailPantiById(detailPantiId);
  
      res.status(200).json({
        message: 'Detail panti berhasil diambil',
        data: detailPanti
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

// Controller untuk menambahkan banyak detail panti sekaligus
const createManyDetailPanti = async (req, res) => {
    try {
      const { daftarPantiId } = req.params;
      const { details } = req.body;
  
      if (!Array.isArray(details) || details.length === 0) {
        return res.status(400).json({ 
          message: 'Format data tidak valid. Harap sediakan array data detail panti' 
        });
      }
  
      const result = await pantiService.createManyDetailPanti(details, daftarPantiId);
  
      res.status(201).json({
        message: `Berhasil menambahkan ${result.count} detail panti`,
        data: result
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
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