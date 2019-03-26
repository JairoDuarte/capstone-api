'use strict';
import User from '../models/user';
import {notFound, success} from '../services/response';

export const showMe = async ({ user: { id, role } }, res) => {
  
  try {
    
    let user = await User.findById(id);
    notFound(res, user);
    success(res, user.view(role));

  } catch (error) {
    return res.status(400).send(error.message);
  }

}

export const updateStatus = async ({ user: { id, role }, body: { status } }, res) => {

  try {
    let user = await User.findById(id);
    notFound(res, user);
    console.log(status);
    user.status = status;
    await user.save();
    success(res, user.view(role));

  } catch (error) {
    return res.status(400).send(error.message);
  }
}

export const getById = async ({params: { id }, user: { role }}, res) => {
  
  try {

    let user = await User.findById(id);
    notFound(res, user);
    
    success(res, user.view(role));
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

export const update = async ({body: { fullname, phone, email }, params: { id }}, res) => {
  
  
  try {
    let user =  await User.findById(id);
    notFound(res, user);

    user.fullname = fullname ? fullname : user.profile.fullname;
    user.phone = phone ? phone : user.profile.phone;
    user.email = email ? email : user.profile.email;
    await user.save();
    success(res);

  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
}

export const remove = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    success(res);
  } catch (error) {
    res.status(400).send(error.message);
  }
}