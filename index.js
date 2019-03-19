const server = require('./server');

// Server just listend for any requests
server.listen(4000, () => {
  console.log('\n*** Server Running on http://localhost:4000 ***\n');
});
