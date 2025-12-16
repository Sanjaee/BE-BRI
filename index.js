import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./src/routes/authRoutes.js"
import transactionRoutes from "./src/routes/transactionRoutes.js"
import accountRoutes from "./src/routes/accountRoutes.js"
import dailyDataRoutes from "./src/routes/dailyDataRoutes.js"
import capitalFlowRoutes from "./src/routes/capitalFlowRoutes.js"
import outletRoutes from "./src/routes/outletRoutes.js"
import settingsRoutes from "./src/routes/settingsRoutes.js"

const app = express()
const port = process.env.PORT || 3000

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://127.0.0.1:8080', 'http://localhost:8080', '*'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*') || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type']
}))

// Cookie parser middleware
app.use(cookieParser())
app.use(express.json())

// Routes
app.get("/", (req, res) => {
    res.send("BRI Link API Server")
})

app.use("/api/auth", authRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/daily-data", dailyDataRoutes)
app.use("/api/capital-flows", capitalFlowRoutes)
app.use("/api/outlet", outletRoutes)
app.use("/api/settings", settingsRoutes)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`)
})