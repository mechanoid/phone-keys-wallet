const path = require('path')
const fs = require('fs')

const scriptsTemplate = {
  name: '',
  version: '',
  main: '',
  author: '',
  license: '',
  scripts: {
    'build': 'echo "Error: no custom build script specified" && exit 1',
    'start': 'echo "Error: no custom start script specified" && exit 1'
  }
}

const write = (name, content) => new Promise((resolve, reject) => {
  fs.writeFile(name, content, err => {
    if (err) { return reject(err) }
    return resolve(true)
  })
})

module.exports = (config) => {
  console.log('collect default package.json settings')
  const cwd = process.cwd()
  const packageJsonPath = path.resolve(cwd, 'package.json')
  const packageJson = require(packageJsonPath)

  if (packageJson.scripts && packageJson.scripts.start && packageJson.scripts.build) {
    return Promise.resolve(true)
      .then(() => console.log('didn\'t touched the package.json'))
  }

  const updatedPackageJson = Object.assign({}, scriptsTemplate, packageJson)

  return write(packageJsonPath, JSON.stringify(updatedPackageJson, null, 2))
  .then(() => console.log('updated package.json'))
  .catch(e => {
    console.log(e)
    process.exit(1)
  })
}
