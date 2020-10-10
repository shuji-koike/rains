const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    content_script: path.join(__dirname, "content_script.ts"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [],
};
