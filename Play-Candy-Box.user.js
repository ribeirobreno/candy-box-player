// ==UserScript==
// @name         Play Candy Box
// @namespace    http://ribeirobreno.com.br/
// @version      0.8
// @updateURL    https://github.com/ribeirobreno/candy-box-player/raw/master/Play-Candy-Box.meta.js
// @downloadURL  https://github.com/ribeirobreno/candy-box-player/raw/master/Play-Candy-Box.user.js
// @description  Automate some tasks from the first Candy Box game.
// @author       Breno Ribeiro <ribeiro.breno@gmail.com>
// @match        https://candybox2.github.io/candybox/
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==
!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=0)}([function(e,t,n){e.exports=n(1)},function(e,t){!function(e,t){"use strict";var n=!1,o=1,r=t.createElement("div"),i=t.getElementById("quest_button"),u=t.getElementById("quest_destination"),c=t.getElementById("eat");function d(){return e.quest}function l(){var e=d().things[d().getCharacterIndex()];return e&&e.hp?e.hp:0}function a(){return d().getCharacterMaxHp()}r.style='position:fixed;top:0;border:1px solid #080;background-color:#8F8;color:#030;padding:.125em .25em;text-align:center;font-family:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;',r.innerHTML="HP soon!",t.body.appendChild(r),setTimeout((function d(){if(i&&u&&u.selectedIndex>-1&&!i.disabled&&"none"!=e.sword.name)n&&(n=!1,l()?u.options.length>u.selectedIndex+1&&--o<1&&(o=1,++u.selectedIndex):u.selectedIndex>0&&(--u.selectedIndex,o+=5,a()<Number.MAX_SAFE_INTEGER/2&&c&&(c.dispatchEvent(new Event("click")),r.innerHTML=l()+"/"+a()))),i.dispatchEvent(new Event("click")),n=!0;else{var s=t.querySelectorAll("#sword_with_button button");s&&s.length&&s.forEach((function(e){e.disabled||e.dispatchEvent(new Event("click"))}))}u&&u.selectedIndex<0&&(u.selectedIndex=0),setTimeout(d,1e3/60)}),1e3/60),requestAnimationFrame((function e(){r.innerHTML=l()+"/"+a(),requestAnimationFrame(e)}))}(unsafeWindow,document)}]);