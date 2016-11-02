var config = require('../index');

config.init({env: 'gdev'})
.then(() =>{
  config.retriveConfig('envionment', 'name', (data) => {
    console.log(data);
    setInterval(() => console.log(config.getConfig()), 3000);
  });
}).catch((error) => console.error(error));