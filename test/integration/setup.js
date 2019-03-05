import { EventEmitter } from 'events'
import supertest from 'supertest';
import Enzyme from 'enzyme';
import "@babel/polyfill";

import app from '../../src/app.js';

EventEmitter.defaultMaxListeners = Infinity
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
//console.log(app.listen(0));


beforeAll(async () => {
  global.app = app;
  global.supertest = supertest;
  global.request = await supertest(app);
  
  global.customer = { token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjN2VhNTA2NDJjOTNiYmMyMjQ4OTViMyIsImV4cGlyZVRva2VuIjoxMDAwMDAwMDE1NTE0MDg0NjAwMDAsImlhdCI6MTU1MTgwMzY1NH0.Q9hsp7F22hzVmlPxt7rnMDRqlPPYw4ZhBrHv0IxGfIc',
   user: { id: '5c7ea50642c93bbc224895b3', role: 'customer' },
   done: true }
  
})