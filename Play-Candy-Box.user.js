// ==UserScript==
// @name         Play Candy Box
// @namespace    http://ribeirobreno.com.br/
// @version      0.5
// @updateURL    https://github.com/ribeirobreno/candy-box-player/raw/master/Play-Candy-Box.meta.js
// @downloadURL  https://github.com/ribeirobreno/candy-box-player/raw/master/Play-Candy-Box.user.js
// @description  Automate some tasks from the first Candy Box game.
// @author       Breno Ribeiro <ribeiro.breno@gmail.com>
// @match        https://candybox2.github.io/candybox/
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==
!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=0)}([function(e,t,n){e.exports=n(1)},function(e,t){!function(){"use strict";var e=!1,t=document.createElement("div"),n=document.getElementById("quest_button"),o=document.getElementById("quest_destination"),r=document.getElementById("eat");t.style='position:fixed;top:0;border:1px solid #080;background-color:#8F8;color:#030;padding:.125em .25em;text-align:center;font-family:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;',t.innerHTML="HP soon!",document.body.appendChild(t),setTimeout((function i(){n&&o&&o.selectedIndex>-1&&!n.disabled&&(e&&(e=!1,unsafeWindow.quest.things[unsafeWindow.quest.getCharacterIndex()].hp?o.options.length>o.selectedIndex+1&&++o.selectedIndex:o.selectedIndex>0&&(--o.selectedIndex,unsafeWindow.quest.getCharacterMaxHp()<Number.MAX_SAFE_INTEGER/2&&r&&(r.dispatchEvent(new Event("click")),t.innerHTML=unsafeWindow.quest.getCharacterMaxHp()))),n.dispatchEvent(new Event("click")),e=!0),o&&o.selectedIndex<0&&(o.selectedIndex=0),setTimeout(i,1e3/60)}),1e3/60),requestAnimationFrame((function e(){t.innerHTML=unsafeWindow.quest.getCharacterMaxHp(),requestAnimationFrame(e)}))}()}]);