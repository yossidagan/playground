const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")

const User = require("../models/User");

router.get("/sanity", (req, res) => {
  res.send("OK!");
});

router.get('/getUsers', (req, res) => {
    User.find().
    then(users => res.send(users))

})
router.post("/saveUser", (req, res) => {

  const { email, password} = req.body 
  
  if (!email || !password) {
    return res.status(400).json({ msg : "Please enter all fields"})
  }
  
    User.findOne({ email }).
    then(user => {
      if (user) return res.status(400).json({ msg : "User aready exists"})
  
      const newUser = new User ({
        email, 
        password
      })

      // Create salt & hash 

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser.save().
          then(user => {
            res.json({
              user : {
                id : user.id,
                email : user.email,
                password : user.password
              }
            })
          })
        })
      })
    })
  
  });



module.exports = router;