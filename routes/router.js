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
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                message: err,
              });
            } else {
              db.query(
                'INSERT INTO users (id, clientName, email, password, city, address, phone, invitecode, registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now());',
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


router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});


router.get('/dashboard', userMiddleware.isLoggedIn, (req, res, next) => {
  const userId = req.userData.userId;
  
  // If the user is logged in and has a valid token, show the dashboard
  res.send(`Welcome to the dashboard, user ${userId}!`);
});

// Redirect to login page if the user tries to access /dashboard without a valid token
router.use('/dashboard', (req, res, next) => {
  // Check if the user is not logged in (no valid token)
  if (!req.headers.authorization) {
    // Redirect the user to the login page or send an appropriate response
    return res.redirect('/login'); // Assuming '/login' is the route for the login page
  } else {
    // If the user has a token but is not authorized for this route, you can send a 403 Forbidden error
    return res.status(403).send('You are not authorized to access this page.');
  }
});



router.get('/logout', userMiddleware.isLoggedIn, (req, res) => {
  res.send('Logged out successfully');
});



module.exports = router;