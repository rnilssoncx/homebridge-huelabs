'use strict';

const http = require('http');

let Accessory, Characteristic, Service;

class HueResource {
  constructor(log, key, name, sensor, host, port, user, api, version, quiet) {
    Accessory = api.hap.Accessory;
    Characteristic = api.hap.Characteristic;
    Service = api.hap.Service;

    this.log = log;
    this.log(`Creating resource: ${key} - ${name}`);
    this.key = key;
    this.name = name;
    this.sensor = sensor;
    this.host = host;
    this.port = port;
    this.user = user;
    this.version = version;
    this.quiet = quiet;
    this.state = false;
  }

  getServices() {
    let services = [];

    services.push(this.getAccessoryInformationService());

    this.resourceService = new Service.Switch(this.name);
    this.resourceService.getCharacteristic(Characteristic.On)
      .on("get", this.getState.bind(this))
      .on("set", this.setState.bind(this));

    services.push(this.resourceService);

    this.log(`Switch "${this.name}" created`);

    return services;
  }

  getAccessoryInformationService() {
    return new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Manufacturer, 'HueLabs')
      .setCharacteristic(Characteristic.Model, 'Button')
      .setCharacteristic(Characteristic.SerialNumber, this.key)
      .setCharacteristic(Characteristic.FirmwareRevision, this.version)
      .setCharacteristic(Characteristic.HardwareRevision, this.version);
  }


  identify(callback) {
    this.log(`Identify requested on ${this.name}`);
    callback();
  }

  getState(callback) {
    if (!this.quiet) {
      this.log(`${this.name} - Pulling update from ${this.host}`);
    }
    http.get({ hostname: this.host, port: this.port, path: `/api/${this.user}/sensors/${this.sensor}` }, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      resp.on('end', () => {
        this._getState(data, callback);
      });
    }).on("error", (error) => {
      this.log('${this.name} - Failed to get update from server');
      callback(error);
    });

  }

  _getState(data, callback) {
    let sensorData = JSON.parse(data);
    try {
      if (!this.quiet) {
        this.log(`Get Status "${this.name}" = ${sensorData.state.status == 1}`);
      }
      callback(null, sensorData.state.status == 1);
    }
    catch (error) {
      this.log(error);
      callback(error);
    }
  }

  setState(on, callback) {
    let that = this;
    let post_data = `{"status":${on ? 1 : 0}}`;
    let post_options = {
      host: this.host,
      port: this.port,
      path: `/api/${this.user}/sensors/${this.sensor}/state`,
      method: 'PUT'
    }

    var post_req = http.request(post_options, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        that.log(`${that.name}: Response - ${chunk}`);
      });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
    callback();
  }
}

module.exports = HueResource;