module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    var app = {
        apps: [
            'iamapp',
        ],
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: app,
        srcDir: '<%= pkg.name %>',
        destDir: 'build',
        tempDir: 'tmp',
        copy: {
            // Copy static/css/ to temp dir for further operation by usemin
            temp: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= srcDir %>',
                        src: [
                            'static/css/**',
                        ],
                        dest: '<%= tempDir %>'
                    }
                ]
            },
            // Copy dirs and files no need for transformation directly to build
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= srcDir %>',
                        src: [
                            'static/image/**',
                            'template/**'
                        ],
                        dest: '<%= destDir %>'
                    }
                ]
            },
        },
        useminPrepare: {
            html: ['<%= srcDir %>/template/**/*.html'],
            options: {
                root: '<%= tempDir %>',  // root for resolving js and css files to transform
                dest: '<%= destDir %>',
                staging: '<%= tempDir %>'
            }
        },
        usemin: {
            html: '<%= destDir %>/template/{,*/}*.html',
            options: {
                assetsDirs: ['<%= destDir %>']
            }
        },
        requirejs: {
            options: {
                appDir: '<%= srcDir %>/static/js',
                baseUrl: './',
                optimize: 'none',
                mainConfigFile: '<%= srcDir %>/static/js/require-config.js',
            },
            build: {
                options: {
                    dir: '<%= tempDir %>/static/js',
                    modules: [
                        {
                            name: 'iamapp/main'
                        }
                    ]
                }
            },
        },
        uglify: {
            options: {
                preserveComments: 'some',
                banner: '/*! Build by grunt in <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }
        },
        // cssmin: {
        //     build: {
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: '<%= srcDir %>',
        //                 src: ['static/css/**/*.css'],
        //                 dest: '<%= destDir %>'
        //             }
        //         ]
        //     }
        // },
        filerev: {
            options: {
              encoding: 'utf8',
              algorithm: 'md5',
              length: 8,
            },
            build: {
                src: [
                    '<%= destDir %>/**/*.js',
                    '<%= destDir %>/**/*.css',
                ]
            }
        },
        shell: {
            clean: {
                command: 'rm -rf <%= destDir %> <%= tempDir %>'
            },
            show_built: {
                command: 'tree <%= destDir %> -h'
            }
        }
    });

    grunt.registerTask('clean', ['shell:clean']);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'useminPrepare',
        'requirejs',
        'concat',  // Called by usemin
        'uglify',  // Called by usemin
        'cssmin',  // Called by usemin
        'filerev',
        'usemin',
        'shell:show_built'
    ]);
};

