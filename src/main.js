(function() {
    'use strict';

    var clicked = false,
        requiredRuns = 1,
        el = document.createElement('div'),
        btn = document.getElementById('quest_button'),
        dst = document.getElementById("quest_destination"),
        eat = document.getElementById("eat");

    el.style = 'position:fixed;top:0;border:1px solid #080;background-color:#8F8;color:#030;padding:.125em .25em;text-align:center;font-family:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;';
    el.innerHTML = 'HP soon!';
    document.body.appendChild(el);

    function draw() {
        el.innerHTML = unsafeWindow.quest.getCharacterMaxHp();

        requestAnimationFrame(draw);
    }

    function loop() {
        if (btn && dst && dst.selectedIndex > -1 && !btn.disabled) {
            if (clicked) {
                clicked = false;
                if (unsafeWindow.quest.things[unsafeWindow.quest.getCharacterIndex()].hp) {
                    if (dst.options.length > (dst.selectedIndex + 1)) {
                        if (--requiredRuns < 1) {
                            requiredRuns = 1;
                            ++dst.selectedIndex;
                        }
                    }
                } else if (dst.selectedIndex > 0) {
                    --dst.selectedIndex;
                    requiredRuns += 5;
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