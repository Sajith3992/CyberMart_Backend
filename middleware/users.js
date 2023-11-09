const jwt = require("jsonwebtoken");
const blacklistedTokens = new Set();

module.exports = {
  validateRegister: (req, res, next) => {
    // username min length 3
    if (!req.body.clientName || req.body.clientName.length <= 3) {
      return res.status(400).send({
        message: 'Please enter a username with min. 3 chars',
      });
    }
    // password min 5 chars
    if (!req.body.password || req.body.password.length < 5) {
      return res.status(400).send({
        message: 'Please enter a password with min. 5 chars',
      });
    }

    next();
    
  },

  isLoggedIn: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(400).send({
        message: 'Your session is not valid!',
      });
    }

    // try {
    //   const authHeader = req.headers.authorization;
    //   const token = authHeader.split(' ')[1];
    //   const decoded = jwt.verify(token, 'SECRETKEY');
    //   req.userData = decoded;
    //   next();
    // } catch (err) {
    //   return res.status(400).send({
    //     message: 'Your session is not valid!',
    //   });
    // }

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
  
    // Check if the token is blacklisted
    if (blacklistedTokens.has(token)) {
      return res.status(401).send({
        message: 'Token is blacklisted. Please log in again.',
      });
    }
    try {
      const decoded = jwt.verify(token, 'SECRETKEY');
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(400).send({
        message: 'Your session is not valid!',
      });
    }
  }
,
  redirectToSignUp: (req, res, next) => {
    // If the user is not authenticated, redirect to the signup page
    if (!req.headers.authorization) {
      return res.redirect('/signup'); // Change '/signup' to your desired signup page URL
    }
    next();
  }

};