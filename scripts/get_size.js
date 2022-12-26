/**
 * 获取目录大小
 * 生成json文件，每一级目录都有对应size属性值
 * 可用于webpack打包之后监测dist文件的size
 */

const fs = require('fs');

function geFileList(path) {
  const files_size = { size: 0 };
  readFile(path, files_size, files_size);
  return files_size;
}

//递归遍历读取文件目录
function readFile(path, files_size) {
  const files = fs.readdirSync(path);//需要用到同步读取
  files.forEach((file) => {
    const states = fs.statSync(path + '/' + file);
    // 如果是文件夹就递归处理
    if (states.isDirectory()) {
      files_size[file] = { size: 0 };
      readFile(path + '/' + file, files_size[file]);
      files_size.size = to_num(files_size.size);
      files_size[file].size = to_num(files_size[file].size);

      files_size.size += files_size[file].size

      files_size.size = to_kb(files_size.size);
      files_size[file].size = to_kb(files_size[file].size);
    } else {
      files_size[file] = {
        size: (states.size / 1024).toFixed(2) + "/kb",
      }
      files_size.size = to_num(files_size.size);
      files_size.size += states.size;
      files_size.size = to_kb(files_size.size);
    }
  });
}

function isString(str) {
  return typeof str === 'string' && str.includes('/kb')
}

function to_kb(size) {
  return (size / 1024).toFixed(2) + "/kb"
}

function to_num(size) {
  if (isString(size)) {
    return size.split('/kb')[0] * 1024
  }
  return size
}

//写入文件utf-8格式
function writeFile(fileName, data) {
  fs.writeFile(fileName, data, (err) => {
    if (err) {
      return console.log(err)
    }
    console.log("文件生成成功");
  });
}

const files_size = geFileList("./src");


writeFile("size.json", JSON.stringify(files_size));