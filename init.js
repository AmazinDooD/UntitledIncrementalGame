function initGameObject() {
    return {
        stats: {
            totalClicks: 0,
            totalShapes: 0,
            totalGildedShapes: 0,
            totalPrestige: 0,
            overclockCount: 0,
            statsOpen: false,
            helpOpen: false,
            clicksInLastSecond: 0,
        },
        resources: {
            shapes: 0,
            gildedShapes: 0,
            astralShapes: 0,
            paintedShapes: {
                t1: [0,0,0], // [red, blue, yellow]
                t2: [0,0,0], // [orange, purple, green]
                golden: 0,
            },
        },
        variables: {
            shapesPerClick: 1,
            ticksPerClick: 1,
            efficiency: 0,
            overclocked: false,
            overclockBoost: 1.2,
            canOverclock: true,
            overclockTimer: 0,
            paintedShapesBoost: 100,
            overclockCooldown: 40,
        },
        prestige: {
            prestigeMin: 10_000,
            prestigeIncrement: 10,
            gildedShapesBoostPercent: 100,
            gildedShapesGainPercent: 100,
            astralShapesOnPrestigePercent: 0,
        },
        shop: {
            costs: [10, 100, 1_500, 100_000, 25_000_000, 1_000_000_000],
            isExpensiveCost: [false, true, false, true, true, true],
            costIncrease: 2,
            costIncreaseExpensive: 3,
        },
        altar: {
            altarOpen: false,
            altarUnlocked: false,
            altarDiv: document.getElementById('altar'),
            astralShapesAvailable: 0,
            astralShapesAllocated: [0, 0, 0, 0],
            totalAstralAllocated: 0,
            spells: ["Golden Ritual", "Gifted Rebirth", "Astral Prestige", "Cosmic Colours"],
        },
        painting: {
            paintingOpen: false,
            paintingUnlocked: false,
            tierCosts: [100_000, 10], // tier 1 is shapes, rest are gilded shapes
        },
        achievements: {
            names: [
                "It has to start somewhere",
                "Most generic idle game mechanic",
                "Buttons are very useful things",
                "Well, thank you very much",
                "Tiny little thing 😊",
                "OVER overclocked",
                "Can't count that high",
                "Δβγξξ",
                "01001000 00110100 01011000 01011000 00110000 01010010",
                "You CHEATER",
            ],
            descriptions: [
                "Gain 100 shapes.",
                "Prestige for the first time.",
                "???",
                "???",
                "???",
                "Overclock 25 times.",
                "Have over 10 Gilded Shapes after you prestige once.",
                "Unlock the Altar.",
                "???",
                "???",
            ],
            secretAchievementDescriptions: [
                null,
                null,
                "Press an achievement button.",
                "Click on any of my links.",
                "Tiny little hamster 😊",
                null,
                null,
                null,
                "Execute the function hax() from the console.",
                "You used an autoclicker. (Either that, or you clicked really fast)",
            ],
            buttons: [],
            achievementsOpen: false,
            sorted: { // filled by generateAchievementMatrix()
                achievements: [],
                descriptions: [],
            },
        },
        divs: {
            mainDiv: document.getElementById("main-game"),
            altarDiv: document.getElementById("altar"),
            paintingDiv: document.getElementById("paint"),
            achievementDiv: document.getElementById("achievement-text"),
            achievementButtonDiv: document.getElementById("achievements"),
        }
    }
}

let game = initGameObject();

const get = (id) => {
    if (id[0] !== "#" || id[0] !== ".") id = "#" + id
    return document.querySelector(id)
}

