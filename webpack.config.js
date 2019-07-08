const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "./source/index.js"),

    externals: {
        buttercup: "buttercup"
    },

    module: {
        rules : [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            }
        ]
    },

    output: {
        filename: "buttercup-importer.js",
        libraryTarget: "commonjs2",
        path: path.resolve(__dirname, "./dist")
    },

    target: "node"
};
