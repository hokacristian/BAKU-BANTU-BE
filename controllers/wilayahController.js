const wilayahService = require('../services/wilayahService');

// Controller for adding a new region
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

// Controller for getting all regions
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

// Controller for getting active regions without authentication
const getActiveWilayah = async (req, res) => {
  try {
    const activeWilayah = await wilayahService.getActiveWilayah();

    res.status(200).json({
      message: 'Active wilayah berhasil diambil',
      data: activeWilayah
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting a region by ID
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

// Controller for deleting a region
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

// Controller for updating the region of an orphanage list
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

// Controller for updating wilayah status
const updateWilayahStatus = async (req, res) => {
  try {
    const { wilayahId } = req.params;
    const { status } = req.body;
    
    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ 
        message: 'Status tidak valid. Gunakan ACTIVE atau INACTIVE' 
      });
    }
    
    const updatedWilayah = await wilayahService.updateWilayahStatus(wilayahId, status);
    
    res.status(200).json({
      message: `Wilayah berhasil ${status === 'ACTIVE' ? 'diaktifkan' : 'dinonaktifkan'}`,
      data: updatedWilayah
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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