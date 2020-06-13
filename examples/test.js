var config = require('../index');

config.init({env: 'prdtesting'})
.then(() =>{
  config.watchConfig('bts', 'user-profile', (data) => {
    console.log(`get data..........`);
    console.log(data);
  }, (data) => {
    console.log(`watch data..........`);
    console.log(data);
  });
}).catch((error) => console.error(error));