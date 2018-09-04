## Webpack-cdn-reload-plugin

### 介绍
#### 为`script`标签和`link`标签插入失败重新加载备用地址的函数，为了解决具有相互以来关系的Js无法重试的痛点。配合webpack多cdn上传或者oss供应商的cdn回源可实现资源加载重试。目前还在测试阶段，__请暂时不在再生产环境中使用__。

### 配置
#### webpack.config.js
```
    npm install webpack-cdn-reload
```

```
    import HtmlWebpackPlugin from 'html-webpack-plugin';
    import WebpackCdnReloadPlugin from 'webpack-cdn-reload';
    plugins:[
        // webpack内置的htmlwebpackplugin是必须的，并且引用顺序必须在插件之前。
        new HtmlWebpackPlugin({
            // option
        }),
        new WebpackCdnReloadPlugin({
            cdn:['https://cdn1.com','https://cdn2.com','https://cdn3.com]
        })
    ]
```
