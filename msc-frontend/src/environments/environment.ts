const env = window["env"] || {
  apiUrl: `http://${window.location.hostname}:5010`,
};
export const environment = {
  production: false,
  version: require('../../package.json').version,
  apiUrl: `${ env.apiUrl }`,
};
