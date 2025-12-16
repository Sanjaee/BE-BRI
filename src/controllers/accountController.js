import prisma from '../utils/prisma.js';

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getAccounts = async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.userId },
      orderBy: { key: 'asc' }
    });

    res.json(accounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createAccount = async (req, res) => {
  try {
    const { key, name } = req.body;

    if (!key || !name) {
      return res.status(400).json({ error: 'Key and name required' });
    }

    const account = await prisma.account.create({
      data: {
        userId: req.userId,
        key,
        name
      }
    });

    res.json(account);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Account key already exists' });
    }
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const account = await prisma.account.findUnique({
      where: { id }
    });

    if (!account || account.userId !== req.userId) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const updated = await prisma.account.update({
      where: { id },
      data: { name }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await prisma.account.findUnique({
      where: { id }
    });

    if (!account || account.userId !== req.userId) {
      return res.status(404).json({ error: 'Account not found' });
    }

    await prisma.account.delete({
      where: { id }
    });

    res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAccountBalances = async (req, res) => {
  try {
    const { date } = req.query;
    const dateString = date || getLocalDateString();

    const dailyData = await prisma.dailyData.findUnique({
      where: {
        userId_date: {
          userId: req.userId,
          date: dateString
        }
      },
      include: {
        accountBalances: true
      }
    });

    if (!dailyData) {
      return res.json({ balances: [] });
    }

    res.json({ balances: dailyData.accountBalances });
  } catch (error) {
    console.error('Get account balances error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAccountBalance = async (req, res) => {
  try {
    const { date, accountKey, balance } = req.body;
    const dateString = date || getLocalDateString();

    let dailyData = await prisma.dailyData.findUnique({
      where: {
        userId_date: {
          userId: req.userId,
          date: dateString
        }
      }
    });

    if (!dailyData) {
      dailyData = await prisma.dailyData.create({
        data: {
          userId: req.userId,
          date: dateString,
          initialCapital: 0,
          bonusFee: 0
        }
      });
    }

    const accountBalance = await prisma.accountBalance.upsert({
      where: {
        dailyDataId_accountKey: {
          dailyDataId: dailyData.id,
          accountKey
        }
      },
      update: {
        balance: parseFloat(balance) || 0
      },
      create: {
        dailyDataId: dailyData.id,
        accountKey,
        balance: parseFloat(balance) || 0
      }
    });

    res.json(accountBalance);
  } catch (error) {
    console.error('Update account balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
