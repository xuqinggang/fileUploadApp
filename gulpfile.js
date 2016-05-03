'use strict';

// 配置
var appConfig = require('./shark-deploy-conf.json');

var express = require('express');
var webpack = require('webpack');
var gulp = require('gulp');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');

var openurl = require('openurl');
var path = require('path');
var fs = require('fs');
var exec = require('sync-exec');
var util = require('./util');
//
var webAppDir = appConfig.webApp;
var htmlPath = appConfig.htmlPath;

var tmp1 = path.join(appConfig.tmpDir, 'step1');
var tmpRevMainfest = path.join(appConfig.tmpDir, 'tmpRevMainfest');


//生成环境server
gulp.task('server', function() {
    var mockDir = appConfig.mockWebApp;
    var ajaxPath = appConfig.ajaxPrefix;
    var buildDir = appConfig.build;
    var htmlDir = path.join(appConfig.buildWebApp, appConfig.htmlPath);
    var app = express();
    // ajax
    app.use(util.getPath(path.join(appConfig.contextPath, ajaxPath)), headerStatic(path.join(mockDir, ajaxPath), {
        'Content-Type': 'application/json'
    }));
    //访问js,css
    app.use(util.getPath('/'), headerStatic(buildDir, {}));
    //访问html
    app.use(util.getPath('/'), headerStatic(htmlDir, {}));
    app.listen(appConfig.prodPort, function(err) {
        if (err) {
            return console.log(err);
        }
        // 设置了默认打开页面
        if (appConfig.prodOpenurl) {
            openurl.open(appConfig.prodOpenurl);
        }

        console.log('listening on %d', appConfig.prodPort);
    });
});

//生成环境
gulp.task("build", function(cb) {
    runSequence(
        'webpack',//webpack打包：1.生成html文件->build并修改其中的css和js链接。2.根据js入口文件进行打包
        'revision-image',//给图片加版本号从src->build
        'revreplace-css',//替换build目录下的css文件的图片引用
        'revreplace-js',//替换build目录下的js文件的图片引用
        'revreplace-html',//替换build目录下的html文件的图片引用
        'copy-build-html',//cp html文件 build/static -> build/app
        'clean-buil-html',//clean build/static 中的html
        cb
    )
});

/***------------- revision start ---------------***/
gulp.task("revision-image", function() {
    var srcImageDir = path.join(appConfig.webApp);
    var buildImageDir = path.join(appConfig.buildWebAppStatic);
    return gulp.src([path.join(srcImageDir, "**/*.{jpg,jpeg,gif,png}")])
        .pipe(rev())
        .pipe(gulp.dest(buildImageDir))
        .pipe(rev.manifest('image-rev-manifest.json'))
        .pipe(gulp.dest(tmpRevMainfest));
});

/***------------- revreplace-css start ---------------***/
//修改css中图片的引用
gulp.task("revreplace-css", function() {
    var manifest = gulp.src([
        path.join(tmpRevMainfest, '/image-rev-manifest.json')
    ]);
    var srcCssDir = path.join(appConfig.buildWebAppStatic, appConfig.cssPath);
    var buildCssDir = srcCssDir;
    return gulp.src(path.join(srcCssDir, "**/*.css"))
        .pipe(revReplace({
            manifest: manifest,
            replaceInExtensions: ['.css'],
            prefix: getMimgUrlPrefix()
        }))
        .pipe(gulp.dest(path.join(buildCssDir)));
});

/***------------- revreplace-js start ---------------***/
//修改js中图片的引用
gulp.task("revreplace-js", function() {
    var manifest = gulp.src([
        path.join(tmpRevMainfest, '/image-rev-manifest.json'),
        // path.join(tmp2, '/flash-rev-manifest.json')
    ]);
    var srcJsDir = path.join(appConfig.buildWebAppStatic, appConfig.jsPath);
    var buildJsDir = srcJsDir;
    return gulp.src(path.join(srcJsDir, "**/*.js"))
        .pipe(revReplace({
            manifest: manifest,
            replaceInExtensions: ['.js'],
            // prefix: getMimgUrlPrefix()
        }))
        .pipe(gulp.dest(buildJsDir));
});

