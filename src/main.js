(function(unsafeWindow, document) {
    'use strict';

    const RUNS_REF = 5,
        TIME_BETWEEN_ITERATIONS = 1000/60;

    var clicked = false,
        requiredRuns = RUNS_REF,
        el = document.createElement('div'),
        btn = document.getElementById('quest_button'),
        dst = document.getElementById("quest_destination"),
        eat = document.getElementById("eat");

    el.style = 'position:fixed;top:0;border:1px solid #080;background-color:#8F8;color:#030;padding:.125em .25em;text-align:center;font-family:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;';
    el.innerHTML = 'Soon!';
    document.body.appendChild(el);

    function getQuestData() {
        return unsafeWindow.quest;
    }
    function getTotalQuestsAvailable() {
        return (dst && dst.options) ? dst.options.length : 0;
    }
    function getCurrentQuest() {
        return dst ? dst.selectedIndex : -1;
    }
    function getCharData() {
        return getQuestData().things[getQuestData().getCharacterIndex()];
    }
    function getCurrentHP() {
        let data = getCharData();
        return (data && data.hp) ? data.hp : 0;
    }
    function getMaxHP() {
        return getQuestData().getCharacterMaxHp();
    }
    function hasWeapon() {
        return unsafeWindow.sword.name != 'none';
    }
    function hasShop() {
        return unsafeWindow.shop.shown;
    }

    function createPanelHTML() {
        return getCurrentHP() + '/' + getMaxHP() +
            '<br>Quest: ' + (getCurrentQuest() + 1) +
            '/' + getTotalQuestsAvailable() +
            '<br>Runs left: ' + requiredRuns;
    }

    function draw() {
        el.innerHTML = createPanelHTML();

        requestAnimationFrame(draw);
    }

    function loop() {
        if (btn && dst && getCurrentQuest() > -1 && !btn.disabled && hasWeapon()) {
            if (clicked) {
                clicked = false;
                if (getCurrentHP()) {
                    if (getTotalQuestsAvailable() > (getCurrentQuest() + 1)) {
                        if (--requiredRuns < 1) {
                            requiredRuns = RUNS_REF;
                            ++dst.selectedIndex;
                        }
                    }
                } else if (getCurrentQuest() > 0) {
                    --dst.selectedIndex;
                    requiredRuns += RUNS_REF;
                    if (getMaxHP() < (Number.MAX_SAFE_INTEGER/2) && eat) {
                        eat.dispatchEvent(new Event('click'));
                        el.innerHTML = createPanelHTML();
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

        if (dst && getCurrentQuest() < 0) {
            dst.selectedIndex = 0;
        }

        setTimeout(loop, TIME_BETWEEN_ITERATIONS);
    }

    setTimeout(loop, TIME_BETWEEN_ITERATIONS);
    requestAnimationFrame(draw);
})(unsafeWindow, document);
