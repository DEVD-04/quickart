import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/UserRoutes.js';
import productRouter from './routes/ProductRoute.js';

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middleware
app.use(express.json()); // every request will be parsed in json
app.use(cors());

//api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

app.get('/', (req,res)=>{
    res.send("API Working");
})

app.listen(port, ()=> console.log(`Server running on PORT: ${port}`));