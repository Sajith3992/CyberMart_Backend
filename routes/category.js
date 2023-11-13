const express = require('express');
const router = express.Router();
const db = require('../lib/db.js');


router.post('/category',(req, res, next) => {
    const {category_name} = req.body;

    db.query(
        'INSERT INTO category (category_name) VALUES ( ?);',
        [
            category_name
        ],
        (err,result) =>{
            if(err){
                console.log(err);
                return res.status(500).send('Incorrect Category Insert Please Try Again')
            }
            res.status(201).send('Category Insert Successfully');
        }
        );
});

router.get('/categories',(req, res , next) =>{
    db.query(
        'SELECT * FROM category;',
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error fetching brands from the database');
            }
            res.status(200).json(results);
        }
    );
});

module.exports = router;