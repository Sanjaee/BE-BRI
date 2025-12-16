import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { generateToken } from '../utils/jwt.js';

// Default user untuk development
const DEFAULT_USERS = [
  { username: 'enggal1933', password: '12345', pin: '12345' }
];

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Cek di database
    let user = await prisma.user.findUnique({
      where: { username }
    });

    // Jika tidak ada, cek default users dan buat user baru
    if (!user) {
      const defaultUser = DEFAULT_USERS.find(u => u.username === username);
      if (defaultUser && (defaultUser.password === password || defaultUser.pin === password)) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
          data: {
            username: defaultUser.username,
            password: hashedPassword,
            pin: defaultUser.pin
          }
        });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      // Verify password
      const isValid = await bcrypt.compare(password, user.password) || password === user.pin;
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username
    });

    // Ensure outlet exists
    let outlet = await prisma.outlet.findUnique({
      where: { userId: user.id }
    });

    if (!outlet) {
      outlet = await prisma.outlet.create({
        data: {
          userId: user.id,
          name: 'ENGGAL JAYA',
          address: 'Jayapura, Papua'
        }
      });
    }

    // Return token in response (frontend will store in sessionStorage)
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      },
      outlet: {
        name: outlet.name,
        address: outlet.address
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verify = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, username: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const outlet = await prisma.outlet.findUnique({
      where: { userId: user.id }
    });

    res.json({
      user,
      outlet: outlet || { name: 'ENGGAL JAYA', address: 'Jayapura, Papua' }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = (req, res) => {
  // Token is stored in sessionStorage, frontend will clear it
  res.json({ message: 'Logged out successfully' });
};
