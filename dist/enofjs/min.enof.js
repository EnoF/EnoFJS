/* !!EnoFJS!! Version: 3.0.0, Author: EnoF <andy@provictores.com> (http://enof.github.io/EnoFJS, Fork me on Github: https://github.com/EnoF/EnoFJS */!function(a){"use strict";void 0!==a?(a.module=a.module||{},a.require=function(b){return a[b.replace(/(.\/)|.js/g,"")]||a},a.exports=function(b,c,d){a[d]=c,a[d.replace(/(.\/)|.js/g,"")]=c}):module.exports={require:require,exports:function(a,b){a.exports=b}}}(this.window),function(a,b,c){"use strict";function d(a){var b=a.extractFunctionName();return e(b,a)}function e(a,b){var d,e,j=q(new b);i("private",j.private,j.public),i("protected",j.protected,j.public),j.extend!==c&&(d=u[j.extend],e=f(j,d));var k=g(j,d);return j.extend!==c&&h(k,e),u[a]=k,o(a,k)}function f(a,b){var c={"private":new b.Private,"protected":new b.Protected,"public":new b.Public,constructor:b.constructor};return m(c.private,a.private),m(c.protected,a.protected),m(c.public,a.public),c}function g(a,b){function d(){}function e(){}function f(){}d.prototype=a.private,e.prototype=a.protected,f.prototype=a.public;var g={extend:a.extend,constructor:a.constructor,sup:b!==c?b.constructor:function(){},Private:d,Protected:e,Public:f};return g}function h(a,b){a.Private.prototype.sup=b.private,a.Protected.prototype.sup=b.protected,a.Public.prototype.sup=b.public,p(a,a.Private.prototype.sup),p(a,a.Private.prototype.sup),p(a,a.Public.prototype.sup)}function i(a,b,c){for(var d in b){var e=b[d],f=!1,g=!1,h=d.capitaliseFirstLetter();e instanceof Object&&(r(e)?(b[d]=e.get,c["get"+h]=j(a,d),f=!0):t(e)&&(b[d]=e.is,c["is"+h]=k(a,d),g=!0),s(e)&&(b[d]=f?e.getSet:g?e.isSet:e.set,c["set"+h]=l(a,d)))}}function j(a,b){return function(){return this[a][b]}}function k(a,b){return function(){return this[a][b]}}function l(a,b){return function(c){this[a][b]=c}}function m(a,b){for(var c in a)b.hasOwnProperty(c)||(b[c]=a[c])}function n(a,b){for(var c in b)a[c]=b[c]}function o(a,b){function d(){var a={"private":new b.Private,"protected":new b.Protected,"public":new b.Public,constructor:b.constructor,sup:b.sup};p(a,a.private),p(a,a.protected),p(a,a.public),n(this,a.public),a.constructor.apply(a,arguments)}return b.extend!==c&&(d.prototype=new v[b.extend]),v[a]=d,d}function p(a,b){b.private=a.private||a.Private.prototype,b.protected=a.protected||a.Protected.prototype,b.public=a.public||a.Public.prototype}function q(a){return a.private=a.private||{},a.protected=a.protected||{},a.public=a.public||{},a.sup=a.sup||{},a.constructor=a.constructor||function(){},a}function r(a){return a.hasOwnProperty("get")||a.hasOwnProperty("getSet")}function s(a){return a.hasOwnProperty("set")||a.hasOwnProperty("getSet")||a.hasOwnProperty("isSet")}function t(a){return a.hasOwnProperty("is")||a.hasOwnProperty("isSet")}var u={},v={};Function.prototype.extractFunctionName=function(){var a=this.toString();return a=a.substr("function ".length),a=a.substr(0,a.indexOf("("))},Function.prototype.bindScope=function(a){var b=this;return function(){return b.apply(a,arguments)}},String.prototype.capitaliseFirstLetter=function(){return this.charAt(0).toUpperCase()+this.slice(1)},a.exports(b,d,"./clazz.js")}(require("./node-shim.js"),module),function(){"use strict";function a(){for(var a=this,b=new Uint32Array(a.length/4),c=0;c<a.length;c+=4)b[c/4]=(a[c+3]<<24|a[c+2]<<16|a[c+1]<<8|a[c])>>>0;return b}function b(a){for(var b=this,c=new Uint8Array(a.buffer),d=0;d<c.length;d+=1)b[d]=c[d]}Array.prototype.toUint32Array=a,Array.prototype.readUint32ArrayIn=b}(),function(a,b,c){"use strict";var d=a.require("./clazz.js"),e=d(function(){this.private={key:{getSet:null},value:{getSet:null},previous:{getSet:null},next:{getSet:null}},this.constructor=function(a,b){this.private.key=a,this.private.value=b}}),LinkedHashMap=d(function(){this.private={duplicateKeyError:"key already exists in LinkedHashMap",keyNotFoundError:"key not found",size:{get:0},first:{get:null},last:{get:null},hashMap:{},add:function(a,b){if(this.private.hashMap.hasOwnProperty(a))throw new Error(this.private.duplicateKeyError);var c=new e(a,b);return this.private.hashMap[a]=c,this.private.size++,c},remove:function(a){var b=a.getKey();a===this.private.first?(this.private.first=this.private.first.getNext(),this.private.first instanceof e&&this.private.first.setPrevious(null)):a===this.private.last?(this.private.last=this.private.last.getPrevious(),this.private.last.setNext(null)):(a.getPrevious().setNext(a.getNext()),a.getNext().setPrevious(a.getPrevious())),this.private.size--,delete this.private.hashMap[b]}},this.protected={addAfter:function(a,b){var c=a.getNext();null!==c?(c.setPrevious(b),b.setNext(c)):this.private.last=b,a.setNext(b),b.setPrevious(a)},addBefore:function(a,b){var c=a.getPrevious();null!==c?(c.setNext(b),b.setPrevious(c)):this.private.first=b,a.setPrevious(b),b.setNext(a)}},this.public={add:function(a,b){var c=this.private.add(a,b);return 1===this.private.size?this.private.first=c:this.protected.addAfter(this.private.last,c),this.private.last=c,c},addAfter:function(a,b,c){var d=this.private.add(b,c),e=this.public.getById(a);return this.protected.addAfter(e,d),d},addBefore:function(a,b,c){var d=this.private.add(b,c),e=this.public.getById(a);return this.protected.addBefore(e,d),d},addFirst:function(a,b){var c=this.private.add(a,b),d=this.private.first;return null!==d&&this.protected.addBefore(d,c),c},addLast:function(a,b){return this.public.add(a,b)},getById:function(a){var b=this.private.hashMap[a];if(b===c)throw new Error(this.private.keyNotFoundError);return b},isEmpty:function(){return 0===this.private.size},remove:function(a){return this.private.hashMap.hasOwnProperty(a)?this.private.remove(this.public.getById(a)):!1},removeFirst:function(){return null===this.private.first?!1:this.private.remove(this.private.first)},removeLast:function(){return null===this.private.last?!1:this.private.remove(this.private.last)}},this.constructor=function(){this.private.hashMap={}}});a.exports(b,LinkedHashMap,"./LinkedHashMap.js")}(require("./node-shim.js"),module),function(a,b){"use strict";function Serializable(){this.private={deserialize:function(a){for(var b in a)b in this.protected?this.protected[b]=a[b]:b in this.private&&(this.private[b]=a[b])},serialize:function(a,b){for(var c in a){var d=a[c];this.private.isNumberOrString(d)?b[c]=a[c]:d instanceof Array&&(b[c]=[],this.private.serializeArray(d,b[c]),0===b[c].length&&delete b[c])}},isNumberOrString:function(a){var b=typeof a;return"number"===b||"string"===b},serializeArray:function(a,b){for(var c=0;c<a.length;c+=1){var d=a[c];this.private.isNumberOrString(d)?b.push(d):d instanceof e&&b.push(d.serialize())}}},this.protected={deserializeArray:function(a,b){for(var c=[],d=0;d<a.length;d++){var e=a[d];c[d]=new b(e)}return c}},this.public={serialize:function(){var a={};return this.private.serialize(this.private,a),this.private.serialize(this.protected,a),this.private.serialize(this.public,a),a}},this.constructor=function(a){this.private.deserialize(a)}}var c=require("./clazz.js"),d=c(Serializable),e=d;a.exports(b,d,"./Serializable.js")}(require("./node-shim.js"),module),function(a,LinkedHashMap){"use strict";function b(b,d,e){var g=f(e);a(c(b,g),function(){d.apply(this,g)})}function c(a,b){return a+" ["+b+"]"}function d(a,b){var c,d=a.toString(),f=new LinkedHashMap;for(var g in b)b.hasOwnProperty(g)&&(c=d.indexOf(g+","),-1===c&&(c=d.indexOf(g+")")),e(c,b[g],f));return f}function e(a,b,c){for(var d=c.getFirst();d;d=d.getNext())if(a<d.getKey())return c.addBefore(d.getKey(),a,b);return c.add(a,b)}function f(a){for(var b=[],c=a.getFirst();c;c=c.getNext())b.push(c.getValue());return b}window.whereIt=function(a,c,e){for(var f=0;f<e.length;f++)b(a,c,d(c,e[f]))}}(window.it,require("./LinkedHashMap.js"));