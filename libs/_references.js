// jQuery is loaded separately into the page to avoid load
// order problems so we must reference it separately here
// also.
// http://requirejs.org/docs/jquery.html#advanced

/// <reference path="jquery-1.8.1.js" />

// Require.js is included directly when loaded in the browser
// (only while developing) so we need to reference it here so
// that intellisense will recognise it.

/// <reference path="require.js" />

// Tell require.js where this projects scripts are located.

requirejs.config({
    baseUrl: '~/'
});