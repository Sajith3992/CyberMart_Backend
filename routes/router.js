const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');


router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    db.query(
      'SELECT id FROM users WHERE LOWER(clientName) = LOWER(?)',
      [req.body.clientName],
      (err, result) => {
        if (result && result.length) {
          // error
          return res.status(409).send({
            message: 'This clientName is already in use!',
          });
        } else {
          // clientName not in use
          const userId = uuid.v4();
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                message: err,
              });
            } else {
              db.query(
                'INSERT INTO users (id, clientName, email, password, city, address, phone, invitecode, registered) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, now());',
                [userId,req.body.clientName, req.body.email, hash, req.body.city, req.body.address, req.body.phone, req.body.invitecode],
                //uuid.v4(),
                (err, result) => {
                  if (err) {
                    return res.status(400).send({
                      message: err,
                    });
                  }
                  const token = jwt.sign(
                    {
                      userId: userId,
                      email:req.body.email,
                    },
                    'SECRETKEY',
                  { expiresIn: '1h' }
                  );

                  return res.status(201).send({
                    message: 'Registered!',
                    token:token,
                  });
                }
              );
            }
          });
        }
      }
    );

  });


  
  router.post('/login', async (req, res, next) => {
    db.query(
      `SELECT * FROM users WHERE email = ?;`,
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
              db.query(`UPDATE users SET last_login = now() WHERE id = ?;`, [
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


router.get('/secret-route',userMiddleware.redirectToSignUp, userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

router.get('/seller-secret-route', userMiddleware.redirectToSignUp, userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

// Protect the /dashboard route using the same middleware
router.get('/dashboard', userMiddleware.redirectToSignUp, userMiddleware.isLoggedIn, (req, res, next) => {
  // Your dashboard route logic here
  res.send('This is the dashboard. Only logged in users can access this.');
});


router.get('/logout', userMiddleware.isLoggedIn, (req, res) => {
  res.send('Logged out successfully');
});



module.exports = router;