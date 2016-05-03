var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path');
var webpack = require('webpack');

//工具
var util = require('./util');

// 引入基本配置
var webpackConfig = require('./webpack.config');
var appConfig = require('./shark-deploy-conf');

//重新配置生产环境的output
webpackConfig.output = {
    // 静态资源的输出路径 'build/static/LivePublisher-web'
    // webpack打包后，生成的js文件，css文件，字符文件，图片文件会打包放在path字段所指定的文件目录中。
    path: path.resolve(__dirname, appConfig.buildWebAppStatic),
    //模板、样式、脚本、图片等资源对应的server上的路径
    //修改生成环境的资源等生成的公共路径
    //"staticWebApp" : "/static/LivePublisher-web"
    publicPath: appConfig.staticWebApp,
    //每个页面对应的主js的生成配置  入口js文件的(生成路径及文件名)相对于path的 如js/module/**/*.js
    filename: 'js/module' + '/' +'[name].[hash:8].js',
    ////The filename of non-entry chunks as relative path inside the output.path directory.
    chunkFilename: '[id].[chunkhash].js'
};

//添加loader 单独生成css文件
webpackConfig.module.loaders = webpackConfig.module.loaders.concat({
    test: /\.css$/, 
    loader: ExtractTextPlugin.extract("style-loader", "css-loader", 'sass-loader')
},{
    test: /\.scss/, 
    loader: ExtractTextPlugin.extract("style-loader", "css-loader", 'sass-loader?' + JSON.stringify({discardComments: {removeAll: true}}))
});

//添加插件
/*
单独使用link标签加载css并设置路径，相对于output配置中的publickPath
输出资源路径 相对于output配置中的path
 */
webpackConfig.plugins = webpackConfig.plugins.concat([
    // 提取css为单文件
    new ExtractTextPlugin("styles/css/[name].[contenthash:8].css"),
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
        filename: '/html' + '/' + pathname + '.html',
        //html模板路径 src/app/LivePublisher-web/html
        template: htmlDir +'/' + pathname + '.html', 
        inject: true, //js插入的位置，true/'head'/'body'/false
        // hash: true, //为静态资源生成hash值 资源路径?hash数字
        chunks: [pathname] //需要引入的chunk，不配置就会引入所有页面的资源(html与入口js文件一一对应)
        // minify: { //压缩HTML文件    
        //     removeComments: true, //移除HTML中的注释
        //     collapseWhitespace: false //删除空白符与换行符
        // }
    };
    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = webpackConfig;