const localStorageItems = () => {
    let localStorageItems = [
        ["stats-totalClicks",game.stats.totalClicks],
        ["stats-totalShapes",game.stats.totalShapes],
        ["stats-totalGildedShapes",game.stats.totalGildedShapes],
        ["stats-totalPrestige",game.stats.totalPrestige],
        ["stats-overclockCount",game.stats.overclockCount],
        ["resources-shapes",game.resources.shapes],
        ["resources-gildedShapes",game.resources.gildedShapes],
        ["resources-astralShapes",game.resources.astralShapes],
        ["resources-paintedShapes-t1-0",game.resources.paintedShapes.t1[0]],
        ["resources-paintedShapes-t1-1",game.resources.paintedShapes.t1[1]],
        ["resources-paintedShapes-t1-2",game.resources.paintedShapes.t1[2]],
        ["resources-paintedShapes-t2-0",game.resources.paintedShapes.t2[0]],
        ["resources-paintedShapes-t2-1",game.resources.paintedShapes.t2[1]],
        ["resources-paintedShapes-t2-2",game.resources.paintedShapes.t2[2]],
        ["resources-paintedShapes-golden",game.resources.paintedShapes.golden],
        ["variables-shapesPerClick",game.variables.shapesPerClick],
        ["variables-ticksPerClick",game.variables.ticksPerClick],
        ["variables-efficiency",game.variables.efficiency],
        ["variables-overclockBoost",game.variables.overclockBoost],
        ["variables-overclockCooldown",game.variables.overclockCooldown],
        ["variables-paintedShapesBoost",game.variables.paintedShapesBoost],
        ["prestige-prestigeMin",game.prestige.prestigeMin],
        ["prestige-gildedShapesBoostPercent",game.prestige.gildedShapesBoostPercent],
        ["prestige-gildedShapesGainPercent",game.prestige.gildedShapesGainPercent],
        ["prestige-astralShapesOnPrestigePercent",game.prestige.astralShapesOnPrestigePercent],
        ["altar-altarUnlocked",game.altar.altarUnlocked],
        ["altar-astralShapesAvailable",game.altar.astralShapesAvailable],
        ["altar-totalAstralAllocated",game.altar.totalAstralAllocated],
        ["painting-paintingUnlocked",game.painting.paintingUnlocked],
    ]
    for (let i=0;i<game.shop.costs.length;i++) localStorageItems.push(["shop-costs-"+i,game.shop.costs[i]]);
    for (let i=0;i<game.altar.astralShapesAllocated.length;i++) localStorageItems.push(["altar-astralShapesAllocated-"+i,game.altar.astralShapesAllocated[i]]);
    for (let i=0;i<game.achievements.unlocked.length;i++) localStorageItems.push(["achievements-unlocked-"+i,game.achievements.unlocked[i]?1:0]);
    return localStorageItems
}

const convertBoolToString = bool => bool ? "Yes" : "No"
game.divs.altarDiv.style.display = 'none';
game.divs.paintingDiv.style.display = 'none';
game.divs.achievementDiv.style.display = 'none';
game.divs.achievementButtonDiv.style.display = 'none';
game.divs.mainDiv.style.display = 'block';
get("overclock-cooldown").style.display = "none";
get("overclock-active").style.display = "none";
game.achievements.unlocked = new Array(game.achievements.names.length).fill(false)
game.achievements.secretAchievementCount = game.achievements.descriptions.filter(x => x === "???").length
document.body.onload = () => {
    get("modal").style.display = "block"
    get("modal-close").onclick = () => {get("modal").style.display = "none"}
    if (+localStorage.getItem("stats-totalClicks") === 0 && +localStorage.getItem("stats-totalShapes") === 0) hardReset(false)
    if (!(navigator.cookieEnabled)) {
        const txt = document.createElement("p")
        txt.classList.add("main-text-mono")
        txt.innerHTML = "Your cookies are disabled!"
        txt.style.fontSize = "35px"
        txt.style.backgroundColor = "#be0000"
        txt.style.borderRadius = "5px"
        txt.style.color = "#4b0000"
        txt.style.textAlign = "center"
        get("hello-txt").insertAdjacentElement("beforebegin",txt)
    }
    generateAchievementMatrix();
    loadFromLocalStorage()
    for (let i=0;i<game.shop.costs.length;i++) {
        get(`shop-${i}-cost`).innerHTML = `Cost: ${game.shop.costs[i].toLocaleString("en-US")} shapes`;
    }
    updateShopButtons()
    get("stats-text").innerHTML = ""
}
window.setInterval(() => idleIncreaseShapes(), 1000)
window.setInterval(() => cheaterCheck(), 1000)
window.setInterval(() => saveToLocalStorage(), 25000)
window.onclick = (e) => {
    if (e.target === get("modal") && navigator.cookieEnabled) get("modal").style.display = "none";
}
get("main-button").onkeydown = (e) => {if (e.keyCode === 13) e.preventDefault();}

