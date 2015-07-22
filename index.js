'use strict';
const fs = require('fs');

module.exports = function (filename, callback) {

  function failOnError(cb) {
    return function (err, result) {
      if (err) {
        callback(err);
      } else {
        cb(result);
      }
    };
  }

  fs.stat(filename, failOnError(function (stats) {
    if (stats.isFile()) {
      fs.readFile(filename, failOnError(function (content) {
        callback(null, content);
      }));
    } else if (stats.isDirectory()) {
      fs.readdir(filename, failOnError(function (files) {
        callback(null, renderDir(files));
      }));
    } else {
      callback(new Error('Expected file or directory'));
    }
  }));
};

function renderDir(files) {
  const html = [
    '<html>',
    ' <body>',
    '  <ul>'
  ];
  files.forEach(function (fname) {
    html.push('    <li><a href="/' + fname + '">' + fname + '</a></li>');
  });
  html.push([
    '  </ul>',
    ' </body>',
    '</html>'
  ].join('\n'));

  return html.join('\n');
}
