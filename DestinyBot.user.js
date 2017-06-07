// ==UserScript==
// @name         DestinyRPG 2.0
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/DestinyRPG-Bot/raw/master/DestinyBot.user.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @version      0.11
// @author       TryHardHusky, LenAnderson
// @match        https://game.destinyrpg.com/*
// @grant        none
// ==/UserScript==

var bot             = {};

var $navCenter      = $(".navbar-on-center .center");

bot.name            = "Eph";
bot.level           = 0;
bot.xp              = 0;
bot.area            = 'The Tower';
bot.health          = 0;
bot.maxHealth       = 0;
bot.glimmer         = 0;
bot.lp              = 0;

bot.old_page        = window.location.href;
bot.href            = window.location.href;

bot.interval        = 1000;
bot.delay           = 0;

bot.cover_at        = 50;   // 90% HP or less
bot.run_at          = 20;  // 20% HP or less

bot.runAway         = false;

bot.inBattle        = false;

bot.enemy           = {};
bot.enemy.health    = 0;
bot.enemy.health    = 0;
bot.enemy.name      = '';
bot.enemy.enraged   = false;
bot.enemy.damage    = 0;

bot.damages         = {};

bot.damages.regular     = 0;
bot.damages.special     = 0;
bot.damages.heavy       = 0;
bot.damages.ultra       = 0;

// TODO: Localstorage values
bot.minDamage       = 100; // For predicting insta-kills
bot.maxDamage       = 0;

bot.ready           = false;

bot.target          = null;
bot.btn             = {};
bot.targets         = {};

bot.status          = 0;

bot.slow_ticks      = 0;
bot.slow_ticks_max  = 50;

bot.statusCodes = {
    0               : "Initializing",
    1               : "Finding Battle",
    2               : "In Battle",
    3               : "Collecting Loot",
    4               : "Looking for Enemies",
    5               : "Travelling",

    "travelling"                : 5,
    "looking_for_enemies"       : 4,
    "collecting_loot"           : 3,
    "in_battle"                 : 2,
    "finding_battle"            : 1,
    "initializing"              : 0
};

// TODO: Detect location
bot.zones = {
    "Earth" : [
        "The City",
        "Old Russia",
        "Old Chicago",
        "Mumbai Push"
    ],
    "Moon" : [
        "Archer's Line",
        "Anchor of Light",
        "Hellmouth",
        "The Gatehouse"
    ],
    "Venus" : [
        "Shattered Coast",
        "Ishtar Cliffs",
        "Walking Ruins",
        "The Citadel",
        "Ember Caves"
    ],
    "Mars" : [
        "The Barrens",
        "Scablands",
        "The Hollows",
        "Firebase Rubicon",
        "Rubicon Wastes"
    ],
    "Fundament" : [
        "Bone Plaza",
        "Helium Court"
    ],
    "Dreadnaught" : [
        "Altar of Oryx",
        "Court of Oryx",
        "Dantalion Exodus VI",
        "Hull Breach",
        "Mausoleum"
    ]
};

bot.attacks = {
    'Regular Attack'    : { hard : 1 },
    'Special Attack'    : { hard : 2, ammo : 100 },
    'Heavy Attack'      : { hard : 3, ammo : 100 },
    'Golden Gun'        : { hard : 4 },
    'Arc Blade'         : { hard : 4 },
    'Shadowshot'        : { hard : 4 }
};

bot.action = {
    r_attack            : 'Regular Attack',
    s_attack            : 'Special Attack',
    h_attack            : 'Heavy Attack',
    u_attack            : 'Golden Gun',

    hit_it              : 'Hit it',
    smack_it            : 'Smack it',
    kick_it             : 'Kick it',

    patrol              : 'Patrol',
    run_away            : 'Run Away',
    take_cover          : 'Take Cover',
    back_to_patrol      : 'Back to patrolling...',
    nothing_nearby      : 'Nothing nearby...'
};

