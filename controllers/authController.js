const authService = require('../services/authService');

const registerSuperAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profileImage = req.file;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const user = await authService.register(username, email, password, profileImage, 'SUPERADMIN');
    res.status(201).json({
      message: 'SUPERADMIN registered successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const result = await authService.login(email, password);
      res.status(200).json({
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  };

const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profileImage = req.file;
    const creatorId = req.user.id;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const admin = await authService.createAdmin(
      { username, email, password, profileImage },
      creatorId
    );

    res.status(201).json({
      message: 'Admin created successfully',
      admin
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    // User is already attached to req from authenticate middleware
    const { password, ...userWithoutPassword } = req.user;
    
    res.status(200).json({
      message: 'Profile fetched successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerSuperAdmin,
  login,
  createAdmin,
  getProfile
};