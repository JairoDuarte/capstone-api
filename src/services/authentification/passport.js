'use strict'

import passport from 'passport'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import * as facebookService from './facebook'
import User from '../../models/user';

export const facebook = () => passport.authenticate('facebook', { session: false });

export const login = () => passport.authenticate('token', { session: false });

export const authorize = ({ required, roles = User.roles } = {}) => (req, res, next) =>
    passport.authenticate('token', { session: false }, (err, user, info) => {
        if (err) {
            console.log(true);
        }
        if (!user || err || (required && !user) || (required && !~roles.indexOf(user.role))) {
            return res.status(401).end()
        }
        req.logIn(user, { session: false }, (err) => {
            if (err) return res.status(401).end()
            next()
        })
    })(req, res, next)


passport.use('facebook', new BearerStrategy(async (token, done) => {

    try {
        let user = await facebookService.getUser(token);
        user = await User.createFromService(user);
        done(null, user);
        return null;
    } catch (error) {
        console.log(error.statusCode);
        console.log(error.message);
        done();
    }
}))

passport.use('token', new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        ExtractJwt.fromAuthHeaderAsBearerToken()
    ])
}, ({ id }, done) => {
    User.findById(id).then((user) => {
        done(null, user.view())
        return null
    }).catch(done)
}))
