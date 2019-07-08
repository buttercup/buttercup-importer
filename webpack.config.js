const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "./source/index.js"),

    externals: {
        buttercup: "buttercup"
    },

    module: {
        rules : [
            {
                test: /\.(js|esm)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        "presets": [
                            ["@babel/preset-env", {
                                "corejs": 3,
                                "useBuiltIns": "entry",
                                "targets": {
                                    "node": "6"
                                }
                            }]
                        ],
                        "plugins": [
                            ["@babel/plugin-proposal-object-rest-spread", {
                                "useBuiltIns": true
                            }]
                        ]
                    }
                }
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
