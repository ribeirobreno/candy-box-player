(function(unsafeWindow, document) {
    'use strict';

    const RUNS_REF = 5,
        HUT_COUNTER_WAIT = 36000,
        MAX_LOLLIPOPS_PLANTED = 17402,
        TIME_BETWEEN_ITERATIONS = 1000/60;

    function getElById(id) {
        return document.getElementById(id);
    }
    function getElementsBySelector(selector) {
        return document.querySelectorAll(selector) || [];
    }

    var clicked = false,
        requiredRuns = RUNS_REF,
        hutCounter = HUT_COUNTER_WAIT,
        lastMobCount =  0,
        el = document.createElement('div'),
        btn = getElById('quest_button'),
        dst = getElById('quest_destination'),
        eat = getElById('eat');

    el.style = 'position:fixed;bottom:.5em;right:.5em;border:1px solid #080;background-color:#8F8;color:#030;padding:.125em .25em;text-align:center;font-family:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;';
    el.innerHTML = 'Soon!';
    document.body.appendChild(el);

    function doClick(el) {
        el.dispatchEvent(new Event('click'));
    }
    function isEnabled(el) {
        return el && !el.disabled;
    }
    function hasVisibility(el) {
        return el && getComputedStyle(el, null).getPropertyValue('visibility') !== 'hidden';
    }
    function shouldHut() {
        let lollipops = unsafeWindow.lollipops;
        if (
            lollipops &&
            lollipops.nbrOwned > 40000 &&
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
    function countMobs() {
        const things = getThings();
        let thing = {}, num = 0;

        for (thing of things) {
            if (thing.type === 'mob') {
                ++num;
            }
        }

        return num;
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
            '<br>HP/Mobs: ' + sumMobsHP() + '/' + lastMobCount +
            '<br>Runs left: ' + requiredRuns +
            '<br>Hut: ' + (100 * hutCounter / HUT_COUNTER_WAIT).toFixed(3) + '%';
    }

    function draw() {
        el.innerHTML = createPanelHTML();

        requestAnimationFrame(draw);
    }

    function loop() {
        if (isEnabled(btn) && getCurrentQuest() > -1 && hasWeapon()) {
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
            let buySword = getElementsBySelector('#sword_with_button button'),
                plant = getElById('plant_1_lp'),
                hut = getElById('go_to_hut');
            buySword.forEach((el) => {
                if (isEnabled(el)) {
                    doClick(el);
                }
            });

            if (hasShop()) {
                if (
                    getLollipopsPlanted() >= MAX_LOLLIPOPS_PLANTED &&
                    (
                        potionCount('fireScroll') < 10 ||
                        (
                            potionCount('impInvocationScroll') < 2 &&
                            hasMagicianHat()
                        )
                    )
                ) {
                    let buyScroll = getElById('buy_scroll');
                    if (isEnabled(buyScroll) && hasVisibility(buyScroll)) {
                        doClick(buyScroll);
                    }
                } else if ((getLollipopsPlanted() / MAX_LOLLIPOPS_PLANTED) < 0.6) {
                    let buyLollipops = getElById('buy_10_lollipops');
                    if (isEnabled(buyLollipops) && hasVisibility(buyLollipops)) {
                        doClick(buyLollipops);
                    }
                }
            }

            if (isEnabled(plant) && getLollipopsPlanted() < MAX_LOLLIPOPS_PLANTED) {
                doClick(plant);
            }

            if (hut) {
                if (shouldHut()) {
                    doClick(hut);
                }

                let mapButtons = getElementsBySelector('#map button');
                mapButtons.forEach((el) => {
                    if (
                        isEnabled(el) &&
                        /^(Sword, better sword|Candies, faster candies|Surpass yourself) .+/.test(el.innerHTML)
                    ) {
                        doClick(el);
                    }
                });
            }

            if (isInQuest()) {
                if (eat && isNextThingAMob() && getNextThingMaxHP() > getMaxHP()) {
                    doClick(eat);
                }

                let currMobCount = countMobs(),
                    potionButtons = getElementsBySelector('#quest_potions button');
                potionButtons.forEach((el) => {
                    if (isEnabled(el)) {
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
                                currMobCount <= lastMobCount &&
                                /^ Teleport scroll.+ /.test(btnText) &&
                                isNextThingAMob() &&
                                getNextThingHP() > getCurrentHP() &&
                                getHPMissing() > 50
                            ) || (
                                /^Health potion.+/.test(btnText) && getHPMissing() > 50 && sumMobsHP() >= getCurrentHP()
                            )
                        ) {
                            doClick(el);
                        }
                    }
                });

                lastMobCount = currMobCount;
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
