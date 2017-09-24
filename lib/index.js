createProcessor.$inject = ['args', 'config.jawrPreprocessor', 'logger', 'helper'];

/**
 * @param {Object} args - Config object of custom preprocessor
 * @param {Object} config - Config object of jawrPreprocessor
 * @param {Object} logger - Karma's logger
 * @param {Object} helper - Karma's helper functions
 * */
function createProcessor(args, config, logger, helper) {
  var log = logger.create('preprocessor.jawr');
  var jawrConfig = config || {};

  function preprocess(content, file, done) {
    log.info('Loading JAWR Config:', jawrConfig);
    log.info('Processing "%s".', file.originalPath);
    try {
      var jawrLoader = jawrConfig['jawrLoader'];
      if (jawrLoader === undefined) {
        log.error('Please provide jawrLoader in karmaConfig.jawrPreprocessor ');
        done(null, content);
      }

      var wrappedContent = injectJawrVariables(jawrLoader, content);
      done(null, wrappedContent);
    }
    catch (error) {
      log.error('%s\n at %s', error.message, file.originalPath);
      done(error, null);
    }
  }

  return preprocess;
}

function injectJawrVariables(jawrLoader, content) {
  var injectString = 'jawrLoader = ' + jawrLoader.toString() + ';\n';
  return injectString + content;
}

module.exports = {
  'processor:jawr': [
    'factory',
    createProcessor
  ]
};
