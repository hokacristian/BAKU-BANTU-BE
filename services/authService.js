const bcrypt = require('bcryptjs');
const prisma = require('../configs/prisma');
const { generateToken } = require('../configs/jwt');
const imagekit = require('../configs/imagekit');

const register = async (email, password, role = 'ADMIN', createdBy = null) => {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

const login = async (email, password) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken({ 
      userId: user.id,
      role: user.role 
    });

    // Create response object with only necessary information
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    return {
      user: userResponse,
      token
    };
  } catch (error) {
    throw error;
  }
};

const createAdmin = async (userData, creatorId) => {
  try {
    // Check if creator is a SUPERADMIN
    const creator = await prisma.user.findUnique({
      where: { id: creatorId }
    });

    if (!creator || creator.role !== 'SUPERADMIN') {
      throw new Error('Only SUPERADMIN can create new admins');
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Upload profile image if provided
    let profileImageUrl = null;
    if (userData.profileImage) {
      try {
        const fileContent = userData.profileImage.buffer.toString('base64');
        
        const uploadResponse = await imagekit.upload({
          file: fileContent,
          fileName: `profile-${Date.now()}`,
          folder: '/user-profiles'
        });
        
        profileImageUrl = uploadResponse.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload profile image');
      }
    }

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        role: 'ADMIN',
        profile: {
          create: {
            namaLengkap: userData.namaLengkap,
            jenisKelamin: userData.jenisKelamin,
            tempatLahir: userData.tempatLahir,
            tanggalLahir: new Date(userData.tanggalLahir),
            alamatDomisili: userData.alamatDomisili,
            kewarganegaraan: userData.kewarganegaraan,
            nomorHP: userData.nomorHP,
            profileImage: profileImageUrl,
            wilayahId: userData.wilayahId
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

const getAllAdmins = async () => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      include: {
        profile: true
      }
    });
    
    // Remove passwords from response
    const adminsWithoutPasswords = admins.map(admin => {
      const { password, ...adminWithoutPassword } = admin;
      return adminWithoutPassword;
    });
    
    return adminsWithoutPasswords;
  } catch (error) {
    throw error;
  }
};

const deleteAdmin = async (adminId, superAdminId) => {
  try {
    // Check if requester is SUPERADMIN
    const superAdmin = await prisma.user.findUnique({
      where: { id: superAdminId }
    });

    if (!superAdmin || superAdmin.role !== 'SUPERADMIN') {
      throw new Error('Hanya SUPERADMIN yang dapat menghapus admin');
    }

    // Check if admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      throw new Error('Admin tidak ditemukan');
    }

    if (admin.role === 'SUPERADMIN') {
      throw new Error('Tidak dapat menghapus SUPERADMIN');
    }

    // Delete admin (profile will be deleted automatically due to cascade)
    const deletedAdmin = await prisma.user.delete({
      where: { id: adminId },
      include: {
        profile: true
      }
    });

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = deletedAdmin;
    return adminWithoutPassword;
  } catch (error) {
    throw error;
  }
};

const resetAdminPassword = async (adminId, superAdminId) => {
  try {
    // Check if requester is SUPERADMIN
    const superAdmin = await prisma.user.findUnique({
      where: { id: superAdminId }
    });

    if (!superAdmin || superAdmin.role !== 'SUPERADMIN') {
      throw new Error('Hanya SUPERADMIN yang dapat mereset password admin');
    }

    // Check if admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      throw new Error('Admin tidak ditemukan');
    }

    // Hash default password
    const defaultPassword = "admin123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Update admin password
    const updatedAdmin = await prisma.user.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    });

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = updatedAdmin;
    return adminWithoutPassword;
  } catch (error) {
    throw error;
  }
};

const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Password saat ini tidak valid');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  resetAdminPassword,
  changePassword
};