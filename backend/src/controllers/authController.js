const user = require("../services/userService");
const auth = require("../services/authService");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const fs = require("fs");

exports.processLogin = async (req, res, next) => {
  let secretKey = env.secretKey;
  let response = req.headers["recaptcha"];

  let url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${response}`;
  console.log(url);
  const captcha = await fetch(url).then((res) => res.json());

  let email = req.body.email;
  let password = req.body.password;

  try {
    let result = await auth.authenticate(email);
    console.log("Insert result variable inside auth.authenticate code");
    console.log(result);
    if (result) {
      fs.appendFileSync(
        "reCaptchaLog.txt",
        "====================================" + "\r\n"
      );
      fs.appendFileSync("reCaptchaLog.txt", JSON.stringify(captcha) + "\r\n");
      fs.appendFileSync("reCaptchaLog.txt", JSON.stringify(result[0]) + "\r\n");
      if (
        bcrypt.compareSync(password, result[0].user_password) == true &&
        captcha.success
      ) {
        var jsonResult = {
          user_id: result[0].user_id,
          role_name: result[0].role_name,
          token: jwt.sign(
            { id: result[0].user_id, role: result[0].role_name },
            config.JWTKey,
            {
              expiresIn: 86400, //Expires in 24 hrs
            }
          ),
        }; //End of data variable setup
        return res.status(200).json(jsonResult);
      } else {
        return res.status(500).json({ message: "Login has failed" });
      } //End of passowrd comparison with the retrieved decoded password.
    }
  } catch (err) {
    let message = "Credentials are not valid.";
    res.status(500).json({
      message: message,
    });
  }
};

exports.processRegister = async (req, res, next) => {
  let fullName = req.body.fullName;
  let email = req.body.email;
  let password = req.body.password;

  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      let result = await user.createUser(fullName, email, hash);
      if (result) {
        console.log(result);
        return res.status(200).json({ message: "Completed registration." });
      } else {
        console.log(
          "processRegister method : callback error block section is running."
        );
        console.log(
          error,
          "=================================================================="
        );
        let message = "Unable to complete registration";
        return res.status(500).json({ message: message });
      }
    });
  } catch (err) {
    let message = "Unable to complete registration";
    res.status(500).json({ message: message });
  }
}; // End of processRegister
