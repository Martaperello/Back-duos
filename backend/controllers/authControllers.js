const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const { promisify } = require('util');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = { expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), 
  httpOnly: true,
  sameSite: 'none',
  secure: true}

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

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and checking if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // 2) Validate the token (Verification)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log('decoded', decoded);

    // 3) Check if the user exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4) Check if the user changed password after the token was issued
    if (freshUser.changedPasswordAfter && freshUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password! Please log in again.',
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser; // Attach user to request object
    next();
  } catch (error) {
    console.error('Error in protect middleware:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid or expired token. Please log in again.',
      });
    }
    // General server error
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // Cookie expires in 10 seconds
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.status(200).json({ status: 'success' });
};
