module.exports = function (grunt) {

    'use strict';

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        mocha_phantomjs: {
            test: {
                options: {
                    urls: ['http://localhost:8001/test/index.html']
                }
            }
        },
        connect: {
            mocha: {
                options: {
                    port: 8001,
                    base: '.'
                }
            },
            preview: {
                options: {
                    keepalive: true,
                    port: 8000,
                    base: '.',
                    hostname: 'localhost',
                    debug: true,
                    open: true
                }
            }

        },
        clean: {
            all: ['dist'],
            js: ['dist/**/*.js','dist/**/*.js.map'],
            css: ['dist/**/*.css','dist/**/*.css.map']
        },

        sass: {
            expanded: {
                options: {
                    outputStyle: 'expanded',
                    sourceMap: true,
                    precision: 5
                },
                files: {
                    'dist/<%=pkg.name %>.css': 'src/scss/index.scss'
                }
            },
            min: {
                options: {
                    outputStyle: 'compressed',
                    sourceMap: true,
                    precision: 5
                },
                files: {
                    'dist/<%=pkg.name %>.min.css': 'src/scss/index.scss'
                }
            }
        },
        sasslint: {
            src: {
                options: {
                    configFile: '.sass-lint.yml'
                },
                target: ['src/scss/**/*.css']
            }
        },
        csslint: {
            dist: {
                options: {
                    csslintrc: '.csslintrc',
                    import: 2
                },
                src: ['dist/**/*.css']
            }
        },

        concat: {
            options: {
                separator: ';\n',
                sourceMap: true,
                sourceMapStyle: 'link'
            },
            dist: {
                src: ['src/js/**/*.js'],
                dest: 'dist/<%=pkg.name %>.js'
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015-without-strict']
            },
            dist: {
                files: {
                    'dist/<%=pkg.name %>.js': 'dist/<%=pkg.name %>.js'
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    mangle: true,
                    sourceMap: true,
                    compress: {
                        drop_debugger: false
                    }
                },
                files: {
                    'dist/<%=pkg.name %>.min.js': 'dist/<%=pkg.name %>.js'
                }
                // files: [
                //     {
                //         expand: true,
                //         cwd: 'src/js',
                //         src: ['**/*.js', '!_grunt/**', '!**/*.test.js'],
                //         rename: function () {
                //             return 'dist/<%=pkg.name %>.min.js';
                //         }
                //     }
                // ]
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            all: [
                'Gruntfile.js',
                'test/index.js',
                //'src/**/*.js',
                'dist/**/*.js',
                '!dist/**/*.min.js'
            ]
        },

        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['clean:js', 'concat:dist', 'uglify:dist', 'test_js']
            },
            scss: {
                files: ['src/**/*.scss'],
                tasks: ['clean:css', 'sass:expanded', 'sass:min', 'test_css']
            }
        }
    };

    grunt.task.registerTask("configureBabel", "configures babel options", function() {
        config.babel.options.inputSourceMap = grunt.file.readJSON("dist/<%=pkg.name %>.js.map");
    });

    grunt.initConfig(config);
    require("load-grunt-tasks")(grunt);


    grunt.registerTask('default', [
        'production',
        'test'
    ]);

    grunt.registerTask('production', [
        'clean',
        'concat:dist',
        'babel',
        'uglify:dist',
        'sass:expanded',
        'sass:min'
    ]);

    grunt.registerTask('test', [
        'test_js',
        'test_css'
    ]);

    grunt.registerTask('test_js', [
        'jshint',
        'connect:mocha',
        'mocha_phantomjs'
    ]);

    grunt.registerTask('test_css', [
        'sasslint:src',
        'csslint:dist'
    ]);

    grunt.registerTask('preview', [
        'connect:preview'
    ]);

};