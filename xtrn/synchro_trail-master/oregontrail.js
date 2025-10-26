var root = js.exec_dir;
var server_file = new File(file_cfgname(root, "server.ini"));
server_file.open('r', true);
//var autoUpdate=server_file.iniGetValue(null,"autoUpdate");
var serverAddr = server_file.iniGetValue(null, "host", "localhost");
var serverPort = server_file.iniGetValue(null, "port", 10088);
server_file.close();

//The official and most updated version of this game can be found at
//https://github.com/chairmanmow/synchro_trail

load("sbbsdefs.js");
//somewhat faithfully version adapted by "larry lagomorph" from 1977 basic code @ http://deserthat.files.wordpress.com/2010/11/oregon1.doc (you can find traces of the BASIC left in this document)
//contact grudgemirror@gmail.com re:oregontrail with any bug reports (there probably are some i haven't found)
var version = "0.2.1b";
console.putmsg("\r\n\r\n\1y                    TRAILBLAZER MAD-LIB \1wversion " + version + "\r\n\r\n\1h\1cby Larry Lagomorph of Futureland BBS \1yvisit us @ futureland.grudgemirror.com\r\n");
console.putmsg("\r\n\r\n                       updated August 2014\r\n");
console.pause();
console.clear();
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;  //keep
}
load("json-client.js");

var db = new JSONClient(serverAddr, serverPort);

var originalPutMsg = console.putmsg.bind(console);
var originalPrint = console.print ? console.print.bind(console) : null;

function stripCtrlA(str) {
    if (!str || typeof str !== 'string') return str;
    return str.replace(/\x01./g, '');
}

function MadLibStory(db, userKey) {
    this.db = db;
    this.dbKey = "TRAIL.MADLIBS." + userKey;
    this.vocab = {};
    this.log = [];
    this.prompts = [
        { key: "hero", prompt: "Trailblazer’s name or title (e.g., 'Captain Vega')" },
        { key: "companion", prompt: "Trusted companion or crew (short phrase, e.g., 'three lunar roustabouts')" },
        { key: "vehicle", prompt: "Your unusual vehicle or mount (e.g., 'steam-mule caravan')" },
        { key: "powerSource", prompt: "What powers or pulls it? (e.g., 'clockwork oxen', 'dark matter sail')" },
        { key: "destination", prompt: "Ultimate destination (place, e.g., 'Oregon City', 'The Rim Gate')" },
        { key: "challenge", prompt: "Recurring obstacle (short noun, e.g., 'flash floods', 'sand blizzards')" },
        { key: "solution", prompt: "Signature tactic (verb phrase, e.g., 'out-maneuver at dusk')" },
        { key: "weapon", prompt: "Preferred weapon (e.g., 'plasma carbine', 'long rifle')" },
        { key: "ammoType", prompt: "Ammunition or fuel (singular/plural, e.g., 'rounds', 'fuel rods')" },
        { key: "treasure", prompt: "Precious cargo (e.g., 'seed vault', 'ore ingots')" },
        { key: "rationFood", prompt: "What counts as food out here? (e.g., 'hardtack', 'lichen stew')" },
        { key: "outfit", prompt: "Outfit/gear everyone wears (plural ok, e.g., 'dust cloaks')" },
        { key: "supplyKit", prompt: "Misc supplies (plural/collective, e.g., 'spare parts')" },
        { key: "currency", prompt: "Currency (e.g., 'credits', 'shells', 'dollars')" },
        { key: "shop", prompt: "Where you resupply (e.g., 'trading post', 'waystation bazaar')" },
        { key: "forageVerb", prompt: "Verb for getting food when broke (base form, e.g., 'forage', 'hunt')" },
        { key: "danger", prompt: "Looming danger (singular or plural, e.g., 'bandits', 'wraith wolves')" },
        { key: "emotion", prompt: "An emotion you pretend not to feel (e.g., 'fear', 'homesickness')" },
        { key: "verb_action", prompt: "A bold past-tense verb (-ed, e.g., 'galloped', 'bartered')" },
        { key: "verb_unexpected", prompt: "A silly -ing verb (e.g., 'cartwheeling', 'moonwalking')" },
        { key: "adjective_bold", prompt: "An adjective meaning impressive/bold (e.g., 'daring', 'starlit')" },
        { key: "wildcard", prompt: "Any random noun that amuses you (e.g., 'tin goose')" }
    ];
    this.load();
}

MadLibStory.prototype.load = function () {
    try {
        var stored = this.db.read("TRAIL", this.dbKey, 1);
        this.db.cycle();
        if (stored) {
            if (stored.vocab) this.vocab = stored.vocab;
            if (stored.log) this.log = stored.log;
        }
    } catch (_e) {
    }
};

MadLibStory.prototype.ensureVocabulary = function () {
    var missing = [];
    for (var i = 0; i < this.prompts.length; i++) {
        var key = this.prompts[i].key;
        if (!this.vocab[key] || !this.vocab[key].length) missing.push(this.prompts[i]);
    }
    if (!missing.length) {
        originalPutMsg("\r\n\1gWe still have last trek's mad-lib words. Reuse them? (\1yY\1g/\1rN\1g)\1n ");
        var reuse = console.getstr().trim().toUpperCase();
        if (reuse !== "N" && reuse !== "NO") {
            return;
        }
        missing = this.prompts.slice(0);
        this.vocab = {};
    }
    originalPutMsg("\r\n\1yBefore we depart, let's flavor the expedition with a few words...\r\n");
    for (var j = 0; j < missing.length; j++) {
        var prompt = missing[j];
        var answer = "";
        while (!answer) {
            originalPutMsg("\1g" + prompt.prompt + "\r\n\1y> ");
            answer = console.getstr().trim();
            if (!answer) originalPutMsg("\1rPlease enter something.\r\n");
        }
        this.vocab[prompt.key] = answer;
    }
    this.persist();
};

MadLibStory.prototype.persist = function () {
    try {
        var payload = { vocab: this.vocab, log: this.log.slice(-200) };
        this.db.write("TRAIL", this.dbKey, payload, 2);
        this.db.cycle();
    } catch (_e) {
    }
};

MadLibStory.prototype.format = function (template, extra) {
    if (typeof template !== 'string') return template;
    var ctx = {};
    for (var key in this.vocab) if (this.vocab.hasOwnProperty(key)) ctx[key] = this.vocab[key];
    if (extra) {
        for (var ex in extra) if (extra.hasOwnProperty(ex)) ctx[ex] = extra[ex];
    }
    return template.replace(/\${([^}]+)}/g, function (_, token) {
        var raw = token.trim();
        var transform = null;
        if (/\.toUpperCase\(\)\s*$/.test(raw)) {
            raw = raw.replace(/\.toUpperCase\(\)\s*$/, '');
            transform = 'upper';
        } else if (/\.toLowerCase\(\)\s*$/.test(raw)) {
            raw = raw.replace(/\.toLowerCase\(\)\s*$/, '');
            transform = 'lower';
        }
        var value = ctx[raw];
        if (value === undefined || value === null) return '';
        if (transform === 'upper' && typeof value === 'string') value = value.toUpperCase();
        if (transform === 'lower' && typeof value === 'string') value = value.toLowerCase();
        return value;
    });
};

MadLibStory.prototype.tell = function (template, extra) {
    var text = this.format(template, extra);
    originalPutMsg(text);
    this.log.push(stripCtrlA(text));
};

MadLibStory.prototype.record = function (template, extra) {
    var text = this.format(template, extra);
    this.log.push(stripCtrlA(text));
};

var madLibKey = (typeof user !== 'undefined' && user && user.alias) ? user.alias : ("node" + system.node_num);
var story = new MadLibStory(db, madLibKey);
story.ensureVocabulary();
story.record("MADLIB SESSION STARTED FOR ${hero} AND ${companion}.", {});

var highScores = db.read("TRAIL", "TRAIL.SCORES", 1);
db.cycle();

if (highScores == undefined) {
    console.putmsg("Creating High Score File");
    var blankArray = [];
    db.write("TRAIL", "TRAIL.SCORES", blankArray, 2);
    db.cycle();
}
highScores = db.read("TRAIL", "TRAIL.SCORES", 1);
db.cycle;
originalPutMsg(story.format("\1g        LEGENDS WHO SURVIVED THE ${challenge.toUpperCase()} TO REACH ${destination.toUpperCase()}\r\n\r\n"));
function displayScores() {
    if (highScores.length == 0) {
        console.putmsg("\1h\1w    No one has conquered the trail yet!  Be the \1rfirst \1wname on the list!!! \r\n\r\n");
        console.pause();
        console.clear();
        return;
    } else {
        var ct = 0;
        for (i = 0; i < highScores.length; i++) {
            var highScore = highScores[i];
            originalPutMsg(story.format("\1h\1y" + highScore["date"] + "\1w ---\1w " + highScore["name"] + " \1gguided a ${vehicle} from \1w" + highScore["bbs"] + "\1g scoring \1w" + highScore["score"] + " \1gpoints!\r\n"));
            ct += 2;
        }
        console.pause();
        console.clear();
        return;  // do not erase

    }
}
displayScores();

