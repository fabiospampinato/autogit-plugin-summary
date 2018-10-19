# Autogit Plugin - Summary

A plugin for displaying a summary of all the changes in the working tree.

It works great in combination with [autogit-plugin-confirmation](https://github.com/fabiospampinato/autogit-plugin-confirmation). Together they allow you to check all the changes manually before performing importat work like committing or publishing.

## Install

```sh
npm install --save autogit-plugin-summary
```

## Usage

#### Options

This plugin uses the following options object:

```js
{
  onlyStaged: true, // Only show changes regarding staged files
  diff: true, // Show the diff of modified files
  content: true // Show the content of new files
}
```

#### Configuration

Add this plugin to a command:

```js
const summary = require ( 'autogit-plugin-summary' );

module.exports = {
  commands: {
    'my-command': [
      summary ({ /* YOUR OPTIONS */ })
    ]
  }
}
```

## License

MIT © Fabio Spampinato
