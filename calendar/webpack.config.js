module.exports = {
    entry: './src/static/js/compiled/index.jsx',
    output: {
        path: __dirname + '/src/static/js/compiled',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'env']
                }
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader' // creates style nodes from JS strings
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS
                }, {
                    loader: 'less-loader' // compiles Less to CSS
                }]
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "url-loader"
                },
            }
        ]
    }
};