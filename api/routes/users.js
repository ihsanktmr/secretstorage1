const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/checkemail", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          IsEmail: true
        });
      }else{
        return res.status(200).json({
          IsEmail: false
        });
      }
    });
});

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: req.body.password,
              photos: []
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
    });
});

router.post("/login", (req, res, next) => {
  var obj;
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      obj = user;
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
       if (req.body.password===user[0].password) { //if auth succesfull
          return res.status(200).json({
            _id: obj[0]._id
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.post("/storage", (req, res, next) => {
  User.findOne({_id: req.body._id}).exec().then(result => 
    res.status(200).json({
    photos: result.photos
  })) 
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: "Did not found"
    });
  });
});

router.post("/add/:userId", (req, res, next) => {
  var newPhotos = [];
  const id = req.params.userId;
  User.findById(id)
  .exec()
  .then(doc => {
    console.log("From database", doc);
    if (doc) {
      newPhotos =doc.photos 
      newPhotos.push(req.body.photo)
      User.update({_id: id, photos: newPhotos })//fixed with id
      doc.save() //and saved after
      .then(
        res.status(200).json({
          photos: newPhotos
        })
      )
     
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    } else {
      res
        .status(404)
        .json({ message: "No valid entry found for provided ID" });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post("/delete/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
  .exec()
  .then(doc => {
    var newPhotos = [];
    console.log("From database", doc);
    if (doc) {
      newPhotos = doc.photos
      let index = newPhotos.indexOf(req.body.photo);
                if (index > -1) {
                  newPhotos.splice(index, 1);
                }
       User.update({_id: id, photos: newPhotos })
       doc.save()
      .then(
          res.status(200).json({
          photos: newPhotos
        }))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    } else {
      res
        .status(404)
        .json({ message: "No valid entry found for provided ID" });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});


router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});



module.exports = router;