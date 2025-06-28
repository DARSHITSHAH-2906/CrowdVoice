const express = require("express");
const cors = require("cors");
require('dotenv').config;
const path = require("path");
const cookieParser = require("cookie-parser");

const ConnectToDB = require("./Service/connect")

const { RefreshToken, VerifyUser } = require("./Service/auth");

//Router
const userrouter = require("./Routers/User")
const postrouter = require("./Routers/Post");
const communityrouter = require("./Routers/Community")

const startserver = async () => {
    const app = express();
    app.use(cors({
        origin: ['https://crowd-voice.vercel.app' , "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"],
        credentials: true, // Allow cookies to be sent with requests
        allowedHeaders: ["Content-Type", "Authorization"]
    }));
    app.use(cookieParser());
    app.use(express.json());

    app.use("/uploads/image", express.static(path.join(__dirname, "uploads/images")));
    app.use("/uploads/video", express.static(path.join(__dirname, "uploads/videos"), {
        setHeaders: (res, path) => {
            if (path.endsWith(".mp4")) {
                res.setHeader("Content-Type", "video/mp4");
            }
        }
    }));


    ConnectToDB();

    app.use("/user", userrouter);
    app.use("/post", postrouter);
    app.use("/community", communityrouter);

    app.get("/refresh-token" , RefreshToken);
    app.get("/verify-user" , VerifyUser)

    app.listen(3000, () => console.log("Server Started at http://localhost:3000"))
}

startserver();