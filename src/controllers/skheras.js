'use strict';
import Skhera, { STATUS_NOTRECIEVED } from '../models/skhera';
import { getCoursier, getAnotherCoursier, sendSkheraRequest, sendSkheraNotificationConsumer } from '../services/skhera';
import { notFound, success } from '../services/response';

export const getByUser = async ({ user: { id } }, res) => {
  try {
    const skheras = await Skhera.find({ author: id, status: { $ne: STATUS_NOTRECIEVED } }).populate('rider');
    notFound(res, skheras);
    success(res, skheras);

  } catch (error) {
    console.error(error);
    return res.status(400).send(error.message);
  }
}

export const getById = async (req, res) => {
  try {
    const skhera = await Skhera.findById(req.params.id);
    notFound(res, skhera);
    success(res, skhera);

  } catch (error) {
    console.error(error);
    return res.status(400).send(error.message);
  }
}

export const getEstimatedPrice = async ({ body: { distance } }, res) => {
  let price = 5;
  distance += '';
  distance = distance.replace('km');
  distance = parseFloat(distance) > 0 ? parseFloat(distance) : 1;

  price += distance * 0.5;
  return res.status(200).send({ price: `${price}DH` });
}

export const create = async ({ body, user, app }, res) => {
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

    let coursier = await getCoursier(skhera.from.coordinates, skhera._id);
    skhera.rider = coursier._id;
    sendSkheraRequest(app, skhera, coursier);
    await skhera.save();
    success(res, skhera.view(), 201);

  } catch (error) {
    console.error(error);
    return res.status(400).send(error.message);
  }
}

export const remove = async (req, res) => {

  try {
    await Skhera.deleteOne({ _id: req.params.id });
    success(res);

  } catch (error) {
    console.error(error);
    return res.status(400).send(error.message)
  }
}

export const accept = async ({ body: { status, idSkhera }, app }, res) => {

  try {
    let skhera = await Skhera.findById(idSkhera);
    notFound(res, skhera);

    if (!status) {
      let coursier = await getAnotherCoursier(skhera.from.coordinates, idSkhera);
      skhera.rider = coursier._id;
      await skhera.save();
      sendSkheraRequest(app, skhera, coursier);
      success(res);
    }
    else {
      sendSkheraNotificationConsumer(app, skhera);
      return success(res);
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}
