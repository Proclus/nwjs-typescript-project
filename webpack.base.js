/* eslint @typescript-eslint/no-var-requires: "off" */

const path = require('path');
const webpack = require('webpack');
// Plugins
// https://github.com/jantimon/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Custom template parameters to be used in data/index.ejs template via "app" namespace.
const customTemplateParameters = () => {
    return {
        info: 'nwjs-typescript-project loaded.',
    }
}

module.exports = {
    entry: './src/main.ts',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'NW.js TypeScript Project',
            template: "./data/index.ejs",
            templateParameters: (compilation, assets, assetTags, options) => {
                const app = customTemplateParameters();
                return {
                    compilation,
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                      tags: assetTags,
                      files: assets,
                      options
                    },
                    app
                };
            },
        }),

        // https://github.com/TypeStrong/ts-loader#usage-with-webpack-watch
        new webpack.WatchIgnorePlugin({
            paths:[
                /\.js$/,
                /\.d\.ts$/,
                path.resolve(__dirname, './node_modules/')
            ]})
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.node$/,
                loader: "nwp-node-loader",
            },
        ],
    },
    resolve: {
        modules: ['node_modules','extras/modules'],
        extensions: ['.tsx', '.ts', 'json', '.wasm'],
        alias: {
            "nwp-gateway.node": "./addons/build/Release/nwp_gateway.node",
        },

        fallback: {
            path: false,
            fs: false
        }
    },
    resolveLoader: {
        alias: {
            'nwp-node-loader': path.resolve(__dirname, 'extras/loaders/nwp-node-loader.js'),
        }
    }
};
