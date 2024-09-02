const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Gizoventory'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// API route to save product
app.post('/api/save-product', (req, res) => {
    const { category, name, unitOfIssue, reorderQuantity, image } = req.body;

    const sql = 'INSERT INTO products (ProductCategoryID, ProductName, UnitOfIssue, ReOrderQuantity, ProductImage) VALUES (?, ?, ?, ?, ?)';
    const getCategoryIDSql = 'SELECT id FROM product_categories WHERE name = ?';
    db.query(getCategoryIDSql, [category], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred while retrieving the category ID.');
        }
        if (results.length === 0) {
            return res.status(404).send('Category not found.');
        }
        const categoryID = results[0].id;
        db.query(sql, [categoryID, name, unitOfIssue, reorderQuantity, image], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('An error occurred while saving the product.');
            }
            res.send('Product saved successfully.');
        });
    });
});

app.get('/api/get-categories', (req, res) => {
    const sql = 'SELECT * FROM product_categories';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred while retrieving the categories.');
        }
        res.send(results);
    });
});
app.get('/api/get-products', (req, res) => {
   res.send('Hello World');
  
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