bot.attackString = {
    0 : "Run",
    1 : "Regular",
    2 : "Special",
    3 : "Heavy",
    4 : "Ultra"
};

var enemies = {
    /* SKIP */
    "Colossus"                  : -1,

    /* REGULAR */
    "Hobgoblin"                 : 1,
    "Harpy"                     : 1,
    "Hydra"                     : 1,
    "Chest"                     : 1,
    "Psion"                     : 1,
    "Phalanx"                   : 1,
    "Cyclops"                   : 1,
    "Minotaur"                  : 1,
    "Praetorian"                : 1,
    "Goblin"                    : 1,
    "Vandal"                    : 1,
    "Shank"                     : 1,
    "Wizard"                    : 1,
    "Thrall"                    : 1,
    "Dreg"                      : 1,
    "Noble Dreg"                : 1,
    "Acolyte"                   : 1,
    "Knight"                    : 1,
    "Captain"                   : 1,

    /* SPECIAL */
    "Legionary"                 : 2,
    "Centurion"                 : 2,

    /* HEAVY */
    "Dust Giants"               : 3,

    /* BOSSES */
    "Draksis"                   : 3,
    "Valus Tlu'urn"             : 4,
    "Valus Mau'ual"             : 4,
    "Kovik, Splicer Priest"     : 4,
    "Sepiks Prime"              : 4,
    "Mormu, Xol Spawn"          : 4,
    "Aksor, Archon Priest"      : 4,
    "Kaliks Reborn"             : 4,
    "War Mech"                  : 4,

    /* Strong cunt, Might as well be boss*/
    "Ogre"                      : 4,
    
    /* Chests, caches, ... */
    "Material Cache"            : 10,
    "Chest"                     : 10
};

bot.isReady = function(){
    if(bot.ready) return;
    bot.load();
    bot.ready = true;
    bot.log("Successfully Initialized");
};

bot.slow_tick = function(){
    bot.slow_ticks = 0;
    bot.save();
};

bot.update = function(){
    bot.delay = 0;

    bot.slow_ticks ++;
    if(bot.slow_ticks >= bot.slow_ticks_max) bot.slow_tick();

    bot.updateHref();
    bot.updateButtons();
    bot.updatePlayerInfo();

    if(bot.level != 0) bot.isReady();

    if(bot.ready && localStorage.kbot === "true"){

        bot.getEnemyInfo();
        // bot.delay = 5000;
        bot.selectEnemy();

    }
    setTimeout(bot.update, (bot.interval + bot.delay));
};

bot.doAction = function(action){
    if(bot.btn[action]) bot.btn[action].click();
};