/***------------- revreplace-html start ---------------***/
//修改html中图片的引用
gulp.task("revreplace-html", function() {
    var manifest = gulp.src([
        // path.join(tmp2, '/style-rev-manifest.json'),
        // path.join(tmp2, '/js-rev-manifest.json'),
        path.join(tmpRevMainfest, '/image-rev-manifest.json'),
        // path.join(tmp2, '/flash-rev-manifest.json')
    ]);
    var srcHtmlDir = path.join(appConfig.buildWebAppStatic, appConfig.htmlPath);
    var buildHtmlDir = srcHtmlDir;
    return gulp.src(path.join(srcHtmlDir, "**/*.{html,htm}"))
        .pipe(revReplace({
            manifest: manifest,
            replaceInExtensions: ['.html'],
            // prefix: getMimgUrlPrefix()
        }))
        .pipe(gulp.dest(buildHtmlDir));
});

/***------------- webpack打包 start ---------------***/
gulp.task('webpack', function() {
    exec('webpack --display-modules --display-chunks --config ' + appConfig.prodConfigName);
    console.log('webpack end');
});

/***------------- copy to build start ---------------***/
gulp.task('copy-build-html', function() {
    var srcHtmlDir = path.join(appConfig.buildWebAppStatic, appConfig.htmlPath);
    var buildHtmlDir = path.join(appConfig.buildWebApp, appConfig.htmlPath);
    return gulp.src(path.join(srcHtmlDir, '**/*.{html,htm}')).pipe(gulp.dest(path.join(buildHtmlDir)));
});
/***------------- clean  start ---------------***/
// 清除build/static 中的html
gulp.task('clean-buil-html', function() {
    var srcHtmlDir = path.join(appConfig.buildWebAppStatic, appConfig.htmlPath);
    return gulp.src([srcHtmlDir], {
            read: false
        })
        .pipe(clean());
});
// 开发环境
gulp.task('develop', function() {
    var config = require('./webpack.dev.conf');
    // 创建一个express实例
    var app = express()
    console.log('!!!!!!!', config.plugins);
    // 调用webpack并把配置传递过去
    var compiler = webpack(config)

    // 使用 webpack-dev-middleware 中间件
    var devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true,   
            chunks: false
        }
    })

    // 使用 webpack-hot-middleware 中间件
    var hotMiddleware = require('webpack-hot-middleware')(compiler)
    // webpack插件，监听html文件改变事件
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
            // 发布事件
            hotMiddleware.publish({ action: 'reload' })
            cb()
        })
    })
    // 注册中间件
    app.use(devMiddleware)
    // 注册中间件
    app.use(hotMiddleware)
    var imgPath = appConfig.imgPath;
    var webappDir = appConfig.webApp;
    //
    app.use(imgPath, headerStatic(path.join(webappDir, imgPath), {}));
    // app.use(appConfig.contextPath, headerStatic(path.join(webAppDir, htmlPath), {}));
    app.listen(appConfig.devPort, function() {
            if(appConfig.dveOpenurl) {
                openurl.open(appConfig.dveOpenurl);
            }
            console.log('socketio listen %d', appConfig.devPort);
    });

})

// 模拟静态资源请求
function headerStatic(staticPath, headers) {
    return function(req, res, next) {
        var reqPath = req.path,
            reqFullPath = path.join(staticPath, reqPath);
        if(fs.existsSync(reqFullPath)) {
            //设置配置的响应头
            for(var h in headers) {
                res.set(h, headers[h]);
            }

            if(/\.html$/.test(reqPath)) {
                res.set('Content-Type', 'text/html');
                res.send((fs.readFileSync(reqFullPath, 'UTF-8')));
            }else {
                if(/\.js$/.test(reqPath)) {
                    res.set('Content-Type', 'text/javascript');
                }else if(/\.css$/.test(reqPath)) {
                    res.set('Content-Type', 'text/css');
                }
                res.send(fs.readFileSync(reqFullPath))
            }
        }else {
            // if (reqPath !== '/livereload.js') {
            //     // console.warn('Not Found: ' + f);
            // }
            next();
        }
    }
}
function getMimgUrlPrefix() {
    var prefix = appConfig.staticWebApp;
    if (typeof prefix === 'string') {
        // var mimgUrl = prefix + '/' + getPath(path.join(appConfig.product, appConfig.staticVersion));
        // var mimgUrl = prefix + '/' + getPath(appConfig.staticVersion);
        return prefix;
    }
    throw new Error('build target [' + appConfig.target + '] undefined in mimgURLPrefix');
}