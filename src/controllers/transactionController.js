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
    },
    include: {
      accountBalances: true,
      transactions: true,
      capitalFlows: true
    }
  });

  if (!dailyData) {
    // Cari data hari sebelumnya untuk saldo awal
    const previousDate = new Date(dateString);
    previousDate.setDate(previousDate.getDate() - 1);
    let previousDateString = getLocalDateString(previousDate);
    
    let previousData = null;
    for (let i = 1; i <= 30; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateString = getLocalDateString(checkDate);
      const data = await prisma.dailyData.findUnique({
        where: {
          userId_date: {
            userId,
            date: checkDateString
          }
        },
        include: {
          accountBalances: true
        }
      });
      if (data) {
        previousData = data;
        break;
      }
    }

    // Buat daily data baru
    dailyData = await prisma.dailyData.create({
      data: {
        userId,
        date: dateString,
        initialCapital: previousData ? (previousData.initialCapital || 0) : 0,
        bonusFee: 0
      },
      include: {
        accountBalances: true,
        transactions: true,
        capitalFlows: true
      }
    });

    // Copy account balances dari hari sebelumnya atau buat default
    const accounts = await prisma.account.findMany({
      where: { userId }
    });

    if (previousData && previousData.accountBalances.length > 0) {
      // Copy dari hari sebelumnya
      for (const prevBalance of previousData.accountBalances) {
        await prisma.accountBalance.create({
          data: {
            dailyDataId: dailyData.id,
            accountKey: prevBalance.accountKey,
            balance: prevBalance.balance
          }
        });
      }
    } else {
      // Buat default balances
      for (const account of accounts) {
        await prisma.accountBalance.create({
          data: {
            dailyDataId: dailyData.id,
            accountKey: account.key,
            balance: 0
          }
        });
      }
    }

    // Reload dengan balances
    dailyData = await prisma.dailyData.findUnique({
      where: { id: dailyData.id },
      include: {
        accountBalances: true,
        transactions: true,
        capitalFlows: true
      }
    });
  }

  return dailyData;
};

export const getTransactions = async (req, res) => {
  try {
    const { date } = req.query;
    const dateString = date || getLocalDateString();
    
    const dailyData = await getOrCreateDailyData(req.userId, dateString);
    
    res.json({
      transactions: dailyData.transactions,
      date: dateString
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const dateString = req.body.date || getLocalDateString();
    const dailyData = await getOrCreateDailyData(req.userId, dateString);

    const transaction = await prisma.transaction.create({
      data: {
        dailyDataId: dailyData.id,
        type: req.body.type,
        date: dateString,
        time: req.body.time,
        customerName: req.body.customerName,
        sourceAccount: req.body.sourceAccount || 'bri1',
        amount: parseFloat(req.body.amount) || 0,
        internalAdminFee: parseFloat(req.body.internalAdminFee) || 0,
        externalAdminFee: parseFloat(req.body.externalAdminFee) || 0,
        bankFee: parseFloat(req.body.bankFee) || 0,
        bankTujuan: req.body.bankTujuan,
        ewalletTujuan: req.body.ewalletTujuan,
        financeTujuan: req.body.financeTujuan,
        pegadaianTujuan: req.body.pegadaianTujuan,
        listrikTujuan: req.body.listrikTujuan,
        teleponTujuan: req.body.teleponTujuan,
        goodsType: req.body.goodsType
      }
    });

    res.json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        dailyData: true
      }
    });

    if (!transaction || transaction.dailyData.userId !== req.userId) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        type: req.body.type,
        date: req.body.date,
        time: req.body.time,
        customerName: req.body.customerName,
        sourceAccount: req.body.sourceAccount,
        amount: parseFloat(req.body.amount) || 0,
        internalAdminFee: parseFloat(req.body.internalAdminFee) || 0,
        externalAdminFee: parseFloat(req.body.externalAdminFee) || 0,
        bankFee: parseFloat(req.body.bankFee) || 0,
        bankTujuan: req.body.bankTujuan,
        ewalletTujuan: req.body.ewalletTujuan,
        financeTujuan: req.body.financeTujuan,
        pegadaianTujuan: req.body.pegadaianTujuan,
        listrikTujuan: req.body.listrikTujuan,
        teleponTujuan: req.body.teleponTujuan,
        goodsType: req.body.goodsType
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        dailyData: true
      }
    });

    if (!transaction || transaction.dailyData.userId !== req.userId) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.delete({
      where: { id }
    });

    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
