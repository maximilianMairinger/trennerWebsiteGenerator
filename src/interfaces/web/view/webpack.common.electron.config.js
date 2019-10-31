const InjectPlugin = require('webpack-inject-plugin').default;

module.exports = (env = {}) => {
    let apiUrl = (env.apiUrl !== undefined) ? env.apiUrl : "https://dev-lb-planer.logfro.de/api/v1/";
    console.log("Building with apiUrl: \"" + apiUrl + "\".\n");
    return {
        entry: './src/index.ts',
        output: {
            filename: 'dist/main.bundle.js',
            chunkFilename: 'dist/[name].js',
            path: __dirname + "/electron-source",
            publicPath: "/"
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        plugins: [
            new InjectPlugin(() => {
                return "global.apiUrl=\"" + apiUrl + "\";"
            })
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: 'ts-loader'
                },
                {
                    test: /\.css$/,
                    use: ['to-string-loader', 'css-loader'],
                },
                {
                    test: /\.(png|jpg|svg|jpeg|gif)$/,
                    loader: 'url-loader'
                }
            ]
        },
    }
};
