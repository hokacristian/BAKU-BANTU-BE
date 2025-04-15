const volunteerService = require('../services/volunteerService');

// Controller untuk mendaftarkan relawan baru
const registerVolunteer = async (req, res) => {
  try {
    const volunteerData = req.body;
    const profileImage = req.file;
    
    if (!volunteerData.namaLengkap || !volunteerData.jenisKelamin || 
        !volunteerData.tempatLahir || !volunteerData.tanggalLahir || 
        !volunteerData.alamatDomisili || !volunteerData.kewarganegaraan || 
        !volunteerData.nomorHP || !volunteerData.email) {
      return res.status(400).json({ 
        message: 'Mohon lengkapi semua data yang diperlukan' 
      });
    }
    
    // Pass the file to the service if it exists
    const volunteer = await volunteerService.registerVolunteer(volunteerData, profileImage);
    
    res.status(201).json({
      message: 'Pendaftaran relawan berhasil',
      data: volunteer
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller untuk mendapatkan semua relawan
const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await volunteerService.getAllVolunteers();
    
    res.status(200).json({
      message: 'Data relawan berhasil diambil',
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller untuk mendapatkan hanya relawan aktif
const getActiveVolunteers = async (req, res) => {
  try {
    const activeVolunteers = await volunteerService.getActiveVolunteers();
    
    res.status(200).json({
      message: 'Data relawan aktif berhasil diambil',
      data: activeVolunteers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller untuk mendapatkan detail relawan berdasarkan ID
const getVolunteerById = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const volunteer = await volunteerService.getVolunteerById(volunteerId);
    
    res.status(200).json({
      message: 'Detail relawan berhasil diambil',
      data: volunteer
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Controller untuk mengubah status relawan
const updateVolunteerStatus = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { status } = req.body;
    
    if (!status || !['PENDING', 'ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ 
        message: 'Status tidak valid. Gunakan PENDING, ACTIVE, atau INACTIVE' 
      });
    }
    
    const updatedVolunteer = await volunteerService.updateVolunteerStatus(volunteerId, status);
    
    let message = 'Status relawan berhasil diperbarui';
    if (status === 'ACTIVE') {
      message = 'Relawan berhasil diaktifkan';
    } else if (status === 'INACTIVE') {
      message = 'Relawan berhasil dinonaktifkan';
    }
    
    res.status(200).json({
      message,
      data: updatedVolunteer
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller baru untuk membuat admin dari relawan
const createAdminFromVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const superAdminId = req.user.id;
    
    const result = await volunteerService.createAdminFromVolunteer(volunteerId, superAdminId);
    
    res.status(201).json({
      message: 'Relawan berhasil dijadikan admin',
      data: result
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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