/* eslint @typescript-eslint/no-var-requires: "off" */

const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map'
});
