const path = require("path");

const express =require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgen = require("morgan");
const compression = require("compression");
dotenv.config({path:"./config.env"});

const ApiError = require("./utils/apiError")
const globalError = require("./middlewares/error.middleware")
const dbConnection = require("./config/database");
const mountRoutes = require("./routes");

dbConnection();

const app = express();

app.use(cors());
app.options("*", cors());
app.use(compression());


app.use(express.json());
app.use(express.static(path.join(__dirname , "uploads")));

console.log(`Environment mode: ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === "development"){
    app.use(morgen("dev"))
}else if (process.env.NODE_ENV === "production"){
    app.use(morgen("combined"))
}

// Mount Routes
mountRoutes(app);
app.get("/" , (req , res)=>{
    res.json({message:"Welcome To Ecommerce API" ,made_by:"Ammar" ,"status":"success" })
})
app.all("*" , ( req, res, next)=>{
    next(new ApiError(`Can't find this this route ${req.originalUrl}` , 400))
})

// Global Err Handling Middleware For Express
app.use(globalError)

const PORT = process.env.PORT
const server = app.listen(PORT,()=>{
    console.log(`App Running On http://localhost:${PORT}/`);
});

//Handle Unhandled Promise Rejection
process.on("unhandledRejection" , (err)=>{
    console.log("UNHANDLED REJECTION!");
    console.log(err.name , err.message);
    server.close((err)=>{
        console.log("Shutting down...")
        process.exit(1);
    })
})