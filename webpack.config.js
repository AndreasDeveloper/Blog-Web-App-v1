const path = require('path'),   // path package, stored in path const var.
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      MiniCssExtractPlugin = require("mini-css-extract-plugin"),
      HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

module.exports = {
    entry: ['@babel/polyfill', './resources/js/index.js'], // Entry point
    output: {
        path: path.resolve(__dirname, 'dist'),   // Outputs bundle to this directory
        filename: 'js/bundle.js'   // with this filename
    },
    devServer: {
        contentBase: './dist',   // live server direction
        open: true,
        port: 8080
    },
    plugins: [
        new HtmlWebpackPlugin({ // All blogs page
            filename: 'html/index.ejs',
            template: './resources/html/index.ejs'
        }),
        new HtmlWebpackPlugin({ // Creating new blog post page
            filename: 'html/new-blog.ejs',
            template: './resources/html/new-blog.ejs'
        }),
        new HtmlWebpackPlugin({ // EJS Partials
            filename: 'html/ejs-partials/navigation.ejs',
            template: './resources/html/ejs-partials/navigation.ejs',
            excludeAssets: [/main.css/, /bundle.js/] // Excluding css from this file
        }),
        new HtmlWebpackPlugin({ // Full Blog Content Page
            filename: 'html/show-blog.ejs',
            template: './resources/html/show-blog.ejs'
        }),
        new HtmlWebpackPlugin({ // Edit Blog Page
            filename: 'html/edit-blog.ejs',
            template: './resources/html/edit-blog.ejs',
            excludeAssets: [/main.css/, /bundle.js/]
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        }),
        new HtmlWebpackExcludeAssetsPlugin()
    ],
    module: {
        rules: [
            // -- BABEL LOADER --
            {
                test: /\.js$/,  // checks for all possible files that has .js in their name
                exclude: /node_modules/,    // excluding node_modules folder
                use: {
                    loader: 'babel-loader'
                }
            },
            // -- CSS/SCSS LOADER --
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            // -- URL/IMG LOADER --
            {
                test: /\.(png|jpg|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '/img/'
                        }
                    }
                ]
            },
            // IMG/URL LOADER IN HTML
            {
                test: /\.(html|ejs)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'link:href', 'img:data-lazy']
                    }
                }
            }
        ]
    }
};