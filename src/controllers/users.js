'use strict';
import User, {STATUS_ACTIF, STATUS_INACTIF} from '../models/user';

export const get = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

export const showMe = async ({ user: { id } }, res) => {
  try {
    let user = await User.findById(id);
    return res.status(200).send(user.view(user.role));
  } catch (error) {
    return res.status(500).send(error.message);
  }

}

export const updateStatus = async ({ user: { id } }, res) => {

  try {
    let user = await User.findById(id);
    user.status = user.status === STATUS_ACTIF ? STATUS_INACTIF : STATUS_ACTIF;
    await user.save();
    return res.status(200).send(user.view(user.role));
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export const getById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    return res.status(200).send(user.view());
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

export const update = async (req, res) => {
  const body = req.body;
  try {
    let user =  await User.findById(req.params.id);
    let {fullname, phone, email} = body;  
    user.fullname = fullname ? fullname : user.profile.fullname;
    user.phone = phone ? phone : user.profile.phone;
    user.email = email ? email : user.profile.email;
    await user.save();
    return res.sendStatus(200);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export const remove = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    return res.sendStatus(200);
  } catch (error) {
    res.status(400).send(error.message)
  }
}