/* !!EnoFJS!! Version: 3.2.0, Author: EnoF <andy@provictores.com> (http://enof.github.io/EnoFJS, Fork me on Github: https://github.com/EnoF/EnoFJS */!function(a){"use strict";function b(a){var b=a.extractFunctionName();return c(b,a)}function c(b,c){var h,i,j=o(new c);g("private",j.private,j.public),g("protected",j.protected,j.public),j.extend!==a&&(h=s[j.extend],i=d(j,h));var k=e(j,h);return j.extend!==a&&f(k,i),s[b]=k,m(b,k)}function d(a,b){var c={"private":new b.Private,"protected":new b.Protected,"public":new b.Public,constructor:b.constructor};return k(c.private,a.private),k(c.protected,a.protected),k(c.public,a.public),c}function e(b,c){function d(){}function e(){}function f(){}d.prototype=b.private,e.prototype=b.protected,f.prototype=b.public;var g={extend:b.extend,constructor:b.constructor,sup:c!==a?c.constructor:function(){},Private:d,Protected:e,Public:f};return g}function f(a,b){a.Private.prototype.sup=b.private,a.Protected.prototype.sup=b.protected,a.Public.prototype.sup=b.public,n(a,a.Private.prototype.sup),n(a,a.Private.prototype.sup),n(a,a.Public.prototype.sup)}function g(a,b,c){for(var d in b){var e=b[d],f=!1,g=!1,k=d.capitaliseFirstLetter();e instanceof Object&&(p(e)?(b[d]=e.get,c["get"+k]=h(a,d),f=!0):r(e)&&(b[d]=e.is,c["is"+k]=i(a,d),g=!0),q(e)&&(b[d]=f?e.getSet:g?e.isSet:e.set,c["set"+k]=j(a,d)))}}function h(a,b){return function(){return this[a][b]}}function i(a,b){return function(){return this[a][b]}}function j(a,b){return function(c){this[a][b]=c}}function k(a,b){for(var c in a)b.hasOwnProperty(c)||(b[c]=a[c])}function l(a,b){for(var c in b)a[c]=b[c]}function m(b,c){function d(){var a={"private":new c.Private,"protected":new c.Protected,"public":new c.Public,constructor:c.constructor,sup:c.sup};n(a,a.private),n(a,a.protected),n(a,a.public),l(this,a.public),a.constructor.apply(a,arguments)}return c.extend!==a&&(d.prototype=new t[c.extend]),t[b]=d,d}function n(a,b){b.private=a.private||a.Private.prototype,b.protected=a.protected||a.Protected.prototype,b.public=a.public||a.Public.prototype}function o(a){return a.private=a.private||{},a.protected=a.protected||{},a.public=a.public||{},a.sup=a.sup||{},a.constructor=a.constructor||function(){},a}function p(a){return a.hasOwnProperty("get")||a.hasOwnProperty("getSet")}function q(a){return a.hasOwnProperty("set")||a.hasOwnProperty("getSet")||a.hasOwnProperty("isSet")}function r(a){return a.hasOwnProperty("is")||a.hasOwnProperty("isSet")}var s={},t={};Function.prototype.extractFunctionName=function(){var a=this.toString();return a=a.substr("function ".length),a=a.substr(0,a.indexOf("("))},Function.prototype.bindScope=function(a){var b=this;return function(){return b.apply(a,arguments)}},String.prototype.capitaliseFirstLetter=function(){return this.charAt(0).toUpperCase()+this.slice(1)},window.clazz=b}(),function(){"use strict";function a(){for(var a=this,b=new Uint32Array(a.length/4),c=0;c<a.length;c+=4)b[c/4]=(a[c+3]<<24|a[c+2]<<16|a[c+1]<<8|a[c])>>>0;return b}function b(a){for(var b=this,c=new Uint8Array(a.buffer),d=0;d<c.length;d+=1)b[d]=c[d]}Array.prototype.toUint32Array=a,Array.prototype.readUint32ArrayIn=b}(),function(a,b){"use strict";var c=a(function(){this.private={key:{getSet:null},value:{getSet:null},previous:{getSet:null},next:{getSet:null}},this.constructor=function(a,b){this.private.key=a,this.private.value=b}}),LinkedHashMap=a(function(){this.private={duplicateKeyError:"key already exists in LinkedHashMap",keyNotFoundError:"key not found",size:{get:0},first:{get:null},last:{get:null},hashMap:{},add:function(a,b){if(this.private.hashMap.hasOwnProperty(a))throw new Error(this.private.duplicateKeyError);var d=new c(a,b);return this.private.hashMap[a]=d,this.private.size++,d},remove:function(a){var b=a.getKey();a===this.private.first?(this.private.first=this.private.first.getNext(),this.private.first instanceof c&&this.private.first.setPrevious(null)):a===this.private.last?(this.private.last=this.private.last.getPrevious(),this.private.last.setNext(null)):(a.getPrevious().setNext(a.getNext()),a.getNext().setPrevious(a.getPrevious())),this.private.size--,delete this.private.hashMap[b]}},this.protected={addAfter:function(a,b){var c=a.getNext();null!==c?(c.setPrevious(b),b.setNext(c)):this.private.last=b,a.setNext(b),b.setPrevious(a)},addBefore:function(a,b){var c=a.getPrevious();null!==c?(c.setNext(b),b.setPrevious(c)):this.private.first=b,a.setPrevious(b),b.setNext(a)}},this.public={add:function(a,b){var c=this.private.add(a,b);return 1===this.private.size?this.private.first=c:this.protected.addAfter(this.private.last,c),this.private.last=c,c},addAfter:function(a,b,c){var d=this.private.add(b,c),e=this.public.getById(a);return this.protected.addAfter(e,d),d},addBefore:function(a,b,c){var d=this.private.add(b,c),e=this.public.getById(a);return this.protected.addBefore(e,d),d},addFirst:function(a,b){var c=this.private.add(a,b),d=this.private.first;return null!==d&&this.protected.addBefore(d,c),c},addLast:function(a,b){return this.public.add(a,b)},getById:function(a){var c=this.private.hashMap[a];if(c===b)throw new Error(this.private.keyNotFoundError);return c},isEmpty:function(){return 0===this.private.size},remove:function(a){return this.private.hashMap.hasOwnProperty(a)?this.private.remove(this.public.getById(a)):!1},removeFirst:function(){return null===this.private.first?!1:this.private.remove(this.private.first)},removeLast:function(){return null===this.private.last?!1:this.private.remove(this.private.last)}},this.constructor=function(){this.private.hashMap={}}});window.LinkedHashMap=LinkedHashMap}(window.clazz),function(a){"use strict";function Serializable(){this.private={deserialize:function(a){for(var b in a)b in this.protected?this.protected[b]=a[b]:b in this.private&&(this.private[b]=a[b])},serialize:function(a,b){for(var c in a){var d=a[c];this.private.isNumberOrString(d)?b[c]=a[c]:d instanceof Array&&(b[c]=[],this.private.serializeArray(d,b[c]),0===b[c].length&&delete b[c])}},isNumberOrString:function(a){var b=typeof a;return"number"===b||"string"===b},serializeArray:function(a,b){for(var d=0;d<a.length;d+=1){var e=a[d];this.private.isNumberOrString(e)?b.push(e):e instanceof c&&b.push(e.serialize())}}},this.protected={deserializeArray:function(a,b){for(var c=[],d=0;d<a.length;d++){var e=a[d];c[d]=new b(e)}return c}},this.public={serialize:function(){var a={};return this.private.serialize(this.private,a),this.private.serialize(this.protected,a),this.private.serialize(this.public,a),a}},this.constructor=function(a){this.private.deserialize(a)}}var b=a(Serializable),c=b;window.SerializableClass=b}(window.clazz),function(a,LinkedHashMap){"use strict";function b(b,d,e){var g=f(e);a(c(b,g),function(){d.apply(this,g)})}function c(a,b){return a+" ["+b+"]"}function d(a,b){var c,d=a.toString(),f=new LinkedHashMap;for(var g in b)b.hasOwnProperty(g)&&(c=d.indexOf(g+","),-1===c&&(c=d.indexOf(g+")")),e(c,b[g],f));return f}function e(a,b,c){for(var d=c.getFirst();d;d=d.getNext())if(a<d.getKey())return c.addBefore(d.getKey(),a,b);return c.add(a,b)}function f(a){for(var b=[],c=a.getFirst();c;c=c.getNext())b.push(c.getValue());return b}window.whereIt=function(a,c,e){for(var f=0;f<e.length;f++)b(a,c,d(c,e[f]))}}(window.it,window.LinkedHashMap);