const path = require('path');
module.exports = {
	mode: 'development',
	entry: {
		pets: './public/javascripts/pets.js',
		petFeed: './public/javascripts/inventory.js',
	},
	output: {
		path: path.join(__dirname, '/public', 'javascripts'),
		filename: '[name].bundle.min.js',
		publicPath:'/javascripts'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: [/node_modules/, /"app.js/],
				loader: "babel-loader",
				options: {
					presets: ["react"]
				}
			}
		]
	},
	optimization: {
		minimize: true
	},
	watch: true
};