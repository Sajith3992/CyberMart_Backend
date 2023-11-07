const jwt = require('jsonwebtoken');

module.exports = {
  validateRegister: (req, res, next) => {
    if (!req.body.clientName || req.body.clientName.length < 3) {
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
      try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'SECRETKEY');
        req.userData = decoded;
        next();
      } catch (err) {
        return res.status(400).send({
          message: 'Your session is not valid!',
        });
      }
  }
};
