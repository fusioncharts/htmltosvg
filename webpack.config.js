module.exports = {
    entry: './src/index.js',
  	output: {
  		path: __dirname + '/dist',
  		filename: 'htmltosvg.js',
  		library: 'htmltosvg',
  		libraryTarget: 'umd',
  		umdNamedDefine: true
  	},
    watch: true,
    devtool: 'source-map',
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
