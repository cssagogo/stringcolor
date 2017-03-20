module.exports = function (grunt) {

    "use strict";

    var path = {
        test: "http://localhost:8001/test/index.html",
        dist: "assets/dist/",
        css: {
            src:  "assets/src/scss/",
            dist: "assets/dist/css/"
        },
        js: {
            src: "assets/src/js/",
            dist:"assets/dist/js/"
        }
    };

    var config = {
        pkg: grunt.file.readJSON("package.json"),
        mocha_phantomjs: {
            test: {
                options: {
                    urls: [path.test]
                }
            }
        },
        connect: {
            mocha: {
                options: {
                    port: 8001,
                    base: "."
                }
            },
            preview: {
                options: {
                    keepalive: true,
                    port: 8000,
                    base: ".",
                    hostname: "localhost",
                    debug: true,
                    open: true
                }
            }

        },
        clean: {
            all: [path.dist],
            js: [path.dist + "**/*.js", path.dist + "**/*.js.map"],
            css: [path.dist + "**/*.css", path.dist + "**/*.css.map"]
        },
        sass: {
            expanded: {
                options: {
                    outputStyle: "expanded",
                    sourceMap: true,
                    precision: 5
                },
                files: [
                    {
                        src: [path.css.src + "index.scss"],
                        dest: path.css.dist + "<%=pkg.name %>.css"},
                ]
            },
            min: {
                options: {
                    outputStyle: "compressed",
                    sourceMap: true,
                    precision: 5
                },
                files: [
                    {
                        src: [path.css.src + "index.scss"],
                        dest: path.css.dist + "<%=pkg.name %>.min.css"},
                ]
            }
        },

        scsslint: {
            allFiles: [
                path.css.src + "/*.scss",
            ],
            options: {
                config: '.scss-lint.yml',
                colorizeOutput: true,
                maxBuffer: 600 * 1024
            }
        },

        csslint: {
            dist: {
                options: {
                    csslintrc: ".csslintrc",
                    import: 2
                },
                src: [path.css.dist + "**/*.css"]
            }
        },
        concat: {
            options: {
                separator: ";\n",
                sourceMap: true,
                sourceMapStyle: "link"
            },
            dist: {
                src: [path.js.src + "**/*.js"],
                dest: path.js.dist + "<%=pkg.name %>.js"
            }
        },
        babel: {
            options: {
                sourceMap: true,
                sourceType: "script",
                presets: [
                    ["es2015", {modules: false}],
                ]
            },
            dist: {
                files: {}
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
                files: [{
                    src: [path.js.dist + "<%=pkg.name %>.js"],
                    dest: path.js.dist + "<%=pkg.name %>.min.js"
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            all: [
                "Gruntfile.js",
                "test/index.js",
                "src/**/*.js",
                "dist/**/*.js",
                "!dist/**/*.min.js"
            ]
        },
        watch: {
            js: {
                files: [path.js.src + "**/*.js"],
                tasks: ["build_js", "test_js"]
            },
            scss: {
                files: [path.css.src + "**/*.scss"],
                tasks: ["build_css", "test_css"]
            }
        }
    };


    grunt.task.registerTask("babelConfig", "configures babel options", function() {

        var jsPath = path.js.dist + config.pkg.name + ".js";
        config.babel.options.inputSourceMap = grunt.file.readJSON(jsPath + ".map");
        config.babel.dist.files[jsPath] = jsPath;

    });


    grunt.initConfig(config);
    require("load-grunt-tasks")(grunt);


    grunt.registerTask("default", [
        "build",
        "test"
    ]);


    grunt.registerTask("build", [
        "clean",
        "build_js",
        "build_css"
    ]);
    grunt.registerTask("build_js", [
        "clean:js",
        "concat:dist",
        "babelConfig",
        "babel",
        "uglify:dist"
    ]);
    grunt.registerTask("build_css", [
        "clean:css",
        "sass:expanded",
        "sass:min"
    ]);


    grunt.registerTask("test", [
        "test_js",
        "test_css"
    ]);
    grunt.registerTask("test_js", [
        "jshint",
        "connect:mocha",
        "mocha_phantomjs"
    ]);
    grunt.registerTask("test_css", [
        "scsslint",
        "csslint:dist"
    ]);


    grunt.registerTask("preview", [
        "connect:preview"
    ]);

};