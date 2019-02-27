'use strict'

import passport from 'passport'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import * as facebookService from './facebook'
const FacebookStrategy = require('passport-facebook').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
import User from '../../models/user';

export const facebook = () => passport.authenticate('facebook', { session: false });
export const login = () => passport.authenticate('token', {session: false});
export const authorize = ({ required, roles = User.roles } = {}) => (req, res, next) =>
  passport.authenticate('token', { session: false }, (err, user, info) => {
    console.log('here');
    if (err || (required && !user) || (required && !~roles.indexOf(user.role))) {
      return res.status(401).end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end()
      next()
    })
  })(req, res, next)


passport.use('facebook', new BearerStrategy((token, done) => {
  facebookService.getUser(token).then((user) => {
    return User.createFromService(user)
  }).then((user) => {
    done(null, user)
    return null
  }).catch(done)
}))

passport.use('login', new BearerStrategy((done) => {
    console.log('login');
    done(null, { user: { id:1, email:'' }})
}))

passport.use( new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
},
(accessToken, refreshToken, profile, done) => {
    const { id, name, email, photos } = profile;
    console.log(profile);
    const fullname =  `${name['middleName']} ${name['givenName']} ${name['familyName']}`;
    User.createFromService({service: 'facebook', id, email, name: fullname, image: photos.value})
        .then(user => {done(null, user);
        return null;})
        .catch(done)
}));

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

passport.use('token', new JwtStrategy({
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromBodyField('access_token'),
    ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    ExtractJwt.fromAuthHeaderAsBearerToken()
  ])
}, ({id}, done) => {
    User.findById(id).then((user) => {
        done(null, user.view())
        return null
      }).catch(done)
}))
