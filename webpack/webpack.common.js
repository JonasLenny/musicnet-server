'use strict'

/*****************************************************************************/
// require area
const path = require('path')
const resolve = require('path').resolve
const root = resolve(__dirname, '../')
const config = require(root + '/config.json')

/*****************************************************************************/
// variables area
const mainFile = config.project.mainFile
const imagesOutput = '/assets/images/'
const fontsOutput = '/assets/fonts/'

let settings = {
    entry: {
        main: [
            `${root}/${mainFile}`
        ]
    },
    module: {
        rules: [
            // loads the js files and transpiles them
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader?name=/assets/js/[name].[ext]',
                query: {
                    presets: ['env', 'react'],
                    cacheDirectory: true,
                },
            },

            // allows you to import css files
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },

            // allows you to import image files
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader?name=[name].[ext]',
                    options: { outputPath: imagesOutput }
                }]
            },

            // allows you to import fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader?name=[name].[ext]',
                    options: { outputPath: fontsOutput }
                }]
            }
        ]
    }
}

module.exports = settings
