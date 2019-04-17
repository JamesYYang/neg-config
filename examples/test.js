var config = require('../index');

config.init({env: 'prd_e7'})
.then(() =>{
  config.retriveConfig('bts', 'gateway_wh7', (data) => {
    console.log(data);
  });
}).catch((error) => console.error(error));