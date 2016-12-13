var webpack = require('webpack'),
    path = require('path'),
    autoprefixer = require('autoprefixer'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    OpenBrowserPlugin = require('open-browser-webpack-plugin')

module.exports = {
    entry: {
        js: './src/index.js'
    },
    output: {
        path: path.join(__dirname, 'dist/example'),
        filename: 'Espa.js',
        library: 'Espa',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: 'style!css!postcss!less'
            },
            {
                test: /\.png/,
                exclude: /node_modules/,
                loader: 'file'
            }
        ]
    },
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/example/index.html')
        }),
        new OpenBrowserPlugin({url: 'http://localhost:8080'})
    ],
    devServer: {
        hot: true,
        contentBase: path.join(__dirname, 'dist')
    }
}



  
  



