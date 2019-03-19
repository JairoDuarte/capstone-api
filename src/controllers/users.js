'use strict';
import Skhera from '../models/skhera';
import {getOptimezedRoutes} from "../services/optimizedRoute";

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

  async getRoutes({user}, res){
    try{
      const user_ = await this.User.findById(user.id);
      console.log(user_);
      const skhera = await Skhera.find({rider: "5c8b88353600cf2ee9e74099"});
      console.log(skhera.length);
      let routes = skhera.map(item => {
        return {lat: item.from.coordinates[1], lng: item.from.coordinates[0], id: item.from.text};
      })
      skhera.map(item => {
        routes.push({lat: item.to.coordinates[0], lng: item.from.coordinates[1], id: item.to.text});
      })
      console.log(routes);

      const optimezedRoutes = await getOptimezedRoutes(routes, user_.location.coordinates); //getOptimezedRoutes(routes);
      return res.status(200).send(optimezedRoutes);
    }catch(error ){
      console.log(error);
      return res.status(500).send(error);
      
    }
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
        let {profile: {fullname, phone, email}} = body;
        
        user.profile.fullname = fullname ? fullname : user.profile.fullname;
        user.profile.phone = phone ? phone : user.profile.phone;
        user.profile.email = email ? email : user.profile.email;

        return user.save()
      })
      .then(() => res.sendStatus(200))
      .catch(err => {console.log(err); res.status(422).send(err.message)});
  }

  remove(req, res) {
    return this.User.deleteOne({ _id: req.params.id })
      .then(() => res.sendStatus(200))
      .catch(err => res.status(400).send(err.message));
  }
}

export default UsersController;
