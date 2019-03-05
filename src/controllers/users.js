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

  showMe({ user }, res) {

    return this.User.findById(user.id)
      .then(user => res.status(200).send(user.view(user.role)))
      .catch(err => res.status(400).send(err.message));

  }

  updateStatus({ user }, res) {

    return this.User.findById(user.id)
      .then(user => {
        user.status = user.status === this.User.status[0] ? this.User.status[1] : this.User.status[0];
        return user.save();
      })
      .then(user => res.status(200).send(user.view(user.role)))
      .catch(err => res.status(422).send(err.message));
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
      .catch(err => {console.log(err); res.status(422).send(err.message)});
  }

  update(req, res) {
    const body = req.body;
    return this.User.findById(req.params.id)
      .then(user => {
        return Object.assign(user, body).save()
      })
      .then(() => res.sendStatus(200))
      .catch(err => res.status(422).send(err.message));
  }

  remove(req, res) {
    return this.User.deleteOne({ _id: req.params.id })
      .then(() => res.sendStatus(200))
      .catch(err => res.status(400).send(err.message));
  }
}

export default UsersController;
