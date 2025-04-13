const wilayahService = require('../services/wilayahService');

// Controller untuk menambahkan wilayah baru
const createWilayah = async (req, res) => {
  try {
    const { nama } = req.body;
    const userId = req.user.id;

    if (!nama) {
      return res.status(400).json({ message: 'Nama wilayah wajib diisi' });
    }

    const wilayah = await wilayahService.createWilayah(nama, userId);

    res.status(201).json({
      message: 'Wilayah berhasil dibuat',
      data: wilayah
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller untuk mendapatkan semua wilayah
const getAllWilayah = async (req, res) => {
  try {
    const wilayahs = await wilayahService.getAllWilayah();

    res.status(200).json({
      message: 'Wilayah berhasil diambil',
      data: wilayahs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller untuk mendapatkan wilayah berdasarkan ID
const getWilayahById = async (req, res) => {
  try {
    const { wilayahId } = req.params;
    const wilayah = await wilayahService.getWilayahById(wilayahId);

    res.status(200).json({
      message: 'Wilayah berhasil diambil',
      data: wilayah
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Controller untuk menghapus wilayah
const deleteWilayah = async (req, res) => {
  try {
    const { wilayahId } = req.params;
    const deletedWilayah = await wilayahService.deleteWilayah(wilayahId);

    res.status(200).json({
      message: 'Wilayah berhasil dihapus',
      data: deletedWilayah
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller untuk memperbarui wilayah pada daftar panti
const updateDaftarPantiWilayah = async (req, res) => {
  try {
    const { daftarPantiId } = req.params;
    const { wilayahId } = req.body;

    const updatedDaftarPanti = await wilayahService.updateDaftarPantiWilayah(daftarPantiId, wilayahId);

    res.status(200).json({
      message: 'Wilayah daftar panti berhasil diperbarui',
      data: updatedDaftarPanti
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createWilayah,
  getAllWilayah,
  getWilayahById,
  deleteWilayah,
  updateDaftarPantiWilayah
};