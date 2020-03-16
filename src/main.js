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

    function doClick(el) {
        el.dispatchEvent(new Event('click'));
    }
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
    function getThings() {
        return getQuestData().things || [];
    }
    function sumMobsHP() {
        const things = getThings();
        let thing = {}, hp = 0;

        for (thing of things) {
            if (thing.type === 'mob') {
                hp += (thing.hp || 0);
            }
        }

        return hp;
    }
    function isThingPresent(text, type) {
        const things = getThings();
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
    function getNextThing() {
        let things = getThings(),
            nextInd = getQuestData().getCharacterIndex() + 1;

        return things.length > nextInd ? things[nextInd] : {};
    }
    function getNextThingHP() {
        return getNextThing().hp || 0;
    }
    function getNextThingMaxHP() {
        let thing = getNextThing();
        return thing.max_hp || 0;
    }
    function isNextThingAMob() {
        return getNextThing().type === 'mob';
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
        return getThings()[getQuestData().getCharacterIndex()];
    }
    function getCurrentHP() {
        let data = getCharData();
        return (data && data.hp) ? data.hp : 0;
    }
    function getMaxHP() {
        return getQuestData().getCharacterMaxHp();
    }
    function getHPFraction() {
        return getCurrentHP() / getMaxHP();
    }
    function getHPMissing() {
        return getMaxHP() - getCurrentHP();
    }
    function hasWeapon() {
        let sword = unsafeWindow.sword;
        return sword && sword.name != 'none';
    }
    function hasShop() {
        let shop = unsafeWindow.shop;
        return shop && shop.shown;
    }
    function hasMagicianHat() {
        let objects = unsafeWindow.objects;
        return objects && objects.list && objects.list.magicianHat.have;
    }
    function getLollipopsPlanted() {
        let farm = unsafeWindow.farm;
        return (farm && farm.lollipopsPlanted) ? farm.lollipopsPlanted : 0;
    }

    function createPanelHTML() {
        return (100 * getHPFraction()).toFixed(3) + '% of ' + getMaxHP() +
            '<br>Quest: ' + (getCurrentQuest() + 1) +
            '/' + getTotalQuestsAvailable() +
            '<br>Mobs HP: ' + sumMobsHP() +
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
                    if (getMaxHP() < (Number.MAX_SAFE_INTEGER / 2) && eat) {
                        doClick(eat);
                    }
                }
            }

            doClick(btn);
            clicked = true;
        } else {
            let buySword = document.querySelectorAll('#sword_with_button button'),
                plant = document.getElementById('plant_1_lp'),
                hut = document.getElementById('go_to_hut');
            if (buySword && buySword.length) {
                buySword.forEach((el) => {
                    if (!el.disabled) {
                        doClick(el);
                    }
                });
            }

            if (
                hasShop() &&
                (
                    potionCount('fireScroll') < 20 ||
                    (
                        potionCount('impInvocationScroll') < 2 &&
                        hasMagicianHat()
                    )
                )
            ) {
                let buyScroll = document.getElementById('buy_scroll');
                if (buyScroll && !buyScroll.disabled && getComputedStyle(buyScroll, null).getPropertyValue('visibility') !== 'hidden') {
                    doClick(buyScroll);
                }
            }

            if (plant && !plant.disabled && getLollipopsPlanted() < 17402) {
                doClick(plant);
            }

            if (hut) {
                if (shouldHut()) {
                    doClick(hut);
                }

                let mapButtons = document.querySelectorAll('#map button');
                if (mapButtons && mapButtons.length) {
                    mapButtons.forEach((el) => {
                        if (
                            !el.disabled &&
                            /^(Sword, better sword|Candies, faster candies) !.+/.test(el.innerHTML)
                        ) {
                            doClick(el);
                        }
                    });
                }
            }

            if (isInQuest()) {
                if (eat && isNextThingAMob() && getNextThingMaxHP() > getMaxHP()) {
                    doClick(eat);
                }

                let potionButtons = document.querySelectorAll('#quest_potions button');
                if (potionButtons && potionButtons.length) {
                    potionButtons.forEach((el) => {
                        if (!el.disabled) {
                            let btnText = el.innerHTML;
                            if (
                                /^Imp invocation scroll.+/.test(btnText) && isMobPresent('GHO') && !isAllyPresent('IMP')
                            ) {
                                doClick(el);
                                requiredRuns = 1;
                            } else if (
                                (
                                    /^Fire scroll.+/.test(btnText) && isNextThingAMob() && getNextThingHP() > 100
                                ) || (
                                    /^Teleport scroll.+/.test(btnText) && isNextThingAMob() && getNextThingHP() > getCurrentHP() && getHPMissing() > 50
                                ) || (
                                    /^Health potion.+/.test(btnText) && getHPMissing() > 50 && sumMobsHP() >= getCurrentHP()
                                )
                            ) {
                                doClick(el);
                            }
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
