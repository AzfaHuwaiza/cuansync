require('dotenv').config();
const express = require('express');
const erorHandler = require('./src/middleware/errorHandler');
const mainRouter = require('./src/routes');
const cors = require('cors');
const cokieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
    origin: ['http://localhost:5173', 'https://cuansync-iqbalsypk-three.vercel.app'], // Izinkan port React kamu
    credentials: true 
}));


app.use(express.json());
app.use(cokieParser());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/', mainRouter);

app.use((req,res) => {
    res.status(404).json({
        status: 'failed',
        message: 'Halaman yang kamu cari tidak ditemukan',
    })
});

app.use(erorHandler);
app.listen(PORT, () =>{
    console.log(`SERVER : http://localhost:${PORT}`);
})