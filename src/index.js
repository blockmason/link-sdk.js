const toQueryString = (inputs = {}) => {
  const pairs = [];
  const keys = Object.keys(inputs);

  for (const key of keys) {
    const { [key]: value } = inputs;
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  if (pairs.length > 0) {
    return `?${pairs.join('&')}`;
  }

  return '';
};

const link = (options = {}, dependencies = {}) => {
  const {
    baseUrl = 'https://api.block.mason.link',
    clientId,
    clientSecret
  } = options;

  const proxy = {
    // eslint-disable-next-line no-undef
    fetch: dependencies.fetch || typeof fetch !== 'undefined' && fetch
  };

  if (!clientId || !clientSecret) {
    throw new Error('Missing options.clientId or options.clientSecret');
  }

  const credential = {};

  const authenticate = async () => {
    /* eslint-disable camelcase */
    if (credential.accessToken) {
      return Promise.resolve(credential.accessToken);
    }

    const response = await proxy.fetch(`${baseUrl}/oauth2/token`, {
      body: JSON.stringify(credential.refreshToken ? {
        grant_type: 'refresh_token',
        refresh_token: credential.refreshToken
      } : {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    });

    const { access_token, errors, refresh_token } = await response.json();

    if (errors && errors.length > 0) {
      throw new Error(errors.map((error) => error.detail).join(' '));
    }

    Object.assign(credential, {
      accessToken: access_token,
      refreshToken: refresh_token
    });

    return credential.accessToken;
    /* eslint-enable camelcase */
  };

  const authenticated = async (path, fetchOptions = {}) => {
    const accessToken = await authenticate();
    const response = await proxy.fetch(`${baseUrl}/v1${path}`, {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${accessToken}`
      },
      method: fetchOptions.method || 'GET'
    });
    const outputs = await response.json();
    return outputs;
  };

  return {
    get: (path = '/', inputs = {}) => authenticated(`${path}${toQueryString(inputs)}`),

    post: (path = '/', inputs = {}) => authenticated(path, {
      body: JSON.stringify(inputs),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
  };
};

export { link };

export default link;
