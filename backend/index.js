import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import router from "./routes/route.js"

// username - zoro
// password - iPV8upiaeKUCOsZj
// url - mongodb+srv://zoro:<password>@cluster0.lm1skdd.mongodb.net/?retryWrites=true&w=majority

const app = express();

app.use(morgan("dev"));
app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

app.use("/api", router); // http://localhost:5000/users/signup

const MONGODB_URL = "mongodb+srv://zoro:iPV8upiaeKUCOsZj@cluster0.lm1skdd.mongodb.net/?retryWrites=true&w=majority";

const port = 5000;

mongoose.connect(MONGODB_URL).then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
})
.catch((error) => console.log(`${error} did not connect`));