const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create product shcema.
const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
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

// Post products data.
app.post('/products', async (req, res) => {
    try {
        const newProduct = new product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
        });
        const productData = await newProduct.insertMany();

        res.status(201).send({ productData });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
});

// Get products data.
app.get('/products', async (req, res) => {
    try {
        const allProducts = await product.find({ price: { $lte: 60 } });
        if (allProducts) {
            res.status(200).send({ allProducts })
        } else {
            res.status(404).send({ message: "Products not found" })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// Get single data according to id.
app.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const allProducts = await product.findOne({ _id: id });
        if (allProducts) {
            res.status(200).send({ allProducts })
        } else {
            res.status(404).send({ message: "Products not found" })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
});

// Delete a document using id.
app.delete('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleteProduct = await product.deleteOne({ _id: id });
        if (deleteProduct) {
            res.status(200).send({ deleteProduct })
        } else {
            res.status(404).send({ message: "something went to wrong." })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
});

// Update a document using id.
app.put('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateProduct = await product.updateOne({ _id: id }, { $set: { price: 80 } });
        if (updateProduct) {
            res.status(200).send({ updateProduct })
        } else {
            res.status(404).send({ message: "something went to wrong." })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
});