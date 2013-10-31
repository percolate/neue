var BANNER = '/*\n    <%= pkg.name %> - v<%= pkg.version %>\n    (c) 2013 Percolate Industries, Inc. http://percolate.com\n*/\n'

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-mocha')

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                options: {
                    standalone: 'neue'
                },
                src: './lib/index.js',
                dest: './dist/neue.js'
            },
            test: {
                options: {
                    debug: true
                },
                src: './test/index.js',
                dest: './test/runner/index.js'
            }
        },
        jshint: {
            options: {
                eqeqeq: true,
                immed: true,
                latedef: 'nofunc',
                newcap: true,
                quotmark: 'single',
                trailing: true,
                unused: true,
                asi: true,
                boss: true,
                expr: true,
                laxbreak: true,
                laxcomma: true,
                scripturl: true,
                sub: true,
                loopfunc: true
            },
            all: ['./lib/**/*.js']
        },
        mocha: {
            test: {
                options: {
                    run: true,
                    reporter: 'Spec',
                    log: true
                },
                src: './test/runner/index.html'
            }
        },
        uglify: {
            options: {
                banner: BANNER
            },
            prod: {
                options: {
                    mangle: true
                },
                files: {
                    './dist/neue.min.js': './dist/neue.js'
                }
            },
            dev: {
                options: {
                    mangle: false,
                    beautify: true,
                    compress: false
                },
                files: {
                    './dist/neue.js': './dist/neue.js'
                }
            }
        }
    })

    grunt.registerTask('test', [
        'jshint:all',
        'browserify:test',
        'mocha:test'
    ])

    grunt.registerTask('dist', [
        'test',
        'browserify:dist',
        'uglify:prod',
        'uglify:dev'
    ])

};
