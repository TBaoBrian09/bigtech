type Env = {
  [env: string]: string;
};

const url: Env = {
  dev: 'https://x9e1raqj6b.execute-api.ap-southeast-1.amazonaws.com/dev/api/v1.1',
  prod: 'https://9fbi9ff2xk.execute-api.ap-southeast-1.amazonaws.com/prod/api/v1.1',
};

const shortURL: Env = {
  dev: 'https://x9e1raqj6b.execute-api.ap-southeast-1.amazonaws.com/dev',
  prod: 'https://9fbi9ff2xk.execute-api.ap-southeast-1.amazonaws.com/prod',
};

const webview: Env = {
  dev: 'https://migrate-bsc.netlify.app',
  prod: 'https://migrate-bsc.netlify.app',
};

export const version: Env = {
  dev: '1.0.3.2 Dev',
  prod: '1.0.3.6',
};

const env = {
  dev: 'dev',
  prod: 'prod',
};

export const buildEnv = env.prod;

export const baseUrl = url[buildEnv];
export const shortUrl = shortURL[buildEnv];
export const codePushVersion = version[buildEnv];
export const webviewUrl = webview[buildEnv];