function increaseShapes() {
    let increment = game.variables.shapesPerClick * game.variables.ticksPerClick * (1 + game.variables.efficiency);
    increment += game.resources.gildedShapes * (game.prestige.gildedShapesBoostPercent / 100) * (game.variables.shapesPerClick / 2);
    if (game.variables.overclocked) increment = increment ** game.variables.overclockBoost;
    increment = Math.round(increment);

    game.resources.shapes += increment
    game.stats.totalClicks++;
    game.stats.clicksInLastSecond++;
    game.stats.totalShapes += increment;
    if (game.stats.statsOpen) updateStatsText();
    if (game.resources.shapes >= 100) gainAchievement(0);
    updateShopButtons();
    updateShapeText();
}

function generateAchievementMatrix() {
    let i = 0;
    let sortedAchievements = []
    let secretAchievements = [];
    let sortedDescriptions = [];
    for (let i in game.achievements.names) {
        if (game.achievements.descriptions[i] !== "???") {
            sortedAchievements.push(game.achievements.names[i])
            sortedDescriptions.push(game.achievements.descriptions[i])
        } else secretAchievements.push(game.achievements.names[i]);
    }
    for (let i in secretAchievements) {
        sortedAchievements.push(secretAchievements[i]);
        sortedDescriptions.push("???");
    }
    for (let item of sortedAchievements) {
        let button = document.createElement("button");
        let buttonText = document.createTextNode(`${item}:\n${sortedDescriptions[i]}`);
        button.classList.add("button");
        button.classList.add("achievement-locked");
        button.appendChild(buttonText);
        button.onclick = () => gainAchievement(2);
        get("achievements").appendChild(button);
        get("achievements").appendChild(document.createElement("br"));
        if (i === game.achievements.descriptions.length - game.achievements.secretAchievementCount - 1) {
            get("achievements").appendChild(document.createElement("br"));
        }
        game.achievements.buttons.push(button);
        i++;
    }
    game.achievements.sorted.achievements = sortedAchievements;
    game.achievements.sorted.descriptions = sortedDescriptions;
}

function idleIncreaseShapes() {
    for (let i in game.resources.paintedShapes.t1) {
        let increment = game.resources.paintedShapes.t1[i] * Math.round(game.resources.paintedShapes.t2[i] / 10 + 1) * Math.round(game.variables.paintedShapesBoost / 100) * 10_000
        increment *= game.resources.paintedShapes.golden + 1
        if (increment !== 0) game.resources.shapes += increment;
    }
    updateShapeText();
    if (game.stats.statsOpen) updateStatsText();
    updateShopButtons()
}

function updateShapeText() {
    get("shapes-text").innerHTML = `Shapes: ${game.resources.shapes.toLocaleString("en-US")}`;
    get("gilded-shapes-text").innerHTML = `Gilded Shapes: ${game.resources.gildedShapes.toLocaleString("en-US")}`;

    if (game.altar.altarOpen) {
        get("astral-shapes-text").innerHTML = `Astral Shapes: ${game.resources.astralShapes.toLocaleString("en-US")}`;
        get("astral-shapes-available-text").innerHTML = `Astral Shapes Available: ${game.altar.astralShapesAvailable.toLocaleString("en-US")}`;
    }
}

