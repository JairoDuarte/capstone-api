import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

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
  username: {
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
    default: 'user'
  },
  image: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

userSchema.path('email').set(function (email) {

  if (!this.username) {
    this.username = email.replace(/^(.+)@.+$/, '$1');
  }

  return email;
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  const saltRounds = 10;

  bcrypt.hash(this.password).then((hash) => {
    this.password = hash
    next()
  }).catch(next)
})

userSchema.methods = {
  view (full) {
    let view = {};
    let fields = ['id', 'username', 'image'];

    if (full) {
      fields = [...fields, 'email', 'createdAt'];
    }

    fields.forEach((field) => { view[field] = this[field] });

    return view;
  },

  authenticate (password) {
    return bcrypt.compare(password, this.password).then((valid) => valid ? this : false);
  }
}

userSchema.statics = {

  createFromService ({ service, id, email, username, image, roles }) {
    return this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] }).then((user) => {
      if (user) {
        user.services[service] = id;
        user.username = username;
        user.image = image;
        user.roles = roles;
        return user.save()
      } else {
        const password = email
        return this.create({ services: { [service]: id }, email, password, username, picture, roles })
      }
    })
  }
}

userSchema.plugin(mongooseKeywords, { paths: ['email', 'username'] })

const User = mongoose.model('User', userSchema)

export const schema = User.schema
export default User
