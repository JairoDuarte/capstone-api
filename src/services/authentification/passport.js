'use strict'

import FacebookTokenStrategy from 'passport-facebook-token';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import facebookService from './facebook';

import User, {COURSIER_ROLE, CUSTOMER_ROLE} from '../../models/user';

export const facebook = () => passport.authenticate('facebook', { session: false });
export const facebookCollback = () => passport.authenticate('facebook', { session: false});

export const login = () => passport.authenticate('token', { session: false });

export const authorize = ({ required, roles = [COURSIER_ROLE, CUSTOMER_ROLE] } = {}) => (req, res, next) =>
    passport.authenticate('token', { session: false }, (err, user) => {
       
        if (!user || err || (required && !user) || (required && !~roles.indexOf(user.role))) {
            return res.status(401).end();
        }
        req.logIn(user, { session: false }, (err) => {
            if (err) return res.status(401).end();
            next();
        });
    })(req, res, next);

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))  
      
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

passport.use('facebook', new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
},
async function (accessToken, refreshToken, profile, done) {
    
    console.log(profile);
    const user  = await facebookService(accessToken);
    //TODO: Utiliser profile pour récupérer les données au lieu de facebookservice
    
    return done(null, user);
}));