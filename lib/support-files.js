const path = require('path')
const fs = require('fs-extra')

const cwd = process.cwd()

const exists = (file) => new Promise((resolve) => fs.exists(file, resolve))

const copy = (source, target) => new Promise((resolve, reject) => {
  fs.copy(source, target, err => {
    if (err) { return reject(err) }
    return resolve(true)
  })
})

const fileWriter = (config) =>
  (source) => {
    const target = path.join(cwd, path.basename(source))

    return Promise.all([exists(source), exists(target)])
      .then(checks => {
        if (!checks[0]) {
          return Promise.resolve(false) // source file does not exists, skip file
        } else if (checks[1] && !config.get('force')) {
          console.log(`File already exists: ${target}`)
          return Promise.resolve(false)
        }

        return copy(source, target)
      })
  }

const ensureSupportFiles = (config) => {
  const home = process.env.HOME
  const ensureFile = fileWriter(config)

  const files = ['.editorconfig', '.eslintrc', '.gitignore', 'LICENSE']
    .map(f => path.resolve(home, f))

  const promises = files.map(ensureFile)

  return Promise.all(promises)
    .then(() => console.log('copied support files'))
    .catch(e => {
      console.log(e)
      process.exit(1)
    })
}

module.exports = ensureSupportFiles
