var glob = require('glob');
var path = require('path');
var os = require('os');
/**
 * 返回 **\/* 对应的目录+文件的basename
 * @param  {[type]} globPath ['app/index'+'/**\/*.html']
 * @param  {[type]} pathDir  ['app/index' + '/']
 * @return {[type]}          [**\/*.html]
 */
function getEntry(globPath, pathDir) {
    // console.log(globPath, '!!');
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.join(dirname, basename);
        // console.log(pathname, '00');
        // pathname = path.join(dirname, basename).replace(/\\/g, '/');
        // console.log('11',pathDir.replace(/\\/g, '\\\\'));
        pathname = transSlash(pathDir ? pathname.replace(new RegExp('^' + pathDir.replace(/\\/g, '\\\\')), '') : pathname);
        entries[pathname] = ['./' + entry];
    }
    // console.log('!!!',entries);
    // console.log(44);
    return entries;
}
/**
 * window下的斜杠‘\’转换成linux下的斜杠‘/’
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function transSlash(path) {
    return path.replace(/\\/, '/');
}

/**
 * 兼容window与mac下的路径问题
 *
 * @param  {string} rPath 路径
 * @return {string}       处理后的路径
 */
function getPath(rPath) {
    if (os.platform() === 'win32') {
        return (rPath || '').replace(/\\/ig, '/');
    } else {
        return rPath || '.';
    }
}

module.exports.getEntry = getEntry;
module.exports.transSlash = transSlash;
module.exports.getPath = getPath;
