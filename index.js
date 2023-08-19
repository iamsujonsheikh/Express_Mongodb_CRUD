const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = 3000;

// Create product shcema.
const productSchema = mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    createAt: {
        type: Date,
        default: Date.now
    }
});
// Create product model.
const product = mongoose.model("products", productSchema);
// Connect to the mongodb using mongoose.
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/testProductDB')
        console.log("Database is succesfully connected.")

    } catch (error) {
        console.log('Something went to wrong db is not connect.', error.message);
        process.exit(1);
    }
};

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectDB();
});

app.get('/', (req, res) => {
    res.send("<h1>Hello developer i am from home route.</h1>")
});