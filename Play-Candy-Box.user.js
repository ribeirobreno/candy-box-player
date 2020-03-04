// ==UserScript==
// @name         Play Candy Box
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate some tasks from the first Candy Box
// @author       Breno Ribeiro <ribeiro.breno@gmail.com>
// @match        https://candybox2.github.io/candybox/
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    var clicked = false,
        el = document.createElement('div');
    el.style = 'position:fixed;top:0;border:1px solid #080;background-color:#8F8;color:#030;padding:.125em .25em;text-align:center;font-family:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;';
    el.innerHTML = 'HP soon!';
    document.body.appendChild(el);

    function draw() {
        el.innerHTML = unsafeWindow.quest.getCharacterMaxHp();

        requestAnimationFrame(draw);
    }

    function loop() {
        var btn = document.getElementById('quest_button'),
            dst = document.getElementById("quest_destination"),
            eat = document.getElementById("eat");

        if (btn && dst && dst.selectedIndex > -1 && !btn.disabled) {
            if (clicked) {
                clicked = false;
                if (unsafeWindow.quest.things[unsafeWindow.quest.getCharacterIndex()].hp) {
                    if (dst.options.length > (dst.selectedIndex + 1)) {
                        ++dst.selectedIndex;
                    }
                } else if (dst.selectedIndex > 0) {
                    --dst.selectedIndex;
                    if (unsafeWindow.quest.getCharacterMaxHp() < (Number.MAX_SAFE_INTEGER/2) && eat) {
                        eat.dispatchEvent(new Event('click'));
                        el.innerHTML = unsafeWindow.quest.getCharacterMaxHp();
                    }
                }
            }

            btn.dispatchEvent(new Event('click'));
            clicked = true;
        }

        if (dst && dst.selectedIndex < 0) {
            dst.selectedIndex = 0;
        }

        setTimeout(loop, 1000/60);
    }

    setTimeout(loop, 1000/60);
    requestAnimationFrame(draw);
})();