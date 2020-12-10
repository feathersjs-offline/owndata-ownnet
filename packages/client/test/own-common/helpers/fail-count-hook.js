const errors = require('@feathersjs/errors');

/**
 * This sets up a before hook for a given method in a given service. The hook
 * will be triggered `count` times (defaults to 1). After `count` activations
 * the hook becomes "transparent" (x=>x).
 *
 * @param {string} type Typically 'Remote' or 'Client'
 * @param {string} serviceName Path of the service to be hooked into
 * @param {string} service The service to be hooked into
 * @param {string} method method to fail install hook for
 * @param {number} count (optional, default 1) number of times to fail
 * @param {feathersError} error (defaults to GeneralError)
 * @param {string} errText text for error message
 */
function failCountHook (type, serviceName, service, method, count = 1, error = errors.GeneralError, errText = 'Fail requested by user request - simulated general error') {
  let triggered = count;

  service.hooks({
    before: {
      [method]: [async context => {
        if (triggered > 0) {
          // console.log(`failCountHook(${serviceName})[${method}]: cnt=${triggered}`)
          triggered--;
          throw new error(errText);
        }
        return context;
      }
      ]
    }
  });
}

module.exports = failCountHook;
