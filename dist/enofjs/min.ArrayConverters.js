/* !!EnoFJS!! Version: 3.0.0, Author: EnoF <andy@provictores.com> (http://enof.github.io/EnoFJS, Fork me on Github: https://github.com/EnoF/EnoFJS */!function(){"use strict";function a(){for(var a=this,b=new Uint32Array(a.length/4),c=0;c<a.length;c+=4)b[c/4]=(a[c+3]<<24|a[c+2]<<16|a[c+1]<<8|a[c])>>>0;return b}function b(a){for(var b=this,c=new Uint8Array(a.buffer),d=0;d<c.length;d+=1)b[d]=c[d]}Array.prototype.toUint32Array=a,Array.prototype.readUint32ArrayIn=b}();