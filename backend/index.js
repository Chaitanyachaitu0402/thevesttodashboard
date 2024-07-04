const cors_proxy = require('cors-anywhere');

// Define the host and port where the CORS proxy server will run
const host = '0.0.0.0';
const port = process.env.PORT || 8080;

// Create and start the CORS proxy server
cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, () => {
  console.log(`Running CORS Anywhere on ${host}:${port}`);
});
