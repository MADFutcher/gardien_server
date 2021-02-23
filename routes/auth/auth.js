const express    = require('express');
const authRoutes = express.Router();
const passport   = require('passport');
const bcrypt     = require('bcryptjs');
// const authController = require('../controller/authController') 
const User       = require('../../models/user-model');


authRoutes.post('/signup', (req,res,next)=>{
  console.log(req.body)
  const {username, password, email} = req.body

  if(!username || !password || !email){
    res.status(400).json({message: "please provide username, password and Email"});
    return
  }

  if(password.length < 8){
      res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
      return;
  }

  User.findOne({ username }, (err, foundUser) => {
 
    if(err){
        res.status(500).json({message: "Username check went bad."});
        return;
    }

    if (foundUser) {
        res.status(400).json({ message: 'Username taken. Choose another one.' });
        return;
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
        username,
        password: hashPass,
        email
    });

    aNewUser.save(err => {
        if (err) {
            res.status(500).json({ message: err });
            return;
        }
        
        req.login(aNewUser, (err) => {

            if (err) {
                res.status(500).json({ message: 'Login after signup went bad.' });
                return;
            }
            aNewUser.password = undefined
            res.status(200).json(aNewUser);
        });
    });
  })
})

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
      if (err) {
          res.status(500).json({ message: 'Something went wrong authenticating user' });
          return;
      }
  
      if (!theUser) {
          res.status(401).json(failureDetails);
          return;
      }

      // save user in session
      req.login(theUser, (err) => {
          if (err) {
              res.status(500).json({ message: 'Session save went bad.' });
              return;
          } 

          theUser.password = undefined
          return res.status(200).json(theUser)
          // authController.createSendToken(theUser, req, res)
      });
  })(req, res, next);
});

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});


authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
      req.user.password=undefined
      res.status(200).json(req.user);
      return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});


module.exports = authRoutes;