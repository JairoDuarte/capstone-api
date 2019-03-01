'use strict';

import mongoose, { Schema } from 'mongoose';
import mongooseKeywords from 'mongoose-keywords';

const roles = ['custumer', 'coursier'];
const status = ['actif', 'inactif'];

const userSchema = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
    trim: true,
    lowercase: true
  },
  services: {
    facebook: String
  },
  role: {
    type: String,
    enum: roles,
    default: 'custumer'
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
    birthday: Date
  }
}, {
    timestamps: true
  })

userSchema.methods = {
  view(role) {

    let view = {};
    let fields = ['id', 'email', 'role'];

    switch (role) {
      case 'custumer':
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
  createFromService({ service, id, email, name, image, role }) {
    return this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] }).then((user) => {
      if (user) {
        user.services[service] = id;
        if (role) user.role = role;
            
        //user.role = role;
        return user.save()
      } else {
        const profile = { image: image };
        name = name.split(' ');
        profile.firstname = name[0] ? name[0] : '';
        profile.lastname = name[1] ? name[1] : '';

        return this.create({ services: { [service]: id }, email, profile, role })
      }
    })
  }
}

userSchema.plugin(mongooseKeywords, { paths: ['email'] });

const User = mongoose.model('User', userSchema);

export const schema = User.schema;
export default User
