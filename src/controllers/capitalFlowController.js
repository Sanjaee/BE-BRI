import prisma from '../utils/prisma.js';

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getOrCreateDailyData = async (userId, dateString) => {
  let dailyData = await prisma.dailyData.findUnique({
    where: {
      userId_date: {
        userId,
        date: dateString
      }
    }
  });

  if (!dailyData) {
    dailyData = await prisma.dailyData.create({
      data: {
        userId,
        date: dateString,
        initialCapital: 0,
        bonusFee: 0
      }
    });
  }

  return dailyData;
};

export const getCapitalFlows = async (req, res) => {
  try {
    const { date } = req.query;
    const dateString = date || getLocalDateString();

    const dailyData = await getOrCreateDailyData(req.userId, dateString);

    const capitalFlows = await prisma.capitalFlow.findMany({
      where: { dailyDataId: dailyData.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(capitalFlows);
  } catch (error) {
    console.error('Get capital flows error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCapitalFlow = async (req, res) => {
  try {
    const dateString = req.body.date || getLocalDateString();
    const dailyData = await getOrCreateDailyData(req.userId, dateString);

    const capitalFlow = await prisma.capitalFlow.create({
      data: {
        dailyDataId: dailyData.id,
        type: req.body.type,
        amount: parseFloat(req.body.amount) || 0,
        sourceBankAccount: req.body.sourceBankAccount,
        destinationBankAccount: req.body.destinationBankAccount
      }
    });

    res.json(capitalFlow);
  } catch (error) {
    console.error('Create capital flow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCapitalFlow = async (req, res) => {
  try {
    const { id } = req.params;

    const capitalFlow = await prisma.capitalFlow.findUnique({
      where: { id },
      include: {
        dailyData: true
      }
    });

    if (!capitalFlow || capitalFlow.dailyData.userId !== req.userId) {
      return res.status(404).json({ error: 'Capital flow not found' });
    }

    await prisma.capitalFlow.delete({
      where: { id }
    });

    res.json({ message: 'Capital flow deleted' });
  } catch (error) {
    console.error('Delete capital flow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
