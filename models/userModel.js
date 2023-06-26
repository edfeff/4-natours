const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  name: {type: String, required: [true, "必须有name"]},
  email: {
    type: String, required: [true, "必须有email"], unique: true, lowercase: true,
    validate: [validator.isEmail, '邮件格式错误']
  },
  photo: {type: String},
  password: {
    type: String,
    required: [true, '必须有密码'],
    minlength: 1,
    maxlength: 10
  },
  passwordConfirm: {
    type: String,
    required: [true, '密码必须确认'],
    validate: {
      validator: function (val) {
        return this.password === val;
      }
    }
  }
})

userSchema.pre("save", async function (next) {
  // console.log("user", this)
  if (!this.isModified('password')) {
    return next();
  }
  //加密密码
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User