var tombStones = db.read("TRAIL", "TRAIL.GRAVES", 1);
db.cycle();
if (tombStones == undefined) {
    console.putmsg("Creating Grave File");
    var blankArray = [];
    db.write("TRAIL", "TRAIL.GRAVES", blankArray, 2);
    db.cycle();
}

tombStones = db.read("TRAIL", "TRAIL.GRAVES", 1);
db.cycle();

tombStones = tombStones.reverse();

originalPutMsg(story.format("\1h\1r       RECENT FALLEN HEROES OF THE ${destination.toUpperCase()} DASH \r\n\1w                            \1h\1y\1i***\1w\1n[\1h\R.I.P.\1n]\1h\1y\1i***\r\n"));
function displayGraves() {
    var rowsMinusOne = console.screen_rows - 4;
    var ct = 0;

    for (i = 0; i < tombStones.length && ct < rowsMinusOne; i++) {
        var tombStone = tombStones[i];
        var vocab = tombStone.vocab || {};
        var vehicle = vocab.vehicle || 'wagon';
        var companion = vocab.companion || 'crew';
        var destination = vocab.destination || 'Oregon City';
        var treasure = vocab.treasure || 'supplies';
        var danger = vocab.danger || tombStone.cause || 'misfortune';
        var summary = "guided a " + vehicle + " toward " + destination + " with " + companion + ", hauling " + treasure + ".";
        console.putmsg("\1h\1b" + tombStone["date"] + "\1n\1w**\1h" + tombStone["name"] + " \1n\1w" + summary + "\1c (" + (tombStone["cause"] || 'unknown fate') + ")\r\n");
        var epitaph = tombStone["engraving"] || ("Fell when " + danger + " caught up.");
        console.putmsg("\1h\1y-\1c" + epitaph + "\r\n");
        ct += 2;
    }
    return;  // do not erase

}
displayGraves();
console.pause();
console.clear();


// game start

