/*
 * [y] hybris Platform
 *
 * Copyright (c) 2017 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */
module.exports = function(grunt) {

    grunt.file.setBase('./');
    grunt.loadTasks('gruntTasks');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-jssemicoloned');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-protractor-runner');

    var phantomJSPattern = 'node_modules/karma-phantomjs-launcher/node_modules/phantomjs/lib/phantom/bin/phantomjs*';
    var chromeDriverFolder = 'node_modules/protractor/selenium/chromedriver';
    var chromeDriverPattern = chromeDriverFolder + '/chromedriver*';

    function getChromeDriverFolder() {
        return chromeDriverFolder + (process.platform === 'win32' ? '/chromedriver.exe' : '/chromedriver');
    }

    var testBase = 'jsTests';
    var testJsFiles = testBase + '/**/*.js';
    var excludedFiles = testBase + '/**/e2e/_shared/**';
    var testsRootFiles = testBase + '/tests/*';

    var paths = require('./jsTests/paths.js');
    var dependencyLoader = require('./jsTests/testDependencyLoader.js');

    grunt.initConfig({

        checkNoForbiddenNameSpaces: {
            pattern: ['web/features/**/*.js', testJsFiles, '!' + excludedFiles]
        },

        checkNoFocus: {
            pattern: [testJsFiles]
        },

        check_i18n_keys_compliancy: {
            prefix: {
                ignored: [
                    'page.displaycondition.', // keys provided by back-end
                    'se.', // keys provided by smartedit-locales_en.properties
                    'type.' // keys provided by back-end
                ],
                expected: ['se.cms.']
            },
            paths: {
                files: [
                    "web/features/**/*Template.html",
                    "web/features/**/*.js"
                ],
                properties: [
                    "resources/localization/cmssmartedit-locales_en.properties",
                    "gruntTasks/smartedit-locales_en.properties"

                ]
            }
        },

        pkg: grunt.file.readJSON('package.json'),

        connect: {
            dev: {
                options: {
                    hostname: '127.0.0.1',
                    port: 8080,
                    keepalive: true,
                    open: true
                }
            },
            test: {
                options: {
                    hostname: '127.0.0.1',
                    port: 7000
                }
            },
            debug: {
                options: {
                    hostname: '127.0.0.1',
                    port: 7000,
                    keepalive: true
                }
            }
        },

        /*
         *in preparation for ng-annotate so as not to alter original source files
         */
        jsbeautifier: {
            files: ['Gruntfile.js', 'web/features/**/*.js', testJsFiles, 'web/features/**/*.html', 'web/styling/**/*.css', '!' + excludedFiles],
            options: {
                //config: "path/to/configFile",
                html: {
                    braceStyle: "collapse",
                    indentChar: " ",
                    indentScripts: "keep",
                    indentSize: 4,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    unformatted: ["a", "sub", "sup", "b", "i", "u"],
                    wrapLineLength: 0,
                    wrapAttributes: 'force'
                },
                css: {
                    indentChar: " ",
                    indentSize: 4
                },
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0,
                    endWithNewline: true
                }
            }
        },
        jssemicoloned: {
            files: ['Gruntfile.js', 'web/features/**/*.js', testJsFiles, '!' + excludedFiles]
        },
        clean: {
            temp: {
                src: ['tmp', 'jsTarget']
            },
            cssfiles: {
                src: ['web/webroot/css/*.css']
            }
        },
        /**
         * code quality
         */
        jshint: {
            options: {
                jshintrc: true,
                reporterOutput: ""
            },
            all: ['Gruntfile.js', 'web/features/**/*.js', testJsFiles, '!' + excludedFiles]
        },

        /*
         * generate AngularJS docs for cmssmartedit
         */
        ngdocs: {
            options: {
                dest: 'jsTarget/docs',
                title: "SmartEdit CMS API",
                startPage: '/#/cmssmartedit'
            },
            cmssmartedit: {
                api: true,
                src: ['web/features/cmscommons/**/*.js', 'web/features/cmssmartedit/**/*.js'],
                title: 'SmartEdit CMS'
            },
            cmssmarteditContainer: {
                api: true,
                src: ['web/features/cmscommons/**/*.js', 'web/features/cmssmarteditContainer/**/*.js'],
                title: 'SmartEdit CMS Container'
            }
        },

        /*
         * 'annotates' angular JS files to be minify-ready
         *
         * @see https://github.com/mzgol/grunt-ng-annotate
         */
        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            run: {
                files: [{
                    expand: true,
                    src: ['jsTarget/**/*.js']
                }, ],
            }
        },
        uglify: {
            dist: {
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: 'jsTarget/', // Src matches are relative to this path.
                    src: ['*.js'], // Actual pattern(s) to match.
                    dest: 'web/webroot/cmssmartedit/js/', // Destination path prefix.
                    ext: '.js', // Dest filepaths will have this extension.
                    extDot: 'first' // Extensions in filenames begin after the first dot
                }],
                options: {
                    mangle: true //ok since one has ng-annotate beforehand
                }
            }
        },
        watch: {
            e2e: {
                files: ['Gruntfile.js', 'web/features/**/*', testBase],
                tasks: ['e2e'],
                options: {
                    atBegin: true
                }
            },
            test: {
                files: ['Gruntfile.js', 'web/features/**/*', testBase],
                tasks: ['test'],
                options: {
                    atBegin: true
                }
            },
            dev: {
                files: ['Gruntfile.js', 'web/features/**/*', testBase + "/**/*"],
                tasks: ['dev'],
                options: {
                    atBegin: true
                }
            },
            pack: {
                files: ['Gruntfile.js', 'web/features/**/*', testBase],
                tasks: ['package'],
                options: {
                    atBegin: true
                }
            },
            ngdocs: {
                files: ['web/features/**/*'],
                tasks: ['ngdocs'],
                options: {
                    atBegin: true
                }
            }
        }

    });

    grunt.registerTask("copyDev", function() {
        var copyDevTask = {
            dev: {
                expand: true,
                flatten: true,
                src: ['jsTarget/*.js'],
                dest: 'web/webroot/cmssmartedit/js'
            }
        };

        grunt.config.set('copy', copyDevTask);
        grunt.task.run('copy');
    });

    // Note: The following methods register tasks so that they can be executed in a multi-folder environment. Their structure
    // is quite similar between each other, so potentially could be refactored to allow for code reuse.
    grunt.registerTask("multipleCopySources", function() {
        var copyToJSTargetTask = {};

        // read all subdirectories from your modules folder
        grunt.file.expand({
            filter: 'isDirectory'
        }, "web/feature*/*").forEach(function(dir) {
            copyToJSTargetTask[dir] = {
                expand: true,
                flatten: false,
                src: [dir + '/**/*.js'],
                dest: 'jsTarget/'
            };
        });
        grunt.config.set('copy', copyToJSTargetTask);
        grunt.task.run('copy');
    });

    /*
     * generates angular.module('run').run(['$templateCache', function($templateCache) {}]) module
     * that contains template caches so that they become minifyable !!!
     */
    grunt.registerTask("multipleNGTemplates", function() {

        var createCommonTemplateTask = {};

        // read all subdirectories from your modules folder
        grunt.file.expand({
            filter: 'isDirectory'
        }, "web/features/*").forEach(function(dir) {
            var folderName = dir.replace("web/features/", "");
            createCommonTemplateTask[dir] = {
                src: [dir + '/**/*Template.html'],
                dest: 'jsTarget/' + dir + '/templates.js',
                options: {
                    standalone: true, //to declare a module as opposed to binding to an existing one
                    module: folderName + 'Templates'
                }
            };

            grunt.config.set('ngtemplates', createCommonTemplateTask);
        });

        grunt.file.expand({
            filter: 'isDirectory'
        }, "web/featureExtensions/*/*").forEach(function(dir) {
            var folderName = dir.replace("web/featureExtensions/", "");

            createCommonTemplateTask[dir] = {
                src: [dir + '/**/*Template.html'],
                dest: 'jsTarget/' + dir + '/templates.js',
                options: {
                    standalone: true, //to declare a module as opposed to binding to an existing one
                    module: folderName + 'Templates'
                }
            };

            grunt.config.set('ngtemplates', createCommonTemplateTask);
        });

        grunt.task.run('ngtemplates');
    });

    grunt.registerTask("requirePushExtensions", function() {
        var extensionsStr = {};

        grunt.file.expand({
            filter: 'isDirectory'
        }, "jsTarget/web/featureExtensions/*/*").forEach(function(dir) {
            var folderName = dir.replace("jsTarget/web/featureExtensions/", "");
            var extensionName = folderName.substring(0, folderName.lastIndexOf('/'));
            var moduleName = folderName.substring(folderName.lastIndexOf('/') + 1);

            extensionsStr[moduleName] = extensionsStr[moduleName] || [];
            extensionsStr[moduleName].push("angular.module('" + moduleName + "').requires.push('" + extensionName + "Module');");

        });

        var files = [];
        for (var moduleName in extensionsStr) {
            files.push({
                append: extensionsStr[moduleName].join('\n'),
                input: 'jsTarget/' + moduleName + '.js'
            });
        }

        grunt.config.set('file_append', {
            'extensions': {
                files: files
            }
        });
        grunt.task.run('file_append');
    });

    grunt.registerTask("multipleConcat", function() {
        var concatScriptsAndTemplatesTask = {};

        grunt.file.expand({
            filter: 'isDirectory'
        }, "jsTarget/web/features/*").forEach(function(dir) {
            if (!endsWith(dir, "/cmscommons")) {
                var folderName = dir.replace("jsTarget/web/features/", "");

                concatScriptsAndTemplatesTask[dir] = {
                    src: [
                        dir + '/**/*.js',
                        "jsTarget/web/features/cmscommons/**/*.js",
                        "jsTarget/web/featureExtensions/*/" + folderName + "/*.js"
                    ],
                    dest: 'jsTarget/' + folderName + '.js'
                };

                grunt.config.set('concat', concatScriptsAndTemplatesTask);
            }
        });

        grunt.task.run('concat');
    });

    grunt.registerTask("multiKarma", 'Executes unit tests for each project via karma separately.', function() {
        //if npmtestancillary is not present, phantomjs drivers won't be present

        try {
            dependencyLoader.checkUnitDependencyFileNames();
        } catch (error) {
            grunt.fail.fatal(error);
        }

        if (grunt.file.expand({
                filter: 'isFile'
            }, phantomJSPattern).length > 0) {


            var multiKarmaTask = {};
            grunt.file.expand({
                filter: 'isDirectory'
            }, testsRootFiles).forEach(function(dir) {
                var folderName = dir.replace(testsRootFiles + '/', "");
                multiKarmaTask[folderName] = {
                    options: {
                        configFile: dir + "/karma.conf.js",
                        singleRun: true
                    }
                };
            });

            grunt.config.set('karma', multiKarmaTask);
            grunt.task.run('karma');
        } else {
            grunt.log.warn('multiKarma grunt phase was not run since no phantomjs driver found under ' + phantomJSPattern);
        }
    });

    grunt.registerTask("multiProtractor", 'Executes end to end tests for each project via protractor separately', function() {
        //if npmtestancillary is not present, chrome drivers won't be present
        if (grunt.file.expand({
                filter: 'isFile'
            }, chromeDriverPattern).length > 0) {

            var multiProtractor = {};

            paths.getE2eFiles().forEach(function(path) {
                multiProtractor[path] = {
                    options: {
                        keepAlive: process.env.PROTRACTOR_KEEP_ALIVE === 'true',
                        configFile: "jsTests/protractor-conf.js",
                        // configFile: paths.config.protractorConf,
                        args: {
                            chromeDriver: getChromeDriverFolder(),
                            specs: [path]
                        }
                    }
                };
            });
            grunt.config.set('protractor', multiProtractor);
            grunt.task.run('protractor');

        } else {
            grunt.log.warn('protractor grunt phase was not run since no chrome driver found under ' + chromeDriverPattern);
        }
    });

    grunt.registerTask("multiProtractorMax", 'Executes end to end tests for each project via protractor separately', function() {
        //if npmtestancillary is not present, chrome drivers won't be present
        if (grunt.file.expand({
                filter: 'isFile'
            }, chromeDriverPattern).length > 0) {

            var multiProtractor = {};

            paths.getE2eFiles().forEach(function(path) {
                multiProtractor[path] = {
                    options: {
                        keepAlive: process.env.PROTRACTOR_KEEP_ALIVE === 'true',
                        configFile: "jsTests/protractor-conf.js",
                        args: {
                            chromeDriver: getChromeDriverFolder(),
                            specs: [path],
                            capabilities: {
                                shardTestFiles: true,
                                maxInstances: process.env.PROTRACTOR_CHROME_INSTANCES || 5
                            }
                        }
                    }
                };
            });

            grunt.config.set('protractor', multiProtractor);
            grunt.task.run('protractor');

        } else {
            grunt.log.warn('protractor grunt phase was not run since no chrome driver found under ' + chromeDriverPattern);
        }

    });

    grunt.registerTask('e2e_repeat', 'Execute the e2e test(s) x amount of times', function(times) {
        var repeat = (times) ? times : 1;

        grunt.task.run('connect:test');
        for (var i = 0; i < repeat; i++) {
            grunt.task.run('multiProtractorMax');
        }
    });

    // Helper Functions
    function endsWith(inputStr, suffix) {
        return inputStr.match(suffix + "$");
    }

    grunt.registerTask('sanitize', ['jssemicoloned', 'jsbeautifier']);

    grunt.registerTask('compile_only', ['jshint', 'jsbeautifier', 'multipleCopySources', 'multipleNGTemplates', 'ngAnnotate:run', 'checkNoForbiddenNameSpaces', 'check_i18n_keys_compliancy', 'checkNoFocus']);
    grunt.registerTask('compile', ['clean', 'compile_only']);

    grunt.registerTask('test_only', ['multiKarma']);
    grunt.registerTask('test', ['compile', 'test_only']);

    grunt.registerTask('concatAndPush', ['multipleConcat', 'requirePushExtensions']);

    grunt.registerTask('dev_only', ['concatAndPush', 'copyDev']);
    grunt.registerTask('dev', ['test', 'dev_only']);

    grunt.registerTask('package_only', ['concatAndPush', 'uglify:dist', 'ngdocs']);
    grunt.registerTask('package', ['test', 'package_only']);

    grunt.registerTask('packageSkipTests', ['compile_only', 'package_only']);

    grunt.registerTask('e2e', ['connect:test', 'multiProtractor']); //any change to the e2e should be adapted to e2e_max task
    grunt.registerTask('e2e_max', ['connect:test', 'multiProtractorMax']);
    grunt.registerTask('verify_only', ['e2e']);
    grunt.registerTask('verify', ['package', 'verify_only']); //any change to the verify tash should be adapted to verify_max task
    grunt.registerTask('verify_max', ['package', 'e2e_max']);

};
