#!/usr/bin/env node

const path = require('path')
const convict = require('convict')

const packageScripts = require(path.resolve(__dirname, '..', 'lib', 'package-defaults.js'))
const supportFiles = require(path.resolve(__dirname, '..', 'lib', 'support-files.js'))

const config = convict({
  force: {
    doc: 'force overwriting of support files',
    format: Boolean,
    default: false,
    arg: 'force'
  }
})

console.log('COLLECT!')
Promise.all([packageScripts(config), supportFiles(config)])
  .then(() => {
    console.log('Phone!', 'Keys!', 'Wallet!')
    console.log('lets go!!')
  })