function updateAllText() {
    updateShapeText();
    if (game.stats.statsOpen) updateStatsText();
    updateShopButtons()
    get("prestige-button").innerHTML = `Prestige (requires ${game.prestige.prestigeMin.toLocaleString("en-US")} shapes)`
}

function updateStatsText() {
    get("stats-text").innerHTML = `
        Total Clicks: ${game.stats.totalClicks.toLocaleString("en-US")}<br>
        Total Shapes: ${game.stats.totalShapes.toLocaleString("en-US")}<br>
        Total Gilded Shapes: ${game.stats.totalGildedShapes.toLocaleString("en-US")}<br>
        Total Prestiges: ${game.stats.totalPrestige.toLocaleString("en-US")}<br>
        Shapes per Click: ${game.variables.shapesPerClick.toLocaleString("en-US")}<br>
        Ticks per Click: ${game.variables.ticksPerClick.toLocaleString("en-US")}<br>
        Efficiency: ${game.variables.efficiency.toLocaleString("en-US")}<br>
        Overclock Boost: ^${game.variables.overclockBoost.toLocaleString("en-US")}<br><br>

        Is altar unlocked? ${convertBoolToString(game.altar.altarUnlocked)}<br>
        Astral Shapes allocated: ${game.altar.totalAstralAllocated.toLocaleString("en-US")}<br>
        Astral Shapes available: ${game.altar.astralShapesAvailable.toLocaleString("en-US")}<br><br>

        Is painting unlocked? ${convertBoolToString(game.painting.paintingUnlocked)}<br>
        Golden Shapes: ${game.resources.paintedShapes.golden.toLocaleString("en-US")}<br>
        Total Tier I Shapes: ${game.resources.paintedShapes.t1.reduce((a,b) => a+b,0).toLocaleString("en-US")}<br>
        Total Tier II Shapes: ${game.resources.paintedShapes.t2.reduce((a,b) => a+b,0).toLocaleString("en-US")}<br>`
}

function buyShopItem(item) {
    if (game.resources.shapes < game.shop.costs[item] || !(isFinite(game.shop.costs[item]))) return;

    game.resources.shapes -= game.shop.costs[item];
    if (!(game.shop.isExpensiveCost[item] ?? false)) game.shop.costs[item] *= game.shop.costIncrease
    else game.shop.costs[item] *= game.shop.costIncreaseExpensive

    get(`shop-${item}-cost`).innerHTML = `Cost: ${game.shop.costs[item].toLocaleString("en-US")} shapes`;

    switch (item) {
        case 0:
            game.variables.shapesPerClick++;
            break;
        case 1:
            game.variables.efficiency++;
            break;
        case 2:
            game.variables.ticksPerClick += 2;
            break;
        case 3:
            game.variables.shapesPerClick *= 2;
            break;
        case 4:
            game.variables.overclockBoost = (game.variables.overclockBoost * 100 + 5) / 100;
            get("overclock-text").innerHTML = `Overclocking gives ^${game.variables.overclockBoost.toLocaleString("en-US")} shape gain for 30 seconds and has a cooldown of ${game.variables.overclockCooldown} seconds.`
            if (Math.floor(game.variables.overclockBoost + 0.05) === 5) {
                const btn = get("shop-4")
                btn.disabled = true
                btn.classList.remove("other-button")
                btn.classList.add("disabled-button")
                game.shop.costs[4] = Infinity
                get(`shop-${item}-cost`).innerHTML = "This upgrade is maxed!"
            }
            break;
        case 5:
            game.variables.overclockCooldown -= 1
            if (game.variables.overclockCooldown === 1) {
                const btn = get("shop-5")
                btn.disabled = true
                btn.classList.remove("other-button")
                btn.classList.add("disabled-button")
                game.shop.costs[5] = Infinity
                get(`shop-${item}-cost`).innerHTML = "This upgrade is maxed!"
            }
            get("overclock-text").innerHTML = `Overclocking gives ^${game.variables.overclockBoost.toLocaleString("en-US")} shape gain for 30 seconds and has a cooldown of ${game.variables.overclockCooldown} seconds.`
            break;
    }

    saveToLocalStorage()
    if (game.stats.statsOpen) updateStatsText();
    updateShopButtons()
    updateShapeText();
}

