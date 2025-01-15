const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      data: user
    }
  })

}

exports.signUp = async (req, res) => {

 try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    })

    createToken(newUser, 200, res);
  } catch (error) {

    res.status(404).json({
      status: "error",
    })
  }
}


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.res.status(401).json({
        status: "Se debe proveer email y passsword",
      })
    }
  
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "Error en el usuario passsword",
      })
    }



    createToken(user, 200, res);
  } catch (error) {
    res.status(404).json({
      status: "error",
    })
  }


}