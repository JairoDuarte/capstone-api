import { EventEmitter } from 'events'
import supertest from 'supertest';
import Enzyme from 'enzyme';
import 'babel-polyfill';

import app from '../../src/app.js';

EventEmitter.defaultMaxListeners = Infinity
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

beforeAll(async () => {
  global.app = app;
  global.supertest = supertest;
  global.request = supertest(app)
})