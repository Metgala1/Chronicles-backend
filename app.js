const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const initializePassport = require("./config/passport");
const passport = require('passport');

//imported routes
const authRoutes = require("./routes/authRoute")
const postRoutes = require("./controllers/postController")
const commentRoutes = require("./routes/commentsRoute")

initializePassport(passport)

dotenv.config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize())
app.use(passport.session())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
//Routes
app.use("/auth", authRoutes)
app.use("/posts", postRoutes)
app.use("/comments", commentRoutes)


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