bot.attack = function(){
    // Return to Patrol
    if( bot.btn[ bot.action.back_to_patrol ] ){
        bot.inBattle = false;
        bot.log("Battle Ended");
        bot.doAction(bot.action.back_to_patrol);
    }
    // Run if low health
    else if( bot.btn[ bot.action.run_away ] && (bot.health < (bot.run_at / 100) * bot.maxHealth || bot.health < bot.enemy.damage * 1.1) ){
        bot.log("Low health, Running like hell.");
        bot.doAction(bot.action.run_away);
    }
    // Heal if possible at less than x% health
    else if(bot.btn[ bot.action.take_cover ] && bot.health < (bot.cover_at / 100) * bot.maxHealth ){
        bot.log("Healing under cover");
        bot.doAction(bot.action.take_cover);
    }
    // Searching for enemies
    else if(!bot.inBattle && bot.targets.length == 0){
        bot.log("Searching for enemies");
        bot.doAction(bot.action.nothing_nearby);
    }
    // Run Away
    else if( bot.btn[bot.action.run_away] && enemies[bot.enemy.name] == -1 ){
        bot.log("Running away from " + bot.enemy.name);
        bot.doAction(bot.action.run_away);
    }
    // Ultra Attack -- bosses only, must have shield or more HP than four times our min damage
    else if ((bot.btn[bot.action.u_attack] || bot.btn[bot.action.kick_it]) && enemies[bot.enemy.name] >= 4 && (bot.enemy.shield > 0 || bot.enemy.health > bot.minDamage*4)) {
        bot.log("ULTRA ATTACK!");
        if(bot.enemy.name.search(/chest|cache/i) == -1) bot.doAction(bot.action.u_attack);
        else bot.doAction(bot.action.kick_it);
    }
    // Heavy Attack -- bosses only, must have shield or more HP than twice our min damage
    else if ((bot.btn[bot.action.h_attack] || bot.btn[bot.action.kick_it]) && enemies[bot.enemy.name] >= 4 && (bot.enemy.shield > 0 || bot.enemy.health > bot.minDamage*2)) {
        bot.log("Heavy Attack");
        if(bot.enemy.name.search(/chest|cache/i) == -1) bot.doAction(bot.action.h_attack);
        else bot.doAction(bot.action.kick_it);
    }
    // Special Attack -- only on shields
    else if ((bot.btn[bot.action.s_attack] || bot.btn[bot.action.smack_it]) && bot.enemy.shield > 0) {
        bot.log("Special Attack");
        if(bot.enemy.name.search(/chest|cache/i) == -1) bot.doAction(bot.action.s_attack);
        else bot.doAction(bot.action.smack_it);
    }
    // Regular Attack
    else if (bot.btn[bot.action.r_attack] || bot.btn[bot.action.smack_it]) {
        bot.log("Regular Attack");
        if(bot.enemy.name.search(/chest|cache/i) == -1) bot.doAction(bot.action.r_attack);
        else bot.doAction(bot.action.hit_it);
    } else {
        bot.log('fuck');
    }
};

bot.selectEnemy = function(){
    if(bot.inBattle) return bot.attack();

    bot.target = bot.targets[Object.keys(bot.targets)[0]];
    var old = -1;

    $.each(bot.targets, function(i,v){
        if(bot.target == null) bot.target = v;
        var ix = enemies[i];
        if(ix > old){
            bot.target = v;
            old = ix;
            bot.enemy.name = i;
            bot.enemy.health = parseInt($(bot.target).find('.item-after').text().replace(/,/g, ''));
        }
    });

    if(bot.target){
        var hits = Math.ceil(bot.enemy.health / bot.minDamage);
        bot.log("Fighting " + bot.enemy.name + " [" + bot.enemy.health + " HP] [" + hits + " Est]");
        bot.target.click();
    } else if (bot.btn[bot.action.nothing_nearby]) {
        bot.log("Searching for enemies");
        bot.doAction(bot.action.nothing_nearby);
    }
    bot.inBattle = true;
};

bot.onNewPage = function(){
    // New page loaded
};

bot.updateHref = function(){
    bot.href        = window.location.href;
    var page        = bot.href.split('.php')[0] + ".php";
    if(bot.old_page != page){
        bot.onNewPage();
        bot.old_page = page;
    }
    bot.inBattle    = bot.href.indexOf('battle.php') > -1;
};

bot.updatePlayerInfo = function(){
    var $stats = $("#statszone").find('.link');
    if($($stats).text().length == 0) return;
    bot.xp          = parseInt($($stats[0]).text().split(':')[1].replace(/,/g, ''));
    bot.glimmer     = parseInt($($stats[1]).text().split(':')[1].replace(/,/g, ''));
    bot.lp          = parseInt($($stats[2]).text().split(':')[1].replace(/,/g, ''));
    bot.level       = (parseInt($($stats[0]).text().split(':')[0].split('level ')[1]) - 1);
    bot.health      = bot.getHealth();
    if(bot.maxHealth < bot.health) bot.maxHealth = bot.health;
};

