import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Register admin (you might want to secure this endpoint or use it only once)
export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin already exists
    let admin = await Admin.findOne({ username });
    if (admin) {
      return res.status(400).json({
        success: false,
        error: 'Admin already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    admin = new Admin({
      username,
      password: hashedPassword
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error registering admin'
    });
  }
};

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error logging in'
    });
  }
};