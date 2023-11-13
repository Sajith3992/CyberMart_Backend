const express = require('express');
const router = express.Router();
const db = require('../lib/db.js');


router.post('/brand',(req, res, next) => {
    const {name } = req.body;
    
    db.query(
        'INSERT INTO brand (name, ) VALUES ( ? );',
        [
            name, 
        ],
        (err,result) =>{
            if(err){
                console.log(err);
                return res.status(500).send('Incorrect Brand Insert Please Try Again')
            }
            res.status(201).send('Brand Insert Successfully');
        }
        )
})

module.exports = router;