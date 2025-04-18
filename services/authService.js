const bcrypt = require('bcrypt');
const prisma = require('../configs/prisma');
const { generateToken } = require('../configs/jwt');
const imagekit = require('../configs/imagekit');
const fs = require('fs');

const register = async (username, email, password, profileImage = null, role = 'ADMIN', createdBy = null) => {
  try {
    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let profileImageUrl = null;
    
    // Upload profile image to ImageKit if provided
    if (profileImage) {
      try {
        const fileBuffer = fs.readFileSync(profileImage.path);
        const fileContent = fileBuffer.toString('base64');
        
        const uploadResponse = await imagekit.upload({
          file: fileContent,
          fileName: `${username}-profile-${Date.now()}`,
          folder: '/user-profiles'
        });
        
        profileImageUrl = uploadResponse.url;
        
        // Clean up temporary file
        fs.unlinkSync(profileImage.path);
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload profile image');
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profileImage: profileImageUrl,
        role,
        createdBy
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

const login = async (identifier, password) => {
  try {
    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier }
        ]
      }
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

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
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

    // Register new admin
    return await register(
      userData.username,
      userData.email,
      userData.password,
      userData.profileImage,
      'ADMIN',
      creatorId
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
  createAdmin
};