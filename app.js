const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require("./routes/authRoute");
const postRoutes = require("./routes/postRoute");
const commentRoutes = require("./routes/commentsRoute");

dotenv.config();
const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://chronicles-seven.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
