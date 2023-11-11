const express = require('express');
const router = express.Router();
const db = require('../lib/db.js');
const {validateProduct } = require('../middleware/productMiddleware.js');

router.post('/product',(req, res, next) => {
    const {p_name, p_brand, p_category, p_unit, p_minqty, p_lotnumber, p_exprireddate, p_barcode,p_image,p_price, p_tax,p_purchesprice,p_discount,p_taxtype,p_margine,p_saleprice,p_finalprice} = req.body;
    
    const validationErrors = validateProduct(req.body);

    if(validationErrors.length > 0){
         return res.status(400).json({errors:validationErrors});
       // return res.status(500).send('Validation Error');
    }

    db.query(
        'INSERT INTO product (p_name, p_brand, p_category, p_unit, p_minqty, p_lotnumber, p_exprireddate, p_barcode,p_image,p_price, p_tax,p_purchesprice,p_discount,p_taxtype,p_margine,p_saleprice,p_finalprice) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
            p_name, p_brand, p_category, p_unit, p_minqty, p_lotnumber, p_exprireddate, p_barcode,p_image,p_price, p_tax,p_purchesprice,p_discount,p_taxtype,p_margine,p_saleprice,p_finalprice
        ],
        (err,result) =>{
            if(err){
                console.log(err);
                return res.status(500).send('Incorrect Product Insert Please Try Again')
            }
            res.status(201).send('Product Insert Successfully');
        }
        )
})

module.exports = router;