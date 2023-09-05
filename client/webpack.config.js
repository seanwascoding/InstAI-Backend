const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        index: ['./components/index.jsx']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve('./build')
    },
    module: {
        rules: [
            { test: /.jsx$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-react'] } } },
            { test: /.js$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } } }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '.'),
        },
        compress: true,
        port: 8000
    },
    performance: {
        hints: false
    }
}