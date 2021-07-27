const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  messages:
  	"Veuillez réessayer dans 10 min !"
});

module.exports = limiter;