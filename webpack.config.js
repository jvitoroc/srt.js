const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let filename = 'srt';

module.exports = env => {
    let plugins = [];
    if (env === 'prod') {
        plugins.push(new UglifyJsPlugin());
        filename += '.min.js'
    } else {
        filename += '.js'
    }

    return {
        entry: './src/srt.js',
        plugins: plugins,
        output: {
            path: path.resolve(__dirname, "build"),
            filename: filename,
            library: 'srtJs',
            libraryTarget: 'umd',
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }]
        }
    }
}