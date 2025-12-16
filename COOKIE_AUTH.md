# Cookie-Based Authentication untuk Cross-Domain

## Konfigurasi

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5500"  # URL frontend Anda (atau "*" untuk development)
NODE_ENV="development"  # atau "production"
```

### Frontend
Update `API_BASE_URL` di `index.html`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';  // URL backend Anda
```

## Cara Kerja

1. **Login**: Backend set cookie `authToken` dengan:
   - `httpOnly: true` - Mencegah XSS attacks
   - `secure: true` (production) - Hanya HTTPS
   - `sameSite: 'none'` - **PENTING untuk cross-domain**
   - `maxAge: 7 days`

2. **Request**: Frontend otomatis kirim cookie dengan `credentials: 'include'`

3. **Middleware**: Backend baca token dari cookie (atau fallback ke Authorization header)

4. **Logout**: Backend clear cookie dengan `maxAge: 0`

## Cross-Domain Support

✅ **Bisa** digunakan untuk backend dan frontend berbeda domain dengan:
- CORS `credentials: true`
- Cookie `sameSite: 'none'`
- Cookie `secure: true` (wajib untuk HTTPS)

## Security Notes

- Cookie `httpOnly` mencegah JavaScript access (XSS protection)
- Cookie `secure` wajib di production (HTTPS only)
- `sameSite: 'none'` diperlukan untuk cross-domain tapi harus pakai HTTPS

## Testing

1. Install dependencies:
```bash
cd be
npm install
```

2. Set environment variables di `.env`

3. Start backend:
```bash
npm start
```

4. Buka frontend di browser (bisa beda domain/port)

5. Login - cookie akan otomatis ter-set dan terkirim di setiap request
