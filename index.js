'use strict';

const platformPrettyName = 'HueLabs';
const platformName = require('./package.json').name;
const version = require('./package.json').version;
const http = require('http');

const HueResource = require('./accessory.js');

var Accessory, Service, Characteristic, UUIDGen, CustomCharacteristic;

module.exports = function (homebridge) {
  Accessory = homebridge.platformAccessory;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  UUIDGen = homebridge.hap.uuid;

  homebridge.registerPlatform(platformName, platformPrettyName, HueLabs);
}

class HueLabs {
  constructor(log, config, api) {
    this.log = log;
    this.log(`${platformPrettyName} Plugin Loaded - Version ${version}`);
    this.api = api;
    this.host = config.host || 'localhost';
    this.port = config.port || 80;
    this.user = config.user;
    this.update_interval = config['update_interval'] || 10; // seconds
    this.quiet = config.quiet || false;
    if (this.quiet) {
      this.log('Quiet logging mode');
    }
    this.resources = {};
  }

  accessories(callback) {
    if (!this.quiet) {
      this.log(`Pulling update from ${this.host}`);
    }
    http.get({ hostname: this.host, port: this.port, path: `/api/${this.user}/resourcelinks` }, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      resp.on('end', () => {
        this._accessories(data, callback);
      });
    }).on("error", (error) => {
      this.log('Failed to get update from server');
      callback(error);
    });

  }

  _accessories(data, callback) {
    let _accessories = [];

    let resourcelinks = JSON.parse(data);
    for (let key of Object.keys(resourcelinks)) {
      let resource = resourcelinks[key];
      if (resource.type == "Link" && resource.classid == 2) {
        for (let link of resource.links) {
          if (link.startsWith('/sensor')) {
            let sensor = link.split('/')[2];
            this.log(`${key}: "${resource.name}" - ${sensor}`)
            const accessory = new HueResource(this.log, key, resource.name, sensor, this.host, this.port, this.user, this.api, version, this.quiet);
            this.resources[key] = accessory;
            _accessories.push(accessory);
            break;
          }
        }
      }
    }
    callback(_accessories);
    this.updateResources();
    this._timer = setInterval(this.updateResources.bind(this), this.update_interval * 1000);  
  }

  updateResources() {
    // for (let key of Object.keys(this.resources)) {
    //   this.resources[key].updateState();
    // }
  }
}
