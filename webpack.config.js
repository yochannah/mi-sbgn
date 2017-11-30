const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    main: './js/index.js',
    dependencies: './js/dependencies.js'
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: {
          reserved: ["$",
            "_",
            "Backbone",
            "MIModel",
            "cola",
            "d3",
            "corner",
            "jstoxml"
          ]
        }
      }
    })

  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mi-sbgn-[name].bundle.js'
  }
};