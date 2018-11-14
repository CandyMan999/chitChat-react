const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  hasAccepted: {
    type: Boolean,
    default: false
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  signUpDate: {
    type: Date,
    default: Date.now()
  },
  intro: {
    type: String,
    default: ""
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    default: null
  },
  sex: {
    type: String,
    enum: ["male", "female"]
  },
  pics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Picture"
    }
  ],
  occupation: {
    type: String,
    default: ""
  },
  drink: {
    type: String,
    enum: ["yes", "socially", "never"]
  },
  smoke: {
    type: String,
    enum: ["yes", "socially", "never"]
  },
  marijuana: {
    type: String,
    enum: ["friendly", "unfriendly"]
  },
  kids: {
    type: Boolean,
    default: false
  },
  location: {
    lat: {
      type: Number,
      default: null
    },
    lng: {
      type: Number,
      default: null
    }
  },
  blockedUsers: [
    {
      type: String,
      default: null
    }
  ]
});

UserSchema.pre("save", function(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
