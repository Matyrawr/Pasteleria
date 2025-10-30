// Karma configuration
// Generated on Thu Oct 10 2024 12:34:56 GMT-0500 (Central Daylight Time)

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine'],

    // plugins to load
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-webpack',
      'karma-spec-reporter'
    ],

    // list of files / patterns to load in the browser
    files: [
      'test/**/*.js',
      'test/**/*.jsx'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      'src/**/*.jsx': ['webpack'],
      'test/**/*.jsx': ['webpack']
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset/resource'
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx']
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
