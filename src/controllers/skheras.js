'use strict';
import {getCoursier, getAnotherCoursier, sendSkheraRequest} from '../services/skhera';

class SkherasController {

  constructor(Skhera) {
    this.Skhera = Skhera;
  }

  getById(req, res) {

    return this.Skhera.findById(req.params.id)
      .then(skhera => res.status(200).send(skhera))
      .catch(err => res.status(400).send(err.message));
  }

  async create({body, user, app}, res) {
    let skhera = new this.Skhera(body);
    skhera.to = {};
    skhera.from = {};
    skhera.price = {};
    skhera.deliver = {};
    skhera.deliver.type = body.deliver;
    skhera.to.text = body.to.text;
    skhera.from.text = body.from.text;
    skhera.to.coordinates = [body.to.coordinates[1], body.to.coordinates[0]];
    skhera.from.coordinates = [body.from.coordinates[1], body.from.coordinates[0]];
    let price = body.price.split('dh').join('')
    price = price.split('-');
    skhera.priceitems.to = price[1];
    skhera.priceitems.from = price[0];
    skhera.author = user.id;
    skhera.price = 0;
    let coursier = await getCoursier(skhera.from.coordinates, skhera._id);
    skhera.rider = coursier._id;
    sendSkheraRequest(app, skhera, coursier);
    return skhera.save()
      .then(() => {
        res.status(201).send(skhera.view())
      })
      .catch(err => {console.log(err); res.status(422).send(err.message)});
  }
  async accept({body: {status, idSkhera} }, response){
    
    if (!status) {
      try {
        let skhera = await this.Skhera.findById(idSkhera);
        console.log(skhera);
        let coursier = await getAnotherCoursier(skhera.from.coordinates, idSkhera);
        console.log('accept');
        console.log(coursier);
        skhera.rider = coursier._id;
        console.log(skhera);
        skhera.save();
        console.log('send');
        return response.status(200).send();
      
      } catch (error) {
          console.error(error);
          return response.status(500).send(error.message)
      }
    }
    // TODO: Notifier le custumer que le skhra a été accepté et est en cours de livraison

  }

  remove(req, res) {
    return this.Skhera.deleteOne({ _id: req.params.id })
      .then(() => res.sendStatus(200))
      .catch(err => res.status(400).send(err.message));
  }
}

export default SkherasController;
