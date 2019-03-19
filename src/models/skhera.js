'use strict';

import mongoose, { Schema } from 'mongoose';
import mongooseKeywords from 'mongoose-keywords'

export const STATUS_PICKED = 'picked';
export const STATUS_DELIVERED = 'delivered';

const skheraSchema = new Schema({
    description: {
        type: String,
    },
    deliver: {
        type: {
            type: String
        },
        duration: Number
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    rider: { type: Schema.Types.ObjectId, ref: 'User' },
    priceitems: {
        from: Number,
        to: Number
    },
    price: {
        type: Number,
        required: true
    },
    schedule: {
        type: String
    },
    items: [String],
    from: {
        text: String,
        coordinates: {
            type: [Number]
        }
    },
    to: {
        coordinates: {
            type: [Number]
        },
        text: String
    },
    status: {
        type: String,
        enum: [STATUS_DELIVERED, STATUS_PICKED],
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
          fields = [...fields];
          break;
  
        case 'coursier':
          fields = [...fields];
          break;
        
        case 'admin':
          fields = [...fields, 'createdAt'];
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
