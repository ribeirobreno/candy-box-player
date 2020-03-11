// ==UserScript==
// @name         Play Candy Box
// @namespace    http://ribeirobreno.com.br/
// @version      0.12.0
// @updateURL    https://github.com/ribeirobreno/candy-box-player/raw/master/Play-Candy-Box.meta.js
// @downloadURL  https://github.com/ribeirobreno/candy-box-player/raw/master/Play-Candy-Box.user.js
// @description  Automate some tasks from the first Candy Box game.
// @author       Breno Ribeiro <ribeiro.breno@gmail.com>
// @match        https://candybox2.github.io/candybox/
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=0)}([function(e,t,n){e.exports=n(1)},function(e,t){!function(e,t){"use strict";var n=!1,r=5,o=36e3,i=t.createElement("div"),l=t.getElementById("quest_button"),u=t.getElementById("quest_destination"),c=t.getElementById("eat");function a(){return e.quest}function s(e,t){var n=a().things||[],r=(n.length,{}),o=!0,i=!1,l=void 0;try{for(var u,c=n[Symbol.iterator]();!(o=(u=c.next()).done);o=!0)if((r=u.value).type===t&&r.text===e)return!0}catch(e){i=!0,l=e}finally{try{o||null==c.return||c.return()}finally{if(i)throw l}}return!1}function d(){return u&&u.options?u.options.length:0}function f(){return u?u.selectedIndex:-1}function p(){var e=a().things[a().getCharacterIndex()];return e&&e.hp?e.hp:0}function b(){return a().getCharacterMaxHp()}function v(){return p()+"/"+b()+"<br>Quest: "+(f()+1)+"/"+d()+"<br>Runs left: "+r+"<br>Hut: "+(100*o/36e3).toFixed(3)+"%"}i.style='position:fixed;bottom:.5em;right:.5em;border:1px solid #080;background-color:#8F8;color:#030;padding:.125em .25em;text-align:center;font-family:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;',i.innerHTML="Soon!",t.body.appendChild(i),setTimeout((function m(){if(l&&u&&f()>-1&&!l.disabled&&"none"!=e.sword.name)n&&(n=!1,p()?d()>f()+1&&--r<1&&(r=5,++u.selectedIndex):f()>0&&(--u.selectedIndex,r+=5,b()<Number.MAX_SAFE_INTEGER/2&&c&&(c.dispatchEvent(new Event("click")),i.innerHTML=v()))),l.dispatchEvent(new Event("click")),n=!0;else{var h=t.querySelectorAll("#sword_with_button button"),y=t.getElementById("go_to_hut");if(h&&h.length&&h.forEach((function(e){e.disabled||e.dispatchEvent(new Event("click"))})),e.shop&&e.shop.shown&&(x="impInvocationScroll",((_=e.potions)&&_.list&&_.list[x]&&_.list[x].nbrOwned?_.list[x].nbrOwned:0)<2)){var g=t.getElementById("buy_scroll");g&&!g.disabled&&g.dispatchEvent(new Event("click"))}if(y){e.lollipops&&e.lollipops.nbrOwned>4e4&&o>0?--o:o=36e3,o<1&&y.dispatchEvent(new Event("click"));var E=t.querySelectorAll("#map button");E&&E.length&&E.forEach((function(e){!e.disabled&&/^(Sword, better sword|Candies, faster candies) !.+/.test(e.innerHTML)&&e.dispatchEvent(new Event("click"))}))}if(a().weAreQuestingRightNow&&s("GHO","mob")&&!function(e){return s(e,"ally")}("IMP")){var w=t.querySelectorAll("#quest_potions button");w&&w.length&&w.forEach((function(e){!e.disabled&&/^Imp invocation scroll.+/.test(e.innerHTML)&&e.dispatchEvent(new Event("click"))}))}}var x,_;u&&f()<0&&(u.selectedIndex=0),setTimeout(m,1e3/60)}),1e3/60),requestAnimationFrame((function e(){i.innerHTML=v(),requestAnimationFrame(e)}))}(unsafeWindow,document)}]);