function prestige() {
    if (game.resources.shapes < game.prestige.prestigeMin) {
        alert(`You need at least ${game.prestige.prestigeMin.toLocaleString("en-US")} shapes to prestige.`)
        return;
    }
    if (!(confirm("Are you sure you want to prestige?"))) return;

    let increment = +((game.prestige.gildedShapesGainPercent / 100)*(Math.log10(game.resources.shapes) - 4).toFixed(2));
    game.resources.gildedShapes += increment;
    game.stats.totalGildedShapes += increment;
    game.stats.totalPrestige++;
    game.resources.shapes = 0;
    game.variables.efficiency = 0;
    game.variables.shapesPerClick = 1;
    game.variables.ticksPerClick = 1;
    game.prestige.prestigeMin *= game.prestige.prestigeIncrement;
    game.shop.costs = [10, 100, 2_500, 100_000, 25_000_000, 1_000_000_000];

    if (game.altar.astralShapesAllocated[2] > 0) {
        game.resources.astralShapes += increment * (game.prestige.astralShapesOnPrestigePercent / 100)
    }
    if (game.stats.totalPrestige >= 5) {
        game.painting.paintingUnlocked = true;
        get("painting-button").innerHTML = "Painting";
    }

    get("prestige-button").innerHTML = `Prestige (requires ${game.prestige.prestigeMin.toLocaleString("en-US")} shapes)`;
    if (!(game.achievements.unlocked[1])) gainAchievement(1);
    else if (game.resources.gildedShapes >= 10) gainAchievement(6);
    for (let i=0;i<game.shop.costs.length;i++) {
        get(`shop-${i}-cost`).innerHTML = `Cost: ${game.shop.costs[i].toLocaleString("en-US")} shapes`;
    }
    updateShapeText();
    updateShopButtons()
}

function toggleStats() {
    if (game.stats.statsOpen) {
        get("stats-text").innerHTML = "";
    } else updateStatsText();
    game.stats.statsOpen = !game.stats.statsOpen;
}

function toggleHelp() {
    if (game.stats.helpOpen) {
        get("help-text").innerHTML = "";
    } else {
        get("help-text").innerHTML = `
        To get shapes, press the "generate shapes" button.<br>
        Once you have 10 shapes, you can increase the amount of shapes per click by 1.<br>
        This will cost 10 shapes, and the cost of buying it again will double.<br><br>
        
        Overclocking is a unique mechanic to increase your shape output.<br>
        Every 40s, you can Overclock which raises your shape gain to the power of 1.2 (without any upgrades).<br>
        Some upgrades can increase this.<br><br>
        
        Efficiency increases your shape gain by 1 for each point you have.<br>
        Ticks increase your shape gain by increasing the amount of times that your shapes are calculated per click.<br><br>
        
        Once you reach 10,000 shapes, you may gain prestige and gain Gilded Shapes based on the amount of shapes you have. (Formula: log10(shapes) - 4)<br>
        Each Gilded Shape gives you 50% of your shapes per click.<br><br>
        
        After reaching 10 Gilded Shapes, the Altar is unlocked. There, you may convert Gilded Shapes into Astral Shapes, and allocate them to Spells.<br>
        Spells have various insanely positive effects based on the amount of Astral Shapes that are allocated to it.<br>
        As Astral Shapes do not give the buff that Gilded Shapes do, it is advised to have 0 Astral Shapes available.<br><br>
        
        After you gain prestige 10 times, you unlock the Painting menu. Shapes can be painted for 100,000 shapes, and they are the only idle income source.<br>
        Painted Shapes have multiple tiers, with each tier boosting the last. Painted Shapes only boost their own colour.<br>
        Orange Shapes (Tier II) only boost Red Shapes (Tier I).
        `
    }
    game.stats.helpOpen = !game.stats.helpOpen;
}

