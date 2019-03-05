import { EventEmitter } from 'events'
import supertest from 'supertest';
import Enzyme from 'enzyme';
import "@babel/polyfill";
import auth from './token';

import app from '../../src/app.js';

EventEmitter.defaultMaxListeners = Infinity
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
//console.log(app.listen(0));


beforeAll(async () => {
  global.app = app;
  global.supertest = supertest;
  global.request = await supertest(app);
  //await auth.auth('coursier');
  await auth.auth('customer');
  
  global.customer = auth.getcustomerToken();
  global.coursier = auth.getCoursierToken();
  
})