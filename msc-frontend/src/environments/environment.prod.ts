const env = window["env"] || {
  apiUrl: `http://${window.location.hostname}/api`,
};
export const environment = {
  production: true,
  version: require('../../package.json').version,
  apiUrl: `${ env.apiUrl }`,
};
