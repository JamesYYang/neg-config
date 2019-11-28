# neg-config

This is node.js client for Newegg configuration service.

## Install

```sh
$ npm install neg-config
```

## How to Use

```js
var config = require('neg-config');

config.init({connectionString: '10.16.75.23:8481, 10.16.75.25:8481, 10.16.75.26:8481'})
.then(() =>{
  config.watchConfig('envionment', 'name', (data) => {
    console.log(data); //get data first time
  }, (data) => {
    console.log(data); //call back when data changed
  });
}).catch((error) => console.error(error));
```

## License

MIT