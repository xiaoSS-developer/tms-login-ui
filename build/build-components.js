/**
 * Compile components
 */
const fs = require('fs-extra')
const path = require('path')
const babel = require('@babel/core')

const libDir = path.join(__dirname, '../lib')
const srcDir = path.join(__dirname, '../src')
const babelConfig = {
  configFile: path.join(__dirname, '../babel.config.js')
}

const scriptRegExp = /\.js$/
const isDir = dir => fs.lstatSync(dir).isDirectory()
const isCode = path => !/(demo|test|\.md)$/.test(path)
const isScript = path => scriptRegExp.test(path)

function compile(dir) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)

    // remove unnecessary files
    if (!isCode(file)) {
      return fs.removeSync(filePath)
    }

    // scan dir
    if (isDir(filePath)) {
      return compile(filePath)
    }

    // compile js or ts
    if (isScript(file)) {
      const { code } = babel.transformFileSync(filePath, babelConfig)
      fs.removeSync(filePath)
      fs.outputFileSync(filePath, code)
    }
  })
}

// clear dir
fs.emptyDirSync(libDir)

// compile lib dir
//process.env.BABEL_MODULE = 'commonjs'
fs.copySync(srcDir, libDir)
compile(libDir)
