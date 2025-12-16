import prisma from '../utils/prisma.js';

export const getOutlet = async (req, res) => {
  try {
    let outlet = await prisma.outlet.findUnique({
      where: { userId: req.userId }
    });

    if (!outlet) {
      outlet = await prisma.outlet.create({
        data: {
          userId: req.userId,
          name: 'ENGGAL JAYA',
          address: 'Jayapura, Papua'
        }
      });
    }

    res.json(outlet);
  } catch (error) {
    console.error('Get outlet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOutlet = async (req, res) => {
  try {
    const { name, address } = req.body;

    const outlet = await prisma.outlet.upsert({
      where: { userId: req.userId },
      update: {
        name: name || undefined,
        address: address || undefined
      },
      create: {
        userId: req.userId,
        name: name || 'ENGGAL JAYA',
        address: address || 'Jayapura, Papua'
      }
    });

    res.json(outlet);
  } catch (error) {
    console.error('Update outlet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
