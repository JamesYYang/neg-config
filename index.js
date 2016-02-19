var zookeeper = require('node-zookeeper-client');
var client;
var logger;
var configObj;
var path;

exports.init = (options) =>{
  return new Promise( (resolve, reject) => {
    options = options || {};
    if(!options.connectionString){
      reject(new Error('Please provide connection string.'));
    }
    logger = options.logger || console;
    client = zookeeper.createClient(options.connectionString);
    client.once('connected', function () {
      logger.info('Connected to ZooKeeper.');
      resolve(null);
    });
    client.on('error', (error) => logger.error(error));
    client.connect();
  });
};

exports.watchConfig = (system, name, callback) => {
  if(!system || !name){
    throw new Error('Please provide system and config name');
  }
  path = `/${system}/${name}`;
  getData(callback);
};

var getData = function(callback){
  client.getData(path,
  (event) => {
    logger.info('data changed');
    logger.info(event);
    getData();
  } ,
  (error, data, stat) => {
    if(error){
      logger.error(error);
    }else{
      var configString = data.toString('utf-8');
      try {
        configObj = JSON.parse(configString);
      } catch (err) {
        configObj = configString;
      }
      if(callback){
        callback(configObj);
      }
    }
  });
};

exports.getConfig = function() {
  return configObj;
};