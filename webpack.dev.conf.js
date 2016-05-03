/*约定大于配置*/
/*
    src目录下 html目录及其中的文件名字与js一一对应
    保证一个html文件对应一个js入口文件
 */
//工具
var util = require('./util');
/*
html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var appConfig = require('./shark-deploy-conf');
var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
// 引入基本配置
var webpackConfig = require('./webpack.config');

//重新配置开发环境的output
webpackConfig.output = {
    // 静态资源的输出路径 'build/static/LivePublisher-web'
    // webpack打包后，生成的js文件，css文件，字符文件，图片文件会打包放在path字段所指定的文件目录中。
    path: path.resolve(__dirname, appConfig.buildWebAppStatic),
    //模板、样式、脚本、图片等资源对应的server上的路径
    //修改开发环境的资源等生成的公共路径
    publicPath: appConfig.devPublicPath,
    //每个页面对应的主js的生成配置  入口js文件的(生成路径及文件名)相对于path的 如js/module/**/*.js
    filename: 'js/module' + '/' +'[name].[hash:8].js',
    ////The filename of non-entry chunks as relative path inside the output.path directory.
    chunkFilename: '[id].[chunkhash].js'
};

//添加loader
webpackConfig.module.loaders = webpackConfig.module.loaders.concat({
    test: /\.css$/,
    //配置css的抽取器、加载器。'-loader'可以省去
    loaders: ['style-loader', 'css-loader'] 
},{
    test: /\.scss$/,
    //配置scss的抽取器、加载器。'-loader'可以省去
    loaders: ["style", "css", "sass"]
});

webpackConfig.resolve.root = [
    path.resolve('./src/app/LivePublisher-web')
]

//添加插件
webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    
    // new HtmlWebpackPlugin({
    //     filename: 'app/index/index.html',
    //     template: path.resolve(__dirname, '../app/index/index.html'),
    //     inject: true
    // })
]);

/*添加多个文件对应的htmlWebpackPlugin*/
var htmlDir = path.join(appConfig.webApp, appConfig.htmlPath);
var pages = Object.keys(util.getEntry( path.join(htmlDir, '/**/*.html'), path.join(htmlDir, '/')));
// var pages = Object.keys(getEntry( 'app/index'+'/**/*.html', 'app/index' + '/'));
pages.forEach(function(pathname) {
    var conf = {
        //favicon路径，通过webpack引入同时可以生成hash值
        // favicon: './src/img/favicon.ico',
        //生成的html存放路径，相对于path。也是浏览器打开的路径
        filename: pathname + '.html',
        //html模板路径 src/app/LivePublisher-web/html
        template: htmlDir +'/' + pathname + '.html', 
        inject: true, //js插入的位置，true/'head'/'body'/false
        // hash: true, //为静态资源生成hash值
        chunks: [pathname] //需要引入的chunk，不配置就会引入所有页面的资源(html与入口js文件一一对应)
        // minify: { //压缩HTML文件    
        //     removeComments: true, //移除HTML中的注释
        //     collapseWhitespace: false //删除空白符与换行符
        // }
    };
    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
});

// var devClient = 'webpack-hot-middleware/client';
var devClient = './dev-client';
Object.keys(webpackConfig.entry).forEach(function (name, i) {
    var extras = [devClient]
    webpackConfig.entry[name] = extras.concat(webpackConfig.entry[name])
})


module.exports = webpackConfig;






