'use strict'

import sign from '../services/authentification/jwt';
import User from '../models/user';

class AuthentificationController {

    async login ({user, body: { role } }, response, next) {
        try {
            
            user.role = role;
            user = await User.createFromService(user);
            const token = await sign({id: user.id, email: user.email});
            return response.status(201).json({ token, user: user.view()});
        } catch (error) {
            next(error)
        }
    }
}
export default AuthentificationController;