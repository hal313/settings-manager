/* global module:true */

module.exports = function(grunt) {
    'use strict';

    // The build version
    var _buildVersion = grunt.file.readJSON('package.json').version,
        // The build date
        _buildDate = new Date(),
        _buildUser = (function() {
            if ('win32' === process.platform) {
                return process.env.USERNAME;
            } else if ('linux' === process.platform) {
                return process.env.USER;
            } else {
                return 'unknown';
            }
        })(),
        // The file which has replacements in JSON format
        _replacementFilePath = 'replacements.json',
        // The replacements read in from the file
        _replacements = (function() {
            if (grunt.file.exists(_replacementFilePath) && grunt.file.isFile(_replacementFilePath)) {
                return grunt.file.readJSON(_replacementFilePath);
            }
        }()),
        // If the file is not present, _replacements will be null

        // Change any strings in the content that match ${some string here} to the value specified in replacements.json
        _resolveFileContent = function(content) {
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
            'source': {
                path: 'test/source.html'
            },
            'build': {
                path: 'test/build.html'
            },
            'build-min': {
                path: 'test/build-min.html'
            },
            'dist': {
                path: 'test/dist.html'
            },
            'dist-min': {
                path: 'test/dist-min.html'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            'noop': {
                tasks: [],
                files: []
            },
            'source': {
                tasks: [],
                files: ['src/**/*.*', 'spec/**/*.*', 'test/source.html']
            },
            'build': {
                tasks: [],
                files: ['src/**/*.*', 'spec/**/*.*', 'test/build.html']
            },
            'build-min': {
                tasks: [],
                files: ['src/**/*.*', 'spec/**/*.*', 'test/build-min.html']
            },
            'dist': {
                tasks: [],
                files: ['src/**/*.*', 'spec/**/*.*', 'test/dist.html']
            },
            'dist-min': {
                tasks: [],
                files: ['src/**/*.*', 'spec/**/*.*', 'test/dist-min.html']
            },
            'headless-source': {
                tasks: ['test-headless-source'],
                files: ['src/**/*.*', 'spec/**/*.*', 'test/source.html']
            },
            'headless-build': {
                tasks: ['test-headless-build'],
                files: ['src/**/*.*', 'spec/**/*.*', 'test/build.html']
            },
            'headless-build-min': {
                tasks: ['test-headless-build-min'],
                files: ['src/**/*.*', 'spec/**/*.*', 'test/build-min.html']
            },
            'headless-dist': {
                tasks: ['test-headless-dist'],
                files: ['src/**/*.*', 'spec/**/*.*', 'test/dist.html']
            },
            'headless-dist-min': {
                tasks: ['test-headless-dist-min'],
                files: ['src/**/*.*', 'spec/**/*.*', 'test/dist-min.html']
            }
        },
        uglify: {
            options: {
                sourceMap: true
            },
            build: {
                files: {
                    'build/SettingsManager.min.js': ['build/SettingsManager.js']
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
            build: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    src: ['build/SettingsManager.js']
                }
            }
        },
        copy: {
            options: {
                process: _resolveFileContent
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: 'build/',
                        filter: 'isFile'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
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
            'source': {
                src: ['test/source.html']
            },
            'build': {
                src: ['test/build.html']
            },
            'build-min': {
                src: ['test/build-min.html']
            },
            'dist': {
                src: ['test/dist.html']
            },
            'dist-min': {
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
    //
    // Build the artifacts
    grunt.registerTask('build', ['jshint:source', 'copy:build', 'uglify:build', 'jshint:build']);
    // Build the distributable artifacts
    grunt.registerTask('build-dist', ['build', 'copy:dist']);
    // Build the distributable artifacts and run tests
    grunt.registerTask('dist', ['build-dist', 'mocha:all']);
    //
    // Test tasks
    //
    // Test the source code
    grunt.registerTask('test-source',                   ['open:source']);
    grunt.registerTask('test-source-watch',             ['test-source', 'watch:source']);
    // Test the code in build
    grunt.registerTask('test-build',                    ['build', 'open:build']);
    grunt.registerTask('test-build-watch',              ['test-build', 'watch:build']);
    // Test the minified dist file
    grunt.registerTask('test-build-min',                ['build', 'open:build-min']);
    grunt.registerTask('test-build-min-watch',          ['test-build-min', 'watch:build-min']);
    // Test all build files (including source)
    grunt.registerTask('test-build-all',                ['test-source', 'test-build', 'test-build-min']);
    grunt.registerTask('test-build-all-watch',          ['test-build-all', 'watch:noop']);

    //
    // Test the code in dist
    grunt.registerTask('test-dist',                     ['build-dist', 'open:dist']);
    grunt.registerTask('test-dist-watch',               ['test-dist', 'watch:dist']);
    // Test the minified dist file
    grunt.registerTask('test-dist-min',                 ['build-dist', 'open:dist-min']);
    grunt.registerTask('test-dist-min-watch',           ['test-dist-min', 'watch:dist-min']);
    // Test all dist files (including source)
    grunt.registerTask('test-dist-all',                 ['test-source', 'test-dist', 'test-dist-min']);
    grunt.registerTask('test-dist-all-watch',           ['test-dist-all', 'watch:noop']);

    // Headless test tasks
    //
    // Test the source code
    grunt.registerTask('test-headless-source',          ['mocha:source']);
    grunt.registerTask('test-headless-source-watch',    ['test-headless-source', 'watch:headless-source']);
    //
    //
    // Test the build files headless
    grunt.registerTask('test-headless-build',           ['build', 'mocha:build']);
    grunt.registerTask('test-headless-build-watch',     ['test-headless-build', 'watch:headless-build']);
    // Test the build min files headless
    grunt.registerTask('test-headless-build-min',       ['build', 'mocha:build-min']);
    grunt.registerTask('test-headless-build-min-watch', ['test-headless-build-min', 'watch:headless-build-min']);
    // Test all the buildfiles
    grunt.registerTask('test-headless-build-all',       ['test-headless-source', 'test-headless-build', 'test-headless-build-min']);
    //
    //
    // Test the code in dist
    grunt.registerTask('test-headless-dist',            ['build-dist', 'mocha:dist']);
    grunt.registerTask('test-headless-dist-watch',      ['test-headless-dist', 'watch:headless-dist']);
    // Test the minified dist file
    grunt.registerTask('test-headless-dist-min',        ['build-dist', 'mocha:dist-min']);
    grunt.registerTask('test-headless-dist-min-watch',  ['test-headless-dist-min', 'watch:headless-dist-min']);
    // Test all the code (source and dist)
    grunt.registerTask('test-headless-dist-all',        ['build-dist', 'mocha:source', 'mocha:dist', 'mocha:dist-min']);
    //
    //
    // Test the dist (source, dist, dist-min, with NO BUILD) (useful for CI jobs)
    grunt.registerTask('test-dist-headless-nobuild',    ['mocha:source', 'mocha:dist', 'mocha:dist-min']);

    // Default task
    grunt.registerTask('default', 'build');
};