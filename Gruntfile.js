module.exports = function (grunt) {
    grunt.initConfig({
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
        jshint: {
            all: [
                'Gruntfile.js',
                'test/index.js',
                'src/**/*.js'
            ]
        },
        sasslint: {
            src: {
                options: {
                    configFile: '.sass-lint.yml',
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
        clean: {
            all: ['dist'],
            js: ['dist/**/*.js','dist/**/*.js.map'],
            css: ['dist/**/*.css','dist/**/*.css.map']
        },
        concat: {
            options: {
                separator: ';\n',
                sourceMap: true
            },
            dist: {
                src: ['src/js/**/*.js'],
                dest: 'dist/<%=pkg.name %>.js'
            }
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
            },
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
                files: [
                    {
                        expand: true,
                        cwd: 'src/js',
                        src: ['**/*.js', '!_grunt/**', '!**/*.test.js'],
                        rename: function () {
                            return 'dist/<%=pkg.name %>.min.js';
                        }
                    }
                ]
            }
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
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-sass-lint');

    grunt.registerTask('default', [
        'production',
        'test'
    ]);

    grunt.registerTask('production', [
        'clean',
        'concat:dist',
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