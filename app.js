const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require("./routes/authRoute")

dotenv.config();

const app = express();
const prisma = new PrismaClient();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/", authRoutes)


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


