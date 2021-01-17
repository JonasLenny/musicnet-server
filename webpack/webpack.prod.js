'use strict'

/*****************************************************************************/
// require area

const path = require('path')
const webpack = require('webpack')
const resolve = require('path').resolve

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require("webpack-merge")

// NOTE: EPERM error on windows (if not running the prompt in admin mode)
// const CleanWebpackPlugin = require('clean-webpack-plugin')

const rootDir = resolve(__dirname, '../')
const projectConfigPath = `${rootDir}/config.json`

const webpackConfig = require('./webpack.common.js')
const projectConfig = require(projectConfigPath)
const packageJSON = require(rootDir + '/package.json')


/*****************************************************************************/
// variables area

function appendProdSettings(env) {
    const development = projectConfig.development
    const version = packageJSON.version

    const buildPath = development.prod.buildTarget

    // the name for the bundled file with the .js ending
    // IDEA: remove the 'hardcoded' assets path
    const outputName = `${projectConfig.project.bundleName}-${version}.js`
    const configOutput = `${rootDir}/${buildPath}`

    // the path to the assets folder within the 'src'
    const assetsFolder = `${rootDir}/src/assets`
    const assetsOutput = `${rootDir}/${buildPath}/assets`

    let prodSettings = {
        output: {
            filename: outputName,
            path: `${rootDir}/${buildPath}`
        },
        plugins: [
            // new CleanWebpackPlugin([outputPath]),
            new HtmlWebpackPlugin({
                title: projectConfig.project.title,
                template: `${rootDir}/src/old/www/index.template.html`
            }),
            new webpack.NamedModulesPlugin(),
            new CopyWebpackPlugin([

                // 1. copy assets
                // {
                //     from : 'src/assets',
                //     to   : `${path.resolve(__dirname, rootBuild)}/assets`
                // }

                // 2. copy the config file
                {
                    from: projectConfigPath,
                    to: configOutput
                }
            ]),
            new UglifyJSPlugin({
                sourceMap: true
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            })
        ]
    }

    return prodSettings
}

function mergeSettings(env) {
    let prodSettings = appendProdSettings(env)

    console.log('')
    console.log('prodSettings')
    console.log(prodSettings)
    console.log()

    return merge(webpackConfig, prodSettings)
}

module.exports = mergeSettings
