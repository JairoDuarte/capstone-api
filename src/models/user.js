'use strict';

import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import mongooseKeywords from 'mongoose-keywords';

const roles = ['custumer', 'robio'];

const userSchema = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    index: true,
    trim: true
  },
  services: {
    facebook: String
  },
  role: {
    type: String,
    enum: roles,
    default: 'custumer'
  },
  image: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

userSchema.path('email').set(function (email) {

  if (!this.name) {
    this.name = email.replace(/^(.+)@.+$/, '$1');
  }

  return email;
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 10;

  bcrypt.hash(this.password, saltRounds).then((hash) => {
    this.password = hash;
    next()
  }).catch(next)
})

userSchema.methods = {
  view (full) {
    let view = {};
    let fields = ['id', 'name', 'image', 'email', 'role'];

    if (full) {
      fields = [...fields, 'createdAt'];
    }

    fields.forEach((field) => { view[field] = this[field] });

    return view;
  },

  authenticate (password) {
    return bcrypt.compare(password, this.password).then((valid) => valid ? this : false);
  }
}

userSchema.statics = {
  roles,
  createFromService ({ service, id, email, name, image, role}) {
    return this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] }).then((user) => {
      if (user) {
        user.services[service] = id;
        user.name = name;
        user.image = image;
        user.role = role;
        return user.save()
      } else {
        const password = email
        return this.create({ services: { [service]: id }, email, password, name, image, role })
      }
    })
  }
}

userSchema.plugin(mongooseKeywords, { paths: ['email', 'name'] });

const User = mongoose.model('User', userSchema);

export const schema = User.schema;
export default User
