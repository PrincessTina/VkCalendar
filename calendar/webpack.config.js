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
            }
        ]
    }
};