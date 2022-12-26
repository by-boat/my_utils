/**
 * 快速创建小程序react组件模板
 * 使用时需要传入需要生成文件的路径,第三个参数传了的话就是使用hooks模板
 * node ./new_react_template.js D:/my-app/src/pages/test
 */

const fs = require('fs');
const path = require('path');
if (!process.argv[2]) {
  throw "给个文件路径~"
}

const is_hooks = Boolean(process.argv[3]);

let fs_name = process.argv[2].split('/')
fs_name = fs_name[fs_name.length - 1]
fs_name = fs_name.split('')
fs_name[0] = fs_name[0].toUpperCase()
fs_name = fs_name.join('').replace(/(-|_)(.)/g, (a) => a[1].toUpperCase())

const class_template = `
import Taro from '@tarojs/taro'

import './index.scss'

export default class ${fs_name} extends Component {
  constructor() {
    super(props)
    this.state = {}
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    <View></View>
  }
}
`
const hooks_template = `import Taro, { useEffect, useState } from '@tarojs/taro'

import './index.scss'

export default function Test(props) {
  const { } = props
  const [state, set_state] = useState()

  useEffect(() => {

  }, [])

  return (
    <View></View>
  )
}

`
try {
  // D:/my-github-apps/min-app1/src/pages/ppo
  fs.mkdirSync(process.argv[2]) // 创建文件
  fs.writeFileSync(path.join(process.argv[2] + '/index.js'), (is_hooks ? hooks_template : class_template)) // 创建js文件
  fs.writeFileSync(path.join(process.argv[2] + '/index.scss'), "")
  console.log('创建成功！')
} catch (error) {
  console.log('创建失败', error)
}
return
// console.log('看看参数', process.argv[2])
fs.writeFile(path.join(process.argv[2] || 'D:/my-github-apps/min-app1/src/pages/test.js'), (obj), (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('写入成功')
})