import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoute from './routes/categoryRoute.js';
import productRoute from './routes/productRoute.js';
import formidable from 'express-formidable';
import cors from 'cors';

//config
dotenv.config();
//rest object

//database config
connectDB();
const app = express();

//middleware
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));


//routes
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);

//rest api
app.get('/', (req, res) => {
    res.send("<h1>  Welcome to ecommerce app</h1>");
});


//PORT 
const PORT = process.env.PORT || 3001;

process.on('uncaughtException', function (err) {
    console.log(err);
});

//listen
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`.bgCyan.white);
})