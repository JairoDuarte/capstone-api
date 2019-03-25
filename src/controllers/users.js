'use strict';
import User from '../models/user';
import {notFound, success} from '../services/response';

export const showMe = async ({ user: { id } }, res) => {
  
  try {
    
    let user = await User.findById(id);
    notFound(res, user);
    success(res, user)

  } catch (error) {
    return res.status(500).send(error.message);
  }

}

export const updateStatus = async ({ user: { id }, status }, res) => {

  try {
    let user = await User.findById(id);
    notFound(res, user);
    
    user.status = status;
    await user.save();
    success(res, user);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export const getById = async (req, res) => {
  
  try {

    let user = await User.findById(req.params.id);
    notFound(res, user);
    
    success(res, user);
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

export const update = async (req, res) => {
  
  const body = req.body;
  
  try {
    let user =  await User.findById(req.params.id);
    notFound(user);

    let {fullname, phone, email} = body;  
    user.fullname = fullname ? fullname : user.profile.fullname;
    user.phone = phone ? phone : user.profile.phone;
    user.email = email ? email : user.profile.email;
    await user.save();
    success(res, 200);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export const remove = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    return res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message)
  }
}