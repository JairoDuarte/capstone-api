'use strict'

import sign from '../services/authentification/jwt';
import User from '../models/user';

class AuthentificationController {

    async login ({session, app, user }, response, next) {
        try {
            const io = app.get('io')
            user.role = session.role;
            user = await User.createFromService(user);
            const token = await sign({id: user.id, email: user.email});
            console.log(session.socketId, session.role);
            io.in(session.socketId).emit('facebook', {user: user.view(user.role), token: token})
            response.end()
            //return response.redirect('http://localhost:3000/signin')  //response.status(201).json({ token, user: user.view()});
        } catch (error) {
            next(error)
        }
    }
}
export default AuthentificationController;