'use strict';

import mongoose, { Schema } from 'mongoose';
import mongooseKeywords from 'mongoose-keywords'

const status = ['picked', 'delivered'];

const skheraSchema = new Schema({
    description: {
        type: String,
    },
    deliver: {
        type: String
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    rider: { type: Schema.Types.ObjectId, ref: 'User' },
    price: {
        from: Number,
        to: Number
    },
    schedule: {
        type: Date
    },
    items: [String],
    from: {
        lat: String,
        long: String,
        text: String
    },
    to: {
        lat: String,
        long: String,
        text: String
    },
    status: {
        type: String,
        enum: status,
        default: 'picked'
    }
}, {
        timestamps: true
})


skheraSchema.methods = {
    view(role) {
  
      let view = {};
      let fields = ['id', 'status', 'items','schedule', 'price', 'deliver', 'description', 'to', 'from', 'author', 'rider'];
  
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
skheraSchema.plugin(mongooseKeywords, { paths: ['author', 'rider'] })


const Skhera = mongoose.model('Skhera', skheraSchema);

export const schema = Skhera.schema;
export default Skhera
