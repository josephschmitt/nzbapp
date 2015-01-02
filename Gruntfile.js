module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
        	dev: {
        		options: {
					trace: true,
					style: 'expanded'
				},
				files: [{
					expand: true,
					cwd: 'scss/',
					src: ['*.scss', '**/*.scss'],
					dest: 'public_html/css/',
					ext: '.css'
				}]
        	}
		},

		coffee: {
			dev: {
				files: [{
					expand: true,
					cwd: 'coffee/',
					src: ['*.coffee', '**/*.coffee'],
					dest: 'public_html/js/',
					ext: '.js'
				}]
			}
		},
		
		watch: {
			sass: {
				options: {
					spawn: false
				},
				files: ['scss/*.scss', 'scss/**/*.scss'],
				tasks: ['sass:dev', 'autoprefixer']
			},

			coffee: {
				options: {
					spawn: false
				},
				files: ['coffee/*.coffee', 'coffee/**/*.coffee'],
				tasks: ['coffee:dev']
			},

			bower: {
				options: {
					spawn: false,
					event: ['added', 'deleted']
				},
				files: ['public_html/js/*.js', 'public_html/js/**/*.js'],
				tasks: ['bower:install', 'injector:dev']
			},

			src_files: {
				options: {
					spawn: false,
					event: ['added', 'deleted']
				},
				files: ['coffee/*', 'scss/*'],
				tasks: ['coffee:dev', 'sass:dev']
			}
		},

		bower: {
			dev: {
				dest: 'public_html/',
			    js_dest: 'public_html/js/lib/',
			    css_dest: 'public_html/css/lib/',
			    fonts_dest: 'public_html/webfonts/lib',
				options: {
					keepExpandedHierarchy: false,
					packageSpecific: {
						foundation: {
							dest: 'scss/',
							files: ['scss/**'],
							keepExpandedHierarchy: true,
							stripGlobBase: true
						}
					},
					ignorePackages: ['modernizr', 'foundation']
				}
			}
		},

		injector: {
			dev: {
				options: {
					addRootSlash: false,
					ignorePath: 'public_html/'
				},
				files: {
					'public_html/index.html': [
						// Base libs
						'public_html/js/lib/jquery.js', 
						'public_html/js/lib/underscore.js', 
						'public_html/js/lib/backbone.js',  
						
						// All other libs
						'public_html/js/lib/*.js',

						//Config file
						'public_html/config.js',

						// App js files
						'public_html/js/transition-region.js', 
						'public_html/js/app.js',
						'public_html/js/apps/gui/**/*.js', 
						'public_html/js/**/*.js', 

						// Exclude minified files
						'!public_html/js/**/*min*.js', 
						'!public_html/js/lib/**/*min*.js',

						// CSS
						'public_html/**/*.css',
						'!public_html/js/lib/*.css'
					]
				}
			},

			dist: {
				options: {
					addRootSlash: false,
					ignorePath: 'dist/'
				},
				files: {
					'dist/index.html': [
						// Base libs
						'dist/**/*.js',

						// CSS
						'dist/**/*.css'
					]
				}
			}
		},

		autoprefixer: {
			options: {
				
			},
			dev: {
				expand: true,
				flatten: true,
				src: 'public_html/css/*.css',
				dest: 'public_html/css/'
			},
		},

		copy: {
			dist: {
				files: [{
					cwd: 'public_html',
					expand: true, 
					src: ['index.html', 'AppIcon.appiconset/*', 'css/lib/**', '!public_html/css/lib/*.css'], 
					dest: 'dist/'
				}]
			}
		},

		uglify: {
			options: {
				mangle: true
			},

			dist: {
				files: {
					'dist/js/app-min.js': [
						// Base libs
						'public_html/js/lib/jquery.js', 
						'public_html/js/lib/underscore.js', 
						'public_html/js/lib/backbone.js',  
						
						// All other libs
						'public_html/js/lib/*.js',

						//Config file
						'public_html/config.js',

						// App js files
						'public_html/js/transition-region.js', 
						'public_html/js/app.js',
						'public_html/js/apps/gui/**/*.js', 
						'public_html/js/**/*.js', 

						// Exclude minified files
						'!public_html/js/**/*min*.js', 
						'!public_html/js/lib/**/*min*.js',
					]
				}
			}
		},

		cssmin: {
			dist: {
				src: ['public_html/css/**/*.css'],
				dest: 'dist/css/styles.css'
			}
		},

		appcache: {
			options: {
				basePath: 'dist/',
				preferOnline: true
			},

			dist: {
				dest: 'dist/manifest.appcache',
				cache: 'dist/**/*',
				network: '*'
			}
		}
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-appcache');

    // Default task(s).
    grunt.registerTask('default', ['build', 'install', 'watch']);
    grunt.registerTask('build', ['sass:dev', 'autoprefixer', 'coffee:dev',]);
    grunt.registerTask('install', ['bower:dev', 'injector:dev']);
    grunt.registerTask('dist', ['copy:dist', 'cssmin:dist', 'uglify:dist', 'injector:dist', 'appcache']);
};