function toggleAltar() {
    if (game.resources.gildedShapes >= 10) game.altar.altarUnlocked = true;
    if (!(game.altar.altarUnlocked)) {
        get("altar-button").innerHTML = "Altar (requires 10 Gilded Shapes)";
        alert("You need 10 Gilded Shapes to access the Altar!");
        return;
    }

    gainAchievement(7);
    get("altar-button").innerHTML = "Altar"
    if (game.altar.altarOpen) {
        game.altar.altarDiv.style.display = 'none';
        game.divs.mainDiv.style.display = 'block';
        document.body.style.backgroundColor = '#1b1e23';
    } else {
        game.altar.altarDiv.style.display = 'block';
        game.divs.mainDiv.style.display = 'none';
        document.body.style.backgroundColor = '#25003a';
    }
    game.altar.altarOpen = !game.altar.altarOpen;
    game.painting.paintingOpen = false;
}

function convertShapes(type) {
    let amount = +prompt("How many shapes to convert?")
    if (!(typeof amount === "number") || isNaN(amount) || amount < 0 || !(isFinite(amount))) return;

    if (type === "astral") {
        if (game.resources.astralShapes < amount) {
            alert("Not enough Astral Shapes!")
            return;
        } else {
            game.resources.astralShapes -= amount;
            game.altar.astralShapesAvailable -= amount;
            game.resources.gildedShapes += amount;
        }
    } else if (type === "gilded") {
        if (game.resources.gildedShapes < amount) {
            alert("Not enough Gilded Shapes!")
            return;
        } else {
            game.resources.gildedShapes -= amount;
            game.altar.astralShapesAvailable += amount;
            game.resources.astralShapes += amount;
        }
    } else return;
    updateShapeText();
}

function allocateAstralShapes(spell) {
    let spellName = game.altar.spells[spell];
    let amount = +prompt("How many Astral Shapes to allocate in the spell?")
    if (amount === 0 || !(isNaN(amount))) return;

    game.altar.totalAstralAllocated = 0;
    for (let i of game.altar.astralShapesAllocated) {
        game.altar.totalAstralAllocated += i;
    }
    game.altar.astralShapesAvailable = game.resources.astralShapes - game.altar.totalAstralAllocated;

    if (amount > game.altar.astralShapesAvailable) {
        alert("Not enough Astral Shapes available!")
        return;
    }
    game.altar.astralShapesAllocated[spell] += amount;
    game.altar.astralShapesAvailable -= amount;

    switch (spell) {
        case 0:
            game.prestige.gildedShapesBoostPercent = amount * 5 + 100;
            break;
        case 1:
            game.prestige.gildedShapesGainPercent = amount * 3 + 100;
            break;
        case 2:
            game.prestige.astralShapesOnPrestigePercent = amount * 2;
            break;
        case 3:
            game.variables.paintedShapesBoost = amount * 3 + 100;
            break;
    }
    alert(`Allocated ${amount} Astral Shapes to spell ${spellName}!`);
    updateShapeText();
}

function togglePainting() {
    if (game.stats.totalPrestige >= 5) game.painting.paintingUnlocked = true;
    if (!(game.painting.paintingUnlocked)) {
        alert("You need 5 total prestige to access Painting.")
        return;
    }

    get("painting-button").innerHTML = "Painting";
    if (game.painting.paintingOpen) {
        game.divs.mainDiv.style.display = 'block'
        game.divs.paintingDiv.style.display = 'none'
        document.body.style.backgroundColor = '#1b1e23';
    } else {
        game.divs.mainDiv.style.display = 'none'
        game.divs.paintingDiv.style.display = 'block'
        document.body.style.backgroundColor = '#1b020a';
    }
    game.painting.paintingOpen = !game.painting.paintingOpen;
    game.altar.altarOpen = false
}

