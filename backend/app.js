require('dotenv').config()
const express = require('express');
const cors = require('cors')
const connectDB = require('./config/db.js');
const UserRouter = require('./routes/userRoutes.js');

const app = express();
const PORT = process.env.PORT 

app.use(express.json());
// Configure CORS to allow requests from frontend (include local dev origin)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://investfolio.onrender.com',
  'https://investfolio.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like curl, Postman, or server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy: This origin is not allowed by CORS'), false);
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 204
}))


app.use("/api/user",UserRouter)

// Health check endpoint for quick local verification
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

connectDB.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`server is listening on ${PORT}`)
    })
})
.catch((err)=>{
    console.log("Server Error", err)
})
