import prisma from '../utils/prisma.js';

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDailyData = async (req, res) => {
  try {
    const { date } = req.query;
    const dateString = date || getLocalDateString();

    let dailyData = await prisma.dailyData.findUnique({
      where: {
        userId_date: {
          userId: req.userId,
          date: dateString
        }
      },
      include: {
        accountBalances: true,
        transactions: {
          orderBy: { createdAt: 'desc' }
        },
        capitalFlows: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!dailyData) {
      // Buat default daily data
      dailyData = await prisma.dailyData.create({
        data: {
          userId: req.userId,
          date: dateString,
          initialCapital: 0,
          bonusFee: 0
        },
        include: {
          accountBalances: true,
          transactions: true,
          capitalFlows: true
        }
      });
    }

    res.json(dailyData);
  } catch (error) {
    console.error('Get daily data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDailyData = async (req, res) => {
  try {
    const { date, initialCapital, bonusFee } = req.body;
    const dateString = date || getLocalDateString();

    const dailyData = await prisma.dailyData.upsert({
      where: {
        userId_date: {
          userId: req.userId,
          date: dateString
        }
      },
      update: {
        initialCapital: initialCapital !== undefined ? parseFloat(initialCapital) : undefined,
        bonusFee: bonusFee !== undefined ? parseFloat(bonusFee) : undefined
      },
      create: {
        userId: req.userId,
        date: dateString,
        initialCapital: parseFloat(initialCapital) || 0,
        bonusFee: parseFloat(bonusFee) || 0
      }
    });

    res.json(dailyData);
  } catch (error) {
    console.error('Update daily data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetDailyData = async (req, res) => {
  try {
    const { date } = req.body;
    const dateString = date || getLocalDateString();

    const dailyData = await prisma.dailyData.findUnique({
      where: {
        userId_date: {
          userId: req.userId,
          date: dateString
        }
      }
    });

    if (dailyData) {
      // Hapus semua transaksi dan capital flows
      await prisma.transaction.deleteMany({
        where: { dailyDataId: dailyData.id }
      });

      await prisma.capitalFlow.deleteMany({
        where: { dailyDataId: dailyData.id }
      });

      // Reset balances ke 0
      await prisma.accountBalance.updateMany({
        where: { dailyDataId: dailyData.id },
        data: { balance: 0 }
      });

      // Reset initial capital dan bonus fee
      await prisma.dailyData.update({
        where: { id: dailyData.id },
        data: {
          initialCapital: 0,
          bonusFee: 0
        }
      });
    }

    res.json({ message: 'Daily data reset successfully' });
  } catch (error) {
    console.error('Reset daily data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