function paintShapes(tier) {
    if (tier === 0 && game.resources.shapes < game.painting.tierCosts[tier]) {
        alert(`To paint shapes of tier 1, you need ${game.painting.tierCosts[0].toLocaleString("en-US")} shapes!`);
        return;
    } else if (game.resources.gildedShapes < game.painting.tierCosts[tier]) {
        alert(`To paint shapes of tier ${tier + 1}, you need ${game.painting.tierCosts[tier].toLocaleString("en-US")} Gilded Shapes!`);
        return;
    }
    if (tier === 0) game.resources.shapes -= game.painting.tierCosts[tier];
    else game.resources.gildedShapes -= game.painting.tierCosts[tier];
    let rng = +((Math.random() * 100).toFixed(2));
    switch (tier) {
        case 0:
            if (rng > 99) {
                game.resources.paintedShapes.golden++;
                alert("WOW! +1 Golden Shape!")
            }
            else if (rng > 66) {
                game.resources.paintedShapes.t1[2]++;
                alert("+1 Yellow Shape!")
            }
            else if (rng > 33) {
                game.resources.paintedShapes.t1[1]++;
                alert("+1 Blue Shape!")
            }
            else {
                game.resources.paintedShapes.t1[0]++;
                alert("+1 Red Shape!")
            }
            break;
        case 1:
            if (rng > 99) {
                game.resources.paintedShapes.golden++;
                alert("WOW! +1 Golden Shape!")
            }
            else if (rng > 66) {
                game.resources.paintedShapes.t2[2]++;
                alert("+1 Green Shape!")
            }
            else if (rng > 33) {
                game.resources.paintedShapes.t2[1]++;
                alert("+1 Purple Shape!")
            }
            else {
                game.resources.paintedShapes.t2[0]++;
                alert("+1 Orange Shape!")
            }
    }
}

function overclock() {
    if (!(game.variables.canOverclock)) return;
    game.variables.overclocked = true;
    game.variables.canOverclock = false;
    game.stats.overclockCount++;
    if (game.stats.overclockCount >= 25) gainAchievement(5)
    get("overclock-active").style.display = "block";
    get("overclock-button").disabled = true;
    window.setTimeout(() => overclockCooldown(), 30000)
}

function overclockCooldown() {
    game.variables.overclockTimer = game.variables.overclockCooldown;
    game.variables.overclocked = false;
    get("overclock-active").style.display = "none";
    get("overclock-cooldown").style.display = 'block'
    get("overclock-cooldown").innerHTML = `Cooldown: ${game.variables.overclockTimer}s`;
    let timeoutId = window.setInterval(() => {
        if (game.variables.overclockTimer === 0) {
            get("overclock-cooldown").style.display = 'none'
            get("overclock-button").disabled = false;
            game.variables.canOverclock = true;
            clearInterval(timeoutId);
            return;
        }
        game.variables.overclockTimer--;
        get("overclock-cooldown").innerHTML = `Cooldown: ${game.variables.overclockTimer}s`;
    }, 1000);
}

function gainAchievement(id) {
    if (game.achievements.unlocked[id]) return;
    console.log(id)

    const sortedId = game.achievements.sorted.achievements.findIndex(item => item === game.achievements.names[id]);
    game.divs.achievementDiv.style.display = 'block';
    game.divs.achievementDiv.innerHTML = `Achievement Unlocked! ${game.achievements.sorted.achievements[sortedId]}`;
    if (game.achievements.descriptions[id] === "???") {
        game.achievements.descriptions[id] = game.achievements.secretAchievementDescriptions[id];
        game.achievements.buttons[sortedId].innerHTML = game.achievements.names[id] + ": " + game.achievements.descriptions[id];
    }
    window.setTimeout(() => {
        game.divs.achievementDiv.style.display = "none";
        game.divs.achievementDiv.innerHTML = "";
    }, 4000)
    game.achievements.unlocked[id] = true;
    game.achievements.buttons[sortedId].classList.remove("achievement-locked")
    game.achievements.buttons[sortedId].classList.add("achievement-unlocked")
}

