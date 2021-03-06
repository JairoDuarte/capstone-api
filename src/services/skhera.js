import User, { STATUS_ACTIF } from '../models/user';
import SkheraTmp from '../models/skheraCoursierTmp';

export const sendSkheraRequest = async (app, skhera, rider) => {
  const io = app.get('io');
  io.sockets.emit('new skhera', { skhera: skhera, idrider: rider._id });
};

export const sendSkheraNotificationConsumer = async (app, skhera) => {
  const io = app.get('io');
  io.sockets.emit('accept skhera', {
    skhera: skhera,
    idconsumer: skhera.author
  });
};

export const getCoursier = async (coordinates, idSkhera) => {
  let coursiers = await User.getCoursierByLocation(coordinates[0], coordinates[1]);
  let coursier = coursiers[0];
  coursiers.splice(coursiers.indexOf(coursier), 1);
  const listOfCoursiersId = coursiers.map(item => {
    return item._id;
  });
  let skheraTmp = new SkheraTmp();
  skheraTmp.idskhera = idSkhera;
  skheraTmp.coursierlist = listOfCoursiersId;
  skheraTmp.save();
  return coursier;
};

export const getAnotherCoursier = async (coordinates, idSkhera) => {
  let coursiers = await SkheraTmp.getById(idSkhera);
  let coursier;
  if (coursiers) {
    let coursierlistId = coursiers.coursierlist;
    for (let index = 0; index < coursierlistId.length; index++) {
      const id = coursierlistId[index];
      coursier = await User.findOne({ _id: id, status: STATUS_ACTIF });
      coursierlistId.splice(coursierlistId.indexOf(id), 1);
      if (coursier) break;
    }
    if (coursier) {
      coursiers.coursierlist = coursierlistId;
      coursierlistId.length === 0 ? await SkheraTmp.deleteOne({ idskhera: idSkhera }) : coursiers.save();
      return coursier;
    }
  }
  coursier = await getCoursier(coordinates, idSkhera);
  return coursier;
};
