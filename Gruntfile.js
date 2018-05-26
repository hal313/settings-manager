/* global module:true */

module.exports = function(grunt) {
    'use strict';

    // The build version
    var _buildVersion = grunt.file.readJSON('package.json').version;
    // The build date
    var _buildDate = new Date();
    var _buildUser = '';
    if ('win32' === process.platform) {
        _buildUser = process.env.USERNAME;
    } else if ('linux' === process.platform) {
        _buildUser = process.env.USER;
    }

    // The file which has replacements in JSON format
    var _replacementFilePath = 'replacements.json';
    // The replacements read in from the file
    var _replacements = null;
    // If the file is not present, _replacements will be null
    if (grunt.file.exists(_replacementFilePath) && grunt.file.isFile(_replacementFilePath)) {
        _replacements = grunt.file.readJSON(_replacementFilePath);
    }

    // Change any strings in the content that match ${some string here} to the value specified in replacements.json
    var _resolveFileContent = function(content) {
        var resolvedContent = content;

        // The default resolvers (build user, version and date)
        resolvedContent = resolvedContent.replace(new RegExp('\\${build.user}', 'gi'), _buildUser);
        resolvedContent = resolvedContent.replace(new RegExp('\\${build.version}', 'gi'), _buildVersion);
        resolvedContent = resolvedContent.replace(new RegExp('\\${build.date}', 'gi'), _buildDate);

        // If the replacements file exists, use the key/value pairs from there
        if (_replacements) {
            for (var key in _replacements) {
                resolvedContent = resolvedContent.replace(new RegExp('\\${' + key + '}', 'gi'), _replacements[key]);
            }
        }

        // Return the resolved content
        return resolvedContent;
    };

    grunt.initConfig({
        open: {
            source: {
                path: 'test/source.html'
            },
            dist: {
                path: 'test/dist.html'
            },
            distmin: {
                path: 'test/dist-min.html'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            files: ['src/**/*.*', 'spec/**/*.*', 'test/**/*.*', 'Gruntfile.js']
        },
        uglify: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/SettingsManager.min.js': ['dist/SettingsManager.js']
                }
            }
        },
        jshint: {
            options: {
                reporterOutput: ''
            },
            source: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    src: ['src/SettingsManager.js']
                }
            },
            // Only lint the unmin file
            dist: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    src: ['dist/SettingsManager.js']
                }
            }
        },
        copy: {
            options: {
                process: _resolveFileContent
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: 'dist/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        mocha: {
            options: {
                run: true,
                reporter: 'Spec'
            },
            all: {
                src: ['test/**/*.*']
            },
            source: {
                src: ['test/source.html']
            },
            dist: {
                src: ['test/dist.html']
            },
            distmin: {
                src: ['test/dist-min.html']
            }
        }

    });


    // Load NPM tasks
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Register tasks
    grunt.registerTask('build', ['jshint:source']);
    grunt.registerTask('dist', ['build', 'copy:dist', 'uglify:dist', 'jshint:dist', 'mocha:all']);
    //
    // Test tasks
    //
    // Test the source code
    grunt.registerTask('test-source', ['open:source', 'watch']);
    grunt.registerTask('test', ['test-source']); // Alias for test-source
    // Test the code in dist
    grunt.registerTask('test-dist', ['dist', 'open:dist', 'watch']);
    // Test the minified dist file
    grunt.registerTask('test-dist-min', ['dist', 'open:distmin', 'watch']);
    grunt.registerTask('test-all', ['test-source', 'test-dist', 'test-dist-min']);
    //
    // Headless test tasks
    //
    // Test the source code
    grunt.registerTask('test-headless-source', ['mocha:source']);
    grunt.registerTask('test-headless', ['test-headless-source']);
    // Test the code in dist
    grunt.registerTask('test-headless-dist', ['dist', 'mocha:dist']);
    // Test the minified dist file
    grunt.registerTask('test-headless-dist-min', ['dist', 'mocha:distmin']);
    // Test all the code (source and dist)
    grunt.registerTask('test-headless-all', ['dist', 'mocha:all']);

    // Default task
    grunt.registerTask('default', 'build');
};