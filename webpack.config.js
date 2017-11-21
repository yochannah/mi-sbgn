const path = require('path');

module.exports = {
  entry: {
    main : './js/script.js',
    dependencies : './js/dependencies.js'
},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mi-sbgn-[name].bundle.js'
  }
};