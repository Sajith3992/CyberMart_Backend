const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../lib/db.js');
const sellerMiddleware = require('../middleware/sellerMiddleware.js');

router.post('/seller-sign-up', sellerMiddleware.validateRegister, (req, res, next) => {
    db.query(
        'SELECT id FROM seller WHERE LOWER(clientName) = LOWER(?)',
        [req.body.clientName],
        (err, result) => {
          if (result && result.length) {
            // error
            return res.status(409).send({
              message: 'This sellerName is already in use!',
            });
          } else {
            // clientName not in use
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).send({
                  message: err,
                });
              } else {
                db.query(
                  'INSERT INTO seller (id, clientName, email, password, city, address, phone, invitecode, registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now());',
                  [uuid.v4(), req.body.clientName, req.body.email, hash, req.body.city, req.body.address, req.body.phone, req.body.invitecode],
                  (err, result) => {
                    if (err) {
                      return res.status(400).send({
                        message: err,
                      });
                    }
                    return res.status(201).send({
                      message: 'Registered!',
                    });
                  }
                );
              }
            });
          }
        }
      );
    });

router.post('/seller-login', async (req, res, next) => {
    db.query(
        `SELECT * FROM seller WHERE email = ?;`,
        [req.body.email],
        (err, result) => {
          if (err) {
            return res.status(400).send({
              message: err,
            });
          }
          if (!result.length) {
            return res.status(400).send({
              message: 'email or password incorrect!',
            });
          }
          bcrypt.compare(
            req.body.password,
            result[0]['password'],
            (bErr, bResult) => {
              if (bErr) {
                return res.status(400).send({
                  message: 'email or password incorrect!',
                });
              }
              if (bResult) {
                // password match
                const token = jwt.sign(
                  {
                    email: result[0].email,
                    userId: result[0].id,
                  },
                  'SECRETKEY',
                  { expiresIn: '1d' }
                );
                db.query(`UPDATE seller SET last_login = now() WHERE id = ?;`, [
                  result[0].id,
                ]);
                return res.status(200).send({
                  message: 'Logged in!',
                  token,
                  user: result[0],
                });
              }
              return res.status(400).send({
                message: 'email or password incorrect!',
              });
            }
          );
        }
      );
    });

router.get('/seller-secret-route', sellerMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = router;
