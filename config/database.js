const mongoose = require("mongoose")
const dbConnection = ()=>{
    mongoose
        .connect(process.env.DB_URI)
        .then(
            (conn)=> {
                console.log("\x1b[32m",`DB connected with ${conn.connection.host}`);
            })
        // .catch((err)=>{
        //     console.log("DB ERR "+err)
        //     process.exit(1)
        // })
}
module.exports = dbConnection