const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Add a Name"],
    },
    email: {
      type: String,
      required: [true, "Please Add An Email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please Add A valid Email",
      ],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
    },

    password: {
      type: String,
      required: [true, "Please add a Password"],
      minlength: 6,
      select: false,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse Populate
UserSchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

// Hashing Passwords
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and Return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Matching Password
UserSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken()=async function(){

  // Generate Token
  const resetToken=crypto.randomBytes(20).toString('hex')

  // Hash Token and set to resetPasswordToken field
  this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')

  // Set Expiry
  this.resetPasswordExpire=Date.now()+10*60*1000;

  return resetToken
}
module.exports = mongoose.model("User", UserSchema);
