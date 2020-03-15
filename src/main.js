(function(unsafeWindow, document) {
    'use strict';

    const RUNS_REF = 5,
        HUT_COUNTER_WAIT = 36000,
        TIME_BETWEEN_ITERATIONS = 1000/60;

    var clicked = false,
        requiredRuns = RUNS_REF,
        hutCounter = HUT_COUNTER_WAIT,
        el = document.createElement('div'),
        btn = document.getElementById('quest_button'),
        dst = document.getElementById("quest_destination"),
        eat = document.getElementById("eat");

    el.style = 'position:fixed;bottom:.5em;right:.5em;border:1px solid #080;background-color:#8F8;color:#030;padding:.125em .25em;text-align:center;font-family:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;';
    el.innerHTML = 'Soon!';
    document.body.appendChild(el);

    function shouldHut() {
        if (
            unsafeWindow.lollipops &&
            unsafeWindow.lollipops.nbrOwned > 40000 &&
            hutCounter > 0
        ) {
            --hutCounter;
        } else {
            hutCounter = HUT_COUNTER_WAIT;
        }

        return hutCounter < 1;
    }
    function getQuestData() {
        return unsafeWindow.quest;
    }
    function isInQuest() {
        return getQuestData().weAreQuestingRightNow || false;
    }
    function isThingPresent(text, type) {
        const things = getQuestData().things || [],
            t = things.length;
        let thing = {};

        for (thing of things) {
            if (
                thing.type === type &&
                thing.text === text
            ) {
                return true;
            }
        }

        return false;
    }
    function isMobPresent(text) {
        return isThingPresent(text, 'mob');
    }
    function isAllyPresent(text) {
        return isThingPresent(text, 'ally');
    }
    function potionCount(name) {
        const potions = unsafeWindow.potions;
        return (
            potions &&
            potions.list &&
            potions.list[name] &&
            potions.list[name].nbrOwned
        ) ? potions.list[name].nbrOwned : 0;
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
        return unsafeWindow.shop && unsafeWindow.shop.shown;
    }
    function hasMagicianHat() {
        return unsafeWindow.objects && unsafeWindow.objects.list && unsafeWindow.objects.list.magicianHat.have;
    }
    function getLollipopsPlanted() {
        return (unsafeWindow.farm && unsafeWindow.farm.lollipopsPlanted) ? unsafeWindow.farm.lollipopsPlanted : 0;
    }

    function createPanelHTML() {
        return getCurrentHP() + '/' + getMaxHP() +
            '<br>Quest: ' + (getCurrentQuest() + 1) +
            '/' + getTotalQuestsAvailable() +
            '<br>Runs left: ' + requiredRuns +
            '<br>Hut: ' + (100 * hutCounter / HUT_COUNTER_WAIT).toFixed(3) + '%';
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
                    dst.selectedIndex = 0;
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
            let buySword = document.querySelectorAll('#sword_with_button button'),
                plant = document.getElementById('plant_1_lp'),
                hut = document.getElementById('go_to_hut');
            if (buySword && buySword.length) {
                buySword.forEach((el) => {
                    if (!el.disabled) {
                        el.dispatchEvent(new Event('click'));
                    }
                });
            }

            if (hasShop() && potionCount('impInvocationScroll') < 2 && hasMagicianHat()) {
                let buyScroll = document.getElementById('buy_scroll');
                if (buyScroll && !buyScroll.disabled && getComputedStyle(buyScroll, null).getPropertyValue('visibility') !== 'hidden') {
                    buyScroll.dispatchEvent(new Event('click'));
                }
            }

            if (plant && !plant.disabled && getLollipopsPlanted() < 17402) {
                plant.dispatchEvent(new Event('click'));
            }

            if (hut) {
                if (shouldHut()) {
                    hut.dispatchEvent(new Event('click'));
                }

                let mapButtons = document.querySelectorAll('#map button');
                if (mapButtons && mapButtons.length) {
                    mapButtons.forEach((el) => {
                        if (
                            !el.disabled &&
                            /^(Sword, better sword|Candies, faster candies) !.+/.test(el.innerHTML)
                        ) {
                            el.dispatchEvent(new Event('click'));
                        }
                    });
                }
            }

            if (isInQuest() && isMobPresent('GHO') && !isAllyPresent('IMP')) {
                let potionButtons = document.querySelectorAll('#quest_potions button');
                if (potionButtons && potionButtons.length) {
                    potionButtons.forEach((el) => {
                        if (
                            !el.disabled &&
                            /^Imp invocation scroll.+/.test(el.innerHTML)
                        ) {
                            el.dispatchEvent(new Event('click'));
                            requiredRuns = 1;
                        }
                    });
                }
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
