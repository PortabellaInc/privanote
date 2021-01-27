module.exports = {
  webpack: function (config) {
    config.module.rules.push({ test: /\.md$/, use: 'raw-loader' });
    config.module.rules.push({ test: /\.yml$/, use: 'raw-loader' });
    return config;
  },
  env: {
    IS_EXTENSION: process.env.IS_EXTENSION,
  },
};
