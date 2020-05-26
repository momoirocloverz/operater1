const path = require('path')
//gzip压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    // assetsDir: 'assets', //静态资源目录（js, css, img）
    lintOnSave: false, //是否开启eslint
    // productionSourceMap: false,
    runtimeCompiler: false,
    configureWebpack: config => {
        let plugins = [
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp(
                    '\\.(' + ['js', 'css'].join('|') +
                    ')$',
                ),
                threshold: 10240,
                minRatio: 0.8,
            }),
        ]
        if (process.env.NODE_ENV !== 'development') {
            config.plugins = [...config.plugins, ...plugins]
        }
    },
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true
    },
    devServer: {
        open: true, //是否自动弹出浏览器页面
        host: "localhost",
        port: '8081',
        https: false,   //是否使用https协议
        hotOnly: false, //是否开启热更新
        proxy: null
    }
}