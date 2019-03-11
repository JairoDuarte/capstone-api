'use strict';

class SkherasController {

  constructor(Skhera) {
    this.Skhera = Skhera;
  }

  getById(req, res) {

    return this.Skhera.findById(req.params.id)
      .then(skhera => res.status(200).send(skhera))
      .catch(err => res.status(400).send(err.message));
  }

  create(req, res) {
    let skhera = new this.Skhera(req.body);
    skhera.to = {};
    skhera.from = {};
    skhera.price = {};
    skhera.to.text = req.body.to;
    skhera.from.text = req.body.from;
    let price = req.body.price.split('dh').join('')
    price = price.split('-');
    skhera.price.to = price[1];
    skhera.price.from = price[0];
    skhera.author = req.user.id;

    return skhera.save()
      .then(() => res.status(201).send(skhera.view()))
      .catch(err => {console.log(err); res.status(422).send(err.message)});
  }

  remove(req, res) {
    return this.Skhera.deleteOne({ _id: req.params.id })
      .then(() => res.sendStatus(200))
      .catch(err => res.status(400).send(err.message));
  }
}

export default SkherasController;
