require.config({
  // example of using shim, to load non AMD libraries (such as Backbone, jquery)
  shim: {
    '/base/libs/jquery-1.8.1.js': {
      exports: 'global'
    }
  }
});

// bootstrap - require, once loaded, kick off test run
require(['test/spec/classExtentions', 'test/spec/animal', 'test/spec/classSpec', '/base/libs/jquery-1.8.1.js'], function (test) {
  console.debug($);
  window.__testacular__.start();
}); 
