/**
 * 小程序精简路由
 * 背景：页面多，使用的是taro2，热更新编译很慢
 * 作用：开发者开发一个需求的时候并不需要用到所有页面，将不需要用到的页面过滤掉，提升编译速度
 */

const routerPath = process.env.CUSTOM_ROUTER
  ? './src/router/config.router.custom'
  : './src/router/config.router'
const fs = require('fs')
const path = require('path')
const {
  pages,
  subpackages,
  preloadRule
} = require(path.resolve(__dirname, routerPath))

console.log(`当前环境：${process.env.BUILD_ENV}`)
console.log(`当前指定的路由：${routerPath}`)

const appPath = path.resolve('./src/app.js')
let app = fs.readFileSync(appPath, 'utf-8')

// 替换pages的值
function replacePages() {
  return new Promise((resolve) => {
    const start = '// pagesStart'
    const end = '// pagesEnd'
    const pagesMarketStartIndex = app.indexOf(start)
    const pagesMarketEndIndex = app.indexOf(end) + end.length
    // 找到要替换的文本范围
    const replacePart = app.slice(pagesMarketStartIndex, pagesMarketEndIndex)

    let str = ''
    str += `[`
    pages.forEach((item, index) => {
      const dot = index < pages.length - 1 ? ',' : `
        ],`
      str += `
            '${item}'${dot}`
    })
    str = `${start}
        pages: ${str}
        ${end}`

    app = app.replace(replacePart, str)

    fs.writeFile(appPath, '', () => {
      fs.writeFile(appPath, app, (res) => {
        resolve('pages完成替换')
      })
    })
  })
}

// 替换subpackage的值
function replaceSubPackages() {
  return new Promise((resolve) => {
    let str = ''
    const start = '// subPackageStart'
    const end = '// subPackageEnd'
    const subpackagesMarkStartIndex = app.indexOf(start)
    const subpackagesMarkEndIndex = app.indexOf(end) + end.length
    const replacePart = app.slice(subpackagesMarkStartIndex, subpackagesMarkEndIndex)

    if (!subpackages.length) {
      str = `${start}
            subpackages: [],
            ${end}`
      app = app.replace(replacePart, str)
      fs.writeFile(appPath, '', () => {
        fs.writeFile(appPath, app, (res) => {
          resolve('subpackages完成替换')
        })
      })
      return
    }

    str += `[`
    subpackages.forEach((item, index) => {
      if (process.env.BUILD_ENV !== 'release' && ['pages/music'].includes(item.root)) {
        item.plugins = {}
      }

      const dot = index < subpackages.length - 1 ? ',' : `
        ],`
      str += `
            ${JSON.stringify(item)}${dot}`
    })

    str = `${start}
        subpackages: ${str}
        ${end}`

    app = app.replace(replacePart, str)

    // 先清空内容再替换内容
    fs.writeFile(appPath, '', () => {
      fs.writeFile(appPath, app, (res) => {
        resolve('subpackages完成替换')
      })
    })

  })
}

// 替换preloadrule的值
function replacePreload() {
  return new Promise((resolve) => {
    let str = ''

    const start = '// preloadRuleStart'
    const end = '// preloadRuleEnd'
    const preloadRuleMarkStartIndex = app.indexOf(start)
    const preloadRuleMarkEndIndex = app.indexOf(end) + end.length
    const replacePart = app.slice(preloadRuleMarkStartIndex, preloadRuleMarkEndIndex)
    const preloadRuleArray = Object.keys(preloadRule)

    if (!preloadRuleArray.length) {
      str = `${start}
            preloadRule: {},
            ${end}`
      app = app.replace(replacePart, str)
      fs.writeFile(appPath, '', () => {
        fs.writeFile(appPath, app, (res) => {
          resolve('preoadRule完成替换')
        })
      })
      return
    }

    str += `{`

    preloadRuleArray.forEach((key, index) => {
      const value = preloadRule[key]
      const dot = index < preloadRuleArray.length - 1 ? ',' : `
        },`
      str += `
            '${key}':${JSON.stringify(value)}${dot}`
    })

    str = `${start}
        preloadRule: ${str}
        ${end}`

    app = app.replace(replacePart, str)

    fs.writeFile(appPath, '', () => {
      fs.writeFile(appPath, app, (res) => {
        resolve('preoadRule完成替换')
      })
    })
  })
}

(async () => {
  const replacePagesResult = await replacePages()
  console.log(replacePagesResult)
  const replaceSubPackagesResult = await replaceSubPackages()
  console.log(replaceSubPackagesResult)
  const replacePreloadResult = await replacePreload()
  console.log(replacePreloadResult)
})()