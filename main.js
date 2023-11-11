require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to your MongoDB using the connection string
mongoose.connect("mongodb+srv://jlenis:Juanpa954@cluster06.k5tcidg.mongodb.net/commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('Could not connect to MongoDB', err);
});

const productSchema = new mongoose.Schema({
  Title: String,
  Description: String,
  Price: String,
  Contact: String,
  Seller: String,
});

// Use 'newp' as the collection name
const Product = mongoose.model('Product', productSchema, 'newp');

// Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const { Title, Description, Price, Seller, Contact } = req.body;

    if (!Title || !Description || !Price || !Seller || !Contact) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const newProduct = new Product({
      Title,
      Description,
      Price,
      Seller,
      Contact,
      // Additional fields specific to your application
    });

    const savedProduct = await newProduct.save();

    if (savedProduct) {
      res.status(201).json({ message: 'Product saved successfully', product: savedProduct });
    } else {
      res.status(500).json({ error: 'Failed to save the product' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create and save the product', details: error.message });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
