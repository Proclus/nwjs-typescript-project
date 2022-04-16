/* extras/loaders/npw-node-loader.js */
const path = require("path");
const loaderUtils = require("loader-utils");
const RTLD_NOW = require("os").constants.dlopen.RTLD_NOW;

module.exports = function (content) {
    const filename = path.basename(this.resourcePath);
    const assetInfo = { sourceFilename: filename };
    const name = loaderUtils.interpolateName(this,"[contenthash].[ext]", {
        context: this.rootContext,
        content,
    });
    this.emitFile(name, content, null, assetInfo);
    return `
        try {
          process.dlopen(module, ${JSON.stringify(name)}, ${RTLD_NOW});
        } catch (error) {
          throw new Error('nwp-node-loader:\\n' + error);
        }
    `;
}

// Avoid webpack processing the binary node addon file
module.exports.raw = true;
