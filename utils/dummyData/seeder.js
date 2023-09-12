const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');
const Product = require('../../models/product.model');
const dBConnection = require('../../config/database');
dotenv.config({ path: '../../config.env' });
dBConnection();

const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));

const insertData = async () => {
    try {
        await Product.create(products);
        console.log("Data Imported Successfully".green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
};

const deleteData = async () => {
    try {
        await Product.deleteMany();
        console.log("Data Deleted Successfully".red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

if(process.argv[2] === "-i"){
    insertData();
}
else if(process.argv[2] === "-d"){
    deleteData();
}