/* eslint-disable prettier/prettier */
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const User = require('../models/UserModel');
const CrudUser = require('../models/CrudUser');



//endpoint to create a new user in the backend
router.post("/User/createUser", async (req, res) => {
    try {
      const { name, email, phone,password, gender, heardFrom, city, state } = req.body;

      const newUserData = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        gender: gender,
        heardFrom: heardFrom,
        city: city,
        state: state,
      };

      const newUser = new User(newUserData);
      console.log("User data to db",newUser);
      await newUser.save();
      res.status(200).json({ message: "User stored successfully"});
    } catch (error) {
      res.status(500).json({ message: "User storing failed" });
    }
  });

  router.post("/Crud/addUser/:userid", async (req, res) => {
    try {
      const {name, emailA, phoneN,addedtimestamp, edittimestamp  } = req.body;
      const userid = req.params.userid;
      const newUserData = {
        useremailLog:userid,//email of logged user.
        name: name,
        email: emailA,
        phone: phoneN,
        addedtimestamp: addedtimestamp,
        edittimestamp: edittimestamp,
      };

      const newUser = new CrudUser(newUserData);
      console.log("User data to db",newUser);
      await newUser.save();
      res.status(200).json({ message: "User stored successfully"});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "User storing failed" });
    }
  });


  router.post("/Crud/editUser/:userid", async (req, res) => {
    try {
      const {name, emailA, phoneN, edittimestamp, prevemail  } = req.body;
      const userid = req.params.userid;
      const newUserData = {
        useremailLog:userid,
        name: name,
        email: emailA,
        phone: phoneN,
        edittimestamp: edittimestamp,
      };
      if (prevemail) {
        const user = await CrudUser.findOne({ email: prevemail , useremailLog: userid});

        if (user) {
            const updatedUser = await CrudUser.findByIdAndUpdate(
                user._id,
                newUserData,
                { new: true }
            );

           return  res.status(200).json({ message: "User edited successfully", user: updatedUser });
        } else {
            return res.status(404).json({ message: "User not found with the specified email" });
        }
    } else {
        return res.status(400).json({ message: "Missing prevemail in the request body" });
    }

    } catch (error) {
      res.status(500).json({ message: "User editing failed" });
    }
  });

  router.post("/Crud/deleteUser/:userid", async (req, res) => {
    try {
      const {emailA  } = req.body;
      await CrudUser.findOneAndDelete({ email: emailA, useremailLog: req.params.userid });

      res.status(200).json({ message: "User deleted successfully"});
    } catch (error) {
      res.status(500).json({ message: "User deleting failed" });
    }
  });

  router.get("/Crud/get-all-users/:userid", async (req, res) => {
    try {

        const fieldsToRetrieve = 'name email phone addedtimestamp edittimestamp';
        console.log(req.params.userid);

        const users = await CrudUser.find({useremailLog : req.params.userid  });
        console.log(users);

        if (users.length === 0) {
            return res.status(404).json({ message: "No crud users found" });
        }
        else {
            const modifiedUsers = users.map(user => ({
              name: user.name,
              emailA: user.email,
              phoneN: user.phone,
              addedtimestamp: user.addedtimestamp,
              edittimestamp: user.edittimestamp,
            }));

            res.status(200).json(modifiedUsers);
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get users" });
    }
});


  router.get("/User/checkLogin/:email", async (req, res) => {
    try {
        const email = req.params.email; 
        const password = req.query.password;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        if (password === user.password) {
            return res.status(200).json({ message: "Login successful" });
        } else {
            return res.status(401).json({ message: "Incorrect password" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to check login" });
    }
});



  module.exports = router;
