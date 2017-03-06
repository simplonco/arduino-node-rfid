'use strict';
 
const serialport = require('serialport');
const SerialPort = serialport.SerialPort;

const port = '/dev/cu.usbmodem1421';
const parser = serialport.parsers.readline('\r\n');
const baudrate = 9600;

var sp = new SerialPort( port, { parser: parser, baudrate: baudrate });

//------------------------- CONNECT TO ARDUINO SERIAL PORT -----------------------//
console.log('Connection to Arduino...');
sp.on('open', function() {
  console.log('Status : success', 'Server currently listening to Arduino serial port.')
});

//------------------------- CONNECT TO ARDUINO SERIAL PORT -----------------------//
sp.on('data', function(uid) {
  console.log('Incoming data from Adruino', uid);
  let db = monk(url);
  if (db && connect) {
    connect(uid);
  }
});




//------------------------- CONNECT TO DATABASE ---------------------------//
const monk = require('monk');
const url = 'localhost:27017/esante';

//  Two types of collections :
//  meds = {
//    name: 'nurofen',                      -> name
//    rfid: 'a030597a',                     -> rfid
//    type: 0,                              -> warning level       
//    allergens: ['sugar','ibuprofene'],    -> allergens
//    maximum : 2400,                       -> maximum daily take in mg
//    minimum: 200,                         -> minimum daily take in mg
//    takes: [0, 1, 2]
//  }
//
//  users = {
//    name: '',                             -> name
//    rfid: '61535039',                     -> rfid
//    type: 0,                              -> warning level       
//    allergies: ['iode','penicilline']     -> allergies
//  }

const connect = function (uid) {
  let db = monk(url);
  if (db) {
    console.log('Successfully connected to database on port 27017.');
    const meds = db.get('meds');
    meds.find({rfid: uid}).then(function (data) {
      console.log(data);
      if(data[0]) sp.write(data[0].name);
      db.close();
    });
  }
  else {
    console.log('Failed to connect to database');
  }
}