bot.getEnemyInfo = function(){
    if(!bot.inBattle) return;
    bot.enemy.health    = parseInt(bot.getEnemyHealth(bot.enemy.name));
    bot.enemy.damage    = parseInt(bot._getRedText());
    bot.enemy.shield    = parseInt(bot.getEnemyShield(bot.enemy.name));
    bot.enemy.enraged   = bot.getEnemyState();

    bot.lastDamage      = parseInt(bot._getGreenText());

    if(bot.lastDamage > bot.maxDamage && bot.lastDamage != 0) bot.maxDamage = bot.lastDamage;
    if(bot.lastDamage < bot.minDamage && bot.lastDamage != 0) bot.minDamage = bot.lastDamage;
};

bot.log = function(message){
    console.log("[KBOT]", JSON.stringify(message));
};

bot.updateButtons = function(){
    bot.btn         = {};
    bot.targets     = {};

    $('.page-on-center .item-inner').each(function(i,v){
        var title = $(v).find('.item-title').text().trim();
        if(title !== ''){
            var spl = title.split('(')[0].trim();
            bot.btn[spl] = $(v);
        }
    });

    $.each(bot.btn, function(key, value){
        if(bot.validEnemy(key)){
            if(bot.targets[key]){
                var old = parseInt($(bot.targets[key]).find('.item-after').text().replace(/,/g, ''));
                var cur = parseInt($(value).find('.item-after').text().replace(/,/g, ''));
                if(cur < old) bot.targets[key] = value;
            } else bot.targets[key] = value;
        }
    });
};

bot.save = function(){
    localStorage.ksettings = JSON.stringify(bot.damages);
    bot.log("Saved KBOT Data");
    console.log(bot.inBattle);
};

bot.load = function(){
    if(localStorage.ksettings){
        bot.damages = JSON.parse(localStorage.ksettings);
        bot.log("Loaded KBOT Settings");
    } else {
        bot.log("Storage doesn't exist");
    }
};

bot.getEnemyState = function(){
    return bot._getOrangeText() === "The enemy is enraged!";
};

bot.getHealth = function(){
    if(!bot.inBattle) return 0;
    return parseInt($(bot._getWhiteText()[0]).text().trim().replace(/^.+?(\d+) \/ (\d+) HP.*$/, '$1'));
};

bot.getArea = function(){
    bot.area = $navCenter.text().split("Patrolling ")[1] || null;
};

bot.validEnemy = function(name){
    return !!enemies[name];
};

bot.getEnemyShield = function(name){
    if(bot.validEnemy(name)) return parseInt($(bot._getWhiteText()[1]).text().trim().replace(/^.*?(-?\d+)\s*Shield.*$/, '$1'));
    else return 0;
};

bot.getEnemyHealth = function(name){
    var rows = bot._getWhiteText();
    if(bot.validEnemy(name) && rows[1]){
        var a = $(rows[1]).text().trim().split(name);
        if(a[1]) a = a[1].split('HP')[0].trim();
        return a;
    }
    else return 0;
};

bot._getRedText = function(){
    return bot._getText('#FF0000','rgb(255, 0, 0)','red','strong').text();
};

bot._getOrangeText = function(){
    return bot._getText('#FFA500', 'rgb(255, 165, 0)','orange', 'span').text();
};

bot._getGreenText = function(){
    return bot._getText('#32CD32', 'rgb(50, 205, 50)', 'green', 'strong').text();
};

bot._getWhiteText = function(){
    return bot._getText('#FFFFFF', "rgb(255, 255, 255)", 'white', 'span', /HP|Shield/);
};

bot._getText = function(h, r, c, element, io){
    io = io || false;
    return $(element).filter(function(){
        var co = $(this).css('color');
        if(io !== false) return (co === h || co === r || co === c) && $(this).text().search(io) > -1;
        else return co === h || co === r || co === c;
    });
};

if(!localStorage.kbot) localStorage.kbot = true;
bot.log("Initializing...");
bot.update();
