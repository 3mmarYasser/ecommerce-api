const express =require("express");
const dotenv = require("dotenv");
const morgen = require("morgan");
dotenv.config({path:"./config.env"});

const ApiError = require("./utils/apiError")
const globalError = require("./middlewares/error.middleware")
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/category.route");

dbConnection();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development"){
    app.use(morgen("dev"))
    console.log(`Environment mode: ${process.env.NODE_ENV}`)

}

// Mount Routes

app.use("/api/v1/categories",categoryRoute)
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
