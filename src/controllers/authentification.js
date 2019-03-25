'use strict'

import sign from '../services/authentification/jwt';
import User from '../models/user';

const login = async ({session, app, user }, response, next) => {
    try {
        const io = app.get('io')
        user.role = session.role;
        user = await User.createFromService(user);
        const token = await sign({id: user.id, email: user.email});
        io.in(session.socketId).emit('facebook', {user: user.view(user.role), token: token})
        return response.status(200).end();
    } catch (error) {
        next(error)
    }
}
export default login;