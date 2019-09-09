module.exports = function(grunt){
	grunt.initConfig({
		eslint: {
			target:['./*.js', '/public/javascripts/*.js']
		}, 
		cssmin: {
			target: {
				src: './public/css/style.css',
				dest: './public/css/style.min.css'
			}
		},
		watch: {
			scripts: {
				files: ['./*.js', './public/css/style.css'],
				tasks: ['eslint', 'cssmin'],
				options: {
					event: ['added', 'changed'],
				},
			},
		}
	});
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
};