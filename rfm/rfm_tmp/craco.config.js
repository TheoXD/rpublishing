const path = require('path');

module.exports = {
  eslint: {
    configure: {
      rules: {
        "no-unused-vars": "off"
      }
    }
  },
  plugins: [
    {
      plugin: require('craco-plugin-scoped-css'),
    },
  ],
  /*
    eslint: {
      mode: ESLINT_MODES.extends,
      configure: () => {
        return require('./.eslintrc')
      }
    },
    */
  webpack: {
    rules: [
      //...
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
