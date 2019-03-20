'use strict';

import mongoose, { Schema } from 'mongoose';

export const STATUS_ACTIF = 'actif';
export const STATUS_INACTIF = 'inactif';
export const CUSTOMER_ROLE = 'consumer';
export const COURSIER_ROLE = 'rider';

const userSchema = new Schema({
  services: {
    facebook: String
  },
  role: {
    type: String,
    enum: [CUSTOMER_ROLE, COURSIER_ROLE],
    default: CUSTOMER_ROLE
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [34.02590720000001,-6.836439899999959]
    }
  },
  status: {
    type: String,
    enum: [STATUS_ACTIF, STATUS_INACTIF],
    default: STATUS_ACTIF
  },
  fullname: String,
  phone: String,
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
  skheras: [{ type: Schema.Types.ObjectId, ref: 'Skhera' }]
}, {
    timestamps: true
  })

userSchema.methods = {
  view(role) {

    let view = {};
    let fields = ['id', 'role'];

    switch (role) {
      case CUSTOMER_ROLE:
        fields = [...fields, 'profile'];
        break;

      case COURSIER_ROLE:
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
  createFromService({ service, id, email, name, image, role }) {
    return this.findOne({ $or: [{ [`services.${service}`]: id }] }).then((user) => {
      
      if (user) {
        
        return user.save();
      } else {
        let fullname = name;
        return this.create({ services: { [service]: id }, role, email, fullname, image})
      }
    })
  },
  async updateLocation(long, latt, id){
    return this.findById(id).then((user) => {
      if (user) {
        user.location.coordinates = [long, latt];
        return user.save()
      }
      return null; 
    })
  },
  async getCoursierByLocation(long, latt){
    try {
        const robios = await this.aggregate().near(
        { 
            near:[parseFloat(long), parseFloat(latt)], 
            distanceField: "dist.calculated", 
            includeLocs: "dist.location",
            spherical:true,
            query: {role: COURSIER_ROLE, status: STATUS_ACTIF},
            num: 10
        })

        return robios;
    } catch (error) {
      return error
    }   
  }
}

userSchema.index({ location: "2dsphere" });

const User = mongoose.model('User', userSchema);

export const schema = User.schema;
export default User
