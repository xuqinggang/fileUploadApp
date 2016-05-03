//配置
var appConfig = require('./shark-deploy-conf');

var path = require('path');
//工具
var util = require('./util');

/*
extract-text-webpack-plugin插件，
有了它就可以将你的样式提取到单独的css文件里，
妈妈再也不用担心样式会被打包到js文件里了。
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');

/*
html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');

//配置参数

/*
entry：入口，可以是一个或者多个资源合并而成，由html通过script标签引入
chunk：被entry所依赖的额外的代码块，同样可以包含一个或者多个文件
 */
var webpackConfig = {
    // 入口文件，path.resolve()方法，可以结合我们给定的两个参数最后生成绝对路径，最终指向的就是我们的index.js文件
    entry: {
        // index: ['./src/app/LivePublisher-web/js/module/index.js'],
        // test3: ['./src/app/LivePublisher-web/js/module/test3.js'],
        // vendors: [
        //     // 'Vue'
        // ]
    },
    /*
         { index: [ './src/app/LivePublisher-web/js/module/index.js' ],
  test3: [ './src/app/LivePublisher-web/js/module/test3.js' ] }

     */
    // 输出配置
    output: {
        // 静态资源的输出路径 'build/static/LivePublisher-web'
        // webpack打包后，生成的js文件，css文件，字符文件，图片文件会打包放在path字段所指定的文件目录中。
        path: path.resolve(__dirname, appConfig.buildWebAppStatic),
        //模板、样式、脚本、图片等资源对应的server上的路径
        // publicPath: appConfig.buildPublicPath,
        //每个页面对应的主js的生成配置  入口js文件的(生成路径及文件名)相对于path的 如js/module/**/*.js
        filename: 'js/module' + '/' +'[name].[hash:8].js',
        ////The filename of non-entry chunks as relative path inside the output.path directory.
        chunkFilename: '[id].[chunkhash].js'
    },
    resolve: {
        extensions: ['', '.js'],
        root: [
            // 
            path.resolve('./src/app/LivePublisher-web')
        ],
        // 别名配置：就可以用别名来进行require了，不管是在webpack配置中，还是在js代码中。比如，在entry中的common模块就可以直接用understore，在打包时就会通过别名找到具体的路径。别名的值最好是绝对路径，当时我们用相对路径如果只是同一个目录结构没有问题，但是多个目录结构的引用就会出现路径解析错误。绝对路径转换使用path.resolve该方法即可
        /* 
        alias: {
                jquery: path.resolve('../global/lib/jquery.js'),
                template: path.resolve('../global/lib/template.js'),
                understore: path.resolve('../global/lib/underscore.js'),
                store: path.resolve('../global/lib/store.js')
            }
        */
    },
/**
 * loaders
 * css-loader和styleloader，前者负责将CSS文件变成文本返回，并处理其中
 * 的url()和@import()，而后者将CSS以style标签的形式插入到页面中去
 */
    module: {
        
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: [ "es2015" ],
                    plugins: [ "transform-runtime" ]
                }
            },
            // { 
            //     test: /\.(png|jpg|gif|svg)$/,
            //     loader: "file-loader?name=styles/img/[hash:8].[name].[ext]" 
            // },
            // 不使用url-loader处理图片,因为构建时图片目录不好处理且css中写url路径时不好处理。所以用express中间件处理图片请求
            // {
            //     test: /\.(png|jpg|gif|svg)$/,
            //     loader: 'url',
            //     query: {
            //         limit: 10,
            //         name: 'styles/img/[name].[ext]?[hash:7]'
            //     }
            // },
        ]
    },
    plugins: [
        // new ExtractTextPlugin('css/[name].css'),
         //单独使用link标签加载css并设置路径，相对于output配置中的publickPath单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        // new HtmlWebpackPlugin({
        //     filename: 'app/index/index.html',
        //     template: path.resolve(__dirname, './app/index/index.html'),
        //     inject: true
        // })
    ]
}



/*添加多个html文件分别对应的入口文件(规定一个html对应一个js入口文件)*/
var entryJSDir = path.join(appConfig.webApp, appConfig.entryJSPath);
var entries = util.getEntry(path.join(entryJSDir, '/**/*.js'), path.join(entryJSDir, '/'));
//修改入口文件对象的key
// var entriesTmp = [];
// for(var key in entries) {
//     entriesTmp['module/' + key] = entries[key];
// }
console.log('222', entries);
webpackConfig.entry = entries;


module.exports =  webpackConfig;