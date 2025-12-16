import prisma from '../utils/prisma.js';

const DEFAULT_SETTINGS = {
  feeTiers: {
    BRI_INTRA: [
      { min: 10000, max: 300000, fee: 5000 },
      { min: 350000, max: 3000000, fee: 10000 },
      { min: 3100000, max: 5000000, fee: 15000 },
      { min: 5100000, max: 7000000, fee: 20000 },
      { min: 7100000, max: 9000000, fee: 25000 },
      { min: 9100000, max: 10000000, fee: 30000 }
    ],
    INTERBANK: [
      { min: 10000, max: 300000, fee: 10000 },
      { min: 350000, max: 3000000, fee: 15000 },
      { min: 3100000, max: 5000000, fee: 20000 },
      { min: 5100000, max: 7000000, fee: 25000 },
      { min: 7100000, max: 9000000, fee: 30000 },
      { min: 9100000, max: 10000000, fee: 40000 }
    ],
    CASHOUT: [
      { min: 10000, max: 50000, fee: 0 },
      { min: 55000, max: 3000000, fee: 5000 },
      { min: 3100000, max: 10000000, fee: 10000 }
    ]
  },
  simpleFees: {
    'Setor Tunai': 3000,
    'Bayar Listrik': 2500,
    'Bayar BPJS KS': 2500,
    'Bayar BPJS TK': 2500,
    'Bayar PDAM': 2500,
    'Beli Pulsa': 1500,
    'Top Up E-Wallet': 2000,
    'Bayar Cicilan': 3000,
    'Pembayaran Pegadaian': 2500,
    'Pembayaran Telepon Pascabayar': 2500,
    'Briva': 2500,
    'Asuransi': 2500,
    'MPN': 2500,
    'Pajak Bumi': 2500,
    'Kartu Kredit': 2500,
    'Numpang Transaksi': 2500,
    'Lainnya': 0
  },
  bonusFeeAccount: 'bri1'
};

export const getSettings = async (req, res) => {
  try {
    let settings = await prisma.settings.findUnique({
      where: { userId: req.userId }
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          userId: req.userId,
          feeTiers: DEFAULT_SETTINGS.feeTiers,
          simpleFees: DEFAULT_SETTINGS.simpleFees,
          bonusFeeAccount: DEFAULT_SETTINGS.bonusFeeAccount
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { feeTiers, simpleFees, bonusFeeAccount } = req.body;

    const settings = await prisma.settings.upsert({
      where: { userId: req.userId },
      update: {
        feeTiers: feeTiers || undefined,
        simpleFees: simpleFees || undefined,
        bonusFeeAccount: bonusFeeAccount || undefined
      },
      create: {
        userId: req.userId,
        feeTiers: feeTiers || DEFAULT_SETTINGS.feeTiers,
        simpleFees: simpleFees || DEFAULT_SETTINGS.simpleFees,
        bonusFeeAccount: bonusFeeAccount || DEFAULT_SETTINGS.bonusFeeAccount
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetSettings = async (req, res) => {
  try {
    const settings = await prisma.settings.upsert({
      where: { userId: req.userId },
      update: {
        feeTiers: DEFAULT_SETTINGS.feeTiers,
        simpleFees: DEFAULT_SETTINGS.simpleFees,
        bonusFeeAccount: DEFAULT_SETTINGS.bonusFeeAccount
      },
      create: {
        userId: req.userId,
        feeTiers: DEFAULT_SETTINGS.feeTiers,
        simpleFees: DEFAULT_SETTINGS.simpleFees,
        bonusFeeAccount: DEFAULT_SETTINGS.bonusFeeAccount
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
