const forEach = require('lodash.foreach');

function getPath(url){
    const urlReg=/https:\/\/([^\/]+)/i; 
    return url.replace(urlReg,'');
}

function addAttr(compilation, tags) {
    if (!tags || !tags.length) {
        return;
    }
    forEach(tags, function (tag, index) {
        tag.attributes['_cdn_reload'] = 'true';
        if (tag.tagName === 'script') {
            tag.attributes['onerror'] = 'cdn_hack(\'' + getPath(tag.attributes.src) + '\')'
        } else if (tag.tagName === 'link') {
            tag.attributes['onerror'] = 'cdn_hack(\'' + getPath(tag.attributes.href) + '\')'
        }
    });
}

function alterAssetTags(compilation, htmlPluginData, callback) {
    addAttr(compilation, htmlPluginData.head);
    addAttr(compilation, htmlPluginData.body);
    if (typeof callback === 'function') {
        callback(null, htmlPluginData);
    } else {
        return new Promise(resolve => resolve(htmlPluginData));
    }
}

// 获取配置
function CdnReloadPlugin(options) {
    if (options) {
        this.options = options;
    } else {
        this.options = {
            cdn: ['./']
        }
    }
}
// 写入的func

CdnReloadPlugin.prototype.apply = function (compiler) {
    var self = this;
    if (compiler.hooks) {
        // 插入备用cdn标记
        compiler
            .hooks
            .compilation
            .tap('htmlWebpackInjectAttributesPlugin', function (compilation) {
                compilation
                    .hooks
                    .htmlWebpackPluginAlterAssetTags
                    .tap("htmlWebpackInjectAttributesPlugin", alterAssetTags.bind(self, compilation));
            })
        compiler
            .hooks
            .compilation
            .tap('compilation', function (compilation) {
                // 插入加载script的标签
                compilation
                    .hooks
                    .htmlWebpackPluginAfterHtmlProcessing
                    .tap('cdnReloadScriptInject', (data) => {
                        var cdnArr = JSON.stringify(self.options.cdn);
                        data.html = data
                            .html
                            .replace(/<\/head>/g, `<script>var _cdnArr=${cdnArr};
                            function cdn_hack(hashname, count) {
                                if (count) {
                                    if (/.js$/g.test(hashname)) {
                                        document.write('<script type="text/javascript" onerror="cdn_hack(' + hashname + ',' + (count * 1 + 1) + ')" src="' + _cdnArr[0] + hashname + '">&#60;&#47;script>')
                                    } else {
                                        document.write('<link type="text/css" rel="stylesheet" onerror="cdn_hack(' + hashname +','+ + (count * 1 + 1) + ')" src="' + _cdnArr[0] + hashname + '">&#60;&#47;link>')
                                    }
                                } else {
                                    if (/.js$/g.test(hashname)) {
                                        document.write('<script type="text/javascript" onerror="cdn_hack(' + hashname + ')" src="' + _cdnArr[0] + hashname + '"><\\\/script>')
                                    } else {
                                        document.write('<link type="text/css" rel="stylesheet" onerror="cdn_hack(' + hashname + ')" src="' + _cdnArr[0] + hashname + '"><\\\/link>')
                                    }
                                }
                            };
                            window.cdn_hack = cdn_hack;
                            </script></head>`);
                    });
            });
    } else {
        // 兼容老版本的webpack
        compiler
            .plugin('compilation', function (compilation) {
                compilation.plugin('html-webpack-plugin-alter-asset-tags', alterAssetTags.bind(self, compilation));
                compilation.plugin('html-webpack-plugin-after-html-processing', (data, callback) => {
                    var cdnArr = JSON.stringify(self.options.cdn);
                    data.html = data
                        .html
                        .replace(/<\/head>/g, `<script>var _cdnArr=${cdnArr};
                            function cdn_hack(hashname, count) {
                                if (count) {
                                    if (/.js$/g.test(hashname)) {
                                        document.write('<script type="text/javascript" onerror="cdn_hack(' + hashname + ',' + (count * 1 + 1) + ')" src="' + _cdnArr[0] + hashname + '">&#60;&#47;script>')
                                    } else {
                                        document.write('<link type="text/css" rel="stylesheet" onerror="cdn_hack(' + hashname +','+ + (count * 1 + 1) + ')" src="' + _cdnArr[0] + hashname + '">&#60;&#47;link>')
                                    }
                                } else {
                                    if (/.js$/g.test(hashname)) {
                                        document.write('<script type="text/javascript" onerror="cdn_hack(' + hashname + ')" src="' + _cdnArr[0] + hashname + '"><\\\/script>')
                                    } else {
                                        document.write('<link type="text/css" rel="stylesheet" onerror="cdn_hack(' + hashname + ')" src="' + _cdnArr[0] + hashname + '"><\\\/link>')
                                    }
                                }
                            };
                            window.cdn_hack = cdn_hack;
                            </script></head>`);
                    if (typeof callback === 'function') {
                        callback(null, data);
                    } else {
                        return new Promise(resolve => resolve(data));
                    }
                });
            });
    }
};

module.exports = CdnReloadPlugin;