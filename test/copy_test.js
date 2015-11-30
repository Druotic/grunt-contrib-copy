'use strict';

var grunt = require('grunt');
var fs = require('fs');
var path = require('path');

exports.copy = {
  main: function(test) {
    test.expect(3);

    var actual = fs.readdirSync('tmp/copy_test_files').sort();
    var expected = fs.readdirSync('test/expected/copy_test_files').sort();
    test.deepEqual(expected, actual, 'should copy several files');

    actual = fs.readdirSync('tmp/copy_test_mix').sort();
    expected = fs.readdirSync('test/expected/copy_test_mix').sort();
    test.deepEqual(expected, actual, 'should copy a mix of folders and files');

    actual = fs.readdirSync('tmp/copy_test_v0.1.0').sort();
    expected = fs.readdirSync('test/expected/copy_test_v0.1.0').sort();
    test.deepEqual(expected, actual, 'should parse both dest and src templates');

    test.done();
  },

  noexpandWild: function(test) {
    test.expect(3);

    ['/', '/test/', '/test/fixtures/'].forEach(function(subpath, i) {
      var actual = fs.readdirSync('tmp/copy_test_noexpandWild' + subpath).sort();
      var expected = fs.readdirSync('test/expected/copy_test_noexpandWild' + subpath).sort();
      test.deepEqual(expected, actual, 'should copy file structure at level ' + i);
    });

    test.done();
  },

  flatten: function(test) {
    test.expect(1);

    var actual = fs.readdirSync('tmp/copy_test_flatten').sort();
    var expected = fs.readdirSync('test/expected/copy_test_flatten').sort();
    test.deepEqual(expected, actual, 'should create a flat structure');

    test.done();
  },

  single: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/single.js');
    var expected = grunt.file.read('test/expected/single.js');
    test.equal(expected, actual, 'should allow for single file copy');

    test.done();
  },

  mode: function(test) {
    test.expect(1);

    test.equal(fs.lstatSync('tmp/mode.js').mode.toString(8).slice(-3), '444');

    test.done();
  },

  modeDir: function(test) {
    test.expect(2);
    test.equal(fs.lstatSync('tmp/copy_test_modeDir/time_folder').mode.toString(8).slice(-3), '777');
    test.equal(fs.lstatSync('tmp/copy_test_modeDir/time_folder/sub_folder').mode.toString(8).slice(-3), '777');
    test.done();
  },

  process: function(test) {
    test.expect(2);
    test.equal(fs.lstatSync('tmp/process/beep.wav').size, fs.lstatSync('test/fixtures/beep.wav').size);
    test.notEqual(fs.lstatSync('tmp/process/test2.js').size, fs.lstatSync('test/fixtures/test2.js').size);

    test.done();
  },

  timestamp: function(test) {
    test.expect(4);

    test.equal(fs.lstatSync('tmp/copy_test_timestamp/sub_folder').mtime.getTime(), fs.lstatSync('test/fixtures/time_folder/sub_folder').mtime.getTime());
    test.equal(fs.lstatSync('tmp/copy_test_timestamp/test.js').mtime.getTime(), fs.lstatSync('test/fixtures/time_folder/test.js').mtime.getTime());
    test.notEqual(fs.lstatSync('tmp/copy_test_timestamp/test1.js').mtime.getTime(), fs.lstatSync('test/fixtures/time_folder/test.js').mtime.getTime());
    test.notEqual(fs.lstatSync('tmp/copy_test_timestamp/test_process.js').mtime.getTime(), fs.lstatSync('test/fixtures/time_folder/test_process.js').mtime.getTime());

    test.done();
  },

  keepSymLinks: function(test) {
    test.expect(5);
    console.log('begin keepSymLinks tests...');
    console.log(fs.lstatSync('tmp/copy_test_keepSymLinks'));
    console.log('---');
    console.log(fs.readdirSync('tmp/copy_test_keepSymLinks/sub_folder1'));

    var actual, expected;
    var dirPaths = [
      '',
      'sub_folder1',
      'sub_folder1/sub_folder2_symlink',
      'sub_folder2/',
      'sub_folder2/sub_sub_folder2'
    ];

    for (var idx = 0; idx < dirPaths.length; idx++) {
      var filepath = dirPaths[idx];
      actual = fs.readdirSync(path.join('tmp/copy_test_keepSymLinks', filepath)).sort();
      expected = fs.readdirSync(path.join('test/expected/copy_test_keepSymLinks', filepath)).sort();
      test.deepEqual(actual, expected, 'directory\'s file names (regular files and sym links) should be the same');
    }

    test.done();
  }
};
