const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Porfavor dinos tu nombre"]
  },

  email: {
    type: String,
    required: [true, "Debes proveer un Email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "El email no tiene un formato valido"]
  },
  photo: {
    type: String
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  password: {
    type: String,
    required: [true, "Porfavor ingresa un password"],
    validate: [validator.isStrongPassword, 'Debe contener almenos una mayuscula y un simbolo'],
    select: false // Esconde el campo de los resultados de las consultas
  },

  passwordConfirm: {
    type: String,
    required: [true, "porfavor ingresa confirmacion de password"],
    validate: [
      {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Confirmacion de Password no coincide'
      }
    ]
  }
})

/*****************pre-save middleware*************************/

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  //Hash the password with cost 12 
  this.password = await bcrypt.hash(this.password, 12);

  //Delete the passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});


/*************************************Metodos*********************** */

userSchema.methods.correctPassword = async function (currentPassword, userPassword) {
  return await bcrypt.compare(currentPassword, userPassword);
}


const User = mongoose.model('User', userSchema);

module.exports = User;