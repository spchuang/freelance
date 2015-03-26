module.exports = function(grunt) {
    'use strict';


    // # Globbing
    // for performance reasons we're only matching one level down:
    // 'test/spec/{,*/}*.js'
    // use this if you want to recursively match all subfolders:
    // 'test/spec/**/*.js'


    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

       // Project settings
        config: {
            // Configurable paths
            app: 'source',
            dist: 'dist'
        },

        // Watches files for changes and runs tasks based on the changed files
        // livereload requires <script data-type="development" src="//localhost:35729/livereload.js"></script>
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            less:{
                files: ['<%= config.app %>/less/**/*.less'], // which files to watch
                tasks: ['less:development'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            js: {
                files: ['<%= config.app %>/js/{,*/}*.js'],
                tasks: ['jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '<%= config.app %>/.tmp/css/{,*/}*.css',
                    '<%= config.app %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 8000,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= config.app %>'
                    ]
                }
            }
        },

        // Automatically inject Bower components into the app, e.g. loads css and js from installed bower package within
        // <!-- bower:css -->
        // <!-- endbower -->
        // and
        // <!-- bower:js -->
        // <!-- endbower -->
        wiredep: {
            options: {
                //cwd: '<%= config.app %>'
            },
            app: {
                src: ['<%= config.app %>/index.html'],
                ignorePath:  /\.\.\//
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes, IMPORTANT, you need a .jshintrc file
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= config.app %>/js/{,*/}*.js'
                ]
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                src: ['dist/']
            }
        },

        // Converts less into css
        less: {
            development: {
                options: {
                    cleancss: true,
                    compress: true,
                    report: 'min',
                    sourceMap: true,
                    sourceMapFilename: '<%= config.app %>/css/app.css.map', // where file is generated and located
                    sourceMapURL: '/css/app.css.map', // the complete url and filename put in the compiled css file
                    sourceMapBasepath: '<%= config.app %>', // Sets sourcemap base path, defaults to current working directory.
                    sourceMapRootpath: '/' // adds this path onto the sourcemap filename and less file paths
                },
                files: {
                    '<%= config.app %>/css/app.css': '<%= config.app %>/less/app.less' // destination file and source file
                }
            },
        },

        copy: {
            cssTest: {
                expand: true,
                flatten: true, // flattens results to a single level
                src: 'source/css/*',
                dest: 'dist/css/'
            },
            indexFile: {
                expand:true,
                flatten:true,
                src:'source/index.html',
                dest:'dist/'
            },
            scripts: {
                expand: true,
                flatten: true,
                src: 'source/js/*',
                dest: 'dist/js'
            },
            assets: {
                expand: true,
                flatten: false,
                src: 'source/assets/**', // includes files within path and its sub-directories
                dest: 'dist/assets'
            }
        }

    });



    grunt.registerTask('build', [
        'clean:dist',
        'wiredep',
        'copy'
    ]);

    //grunt.registerTask('default', ['copy']);
    grunt.registerTask('serve', [
        'connect',
        'wiredep',
        'less:development',
        'jshint',
        'watch'
    ]);

    grunt.registerTask('default', ['connect', 'watch']);


};