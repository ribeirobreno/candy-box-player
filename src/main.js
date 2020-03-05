(function(unsafeWindow) {
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

    function getQuestData() {
        return unsafeWindow.quest;
    }
    function getCharData() {
        return getQuestData().things[getQuestData().getCharacterIndex()];
    }
    function getCurrentHP() {
        return getCharData().hp;
    }
    function getMaxHP() {
        return getQuestData().getCharacterMaxHp();
    }
    function hasWeapon() {
        return getCharData().weapon != 'none';
    }

    function draw() {
        el.innerHTML = getCurrentHP() + '/' + getMaxHP();

        requestAnimationFrame(draw);
    }

    function loop() {
        if (btn && dst && dst.selectedIndex > -1 && !btn.disabled && hasWeapon()) {
            if (clicked) {
                clicked = false;
                if (getCurrentHP()) {
                    if (dst.options.length > (dst.selectedIndex + 1)) {
                        if (--requiredRuns < 1) {
                            requiredRuns = 1;
                            ++dst.selectedIndex;
                        }
                    }
                } else if (dst.selectedIndex > 0) {
                    --dst.selectedIndex;
                    requiredRuns += 5;
                    if (getMaxHP() < (Number.MAX_SAFE_INTEGER/2) && eat) {
                        eat.dispatchEvent(new Event('click'));
                        el.innerHTML = getCurrentHP() + '/' + getMaxHP();
                    }
                }
            }

            btn.dispatchEvent(new Event('click'));
            clicked = true;
        } else {
            let buySword = document.querySelectorAll('#sword_with_button button');
            if (buySword && buySword.length) {
                buySword.forEach((el) => {
                    if (!el.disabled) {
                        el.dispatchEvent(new Event('click'));
                    }
                });
            }
        }

        if (dst && dst.selectedIndex < 0) {
            dst.selectedIndex = 0;
        }

        setTimeout(loop, 1000/60);
    }

    setTimeout(loop, 1000/60);
    requestAnimationFrame(draw);
})(unsafeWindow);
