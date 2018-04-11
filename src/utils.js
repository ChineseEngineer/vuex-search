import CancellablePromise from 'bluebird';

/**
 * Adds '/'
 *
 * @param {string} namespace
 */
export function normalizeNamespaceName(namespace) {
  if (namespace === '') return '';
  return namespace.slice(-1) === '/' ? namespace : namespace.concat('/');
}

/**
 * With assumption Vuex Search module starts from root.
 *
 * @param {string | [string]} modulePath
 */
export function modulePathToNamespace(modulePath) {
  if (Array.isArray(modulePath)) {
    return modulePath.join('/').concat('/');
  } else if (typeof modulePath === 'string') {
    return normalizeNamespaceName(modulePath);
  }
  return JSON.stringify(modulePath);
}

/**
 * Transform getters to avoid currying complication in api.
 *
 * @param {string} resourceName
 * @param {(resourceName: string, store: Store) => State)} resourceGetter
 */
export function resourceGetterWrapper(resourceName, resourceGetter) {
  return store => resourceGetter(resourceName, store);
}

/**
 * Basic Promise does not support promise cancellation.
 * This function wraps the basic promise and returns cancellable one.
 *
 * @param {Promise} promise
 */
export function cancellablePromiseWrapper(promise) {
  CancellablePromise.config({ cancellation: true });

  return new CancellablePromise((resolve, reject) => {
    promise
      .then(resolve)
      .catch(reject);
  });
}