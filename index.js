const zookeeper = require('node-zookeeper-client');
const connStr = {
  gdev: '10.16.75.22:8481,10.16.75.24:8481,10.16.75.26:8481',
  gqc: '172.16.168.84:8481',
  prdtesting: '10.1.41.205:8481',
  prd: '10.1.49.61:8481,10.1.49.62:8481,10.1.49.63:8481,172.16.139.228:8481,172.16.139.229:8481,172.16.139.230:8481,172.16.41.141:8481,172.16.41.142:8481,172.16.41.143:8481',
  prd_e4: 'config4.newegg.org:80',
  prd_e11: 'config11.newegg.org:80',
  prd_e7: 'config7.newegg.org:80'
};
var client;
var logger;
var configObj;
var path;

exports.init = (options) => {
  return new Promise((resolve, reject) => {
    options = options || {};
    if (!options.connectionString && !options.env) {
      reject(new Error('Please provide connection string.'));
    }
    var conn = getConnString(options);
    if (!conn) {
      reject(new Error('Please provide connection string.'));
    }
    logger = options.logger || console;
    client = zookeeper.createClient(conn);
    client.once('connected', function () {
      logger.info('Connected to ZooKeeper.');
      resolve(null);
    });
    client.on('error', (error) => logger.error(error));
    client.connect();
  });
};

let getConnString = (options) => {
  var conn = options.connectionString || connStr[options.env];
  return conn;
};

let validata = (system, name) => {
  if (!system || !name) {
    throw new Error('Please provide system and config name');
  }
  path = `/${system}/${name}`;
  return path;
}

exports.retriveConfig = (system, name, callback) => {
  this.watchConfig(system, name, callback);
};

exports.watchConfig = (system, name, callback, watchCallback) => {
  path = validata(system, name);
  getData(callback, watchCallback);
};

var getData = function (callback, watchCallback) {
  var watcher = null;
  if (watchCallback) {
    watcher = (event) => {
      logger.info('data changed');
      logger.info(event);
      getData(null, watchCallback);
    };
  }
  client.getData(path, watcher,
    (error, data, stat) => {
      let isCallback = false;
      if (error) {
        logger.error(error);
      } else {
        var configString = data.toString('utf-8');
        try {
          configObj = JSON.parse(configString);
        } catch (err) {
          configObj = configString;
        }
        if (callback) {
          callback(configObj);
          isCallback = true;
        }
        if (!watchCallback) {
          client.close();
        } else if (!isCallback) {
          watchCallback(configObj);
        }
      }
    });
};

exports.getConfig = function () {
  return configObj;
};