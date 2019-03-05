'use strict'

import passport from 'passport';
import { Strategy as FBStrategy } from 'passport-facebook';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import facebookService from './facebook';

import User from '../../models/user';

export const facebook = () => passport.authenticate('facebook', { session: false });
export const facebookCollback = () => passport.authenticate('facebook', { session: false});

export const login = () => passport.authenticate('token', { session: false });

export const authorize = ({ required, roles = User.roles } = {}) => (req, res, next) =>
    passport.authenticate('token', { session: false }, (err, user) => {
       
        if (!user || err || (required && !user) || (required && !~roles.indexOf(user.role))) {
            return res.status(401).end();
        }
        req.logIn(user, { session: false }, (err) => {
            if (err) return res.status(401).end();
            next();
        });
    })(req, res, next);
        
/*eslint-disable*/
passport.use('token', new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: false,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        ExtractJwt.fromAuthHeaderAsBearerToken()
    ])
}, ({ id, expireToken }, done) => {
    if (Date.now() > expireToken) {
        return done(new Error('Token Expired'), false);
    }
    User.findById(id).then((user) => {
        done(null, user.view());
        return null;
    }).catch(done);
}));

passport.use('facebook', new FBStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/auth/signin'
  },
  async function(accessToken, refreshToken, {}, done) {
    const user  = await facebookService(accessToken);
   
    return done(null, user);
}));