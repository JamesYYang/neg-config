var config = require('../index');

config.init({connectionString: '10.16.75.23:8481, 10.16.75.25:8481, 10.16.75.26:8481'})
.then(() =>{
  config.watchConfig('envionment', 'name', (data) => {
    console.log(data);
    setInterval(() => console.log(config.getConfig()), 3000);
  });
}).catch((error) => console.error(error));