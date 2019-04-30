/* global module:true */

module.exports = function(grunt) {
    'use strict';

    // Change any strings in the content that match ${some string here} to the value specified in replacements.json
    var BUILD_DIR = 'build',
        DIST_DIR = 'dist',
        STAGE_DIR = BUILD_DIR + '/' + DIST_DIR,
        resolveFileContent = function(content) {
            var resolvedContent = content,
                // The build version
                buildVersion = grunt.file.readJSON('package.json').version,
                // The build date
                buildDate = new Date(),
                buildUser = (function() {
                    if ('win32' === process.platform) {
                        return process.env.USERNAME;
                    } else if ('linux' === process.platform) {
                        return process.env.USER;
                    } else {
                        return 'unknown';
                    }
                })(),
                // The file which has replacements in JSON format
                replacementFilePath = 'replacements.json',
                // The replacements read in from the file
                replacements = (function() {
                    // If the file is not present, _replacements will be null
                    if (grunt.file.exists(replacementFilePath) && grunt.file.isFile(replacementFilePath)) {
                        return grunt.file.readJSON(replacementFilePath);
                    }
                }());

            // The default resolvers (build user, version and date)
            resolvedContent = resolvedContent.replace(new RegExp('\\${build.user}', 'gi'), buildUser);
            resolvedContent = resolvedContent.replace(new RegExp('\\${build.version}', 'gi'), buildVersion);
            resolvedContent = resolvedContent.replace(new RegExp('\\${build.date}', 'gi'), buildDate);

            // If the replacements file exists, use the key/value pairs from there
            if (replacements) {
                for (var key in replacements) {
                    resolvedContent = resolvedContent.replace(new RegExp('\\${' + key + '}', 'gi'), replacements[key]);
                }
            }

            // Return the resolved content
            return resolvedContent;
        };

    grunt.initConfig({

        watch: {
            build: {
                files: ['src/**/*.js', 'test/**/*.js'],
                tasks: ['build']
            }
        },
        uglify: {
            options: {
                sourceMap: true
            },
            build: {
                files: {
                    [STAGE_DIR + '/SettingsManager.min.js']: [STAGE_DIR + '/SettingsManager.js']
                }
            }
        },
        jshint: {
            options: {
                reporterOutput: ''
            },
            source: {
                options: {
                    reporter: require('jshint-stylish'),
                    jshintrc: true
                },
                all: ['Gruntfile.js', 'src/*.js', 'test/**/*.js']
            }
        },
        copy: {
            options: {
                process: resolveFileContent
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: STAGE_DIR,
                        filter: 'isFile'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: STAGE_DIR,
                        src: ['**/*.js'],
                        dest: DIST_DIR,
                        filter: 'isFile'
                    }
                ]
            }
        }
    });


    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Register tasks
    //
    // Build the artifacts
    grunt.registerTask('build', ['jshint', 'copy:build', 'uglify:build']);
    grunt.registerTask('build:watch', ['build', 'watch:build']);
    grunt.registerTask('dist', ['build', 'copy:dist']);

    // Default task
    grunt.registerTask('default', 'build');
};