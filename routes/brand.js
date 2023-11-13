const express = require('express');
const router = express.Router();
const db = require('../lib/db.js');


router.post('/brand',(req, res, next) => {
    const {brand_name} = req.body;

    db.query(
        'INSERT INTO brand (brand_name) VALUES ( ?);',
        [
            brand_name
        ],
        (err,result) =>{
            if(err){
                console.log(err);
                return res.status(500).send('Incorrect Brand Insert Please Try Again')
            }
            res.status(201).send('Brand Insert Successfully');
        }
        );
});

router.get('/brands',(req, res , next) =>{
    db.query(
        'SELECT * FROM brand;',
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