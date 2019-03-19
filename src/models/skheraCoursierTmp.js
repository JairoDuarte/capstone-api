'use strict';

import mongoose, { Schema } from 'mongoose';

const skheraCoursierTmpSchema = new Schema({
    idskhera: {
        type: String,
    },
    coursierlist: [String],
}, {
        timestamps: true
})

skheraCoursierTmpSchema.statics = {

    async getById(id){
      try {
          const item = await this.findOne({idskhera: id});
          if (item) {
              return item;
          }
          return false;
      } catch (error) {
        return error
      }   
    }
  }

const SkheraCoursierTmp = mongoose.model('SkheraCoursierTmpSchema', skheraCoursierTmpSchema);

export const schema = SkheraCoursierTmp.schema;
export default SkheraCoursierTmp
