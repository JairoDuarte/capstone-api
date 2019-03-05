'use strict'

import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET;

const sign = (user, options, method = jwt.sign) =>{
  user.expireToken = Date.now() + parseInt(process.env.JWT_EXPIRATION_MS);
  return method(user, jwtSecret, options)};

  export default sign;