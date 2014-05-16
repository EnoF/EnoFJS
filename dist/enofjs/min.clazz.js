/* !!EnoFJS!! Version: 2.0.1, Author: EnoF <andy@provictores.com> (http://enof.github.io/EnoFJS, Fork me on Github: https://github.com/EnoF/EnoFJS */!function(a,b,c){"use strict";function d(a){var b=a.extractFunctionName();return e(b,a)}function e(a,b){var d,e,j=q(new b);i("private",j.private,j.public),i("protected",j.protected,j.public),j.extend!==c&&(d=u[j.extend],e=f(j,d));var k=g(j,d);return j.extend!==c&&h(k,e),u[a]=k,o(a,k)}function f(a,b){var c={"private":new b.Private,"protected":new b.Protected,"public":new b.Public,constructor:b.constructor};return m(c.private,a.private),m(c.protected,a.protected),m(c.public,a.public),c}function g(a,b){function d(){}function e(){}function f(){}d.prototype=a.private,e.prototype=a.protected,f.prototype=a.public;var g={extend:a.extend,constructor:a.constructor,"super":b!==c?b.constructor:function(){},Private:d,Protected:e,Public:f};return g}function h(a,b){a.Private.prototype.super=b.private,a.Protected.prototype.super=b.protected,a.Public.prototype.super=b.public,p(a,a.Private.prototype.super),p(a,a.Private.prototype.super),p(a,a.Public.prototype.super)}function i(a,b,c){for(var d in b){var e=b[d],f=!1,g=!1,h=d.capitaliseFirstLetter();e instanceof Object&&(r(e)?(b[d]=e.get,c["get"+h]=j(a,d),f=!0):t(e)&&(b[d]=e.is,c["is"+h]=k(a,d),g=!0),s(e)&&(b[d]=f?e.getSet:g?e.isSet:e.set,c["set"+h]=l(a,d)))}}function j(a,b){return function(){return this[a][b]}}function k(a,b){return function(){return this[a][b]}}function l(a,b){return function(c){this[a][b]=c}}function m(a,b){for(var c in a)b.hasOwnProperty(c)||(b[c]=a[c])}function n(a,b){for(var c in b)a[c]=b[c]}function o(a,b){function d(){var a={"private":new b.Private,"protected":new b.Protected,"public":new b.Public,constructor:b.constructor,"super":b.super};p(a,a.private),p(a,a.protected),p(a,a.public),n(this,a.public),a.constructor.apply(a,arguments)}return b.extend!==c&&(d.prototype=new v[b.extend]),v[a]=d,d}function p(a,b){b.private=a.private||a.Private.prototype,b.protected=a.protected||a.Protected.prototype,b.public=a.public||a.Public.prototype}function q(a){return a.private=a.private||{},a.protected=a.protected||{},a.public=a.public||{},a.super=a.super||{},a.constructor=a.constructor||function(){},a}function r(a){return a.hasOwnProperty("get")||a.hasOwnProperty("getSet")}function s(a){return a.hasOwnProperty("set")||a.hasOwnProperty("getSet")||a.hasOwnProperty("isSet")}function t(a){return a.hasOwnProperty("is")||a.hasOwnProperty("isSet")}var u={},v={};Function.prototype.extractFunctionName=function(){var a=this.toString();return a=a.substr("function ".length),a=a.substr(0,a.indexOf("("))},Function.prototype.bindScope=function(a){var b=this;return function(){return b.apply(a,arguments)}},String.prototype.capitaliseFirstLetter=function(){return this.charAt(0).toUpperCase()+this.slice(1)},a.exports(b,d,"./clazz.js")}(require("./node-shim.js"),module);