## Webpack-cdn-reload-plugin

### 介绍
#### 为script标签和link标签插入失败重新加载备用地址的函数。


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
