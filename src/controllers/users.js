'use strict';

class UsersController {

    constructor(User) {
      this.User = User;
    }
  
    get(req, res) {
      return this.User.find({})
        .then(users => res.status(200).send(users))
        .catch(err => res.status(400).send(err.message));
    }

    showMe ({ user }, res){
        return res.status(200).json(user);
    }
  
    getById(req, res) {
  
      return this.User.findById(req.params.id)
        .then(user => res.status(200).send(user.view()))
        .catch(err => res.status(400).send(err.message));
    }
  
    create(req, res) {
      const user = new this.User(req.body);
  
      return user.save()
        .then(() => res.status(201).send(user.view()))
        .catch(err => res.status(422).send(err.message));
    }
  
    update(req, res) {
      const body = req.body;
      return this.User.findById(req.params.id)
        .then(user => {
          user.name = body.name
          user.email = body.email
          user.role = body.role
          if(body.password) {
            user.password = body.password
          }
          return user.save();
        })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(422).send(err.message));
    }
  
    remove(req, res) {
      return this.User.deleteOne({ _id: req.params.id})
        .then(() => res.sendStatus(200))
        .catch(err => res.status(400).send(err.message));
    }
  }
  
  export default UsersController;
  