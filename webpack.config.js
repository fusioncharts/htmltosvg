module.exports = {
    entry: './src/index.js',
  	output: {
  		path: __dirname + '/dist',
  		filename: 'htmlcanvas.js',
  		library: 'htmlcanvas',
  		libraryTarget: 'umd',
  		umdNamedDefine: true
  	},
    module: {
     loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    }
};
