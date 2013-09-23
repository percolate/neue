module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-contrib-uglify')

    grunt.initConfig({
        browserify: {
            dist: {
                options: {
                    standalone: 'neue'
                },
                src: './lib/index.js',
                dest: './dist/neue.js'
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            dist: {
                files: {
                    './dist/neue.min.js': './dist/neue.js'
                }
            }
        }
    })

    grunt.registerTask('dist', [
        'browserify:dist',
        'uglify:dist'
    ])

};
