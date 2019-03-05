'use strict';

import mongoose, { Schema } from 'mongoose';

const roles = ['customer', 'coursier'];
const status = ['actif', 'inactif'];

const userSchema = new Schema({
  services: {
    facebook: String
  },
  role: {
    type: String,
    enum: roles,
    default: 'customer'
  },
  status: {
    type: String,
    enum: status,
    default: 'actif'
  },
  profile: {
    firstname: String,
    lastname: String,
    image: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      trim: true,
      lowercase: true
    },
    birthday: Date
  }
}, {
    timestamps: true
  })

userSchema.methods = {
  view(role) {

    let view = {};
    let fields = ['id', 'role'];

    switch (role) {
      case 'customer':
        fields = [...fields, 'profile'];
        break;

      case 'coursier':
        fields = [...fields, 'profile', 'status'];
        break;
      
      case 'admin':
        fields = [...fields, 'profile', 'status', 'createdAt'];
        break;
    }

    fields.forEach((field) => { view[field] = this[field] });

    return view;
  }
}

userSchema.statics = {
  status,
  roles,
  createFromService({ service, id, email, name, image }) {
    return this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] }).then((user) => {
      if (user) {
        
        return user.save()
      } else {
        const profile = {};
        profile.email = email;
        profile.image = image;
        name = name.split(' ');
        profile.firstname = name[0] ? name[0] : '';
        profile.lastname = name[1] ? name[1] : '';

        return this.create({ services: { [service]: id }, profile})
      }
    })
  }
}

const User = mongoose.model('User', userSchema);

export const schema = User.schema;
export default User