function OregonTrail() {
    function Score() {
        return totalMileage + animalsAMT + foodAMT + clothingAMT + supplyAMT;  //do not erase
    }


    var yesNo = new String;
    var choiceShootingExptLvl = new Number;
    var animalsAMT = new Number;
    var foodAMT = new Number;
    var ammoAMT = new Number;
    var clothingAMT = new Number;
    var supplyAMT = new Number;
    var flagForFortOption = new Number;
    var cashInitialPurchase = new Number;
    var totalMileage = new Number;
    var turnNumber = new Number;
    var woundedFlag = new Number;
    var southPassFlag = 0;
    var blueMountainPassFlag = 0;
    var mileSouthPassFlag = new Number;
    var actionChoice = new Number;
    var choiceEat = new Number;
    var bangResponse = new Number;
    var blizzardFlag = new Number;
    var notEnoughClothes = new Number;
    var fortAMT = new Number;
    var eventNo = 0;
    var blizzardFlag = 0;
    var notEnoughClothes = 0;
    var tacticChoice = 0;
    var riderHostilityFactor = 0;
    var deadFlag = 0;
    var illnessFlag = 0;
    var causeOfDeath = "";
    var outOfAmmoToggle = new Boolean;

    instructions();
    console.pause();
    console.clear();

    var userSelection = "0";
    while (userSelection != "1") {
        userSelection = firstPrompt();
    }
    rifleSkills();  // finds out what your shooting level is 
    initialPurchase();
    firstTurn();

    function firstPrompt() {
        originalPutMsg("\r\n\r\n1 - Begin the expedition\r\n2 - Quit\r\n");
        var choice = console.getstr().trim().toUpperCase();
        if (choice === "2" || choice === "Q") {
            throw "gameOver";
        }
        if (choice === "1") {
            return "1";
        }
        originalPutMsg("\1r\1i[Please choose 1 or 2]\1n");
        return "0";
    }

    function instructions() {
        console.crlf();
        console.crlf();
        story.tell("\r\n\1hThis simulator chronicles ${hero}'s attempt to haul ${treasure} from a dusty launch pad to ${destination}.");
        story.tell("\r\n\1hYour motley crew pilots a ${vehicle} drawn by ${powerSource}. Plan on 2040 miles of chaos—if ${danger} doesn’t end things early.");
        story.tell("\r\n\1hYou've saved \1g900 ${currency}\1w for the journey and already sunk \1g200 ${currency}\1w into the ${vehicle}.");
        story.tell("\r\n\1hSpend the remaining \1g700 ${currency}\1w on whatever keeps the mission afloat:");
        console.crlf();
        story.tell("\r\n\1h     \1g${powerSource.toUpperCase()}\1y *** \1wBudget \1g200-300 ${currency}\1w for propulsion—the fancier the ${powerSource}, the faster you travel.");
        console.crlf();
        story.tell("\r\n\1h     ${rationFood.toUpperCase()}\1y *** \1wA well-fed crew is less likely to succumb to ${danger} or illness.");
        console.crlf();
        story.tell("\r\n\1h     \1r${ammoType.toUpperCase()}\1y *** \1g1 ${currency}\1w buys 50 units. You'll need them when ${weapon} talk is the only diplomacy ${danger} respects, and for ${forageVerb}ing ${rationFood}.");
        console.crlf();
        story.tell("\r\n\1h     \1c${outfit.toUpperCase()}\1y *** \1wDress for blistering suns, sideways sleet, and whatever ${challenge} throws out.");
        console.crlf();
        story.tell("\r\n\1h     \1y${supplyKit.toUpperCase()}\1r *** \1wSpare parts, potions, duct tape—whatever keeps ${vehicle} and crew stitched together.");
        console.crlf();
        console.crlf();
        story.tell("\r\n\1hBlow the whole bankroll now or stash some \1g${currency}\1w to splurge at a ${shop}. Prices spike out there. You can also ${forageVerb} along the way to restock ${rationFood}.");
        console.crlf();
        story.tell("\r\n\1hWhen it's time to unleash your ${weapon}, you'll be prompted for a sound effect. Type it fast and press ENTER—hesitate and ${danger} gains ground.");
        console.crlf();
        story.tell("\r\n\1hInventory is tallied in ${currency} except for ${ammoType}, which is counted by the unit. When prompted for costs, just enter numbers—no symbols.");
        console.crlf();
        story.tell("\r\n\1h\1g\1iMay ${hero} ${verb_action} boldly! \1n");
    }

    function rifleSkills() {
        console.crlf();
        console.crlf();
        originalPutMsg(story.format("\1h\1mHow confident are you wielding your ${weapon}?\r\n"));
        console.putmsg("\1h\1y(1) \1wACE MARKSMAN,  \1y(2) \1wGOOD SHOT,  \1y(3)\1w FAIR TO MIDDLIN'");
        console.putmsg("\r\n\1h\1y(4) \1wNEED MORE PRACTICE,  \1y(5) \1wSHAKY KNEES");
        console.crlf();
        console.putmsg("\r\n\1h\1cENTER ONE OF THE ABOVE,THE BETTER YOU CLAIM YOU ARE, THE\r\n");
        originalPutMsg(story.format("\1h\1cFASTER YOU'LL HAVE TO BE WITH YOUR ${weapon.toUpperCase()} TO BE SUCCESSFUL."));
        choiceShootingExptLvl = console.getnum();
        //if(choiceShootingExptLvl != 5) { // unsure about this expression taken from basic
        //choiceShootingExptLvl = 0;
        if (1 > choiceShootingExptLvl || choiceShootingExptLvl > 5) {
            console.putmsg("\r\n\1r\1i[Invalid Selection]");
            rifleSkills();
        }
    }

    function getAnimals() {
        originalPutMsg(story.format("\1h\1mHow much ${currency} will you invest in your ${powerSource}?\r\n \1y minimum : 201 \r\n"));
        animalsAMT = console.getnum();
        while (300 <= animalsAMT || animalsAMT <= 200) {
            if (animalsAMT <= 200) {
                originalPutMsg(story.format("Not enough ${powerSource}."));
            }
            if (animalsAMT >= 300) {
                originalPutMsg(story.format("Too much to spend on ${powerSource}."));
            }
            animalsAMT = console.getnum();
        }
    }

    function getFood() {
        originalPutMsg(story.format("\1h\1wHow much ${currency} do you dedicate to ${rationFood}?"));
        foodAMT = console.getnum();
        while (foodAMT <= 0) {
            console.putmsg("IMPOSSIBLE");
            foodAMT = console.getnum();
        }
    }

    function getAmmo() {
        originalPutMsg(story.format("\1h\1rHow much ${currency} do you pour into ${ammoType}?"));
        ammoAMT = console.getnum();
        while (ammoAMT <= 0) {
            console.putmsg("IMPOSSIBLE");
            ammoAMT = console.getnum();
        }
    }

    function getClothing() {
        originalPutMsg(story.format("\1h\1bHow much ${currency} will outfit the crew in ${outfit}?"));
        clothingAMT = console.getnum();
        while (clothingAMT <= 0) {
            console.putmsg("IMPOSSIBLE");
            clothingAMT = console.getnum();
        }
    }

    function getSupplies() {
        originalPutMsg(story.format("\1h\1yHow much ${currency} completes the ${supplyKit}?"));
        supplyAMT = console.getnum();
        while (supplyAMT <= 0) {
            console.putmsg("IMPOSSIBLE");
            supplyAMT = console.getnum();
        }
    }

    function initialPurchase() {

        flagForFortOption = flagForFortOption * -1;  // WTF IS THIS? -- switch from true to false whether or not you have to go to the fort
        //woundedFlag*illnessFlag*southPassFlag*blueMountainPassFlag*M*mileSouthPassFlag*turnNumber=0;  // WTF IS THISg removed as its probably some legacy basic code for clearing memory in old cpus
        anotherPurchase();

    }

    function anotherPurchase() {
        console.crlf();
        getAnimals();
        getFood();
        getAmmo();
        getClothing();
        getSupplies();
        calculateCosts();
    }

    function calculateCosts() {
        cashInitialPurchase = 700 - animalsAMT - foodAMT - ammoAMT - clothingAMT - supplyAMT;
        if (cashInitialPurchase <= 0) {
            originalPutMsg(story.format("\r\n\1h\1r\1iYou overspent! \r\n\1n\1h\1yYou only had 700 ${currency} to begin with. Try again."));
            initialPurchase();
        }
        else {
            ammoAMT *= 50;
            story.tell("\1h\1g${hero} counts ${cash} ${currency} left in the travel fund while ${companion} tries not to look worried.", {
                cash: cashInitialPurchase
            });
        }
    }

    function inventoryCheck() {
        if (foodAMT <= 0) {
            foodAMT = 0;
        }
        if (ammoAMT <= 0) {
            ammoAMT = 0;
        }
        //clearIllness();
        if (clothingAMT <= 0) {  // if there is no clothing then there is no clothing
            clothingAMT = 0;
        }
        if (supplyAMT <= 0) {
            supplyAMT = 0;
        }
        if (foodAMT <= 13) {
            story.tell("\r\n\1h\1r${companion} eyes the ${treasure} crates and hisses, '${hero}, we'd better ${solution} before we chew the wagon wheels.'\1n\r\n", {});
            console.beep();
            console.pause();
        }
        foodAMT = parseInt(foodAMT);
        ammoAMT = parseInt(ammoAMT);
        clothingAMT = parseInt(clothingAMT);
        supplyAMT = parseInt(supplyAMT);
        cashInitialPurchase = parseInt(cashInitialPurchase);
        totalMileage = parseInt(totalMileage);
        prevMileage = totalMileage; // WTF IS THIS} decemberSixth();
        //console.putmsg("end inventory check");
    }

    function doctorVisit() {
        cashInitialPurchase = cashInitialPurchase - 20;
        if (cashInitialPurchase > 0) {
            originalPutMsg(story.format("\r\n'\1h\1yLet's get you stitched up.\1n\1w'\r\n\1h\1r\1iHe charges 20 ${currency}.\1n\r\n"));
            clearIllness();
        }
        else {
            cantAffordDoctor();
        }
    }

    function turnStart() {
        inventoryCheck();
        //console.putmsg("\r\nTurn \1m" + turnNumber + "\1w Start.\r\n\1gIllness Flag = " + illnessFlag + "\r\n\1rWounded Flag = " + woundedFlag + "\r\n\1bActual Mileage = " + totalMileage + "\r\n\1mSouth Pass Flag normal[mile] = " + southPassFlag + "/" + mileSouthPassFlag + "\r\n");
        if (illnessFlag == 1 || woundedFlag == 1) {  //are you sick?
            doctorVisit();

        }
        //console.putmsg("b4 southpass flagcheck");
        southPassFlagCheck();
    }

    function firstTurn() {
        turnNumber = 0;
        console.crlf();
        console.putmsg("\1h\1mMONDAY \1wMARCH 29 1847");
        console.crlf();
        turnStart();
    }

    function turnCheck() {

        if (totalMileage <= 2040) {
            // ***SETTING DATE****
            turnNumber++;  //advances turn
            console.crlf();
            console.putmsg("\1h\1mMONDAY ");
            if (turnNumber == 1) {

                console.putmsg("\1h\1wAPRIL 12");
            }
            if (turnNumber == 2) {
                console.putmsg("\1h\1wAPRIL 26 ");
            }
            if (turnNumber == 3) {
                console.putmsg("\1h\1wMAY 10");
            }
            if (turnNumber == 4) {
                console.putmsg("\1h\1wMAY 24 ");
            }
            if (turnNumber == 5) {
                console.putmsg("\1h\1wJUNE 7 ");
            }
            if (turnNumber == 6) {
                console.putmsg("\1h\1wJUNE 21 ");
            }
            if (turnNumber == 7) {
                console.putmsg("\1h\1wJULY 5 ");
            }
            if (turnNumber == 8) {
                console.putmsg("\1h\1wJULY 19 ");
            }
            if (turnNumber == 9) {
                console.putmsg("\1h\1wAUGUST 2 ");
            }
            if (turnNumber == 10) {
                console.putmsg("\1h\1wAUGUST 16 ");
            }
            if (turnNumber == 11) {
                console.putmsg("\1h\1wAUGUST 31 ");
            }
            if (turnNumber == 12) {
                console.putmsg("\1h\1wSEPTEMBER 13");
            }
            if (turnNumber == 13) {
                console.putmsg("\1h\1wSEPTEMBER 27 ");
            }
            if (turnNumber == 14) {
                console.putmsg("\1h\1wOCTOBER 11 ");
            }
            if (turnNumber == 15) {
                console.putmsg("\1h\1wOCTOBER 25");
            }
            if (turnNumber == 16) {
                console.putmsg("\1h\1wNOVEMBER 8 ");
            }
            if (turnNumber == 17) {
                console.putmsg("\1h\1wNOVEMBER 22 ");
            }
            if (turnNumber == 18) {
                console.putmsg("\1h\1wDECEMBER 6 ");
            }
            if (turnNumber == 19) {
                console.putmsg("\1h\1wDECEMBER 20 ");
            }
            if (turnNumber == 20) {
                story.tell("\1h\1w${hero} lingers too long—the first blizzard swallows the expedition before ${destination}.");
                causeOfDeath = "got too tired";
                formalities();
                return; //this might be okay since it should exit the function after the end of the game, maybe take out
                //console.crlf();
            }
            console.putmsg(" 1847\r\n");
            turnStart();
        }
        else {
            finalTurn();
        }
    }

    function cantAffordDoctor() {
        cashInitialPurchase = 0
        story.tell("${companion} checks the piggy bank—no ${currency} left for medics.");
        youDiedOf();
    }

    function clearIllness() {
        woundedFlag = 0;
        illnessFlag = 0;
    }

    function turnChoice() {
        originalPutMsg(story.format("\r\n\1h\1w*${rationFood.toUpperCase()}*" + "\1h\1r${ammoType.toUpperCase()} " + "\1b${outfit.toUpperCase()}" + "\1y${supplyKit.toUpperCase()}" + "\1g${currency.toUpperCase()}"));
        console.crlf();
        console.putmsg("\1w--" + foodAMT + "\1w--\1r --" + ammoAMT + "--\1b-- " + clothingAMT + "--\1y--" + supplyAMT + " --\1g--" + cashInitialPurchase);
        if (flagForFortOption != -1) {
            flagForFortOption = flagForFortOption * -1;
            fortHuntContinue();
        }
    }

    function southPassFlagCheck() {
        //console.putmsg("south pass flag check");
        if (mileSouthPassFlag != 1) {
            console.putmsg("\1h\1yTOTAL MILEAGE IS : \1g" + totalMileage + "\r\n");
            turnChoice();
        }
        else {
            console.putmsg("\1h\1yTOTAL MILEAGE IS 950\r\n\1n\1yYou are traveling through mountains");
            mileSouthPassFlag = 0;
            turnChoice();
        }
    }

    function fortHuntContinue() {
        originalPutMsg(story.format("\r\n\r\n\1h\1wDo you want to \1m(1) stop at the nearest ${shop}, \1h\1r(2) ${forageVerb}, "));
        originalPutMsg("\1h\1g(3) CONTINUE \1i\1y?\1n");
        actionChoice = console.getnum();
        if (actionChoice == 1) {
            fortBuy();
        }
        else if (actionChoice == 2) {
            if (ammoAMT < 39) {
                originalPutMsg(story.format("\1h\1rNo luck—you need more ${ammoType} before you can ${forageVerb}."));
                fortHuntContinue();
            }
            else {
                goHunting();
            }
        }
        else if (actionChoice == 3) {
            checkFoodAMT();
        }
        else {
            console.putmsg("\1i\1r[Invalid Selection]\1n");
            fortHuntContinue();
            //return;
        }
    }

    function fortBuy() {
        originalPutMsg(story.format("\1h\1gSpending spree at the ${shop}! Enter how many ${currency} to toss at each category:\r\n"));

        //setFortAmtSubroutine();
        foodFortCycle();
        ammoFortCycle();
        clothingFortCycle();
        supplyFortCycle();
        totalMileage = totalMileage - 45;
        checkFoodAMT();
    }

    function goHunting() {
        if (ammoAMT < 39) {
            originalPutMsg(story.format("No dice—you need more ${ammoType} before you can ${forageVerb}."));
            fortHuntContinue();
        }
        else {
            totalMileage = totalMileage - 45;
            shootingSub();
            //console.putmsg("bangResponse time " + bangResponse);
            if (bangResponse >= 1) {
                var randomMeasure = 1000 * Math.random();
                //console.putmsg("\1r" + randomMeasure + " : random \1y" + 5*bangResponse + " adj bang response");
                if (randomMeasure > 5 * bangResponse) {
                    story.tell("\1h\1y${hero} nails the target with the ${weapon}. ${companion} cheers for ${rationFood} tonight!\r\n", {});
                    foodAMT = foodAMT + 52 + Math.random() * 6;
                    ammoAMT = ammoAMT - 10 - 3 * bangResponse;
                    //checkFoodAMT();
                }
                else {
                    story.tell("\1h\1rMissed! The coveted ${rationFood} snickers and slips away.");
                    ammoAMT = ammoAMT - 10 - Math.random() * 4;
                }

            }
            checkFoodAMT();
        }
    }

    //the following function is my own helper function for returning a random integer for selecting a bang word

    function shootingSub() {
        var variationsOfShootingWord = new Array;
        variationsOfShootingWord[0] = "BANG"
        variationsOfShootingWord[1] = "BLAM"
        variationsOfShootingWord[2] = "POW"
        variationsOfShootingWord[3] = "WHAM"
        var shootingWordSelector = parseInt(getRandomInt(0, 3));

        originalPutMsg(story.format("\r\nCall out a sound effect to unleash your ${weapon}: \\1h\\1y" + variationsOfShootingWord[shootingWordSelector]));
        console.crlf();
        console.beep();
        bangClockStart = system.timer;
        //console.putmsg("bangClockStart time " + bangClockStart);
        userBangWord = console.getstr();
        bangResponse = system.timer;
        userBangWord = userBangWord.toUpperCase();
        //console.putmsg("bangResponse time " + bangResponse);
        bangResponseCheck();
        function bangResponseCheck() {
            bangResponse = ((bangResponse - bangClockStart) * 36) - (choiceShootingExptLvl - 1)
            console.crlf();
            /*if(bangResponse<0) {
             bangResponse=0;
             } */
            if (userBangWord != variationsOfShootingWord[shootingWordSelector]) {
                bangResponse = 0;
                misfire();
            }
        }
    }

    function checkFoodAMT() {
        //console.putmsg("checkFoodAMT function");
        if (foodAMT <= 13) {
            starve();
            return;  //this should be okay 
        }
        else

            eatChoice();

    }

    function eatChoice() {
        originalPutMsg(story.format("\r\nWhat's the ${rationFood} plan? \1r(1) rationed  \1y(2) reasonable  \1g(3) lavish \1h\1y?"));
        choiceEat = console.getnum();
        if (foodAMT - 8 - 5 < 0) {
            starve();
        }
        else if (choiceEat > 3 || choiceEat < 1) {
            console.crlf();
            story.tell("${companion} shakes their head—no way can we feast like that right now.");
            eatChoice();
            //return;  this may need to be put back in

        }
        else {
            choiceEat = parseInt(choiceEat);
            foodAMT = foodAMT - 8 - 5 * choiceEat;
            totalMileage = totalMileage + 200 + (animalsAMT - 220) / 5 + 10 * Math.random();
            blizzardFlag = 0;
            notEnoughClothes = 0;
            riders();
        }
    }

    function actionEvaluate() {
        originalPutMsg(story.format("\r\nDo you want to (1) ${forageVerb}, or (2) continue rolling?"));
        actionChoice = console.getnum();
        if (actionChoice == 1) {
            goHunting();
        }
        if (actionChoice == 2) {
            checkFoodAMT();
            fortBuy();
        }
    }

    function riders() {
        //console.putmsg("riders function beginning");
        if (Math.random() * 10 < ((Math.pow(totalMileage / 100 - 4), 27) + 72) / (((Math.pow(totalMileage / 100 - 4), 2) + 12) - 1)) {
            //console.putmsg("math selected event selector");
            eventSelector();
        }
        else {
            story.tell("\r\n\1rMysterious riders loom ahead. ${companion} squints to see if they're friends or ${danger}.  ");
            riderHostilityFactor = 0;
            if (Math.random() < .8) {
                originalPutMsg("\1gDON'T ");
                riderHostilityFactor = 1;
            }
            originalPutMsg("\1rLOOK HOSTILE\r\n");

            if (Math.random() > .2) {
                riderHostilityFactor = 1 - riderHostilityFactor;
            }

            tacticChoice = 0;

            while (tacticChoice < 1 || tacticChoice > 4) {
                console.putmsg("\r\n\1h\1w\1iTACTICS\1n\r\n");
                console.putmsg("\1h\1m(1) RUN  \1h\1r(2) ATTACK  \1h\1g(3) CONTINUE  \1y(4) CIRCLE WAGONS\1i?\1n");
                tacticChoice = console.getnum();
                tacticChoice = parseInt(tacticChoice);
            }

            if (riderHostilityFactor == 1) {
                milesAfterRiders();
            }
            else {
                if (tacticChoice == 1) { // 3110
                    totalMileage = totalMileage + 20;
                    supplyAMT = supplyAMT - 15;
                    ammoAMT = ammoAMT - 150;
                    animalsAMT = animalsAMT - 40;
                    riderHostilityCheck();
                }
                if (tacticChoice == 2) { // attackCycle();
                    shootingSub();
                    //console.putmsg(bangResponse + "\1h\1r : BANG RESPONSE (multiply times 4 subtract 40 ammo amt)");

                    ammoAMT = ammoAMT - bangResponse * 4 - 40;
                    attackRiders();

                }
                if (tacticChoice == 3) {
                    fortAMT = 0;
                    milesAfterRiders();
                }
                if (tacticChoice == 4) {
                    if (Math.random() > .8) {
                        ridersNoAttack();
                    }
                    else {
                        ammoAMT = ammoAMT - 150;
                        supplyAMT = supplyAMT - 15;
                        riderHostilityCheck();
                    }

                    shootingSub();
                    ammoAMT = ammoAMT - bangResponse * 30 - 80
                    totalMileage = totalMileage - 25
                    attackRiders();
                }
            }
        }
    }

    function milesAfterRiders() {
        if (tacticChoice == 1) { //RUN milesMinusFive(); 
            totalMileage = totalMileage + 15;
            animalsAMT = animalsAMT - 10;
            riderHostilityCheck();
        }
        if (tacticChoice == 2) { //checkMoney();
            totalMileage = totalMileage - 5;
            ammoAMT = ammoAMT - 100;
            riderHostilityCheck();
        }
        if (tacticChoice == 3) { // milesMinusTwenty();
            riderHostilityCheck();
        }
        if (tacticChoice == 4) {
            totalMileage = totalMileage - 20;
            riderHostilityCheck();
        }
    }

    function ridersNoAttack() {
        story.tell("\1h\1wThe riders size up ${hero} and drift away without a fight.");
        eventSelector();
    }

    //was friendly.Riders()
    function riderHostilityCheck() {
        if (riderHostilityFactor != 0) {
            story.tell("\r\n\1gThey were friendly after all—but double-check the ${treasure} just in case.");
            eventSelector();
        }
        else {
            story.tell("\r\n\1h\1rHostile riders! Brace for losses and keep ${weapon} handy.\1n\r\n");
            console.beep();
            if (ammoAMT <= 0) {
                story.tell("\1m${hero} runs dry on ${ammoType} and the riders overrun the camp.");
                //nsole.putmsg("\1yammoAMT var : \1h\1r  " + ammoAMT);
                causeOfDeath = "got massacred";
                formalities();
                //return;  //another one that might not be necessary but comes after death
            }
            else {
                eventSelector();
            }
        }
    }

    //southPassFlagCheck();
    function attackRiders() {
        //console.putmsg("\r\n\1cYour BANG RESPONSE was " + bangResponse + "\r\n");
        if (bangResponse <= 40 && bangResponse >= 1) {
            story.tell("\1h\1gNerves of steel—${hero}'s ${weapon} work drives them off.");
            riderHostilityCheck();
        }
        else {
            if (bangResponse <= 60 && bangResponse >= 1) {
                story.tell("\1h\1yA bit slow on the trigger—${danger} regroup.");
                riderHostilityCheck();
            }
            else {
                story.tell("\1h\1yBotched shot—${hero} takes a blade in the chaos!\r\n");
                console.beep();
                woundedFlag = 1;
                story.tell("\1cTime to visit whatever sawbones is on duty.\r\n");
                riderHostilityCheck();
            }
        }
    }

    function showSupplies() {
        originalPutMsg(story.format("\r\n\1h\1w*${rationFood.toUpperCase()}*" + "\1h\1r${ammoType.toUpperCase()} " + "\1b${outfit.toUpperCase()}" + "\1y${supplyKit.toUpperCase()}" + "\1g${currency.toUpperCase()}"));
        console.crlf();
        console.putmsg("\1w--" + foodAMT + "\1w--\1r --" + ammoAMT + "--\1b-- " + clothingAMT + "--\1y--" + supplyAMT + " --\1g--" + cashInitialPurchase + "\r\n");
    }

    function setFortAmtSubroutine() {
        fortAMT = console.getnum();
        if (cashInitialPurchase > 0) {
            originalPutMsg(story.format("\1h\1w *** \1gYou have \1y" + cashInitialPurchase + "\1g ${currency} remaining\r\n"));
            //showSupplies();
            fortAMT = console.getnum();
            if (fortAMT > cashInitialPurchase) {
                originalPutMsg(story.format("\1h\1r\1iNot enough ${currency}!\1n\1h\1w--\1yKeep your spending down\r\n"));
                setFortAmtSubroutine();
            }
            else {
                cashInitialPurchase = cashInitialPurchase - fortAMT;
                //showSupplies();
            }

        }
        else {
            originalPutMsg(story.format("\1h\1rNo ${currency} left."));
        }
    }

    function foodFortCycle() {
        fortAMT = 0;
        originalPutMsg(story.format("\1h\1w${rationFood.toUpperCase()}\r\n"));

        if (cashInitialPurchase > 0) {
            originalPutMsg(story.format("\1h\1gYou have \1y" + cashInitialPurchase + "\1g ${currency} remaining\r\n"));
            //showSupplies();
            fortAMT = console.getnum();
            if (fortAMT > cashInitialPurchase) {
                originalPutMsg(story.format("\1h\1rYou don't have that much ${currency}—dial it back.\r\n"));
                foodFortCycle();
            }
            else {
                cashInitialPurchase = cashInitialPurchase - fortAMT;
                foodAMT = parseInt(foodAMT + .667 * fortAMT);
                fortAMT = 0;
                //showSupplies();
            }
        }
        else {
            originalPutMsg(story.format("\1h\1rNo ${currency} left."));
        }
    }

    function ammoFortCycle() {
        originalPutMsg(story.format("\1h\1r${ammoType.toUpperCase()}\r\n"));
        fortAMT = 0;
        if (cashInitialPurchase > 0) {
            originalPutMsg(story.format("\1h\1gYou have \1y" + cashInitialPurchase + "\1g ${currency} remaining\r\n"));
            //showSupplies();
            fortAMT = console.getnum();
            if (fortAMT > cashInitialPurchase) {
                originalPutMsg(story.format("\1h\1rYou don't have that much ${currency}—dial it back.\r\n"));
                ammoFortCycle();
            }
            else {
                cashInitialPurchase = cashInitialPurchase - fortAMT;
                ammoAMT = parseInt(ammoAMT + 2 / 3 + fortAMT * 50);
                fortAMT = 0;	//this equation looks shaky
                //showSupplies();
            }
        }
        else {
            originalPutMsg(story.format("\1h\1rNo ${currency} left."));
        }
    }

    function clothingFortCycle() {
        originalPutMsg(story.format("\1h\1b${outfit.toUpperCase()}\r\n"));
        fortAMT = 0;
        if (cashInitialPurchase > 0) {
            originalPutMsg(story.format("\1h\1gYou have \1y" + cashInitialPurchase + "\1g ${currency} remaining\r\n"));
            //showSupplies();
            fortAMT = console.getnum();
            if (fortAMT > cashInitialPurchase) {
                originalPutMsg(story.format("\1h\1rYou don't have that much ${currency}—dial it back.\r\n"));
                clothingFortCycle();
            }
            else {
                cashInitialPurchase = cashInitialPurchase - fortAMT;
                clothingAMT = parseInt(clothingAMT + 2 / 3 * fortAMT);
                fortAMT = 0;
                //showSupplies();
            }

        }
        else {
            originalPutMsg(story.format("\1h\1rNo ${currency} left."));
        }
    }

    function supplyFortCycle() {
        originalPutMsg(story.format("\1h\1y${supplyKit.toUpperCase()}\r\n"));
        fortAMT = 0;
        if (cashInitialPurchase > 0) {
            originalPutMsg(story.format("\1h\1gYou have \1y" + cashInitialPurchase + "\1g ${currency} remaining\r\n"));
            //showSupplies();
            fortAMT = console.getnum();
            if (fortAMT > cashInitialPurchase) {
                originalPutMsg(story.format("\1h\1rYou don't have that much ${currency}—dial it back.\r\n"));
                supplyFortCycle();
            }
            else {
                cashInitialPurchase = cashInitialPurchase - fortAMT;
                supplyAMT = parseInt(supplyAMT + (.667 * fortAMT));
                fortAMT = 0;
                //showSupplies();
            }
        }
        else {
            originalPutMsg(story.format("\1h\1rNo ${currency} left."));
        }
    }

    function shotInLeg() {
        if (bangResponse <= 35 && ammoAMT > 1 && outOfAmmoToggle != true) {
            quickestDraw();
        }
        else {
            story.tell("\r\n\1h\1y${danger} tags ${hero}'s leg and makes off with part of the ${powerSource}.");
            woundedFlag = 1;
            story.tell("\r\n${companion} insists on calling whatever passes for a doctor.");
            supplyAMT = supplyAMT - 5;
            animalsAMT = animalsAMT - 20;
            outOfAmmoToggle = false;
            mountains();
        }
    }

    function eventSelector() {
        //console.putmsg("event slector function beginning");
        advanceEventCounter();
        console.crlf();

        secondSwitch();
        //console.putmsg("event switch passed");
    }

    function advanceEventCounter() {
        //console.putmsg("event prior ")
        //log(eventNo.toSource());
        //console.putmsg(eventNo);
        eventNo++;
        //log(eventNo.toSource());
        //console.putmsg("event advanced "); 
        //console.putmsg(eventNo);
    }

    function secondSwitch() {
        console.pause();
        console.clear();
        //ON eventNo-10 continue: 4220,4290,4340,4650,4610,indianFood();
        if (eventNo == 1) {
            var breakdownDelay = 15 + 5 * Math.random();
            var repairCost = 8;
            totalMileage = totalMileage - breakdownDelay;
            supplyAMT = supplyAMT - repairCost;
            story.tell("${danger} sabotages the ${vehicle}. ${hero} burns ${repairCost} bundles of ${supplyKit} and loses about ${delay} miles patching it back together.", {
                repairCost: repairCost,
                delay: Math.round(breakdownDelay)
            });
            mountains();
        }

        if (eventNo == 2) {
            var limpDelay = 25;
            totalMileage = totalMileage - limpDelay;
            animalsAMT = animalsAMT - 20;
            story.tell("One of the ${powerSource} pulls something fierce. Progress slows by ${delay} miles and the propulsion budget drops 20 ${currency}.", {
                delay: limpDelay
            });
            mountains();
        }
        if (eventNo == 3) {
            var injuryDelay = 5 + 4 * Math.random();
            var slingCost = 2 + 3 * Math.random();
            totalMileage = totalMileage - injuryDelay;
            supplyAMT = supplyAMT - slingCost;
            story.tell("Bad luck—someone in ${companion} takes a nasty spill. ${hero} fashions a sling out of ${supplyKit}, costing about ${delay} miles and ${supplies} units of gear.", {
                delay: Math.round(injuryDelay),
                supplies: Math.max(1, Math.round(slingCost))
            });
            mountains();
        }
        if (eventNo == 4) {
            var wanderDelay = 17;
            totalMileage = totalMileage - wanderDelay;
            story.tell("A ${powerSource} wanders off chasing ${stray}. ${hero} blows ${delay} miles corralling it again.", {
                stray: story.vocab.wildcard || 'something shiny',
                delay: wanderDelay
            });
            mountains();
        }
        if (eventNo == 5) {
            var lostDelay = 10;
            totalMileage = totalMileage - lostDelay;
            story.tell("${companion} misplaces the ${wildcard}. Everyone wastes ${delay} miles searching the scrub for clues.", {
                wildcard: story.vocab.wildcard || 'favorite trinket',
                delay: lostDelay
            });
            mountains();
        }
        if (eventNo == 6) {
            var previousMileage = totalMileage;
            totalMileage = totalMileage - 10 * Math.random() * -2;
            var waterDelay = Math.round(Math.abs(totalMileage - previousMileage));
            story.tell("${hero} discovers the canteens full of sludge. The crew wanders about ${delay} miles to find something drinkable.", {
                delay: Math.max(1, waterDelay)
            });
            mountains();
        }

        if (eventNo == 7) {
            if (totalMileage > 950) {
                coldWeather();
            }
            else {
                var rainFoodLoss = 10;
                var rainAmmoLoss = 500;
                var rainSupplyLoss = 15;
                story.tell("\1bA ${challenge} of sideways rain slams the ${vehicle}. ${hero} sacrifices ${rainFoodLoss} lbs of stores, ${rainAmmoLoss} rounds, and ${rainSupplyLoss} crates of gear to keep ${danger} from having a feast.", {
                    rainFoodLoss: rainFoodLoss,
                    rainAmmoLoss: rainAmmoLoss,
                    rainSupplyLoss: rainSupplyLoss
                });
                foodAMT = foodAMT - rainFoodLoss;
                ammoAMT = ammoAMT - rainAmmoLoss;
                supplyAMT = supplyAMT - rainSupplyLoss;
                totalMileage = totalMileage - 10 * Math.random() - 5;
                mountains();
            }
        }
        if (eventNo == 8) {
            var ambushers = story.vocab.danger ? story.vocab.danger.toUpperCase() : "BANDITS";
            story.tell("\1h\1r" + ambushers + " erupt from the brush! ${hero} yells '" + (story.vocab.solution || "IMPROVISE").toUpperCase() + "!' and grips the ${vehicle}'s rail.\1n\r\n", {});
            console.beep();
            console.pause();
            shootingSub();
            ammoAMT = ammoAMT - 20 * bangResponse;
            //console.putmsg("\r\n\1h\1yBANG RESPONSE = " + bangResponse + "\r\n"); 
            if (bangResponse <= 50 && bangResponse >= 1) {
                shotInLeg();
            }
            else {
                story.tell("\1rClick. Empty. ${danger} scoop up ${cashStolen} coins while ${companion} dives for cover.", {
                    danger: story.vocab.danger || "bandits",
                    cashStolen: parseInt(cashInitialPurchase / 3)
                });
                cashInitialPurchase = cashInitialPurchase / 3;
                outOfAmmoToggle = true;
                shotInLeg();
            }
        }

        if (eventNo == 9) {
            story.tell("\1h\1rFire tongues through the ${vehicle}! ${hero} hurls ${treasure} crates overboard while ${companion} fights the sparks.\r\n", {});
            foodAMT = foodAMT - 40;
            ammoAMT = ammoAMT - 400;
            supplyAMT = supplyAMT - Math.random() * 68 - 3;
            totalMileage = totalMileage - 15;
            mountains();
        }
        if (eventNo == 10) {
            story.tell("\1h\1wA fog bank gulps the trail. ${hero} spends a day ${verb_unexpected} in circles while ${companion} mutters about lost time.\r\n", {});
            totalMileage = totalMileage - 10 - 5 * Math.random();
            mountains();
        }

        if (eventNo == 11) {
            story.tell("\1h\1gA venomous ${danger} lashes out. ${hero} blasts it to bits but not before fangs taste travel-worn boots.", {});
            ammoAMT = ammoAMT - 10;
            supplyAMT = supplyAMT - 5;
            if (supplyAMT <= 0) {
                story.tell("\1r\r\n\1iWithout medicine, the venom overtakes ${hero}. ${emotion} floods the camp.\1n", {});
                causeOfDeath = "got bit by a snake";
                formalities();
                return;  // comes after formalities
            }
            else {
                mountains();
            }
        }
        if (eventNo == 12) {
            story.tell("${vehicle} bogs down in a roaring ford. ${hero} watches ${foodLoss} lbs of stores and ${clothLoss} sets of clothing drift away while ${companion} howls at ${danger}.", {
                foodLoss: 30,
                clothLoss: 20
            });
            foodAMT = foodAMT - 30;
            clothingAMT = clothingAMT - 20;
            totalMileage = totalMileage - 20 - 20 * Math.random();
            mountains();
        }
        if (eventNo == 13) {
            story.tell("A pack of ${danger} explodes from the night. ${hero} orders ${companion} to ${solution} while taking aim.", {});
            shootingSub();
            if (ammoAMT > 39) {
                wildBangResponse();
            }
            else {
                story.tell("\1h\1rEmpty belts! ${danger} overrun the camp as ${companion} shields the ${treasure}.\r\n", {});
                woundedFlag = 1;
                youDiedOf();
            }
            ammoAMT = ammoAMT - 20 * bangResponse
            clothingAMT = clothingAMT - bangResponse * 4
            foodAMT = foodAMT - bangResponse * 8
            mountains();
        }
        // this one looks like it needs fixing;	
        if (eventNo == 14) {
            if (choiceEat == 1) {
                illnessSubroutine();
            }
            if (choiceEat == 2) {
                if (Math.random() < .25) {
                    illnessSubroutine();
                }

                mountains();

            }
            if (choiceEat == 3) {
                if (Math.random() > .5) {
                    illnessSubroutine();
                    mountains();
                }
                else {
                    mountains();

                }
            }
        }
        if (eventNo == 15) {
            story.tell("Friendly scouts trade stories with ${companion} and point toward hidden caches of ${treasure}.");
            foodAMT = foodAMT + 14;
            mountains();
        }

    }

    // ***MOUNTAINS***
    function mountains() {
        console.pause();
        if (totalMileage <= 950) {
            turnCheck();
            return;//this is the sketchiest one it seems to leave in.
        }
        if (Math.random() * 10 < 9 - ((Math.pow(totalMileage / 100 - 15, 2) + 72) / (Math.pow(totalMileage / 100 - 15), 2) + 12)) {
            hailStorm();
        }
        story.tell("\r\n\1y${adjective_bold} ridgelines surround the ${vehicle}. ${hero} sketches the peaks like they were ${wildcard}.");
        console.pause();
        if (Math.random() < .1) {

            totalMileage = totalMileage - 60;
        } //4780
        if (Math.random() < .11) {
            slowGoing();
        }
        else {
            story.tell("\1m${companion} admits the map was upside down. ${hero} wastes precious days ${verb_unexpected} in search of the trail!");
            console.beep();
            totalMileage = totalMileage - 60;
            hailStorm();
            story.tell("\r\n\1y${vehicle} groans and splinters. ${hero} shells out supplies to patch the frame.");
            supplyAMT = supplyAMT - 5;
            ammoAMT = ammoAMT - 200;
            totalMileage = totalMileage - 20 - 30 * Math.random();
            checkSouthPass();
        }
    }

    function checkSouthPass() {
        if (southPassFlag == 1) {
            checkMileage17hundred();
        }
        else {
            southPassFlag = 1;
            if (Math.random() < .8) {
                blizzard();
            }
            else {
                story.tell("\1h${hero} coasts through South Pass with not a flake in sight. ${companion} brags that ${solution} works every time.\r\n");
                checkMileage17hundred();
            }
        }
    }

    function slowGoing() {
        story.tell("\1r${vehicle} lurches through muck. ${hero} mutters that ${challenge} is winning this leg.\r\n");
        totalMileage = totalMileage - 45 - Math.random() / .02;
        checkSouthPass();
    }

    //this needs to be fixed big time  ALERT ALERT 
    function checkMileage17hundred() {
        if (totalMileage < 1700) {
            checkMileageNine50();
        }
        if (blueMountainPassFlag != 1) {
            checkMileageNine50();
        }
        else {
            blueMountainPassFlag = 1;
        }
        if (Math.random() < .7) {
            blizzard();
        }
        else {
            turnCheck();
        }
    }

    function checkMileageNine50() {
        if (totalMileage < 950) {
            turnCheck();
        }
        else {
            mileSouthPassFlag = 1;
            turnCheck();
        }
    }

    function blizzard() {
        story.tell("\1cA blizzard ambushes the pass. ${companion} watches ${treasure} vanish into drifts while ${hero} clings to the ${vehicle}.", {});
        blizzardFlag = 1;
        foodAMT = foodAMT - 25;
        supplyAMT = supplyAMT - 10;
        ammoAMT = ammoAMT - 300;
        totalMileage = totalMileage - 30 - 40 * Math.random();
        if (clothingAMT < 18 + 2 * Math.random()) {
            illnessSubroutine();
        }
        else {
            checkMileageNine50();
        }
    }

    // ***DYING***
    function starve() {
        story.tell("\r\n\1i\1r${hero} and ${companion} finally run out of ${treasure}. The trail swallows them in silence.\1n", {});
        causeOfDeath = "starved to death";
        formalities();
        return;  //after formalities
    }

    function outOfMedicalSupplies() {
        story.tell("\1rThe med kit is empty. ${emotion} spreads through the camp.");
        youDiedOf();
    }

    function youDiedOf() {
        story.tell("\r\n\1r${hero} succumbs to the trail: ");
        if (woundedFlag == 1) {
            injuries();
        }
        else {
            story.tell("\1cPNEUMONIA leaves ${companion} to haul the ${vehicle} alone.");
            causeOfDeath = "got pneumonia";
            formalities();
            return;  //after formalities
        }
    }

    function injuries() {
        story.tell("\1h\1rInjuries pile up faster than ${solution} can mend them.");
        causeOfDeath = "was injured badly";
        formalities();
        return;  //after formalities
    }

    function formalities() {
        console.crlf();
        story.tell("The keeper of the trail ledger clears their throat. 'Before ${hero} fades into legend, a few formalities.'");
        console.crlf();
        originalPutMsg("\1cWOULD YOU LIKE A MINISTER?");
        yesNo = console.getstr();
        originalPutMsg("\1mWOULD YOU LIKE A FANCY FUNERAL?");
        yesNo = console.getstr();
        originalPutMsg("\1bWOULD YOU LIKE US TO INFORM YOUR NEXT OF KIN?");
        yesNo = console.getstr();
        if (yesNo = "YES") {
            telegraph();
        }
        else {
            story.tell("\1m'But your Aunt Sadie back in St. Louis still worries,' the clerk reminds ${companion}.");
            console.crlf();
            telegraph();
        }
    }

    function digGrave() {
        originalPutMsg(story.format("\1wWhat inscription seals the memorial? (\1r79 chars\1w)\r\n\1y>"));
        this.engraving = console.getstr();
        this.fromBBS = system.name;
        if (!this.engraving || !this.engraving.trim()) {
            this.engraving = story.format("${hero} went ${verb_unexpected} with ${danger} while chasing ${treasure}.");
        }
        this.engraving = this.engraving.substring(0, 78);
        this.score = parseInt(totalMileage);
        this.corpseName = user.alias;
        this.deathDate = system.datestr();
        this.deathCause = causeOfDeath;
        console.clear();
        story.tell("\r\n\r\n\1h\1wHere lies ${corpse}, legendary ${hero} of the ${vehicle}.", { corpse: this.corpseName });
        story.tell("\r\n\1w ... \r\n" + this.engraving);
        story.tell("\r\n\1wTraveled \1h" + this.score + "\1n miles from \1h" + this.fromBBS + "\1n before they \1h" + this.deathCause + "\1n and died.\r\n\r\n\r\n", {});
        graveObj = {
            "name": this.corpseName,
            "engraving": this.engraving,
            "score": this.score,
            "bbs": this.fromBBS,
            "date": this.deathDate,
            "cause": this.deathCause,
            "vocab": (function (v) { try { return JSON.parse(JSON.stringify(v)); } catch (_e) { return {}; } })(story.vocab)
        };
        db.push("TRAIL", "TRAIL.GRAVES", graveObj, 2);
        db.cycle();
    }

    function telegraph() {
        story.tell("\r\n\1h\1i\1yThe telegrapher pockets $4.50 and promises to tell the tale of ${hero} and ${companion}.\1n\r\n");
        console.crlf();
        story.tell("\1h\1wThe clerk sighs, apologizing that the gates of ${destination} stayed closed this run.");
        console.crlf();
        console.crlf();
        story.tell("\1h\1wSINCERELY");
        console.crlf();
        story.tell("\1gTHE " + (story.vocab.destination ? story.vocab.destination.toUpperCase() : "WELCOME") + " RELOCATION DESK\r\n\r\n");
        digGrave();
        story.record("MADLIB JOURNEY ENDED: ${hero} fell to ${cause}.", { cause: causeOfDeath || "the trail" });
        story.persist();
        throw "gameOver";
        originalPutMsg("\1r\1iGAME OVER");
    }


    // ***FINAL TURN***
    function finalTurn() {
        twoWeekFraction = (2040 - prevMileage) / (totalMileage - prevMileage);
        foodAMT = foodAMT + (1 - twoWeekFraction) * (8 + 5 * choiceEat);
        console.crlf();
        // **BELLS IN LINES 5470,5480**
        console.beep();
        console.beep();
        console.beep();
        story.tell("\1g${hero} and ${companion} roll into ${destination} after 2040 miles of ${challenge}. Crowd goes wild!", {});
        console.crlf();
        twoWeekFraction = parseInt(twoWeekFraction * 14);
        turnNumber = turnNumber * 14 + twoWeekFraction;
        twoWeekFraction = twoWeekFraction + 1;

        switch (twoWeekFraction % 7) {
            //twoWeekFraction=twoWeekFraction-7
            // ON twoWeekFraction continue: 5570,5590,5610,5630,5650,5670,5690
            case 1:
                console.putmsg("MONDAY ");
                break;
            case 2:
                console.putmsg("TUESDAY ");
                break;
            case 3:
                console.putmsg("WEDNESDAY ");
                break;
            case 4:
                console.putmsg("THURSDAY ");
                break;
            case 5:
                console.putmsg("FRIDAY ");
                break;
            case 6:
                console.putmsg("SATURDAY ");
                break;
            case 0:
                console.putmsg("SUNDAY ");
                break;
        }
        finalMonth();
        console.crlf();
        story.tell("Supplies on arrival: ${foodLeft} of ${rationFood}, ${ammoLeft} ${ammoType}, ${clothesLeft} ${outfit}, ${supplyLeft} ${supplyKit}, ${cashLeft} ${currency}.", {
            foodLeft: Math.max(0, parseInt(foodAMT)),
            ammoLeft: Math.max(0, parseInt(ammoAMT)),
            clothesLeft: Math.max(0, parseInt(clothingAMT)),
            supplyLeft: Math.max(0, parseInt(supplyAMT)),
            cashLeft: Math.max(0, parseInt(cashInitialPurchase))
        });
        if (ammoAMT < 0) {
            ammoAMT = 0;
        }
        if (clothingAMT < 0) {
            clothingAMT = 0;
        }
        if (supplyAMT < 0) {
            supplyAMT = 0;
        }
        if (cashInitialPurchase < 0) {
            cashInitialPurchase = 0;
        }
        if (foodAMT < 0) {
            foodAMT = 0;
        }
        console.putmsg(parseInt(foodAMT) + parseInt(ammoAMT) + parseInt(clothingAMT) + parseInt(supplyAMT) + parseInt(cashAfterInitialPurchase));
        console.crlf();
        story.tell("President Polk sends a telegram praising ${hero}'s ${adjective_bold} grit.", {});
        console.crlf();
        story.tell("He wishes your crew a prosperous life in the promised land of ${destination}.");
        console.crlf();
        story.tell("Unpack the ${treasure}; the frontier is yours.");
        newHighScore();
        story.record("MADLIB JOURNEY COMPLETE: ${hero} reached ${destination} in ${turnNumber} turns.", {
            turnNumber: turnNumber
        });
        story.persist();
    }

    function newHighScore() {
        story.tell("\1h\1yYour legend is now etched into the high score chronicle!");
        this.fromBBS = system.name;
        this.score = Score();
        this.score = this.score * (22 - turnNumber) * (6 - choiceShootingExptLvl);
        story.tell("\r\n\1h\1mFinal tally: \1w${score} prestige points.\r\n", { score: this.score });
        this.corpseName = user.alias;
        this.deathDate = system.datestr();
        scoreObj = { "name": this.corpseName, "score": this.score, "bbs": this.fromBBS, "date": this.deathDate };
        db.push("TRAIL", "TRAIL.SCORES", scoreObj, 2);
        db.cycle();
        throw err;
    }

    // ***ILLNESS SUB-ROUTINE***
    function illnessSubroutine() {
        if (100 * Math.random() < 10 + (choiceEat - 1) * 35) {
            story.tell("\1gA mild bug sweeps the crew—${supplyKit} gets raided but spirits stay high.\r\n", {});
            totalMileage = totalMileage - 5;
            supplyAMT = supplyAMT - 2;
        }
        else {
            if (100 * Math.random() < 100 - (40 / Math.pow(4, (choiceEat - 1)))) {
                story.tell("\r\n\1g\1iA nasty illness knocks out ${companion}. More ${supplyKit} disappears into the blender.\r\n", {});
                totalMileage = totalMileage - 5;
                supplyAMT = supplyAMT - 5;
                checkSupplies();
            } else {
                story.tell("\1i\1rSerious outbreak! ${hero} halts the caravan for emergency treatment.");
                supplyAMT = supplyAMT - 10;
                illnessFlag = 1;
                checkSupplies();
            }
        }

        if (supplyAMT < 0) {
            outOfMedicalSupplies();
        }
        else {
            if (blizzardFlag == 1) {
                checkMileageNine50();
            }
            else {
                mountains();
            }
        }
    }


    /* 6470 // ***IDENTIFICATION OF VARIABLES IN THE PROGRAM***
     6480 // A = AMOUNT SPENT ON ANIMALS
     6490 // B = AMOUNT SPENT ON AMMUNITION
     6500 // B1 = ACTUAL RESPONSE TIME FOR console.inkey(TING "BANG"
     6510 // B3 = CLOCK TIME START OF console.inkey(TING "BANG"
     6520 // C = AMOUNT SPENT ON CLOTHING
     6530 // C1 = FLAG FOR INSUFFICIENT CLOTHING IN COLD WEATHER
     6540 // C$ = YES/NO RESPONSE TO QUESTIONS
     6550 // D1 = COUNTER IN GENERATING EVENTS
     6560 // D3 = TURN NUMBER FOR SETTING DATE
     6570 // D4 = CURRENT DATE
     6580 // D9 = CHOICE OF SHOOTING EXPERTISE LEVEL
     6590 // E = CHOICE OF EATING
     6600 // F = AMOUNT SPENT ON FOOD
     6610 // F1 = FLAG FOR CLEARING SOUTH PASS
     6620 // F2 = FLAG FOR CLEARING BLUE MOUNTAINS
     6630 // F9 = FRACTION OF 2 WEEKS TRAVELED ON FINAL TURN
     6640 // X5 = FLAG FOR INJURY
     6650 // L1 = FLAG FOR BLIZZARD
     6660 // M = TOTAL MILEAGE WHOLE TRIP
     6670 // M1 = AMOUNT SPENT ON MISCELLANEOUS SUPPLIES
     6680 // M2 = MILEAGE UP THROUGH PREVIOUS TURN
     6690 // M9 = FLAG FOR CLEARING SOUTH PASS IN SETTING MILEAGE
     6700 // P = AMOUNT SPENT ON ITEMS AT FORT
     6710 // R1 = RANDOM NUMBER IN CHOOSING EVENTS
     6720 // S4 = FLAG FOR ILLNESS
     6730 // S5 = ""HOSTILITY OF RIDERS"" FACTOR
     6740 // S6 = SHOOTING WORD SELECTOR
     6750 // S$ = VARIATIONS OF SHOOTING WORD
     6760 // T = CASH LEFT OVER AFTER INITIAL PURCHASES
     6770 // T1 = CHOICE OF TACTICS WHEN ATTACKED
     6780 // X = CHOICE OF ACTION FOR EACH TURN
     6790 // X1 = FLAG FOR FORT OPTION
     6800 END */

    function hailStorm() {
        story.tell("\r\n\r\n\1h\1wIce shards hammer the ${vehicle}, shredding supplies!\r\n");
        console.beep();
        console.pause();
        totalMileage = totalMileage - 5 - Math.random() * 10;
        ammoAMT = ammoAMT - 200;
        supplyAMT = supplyAMT - 4 - Math.random() * 3;
        // mountains();
    }

    function warmEnough() {
        if (notEnoughClothes != 1) {
            mountains();
        }
        else {
            illnessSubroutine();
        }
    }

    function coldWeather() {
        story.tell("\1cAn arctic gust slaps the ${vehicle}. ${companion} braces for frost.");
        if (clothingAMT < 22 + 4 * Math.random()) {
            notEnoughClothes = 0;

        }
        else {
            notEnoughClothes = 1;

        }
        if (notEnoughClothes == 1) {
            story.tell("\1h\1wThe crew needs more ${outfit} to stay warm!\r\n");
        } else {
            story.tell("\1h\1wLuckily the ${outfit} stash keeps everyone toasty.\r\n");
        }
        warmEnough();
        console.pause();
    }

    function wildBangResponse() {
        if (bangResponse < 45 || bangResponse == 0) {
            slowDraw();
        }
        else {
            story.tell("${hero} lines up a perfect shot—the scavengers retreat with empty hands.");
        }
    }

    function slowDraw() {
        story.tell("Too slow! ${danger} snatches some ${rationFood} and ${outfit} before slipping away.");
    }

    /*		
     function wildBangResponse {
     if(bangResponse<2) { slowDraw();
     }
     else {
     console.putmsg("NICE SHOOTIN' PARDNER---THEY DIDN'T GET MUCH");
     }
     function slowDraw(); {
     console.putmsg("SLOW ON THE DRAW---THEY GOT AT YOUR FOOD AND CLOTHES");
     }
     **/


    function quickestDraw() {
        story.tell("QUICKEST DRAW IN THE SECTOR! ${hero} drops the threat in a heartbeat.");
        story.tell("YOU GOT 'EM!");
        mountains();
    }

    function finalMonth() {
        if (turnNumber < 93) {
            console.putmsg("JULY " + turnNumber + " 1847");
            turnNumber = turnNumber - 93;
        }
        if (93 < turnNumber < 124) {
            turnNumber = turnNumber - 124;
            console.putmsg("AUGUST " + turnNumber + " 1847");
        }
        if (123 < turnNumber < 155) {
            turnNumber = turnNumber - 155;
            console.putmsg("SEPTEMBER " + turnNumber + " 1847");
        }

        if (154 < turnNumber < 185) {
            turnNumber = turnNumber - 185;
            console.putmsg("OCTOBER " + turnNumber + " 1847");
        }

        if (184 < turnNumber < 216) {
            turnNumber = turnNumber - 216;
            console.putmsg("NOVEMBER " + turnNumber + " 1847");
        }
        if (215 < turnNumber246) {
            turnNumber = turnNumber - 246;
            console.putmsg("DECEMBER " + turnNumber + "1847");
        }
    }

    function checkSupplies() {
        if (supplyAMT < 0) {
            outOfMedicalSupplies();
            return;
        }
        if (blizzardFlag == 1) {
            checkMileageNine50();
            return;
            ;
        }
        mountains();
    }


    function misfire() {
        var misfirePhrase = new Array;
        misfirePhrase[0] = "You hit a rock"
        misfirePhrase[1] = "You completely miss your target, but almost kill your favorite sheep."
        misfirePhrase[2] = "Looks like you forgot to take the safety off"
        misfirePhrase[3] = "Who taught you to shoot? Plaxico Burress?"
        var misfirePhraseSelector = parseInt(getRandomInt(0, misfirePhrase.length - 1));
        console.putmsg("\1h\1y" + misfirePhrase[misfirePhraseSelector] + "\r\n");
    }
}

try {
    OregonTrail();
}
catch (err) {
    originalPutMsg("\1r\1iGAME OVER");
}


