var config = require('../index');

config.init({env: 'gdev'})
.then(() =>{
  config.watchConfig('bts', 'd-proxy', (data) => {
    console.log(`get data..........`);
    console.log(data);
  }, (data) => {
    console.log(`watch data..........`);
    console.log(data);
  });
}).catch((error) => console.error(error));