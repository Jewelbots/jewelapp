module.exports = {
  bump: {
    options: {
      files: ['package.json', 'bower.json', 'config.xml'],
      updateConfigs: [],
      commit: true,
      commitMessage: 'Release %VERSION%',
      commitFiles: ['package.json', 'bower.json', 'config.xml'],
      createTag: true,
      tagName: '%VERSION%',
      tagMessage: 'Version %VERSION%',
      push: false,
      pushTo: 'upstream',
      gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
    }
  },
  // Project settings
  yeoman: {
    // configurable paths
    app: 'app',
    scripts: 'scripts',
    styles: 'styles',
    images: 'images',
    test: 'test',
    dist: 'www'
  },

  // Environment Variables for Angular App
  // This creates an Angular Module that can be injected via ENV
  // Add any desired constants to the ENV objects below.
  // https://github.com/diegonetto/generator-ionic/blob/master/docs/FAQ.md#how-do-i-add-constants
  ngconstant: {
    options: {
      space: '  ',
      wrap: '"use strict";\n\n {%= __ngModule %}',
      name: 'config',
      dest: '<%= yeoman.app %>/<%= yeoman.scripts %>/configuration.js'
    },
    development: {
      constants: {
        ENV: {
          name: 'development',
          apiEndpoint: 'http://dev.yoursite.com:10000/'
        }
      }
    },
    production: {
      constants: {
        ENV: {
          name: 'production',
          apiEndpoint: 'http://api.yoursite.com/'
        }
      }
    }
  },

  // Watches files for changes and runs tasks based on the changed files
  watch: {
    bower: {
      files: ['bower.json'],
      tasks: ['wiredep', 'newer:copy:app']
    },
    html: {
      files: ['<%= yeoman.app %>/**/*.html'],
      tasks: ['newer:copy:app']
    },
    js: {
      files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'],
      tasks: ['newer:copy:app', 'newer:jshint:all']
    },
    compass: {
      files: ['<%= yeoman.app %>/<%= yeoman.styles %>/**/*.{scss,sass}'],
      tasks: ['compass:server', 'autoprefixer', 'newer:copy:tmp']
    },
    gruntfile: {
      files: ['Gruntfile.js'],
      tasks: ['ngconstant:development', 'newer:copy:app']
    }
  },

  // The actual grunt server settings
  connect: {
    options: {
      port: 9000,
      // Change this to '0.0.0.0' to access the server from outside.
      hostname: 'localhost'
    },
    dist: {
      options: {
        base: '<%= yeoman.dist %>'
      }
    },
    coverage: {
      options: {
        port: 9002,
        open: true,
        base: ['coverage']
      }
    }
  },

  // Make sure code styles are up to par and there are no obvious mistakes
  jshint: {
    options: {
      jshintrc: '.jshintrc',
      reporter: require('jshint-stylish')
    },
    all: [
      'Gruntfile.js',
      '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js',
      '!<%= yeoman.app %>/<%= yeoman.scripts %>/utils/**/*.js'
    ],
    test: {
      options: {
        jshintrc: 'test/.jshintrc'
      },
      src: ['test/unit/**/*.js']
    }
  },

  // Empties folders to start fresh
  clean: {
    dist: {
      files: [{
        dot: true,
        src: [
          '.temp',
          '<%= yeoman.dist %>/*',
          '!<%= yeoman.dist %>/.git*'
        ]
      }]
    },
    server: '.temp'
  },

  autoprefixer: {
    options: {
      browsers: ['last 1 version']
    },
    dist: {
      files: [{
        expand: true,
        cwd: '.temp/<%= yeoman.styles %>/',
        src: '{,*/}*.css',
        dest: '.temp/<%= yeoman.styles %>/'
      }]
    }
  },

  // Automatically inject Bower components into the app
  wiredep: {
    app: {
      src: ['<%= yeoman.app %>/index.html'],
      ignorePath:  /\.\.\//
    },
    sass: {
      src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
      ignorePath: /(\.\.\/){1,2}bower_components\//
    }
  },


  // Compiles Sass to CSS and generates necessary files if requested
  compass: {
    options: {
      sassDir: '<%= yeoman.app %>/<%= yeoman.styles %>',
      cssDir: '.temp/<%= yeoman.styles %>',
      generatedImagesDir: '.temp/<%= yeoman.images %>/generated',
      imagesDir: '<%= yeoman.app %>/<%= yeoman.images %>',
      javascriptsDir: '<%= yeoman.app %>/<%= yeoman.scripts %>',
      fontsDir: '<%= yeoman.app %>/<%= yeoman.styles %>/fonts',
      importPath: '<%= yeoman.app %>/bower_components',
      httpImagesPath: '/<%= yeoman.images %>',
      httpGeneratedImagesPath: '/<%= yeoman.images %>/generated',
      httpFontsPath: '/<%= yeoman.styles %>/fonts',
      relativeAssets: false,
      assetCacheBuster: false,
      raw: 'Sass::Script::Number.precision = 10\n'
    },
    dist: {
      options: {
        generatedImagesDir: '<%= yeoman.dist %>/<%= yeoman.images %>/generated'
      }
    },
    server: {
      options: {
        debugInfo: true
      }
    }
  },


  // Reads HTML for usemin blocks to enable smart builds that automatically
  // concat, minify and revision files. Creates configurations in memory so
  // additional tasks can operate on them
  useminPrepare: {
    html: '<%= yeoman.app %>/index.html',
    options: {
      dest: '<%= yeoman.dist %>',
      staging: '.temp',
      flow: {
        html: {
          steps: {
            js: ['concat', 'uglifyjs'],
            css: ['cssmin']
          },
          post: {}
        }
      }
    }
  },

  // Performs rewrites based on the useminPrepare configuration
  usemin: {
    html: ['<%= yeoman.dist %>/**/*.html'],
    css: ['<%= yeoman.dist %>/<%= yeoman.styles %>/**/*.css'],
    options: {
      assetsDirs: ['<%= yeoman.dist %>']
    }
  },

  // The following *-min tasks produce minified files in the dist folder
  cssmin: {
    options: {
      //root: '<%= yeoman.app %>',
      noRebase: true
    }
  },
  htmlmin: {
    dist: {
      options: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeCommentsFromCDATA: true,
        removeOptionalTags: true
      },
      files: [{
        expand: true,
        cwd: '<%= yeoman.dist %>',
        src: ['*.html', 'templates/**/*.html'],
        dest: '<%= yeoman.dist %>'
      }]
    }
  },

  // Copies remaining files to places other tasks can use
  copy: {
    dist: {
      files: [{
        expand: true,
        dot: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>',
        src: [
          '<%= yeoman.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '*.html',
          'templates/**/*.html',
          'fonts/*'
        ]
      }, {
        expand: true,
        cwd: '.temp/<%= yeoman.images %>',
        dest: '<%= yeoman.dist %>/<%= yeoman.images %>',
        src: ['generated/*']
      }]
    },
    styles: {
      expand: true,
      cwd: '<%= yeoman.app %>/<%= yeoman.styles %>',
      dest: '.temp/<%= yeoman.styles %>/',
      src: '{,*/}*.css'
    },
    fonts: {
      expand: true,
      cwd: 'app/bower_components/ionic/release/fonts/',
      dest: '<%= yeoman.app %>/fonts/',
      src: '*'
    },
    vendor: {
      expand: true,
      cwd: '<%= yeoman.app %>/vendor',
      dest: '.temp/<%= yeoman.styles %>/',
      src: '{,*/}*.css'
    },
    app: {
      expand: true,
      cwd: '<%= yeoman.app %>',
      dest: '<%= yeoman.dist %>/',
      src: [
        '**/*',
        '!**/*.(scss,sass,css)',
      ]
    },
    tmp: {
      expand: true,
      cwd: '.temp',
      dest: '<%= yeoman.dist %>/',
      src: '**/*'
    }
  },

  concurrent: {
    ionic: {
      tasks: [],
      options: {
        logConcurrentOutput: true
      }
    },
    server: [
      'compass:server',
      'copy:styles',
      'copy:vendor',
      'copy:fonts'
    ],
    test: [
      'compass',
      'copy:styles',
      'copy:vendor',
      'copy:fonts'
    ],
    dist: [
      'compass:dist',
      'copy:styles',
      'copy:vendor',
      'copy:fonts'
    ]
  },

  // By default, your `index.html`'s <!-- Usemin block --> will take care of
  // minification. These next options are pre-configured if you do not wish
  // to use the Usemin blocks.
  // cssmin: {
  //   dist: {
  //     files: {
  //       '<%= yeoman.dist %>/<%= yeoman.styles %>/main.css': [
  //         '.temp/<%= yeoman.styles %>/**/*.css',
  //         '<%= yeoman.app %>/<%= yeoman.styles %>/**/*.css'
  //       ]
  //     }
  //   }
  // },
  // uglify: {
  //   dist: {
  //     files: {
  //       '<%= yeoman.dist %>/<%= yeoman.scripts %>/scripts.js': [
  //         '<%= yeoman.dist %>/<%= yeoman.scripts %>/scripts.js'
  //       ]
  //     }
  //   }
  // },
  // concat: {
  //   dist: {}
  // },

  // Test settings
  // These will override any config options in karma.conf.js if you create it.
  karma: {
    options: {
      basePath: '',
      frameworks: ['jasmine'],
      files: [
        '<%= yeoman.app %>/bower_components/angular/angular.js',
        '<%= yeoman.app %>/bower_components/angular-mocks/angular-mocks.js',
        '<%= yeoman.app %>/bower_components/angular-animate/angular-animate.js',
        '<%= yeoman.app %>/bower_components/angular-sanitize/angular-sanitize.js',
        '<%= yeoman.app %>/bower_components/angular-ui-router/release/angular-ui-router.js',
        '<%= yeoman.app %>/bower_components/ionic/release/js/ionic.js',
        '<%= yeoman.app %>/bower_components/ionic/release/js/ionic-angular.js',
        '<%= yeoman.app %>/bower_components/ngCordova/dist/ng-cordova.js',
        '<%= yeoman.app %>/bower_components/ngCordova/dist/ng-cordova-mocks.js',
        '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js',
        '<%= yeoman.test %>/mock/**/*.js',
        '<%= yeoman.test %>/spec/**/*.js',
        '<%= yeoman.test %>/unit/**/*.js',
      ],
      autoWatch: false,
      reporters: ['dots', 'coverage'],
      port: 8080,
      singleRun: false,
      preprocessors: {
        // Update this if you change the yeoman config path
        '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js': ['coverage']
      },
      coverageReporter: {
        reporters: [
          { type: 'html', dir: 'coverage/' },
          { type: 'text-summary' }
        ]
      }
    },
    unit: {
      // Change this to 'Chrome', 'Firefox', etc. Note that you will need
      // to install a karma launcher plugin for browsers other than Chrome.
      browsers: ['PhantomJS'],
      background: true
    },
    continuous: {
      browsers: ['PhantomJS'],
      singleRun: true,
    }
  },

  // ngAnnotate tries to make the code safe for minification automatically by
  // using the Angular long form for dependency injection.
  ngAnnotate: {
    dist: {
      files: [{
        expand: true,
        cwd: '.temp/concat/<%= yeoman.scripts %>',
        src: '*.js',
        dest: '.temp/concat/<%= yeoman.scripts %>'
      }]
    }
  }
}
