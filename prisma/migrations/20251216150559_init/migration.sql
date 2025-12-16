-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outlet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'ENGGAL JAYA',
    "address" TEXT NOT NULL DEFAULT 'Jayapura, Papua',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outlet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "initialCapital" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bonusFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountBalance" (
    "id" TEXT NOT NULL,
    "dailyDataId" TEXT NOT NULL,
    "accountKey" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "dailyDataId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT,
    "customerName" TEXT,
    "sourceAccount" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "internalAdminFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "externalAdminFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bankFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bankTujuan" TEXT,
    "ewalletTujuan" TEXT,
    "financeTujuan" TEXT,
    "pegadaianTujuan" TEXT,
    "listrikTujuan" TEXT,
    "teleponTujuan" TEXT,
    "goodsType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapitalFlow" (
    "id" TEXT NOT NULL,
    "dailyDataId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "sourceBankAccount" TEXT,
    "destinationBankAccount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CapitalFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feeTiers" JSONB NOT NULL,
    "simpleFees" JSONB NOT NULL,
    "bonusFeeAccount" TEXT NOT NULL DEFAULT 'bri1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Outlet_userId_key" ON "Outlet"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key_key" ON "Account"("userId", "key");

-- CreateIndex
CREATE INDEX "DailyData_userId_date_idx" ON "DailyData"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyData_userId_date_key" ON "DailyData"("userId", "date");

-- CreateIndex
CREATE INDEX "AccountBalance_dailyDataId_idx" ON "AccountBalance"("dailyDataId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountBalance_dailyDataId_accountKey_key" ON "AccountBalance"("dailyDataId", "accountKey");

-- CreateIndex
CREATE INDEX "Transaction_dailyDataId_idx" ON "Transaction"("dailyDataId");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE INDEX "CapitalFlow_dailyDataId_idx" ON "CapitalFlow"("dailyDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- AddForeignKey
ALTER TABLE "Outlet" ADD CONSTRAINT "Outlet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyData" ADD CONSTRAINT "DailyData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountBalance" ADD CONSTRAINT "AccountBalance_dailyDataId_fkey" FOREIGN KEY ("dailyDataId") REFERENCES "DailyData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_dailyDataId_fkey" FOREIGN KEY ("dailyDataId") REFERENCES "DailyData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapitalFlow" ADD CONSTRAINT "CapitalFlow_dailyDataId_fkey" FOREIGN KEY ("dailyDataId") REFERENCES "DailyData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
