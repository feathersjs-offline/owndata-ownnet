import errors from '@feathersjs/errors';

/**
 * This sets up a before (and error) hook for all functions for a given service. The hook
 * can simulate e.g. backend failure, network connection troubles, or timeout by supplying
 * ```{query: {_fail:true}}``` to the call options.
 * If `_fail` is false or the query is not supplied all this hook is bypassed.
 *
 * @param {string} type Typically 'Remote' or 'Client'
 * @param {string} service The service to be hooked into
 * @param {boolean} allowFail Will we allow the usage of _fail? (Default false)
 */
function setUpHooks (type, serviceName, service, allowFail = false, verbose = false) {

  service.hooks({
    before: {
      all: [async context => {
        if (verbose) {
          const data = context.data ? `\n\tdata\t${JSON.stringify(context.data)}` : '';
          const params = context.params ? `\n\tparams\t${JSON.stringify(context.params)}` : '';
          console.log(`Before.all.hook ${type}.${context.method} called${data}${params}\n\tallowFail = ${allowFail}`);
        }
        if (context.params.query) {
          if (allowFail) {
            if (context.params.query._fail) { // Passing in param _fail simulates errors
              throw new errors.Timeout('Fail requested by user request - simulated timeout/missing connection');
            }
            if (context.params.query._badFail) { // Passing in param _badFail simulates other error than timeout
              throw new errors.GeneralError('Fail requested by user request - simulated general error');
            }
          }
          // In case _fail/_badFail was supplied but not true and allowed - remove it before continuing
          let newQuery = Object.assign({}, context.params.query);
          delete newQuery._fail;
          delete newQuery._badFail;
          context.params.query = newQuery;
          return context;
        }
      }
      ]
    }
  });
}

module.exports = setUpHooks;