function toggleAchievements() {
    if (game.altar.altarOpen) toggleAltar()
    if (game.painting.paintingOpen) togglePainting()
    if (game.achievements.achievementsOpen) {
        game.divs.achievementButtonDiv.style.display = "none";
        game.divs.mainDiv.style.display = "block";
        get("achievement-button").innerHTML = "Achievements"
    } else {
        game.divs.achievementButtonDiv.style.display = "block";
        game.divs.mainDiv.style.display = "none";
        get("achievement-button").innerHTML = "Back"
    }
    game.achievements.achievementsOpen = !game.achievements.achievementsOpen
}

function cheaterCheck() {if (game.stats.clicksInLastSecond > 20) gainAchievement(9); game.stats.clicksInLastSecond = 0}

function saveToLocalStorage(prompt = false) {
    for (let i=0;i<localStorageItems().length;i++) localStorage[localStorageItems()[i][0]] = JSON.stringify(localStorageItems()[i][1])
    if (prompt) alert("Saved your game!")
}

function loadFromLocalStorage(prompt = false) {
    for (let i=0;i<localStorageItems().length;i++) {
        let item = +localStorage.getItem(localStorageItems()[i][0]);
        const keys = localStorageItems()[i][0].split("-");
        console.log(keys)
        if (keys[0] === "achievements") {
            if (item === 1) gainAchievement(+keys[2])
            continue
        }
        if (keys.length === 2) {
            game[keys[0]][keys[1]] = item
        } else if (keys.length === 3) {
            game[keys[0]][keys[1]][keys[2]] = item
        } else if (keys.length === 4) {
            game[keys[0]][keys[1]][keys[2]][keys[3]] = item
        } else console.log("uh oh: " + keys)
    }
    if (prompt) alert("Saved your game!")
    updateAllText()
}

function updateShopButtons() {
    for (let i=0;i<game.shop.costs.length;i++) {
        if (game.resources.shapes < game.shop.costs[i]) {
            const btn = get("shop-"+i)
            btn.disabled = true
            btn.classList.remove("other-button")
            btn.classList.add("disabled-button")
        } else {
            const btn = get("shop-"+i)
            btn.disabled = false
            btn.classList.remove("disabled-button")
            btn.classList.add("other-button")
        }
    }
}

function hardReset(prompt = true) {
    if (prompt && !(confirm("Are you sure you want to hard reset?"))) return;
    if (prompt && !(confirm("This will erase EVERYTHING! Are you really sure?"))) return;
    game = initGameObject()
    game.achievements.unlocked = new Array(game.achievements.names.length).fill(false)
    game.achievements.secretAchievementCount = game.achievements.descriptions.filter(x => x === "???").length
    saveToLocalStorage()
    updateAllText()
    updateShopButtons()
    for (let i=0;i<game.shop.costs.length;i++) {
        get(`shop-${i}-cost`).innerHTML = `Cost: ${game.shop.costs[i].toLocaleString("en-US")} shapes`;
    }
    if (prompt) alert("Reset your game!");
}
const hax = () => gainAchievement(8);
// SAVE SYSTEM WORK IN PROGRESS
// bro what is this, why am I not using localStorage
// now i am :)
/*
function exportSave() {
    let save = `${game.stats.totalClicks};_00a;${game.stats.totalShapes};${game.stats.totalGildedShapes};${game.stats.totalGildedShapes-7};${game.stats.totalPrestige};${game.resources.shapes};${game.resources.shapes+game.stats.totalPrestige}`
    console.log(save);
}

function importSave() {
    const save = prompt("Enter save code")
    let saveItems = save.split(";")
    if (saveItems[1] !== "_00a" || +saveItems[4] !== +saveItems[3]-7 || +saveItems[7] !== +saveItems[6]+ +saveItems[5]) {
        alert("Invalid")
        return;
    }
    delete saveItems[1]
    delete saveItems[4]
    delete saveItems[7]
}
*/