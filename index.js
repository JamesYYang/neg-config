var zookeeper = require('node-zookeeper-client');
var connStr = {
  gdev: '10.16.75.23:8481,10.16.75.25:8481,10.16.75.26:8481',
  gqc: '10.1.24.130:8481',
  prdtesting: '10.1.41.205:8481',
  prd: '10.1.49.61:8481,10.1.49.62:8481,10.1.49.63:8481,172.16.139.228:8481,172.16.139.229:8481,172.16.139.230:8481,172.16.41.141:8481,172.16.41.142:8481,172.16.41.143:8481',
  prd_e4: '172.16.41.141:8481,172.16.41.142:8481,172.16.41.143:8481',
  prd_e11: '172.16.139.228:8481,172.16.139.229:8481,172.16.139.230:8481',
  prd_e7: '10.1.49.61:8481,10.1.49.62:8481,10.1.49.63:8481'
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

var getConnString = (options) => {
  var conn = options.connectionString || connStr[options.env];
  return conn;
};

exports.watchConfig = (system, name, callback) => {
  if (!system || !name) {
    throw new Error('Please provide system and config name');
  }
  path = `/${system}/${name}`;
  getData(true, callback);
};

exports.retriveConfig = (system, name, callback) => {
  if (!system || !name) {
    throw new Error('Please provide system and config name');
  }
  path = `/${system}/${name}`;
  getData(false, callback);
};

var getData = function (isWatch, callback) {
  var watcher = (event) => {
    logger.info('data changed');
    logger.info(event);
    getData();
  };
  if (!isWatch) {
    watcher = null;
  }
  client.getData(path, watcher,
    (error, data, stat) => {
      if (error) {
        logger.error(error);
      } else {
        var configString = data.toString('utf-8');
        try {
          configObj = JSON.parse(configString);
        } catch (err) {
          configObj = configString;
        }
        if(!isWatch){
          client.close();
        }
        if (callback) {
          callback(configObj);
        }
      }
    });
};

exports.getConfig = function () {
  return configObj;
};
