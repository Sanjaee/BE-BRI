# BRI Link Backend API

Backend API untuk aplikasi BUKU KAS BRILink dengan JWT Authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup database:
- Buat file `.env` di root folder `be/`
- Tambahkan:
```
DATABASE_URL="postgresql://user:password@localhost:5432/brilink_db"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
```

3. Generate Prisma Client:
```bash
npx prisma generate
```

4. Run migrations:
```bash
npx prisma migrate dev --name init
```

5. Start server:
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

### Auth
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token (protected)

### Transactions
- `GET /api/transactions?date=YYYY-MM-DD` - Get transactions (protected)
- `POST /api/transactions` - Create transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

### Accounts
- `GET /api/accounts` - Get all accounts (protected)
- `POST /api/accounts` - Create account (protected)
- `PUT /api/accounts/:id` - Update account (protected)
- `DELETE /api/accounts/:id` - Delete account (protected)
- `GET /api/accounts/balances?date=YYYY-MM-DD` - Get account balances (protected)
- `PUT /api/accounts/balances/update` - Update account balance (protected)

### Daily Data
- `GET /api/daily-data?date=YYYY-MM-DD` - Get daily data (protected)
- `PUT /api/daily-data` - Update daily data (protected)
- `POST /api/daily-data/reset` - Reset daily data (protected)

### Capital Flows
- `GET /api/capital-flows?date=YYYY-MM-DD` - Get capital flows (protected)
- `POST /api/capital-flows` - Create capital flow (protected)
- `DELETE /api/capital-flows/:id` - Delete capital flow (protected)

### Outlet
- `GET /api/outlet` - Get outlet info (protected)
- `PUT /api/outlet` - Update outlet info (protected)

### Settings
- `GET /api/settings` - Get settings (protected)
- `PUT /api/settings` - Update settings (protected)
- `POST /api/settings/reset` - Reset settings (protected)

## Authentication

Semua endpoint kecuali `/api/auth/login` memerlukan JWT token di header:
```
Authorization: Bearer <token>
```

Token akan otomatis expire setelah 7 hari (default) atau sesuai `JWT_EXPIRES_IN`.

## Database Schema

- **User**: User accounts untuk login
- **Outlet**: Info outlet/agen
- **Account**: Rekening bank
- **DailyData**: Data harian (initial capital, bonus fee)
- **AccountBalance**: Saldo rekening per hari
- **Transaction**: Transaksi harian
- **CapitalFlow**: Arus kas internal
- **Settings**: Pengaturan biaya admin

## Default User

Username: `enggal1933`
Password: `12345`
PIN: `12345`
