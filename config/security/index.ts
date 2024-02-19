const { RATE_LIMIT_TTL, RATE_LIMIT_COUNT } = process.env;

export const securityConfig = {
  rateLimit: {
    ttl: parseInt(RATE_LIMIT_TTL) || 60 * 1000,
    limit: parseInt(RATE_LIMIT_COUNT) || 10,
  },
};
