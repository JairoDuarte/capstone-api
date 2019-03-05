'use strict'

import User from '../../../src/models/user';

describe('Routes: Users', () => {
    const defaultId = '56cb91bdc3464f14678934ca';
    const defaultcustomer = {
        profile: {
            email: 'doe@gmail.com',
            firstname: 'Jhon',
            lastname: 'Doe',
            birthday: Date(),
            image: ''
        },
        role: 'customer',
        status: 'actif'

    };
    const expectedcustomer = {
        id: defaultId,
        profile: {
            email: 'doe@gmail.com',
            firstname: 'Jhon',
            lastname: 'Doe',
            birthday: Date(),
            image: ''
        },
        role: 'customer'
    };

    beforeEach(() => {
        const user = new User(defaultcustomer);
        user._id = defaultId;
        return user.save();
        //return User.deleteOne({})
          //  .then(() => user.save());
    });

    afterEach(() => User.deleteMany({_id: defaultId}));

    describe('GET /users', () => {
        test('should return a list of users', async () => {

            const response = await request.get('/api/users');
            expect(response.body[0].role).toBe(expectedcustomer.role);

        });
    });

    describe('GET /users/:id when an id is specified', () => {
        test('should return 200 with one user', async () => {

            const response = await request.get(`/api/users/${defaultId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.role).toEqual(expectedcustomer.role);
        });
    });


    describe('Show Me /users/me required user authentification token', () => {
        test('should return 200 with user information', async () => {
            const response = await request
                .get(`/api/users/me`)
                .set('Authorization', `Bearer ${customer.token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.role).toEqual(customer.user.role);
        });
    });


    describe('Update status of coursier /users/status required user authentification token', () => {
        test('should return 200 with user information', async () => {

            await request.put(`/api/users/${customer.user.id}`).send({role: 'coursier', status: 'actif'});

            const response = await request
                .get(`/api/users/status`)
                .set('Authorization', `Bearer ${customer.token}`);
            await request.put(`/api/users/${customer.user.id}`).send({role: 'customer'});

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual('inactif');
        });
    });

    describe('POST /users', () => {
        test('should return a new user with status code 201', async () => {
            await User.deleteOne({_id: defaultId});
            const customId = '56cb91bdc3464f14678934ba';
            const newUser = Object.assign({}, { _id: customId }, defaultcustomer);
            const expectedSavecustomer = Object.assign({}, expectedcustomer, { id: customId });

            const response = await request.post('/api/users').send(newUser);
            expect(response.statusCode).toBe(201);
            expect(response.body.role).toEqual(expectedSavecustomer.role);
            await User.deleteOne({_id: customId});
        });
    });

    describe('PUT /users/:id', () => {
        test('should update the user and return 200 as status code', async () => {
            const customUser = { firstname: 'Din', lastname: 'Doe' };
            const updatedUser = Object.assign({}, defaultcustomer, customUser);

            const response = await request.put(`/api/users/${defaultId}`).send(updatedUser);

            expect(response.status).toBe(200);
        });
    });

    describe('DELETE /users/:id', () => {
        test('should delete an user and return 200 as status code', async () => {

            const response = await request.delete(`/api/users/${defaultId}`);
            expect(response.status).toBe(200);

        });
    });
});