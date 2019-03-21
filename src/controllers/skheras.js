'use strict';
import Skhera from '../models/skhera';

export const getByUser = async ({params: { id }}, res) => {
  try {
    const skheras = await Skhera.find({author: id });
    return res.status(200).send(skheras);
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

export const getById = async (req, res) => {
  try {
    const skheras = await Skhera.findById(req.params.id);
    return res.status(200).send(skheras);
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

export const getEstimatedPrice = async  ({ body: {distance, to, deliver}}, res) => {
  let price;
  distance+= '';
  distance = distance.replace('km');
  distance = parseFloat(distance) > 0 ? parseFloat(distance) : 1;
  switch (deliver) {
    case '2-Hour':
      price = 10;
      break;
    case '4-Hour':
      price = 7.5;
      break;
    default:
      price = 5;
      break;
  }
  if (to > 100) {
    price *= 1.75;
    
  }else if(to > 200 ){
    price *= 2;
  }else if(to > 500){
    price *= 2.5;
  }else if(to > 1000){
    price *= 3;
  }
  else{
    price *= 1.5;
  }
  price *= distance;
  return res.status(200).send({price: `${price}DH`});
}

export const create = async ({body, user}, res) => {
  let skhera = new Skhera(body);
  skhera.to = {};
  skhera.from = {};
  skhera.deliver = {};
  skhera.deliver.type = body.deliver;
  skhera.to.text = body.to.text;
  skhera.from.text = body.from.text;
  skhera.to.coordinates = [body.to.coordinates[1], body.to.coordinates[0]];
  skhera.from.coordinates = [body.from.coordinates[1], body.from.coordinates[0]];
  skhera.author = user.id;
  try {
    await skhera.save();
    return res.status(201).send(skhera.view());
  } catch (error) {
    return res.status(422).send(error.message);
  }
}

export const remove = async (req, res) => {
  try {
    await Skhera.deleteOne({ _id: req.params.id });
    return res.status(200).send();
  } catch (error) {
    return res.status(400).send(error.message)
  }
}