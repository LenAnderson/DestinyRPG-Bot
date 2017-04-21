## What is it
A bot for the game destinyrpg.com

## This allowed?
Long story short. No. The developer does not want automation scripts.  
Using this script will get you banned if caught.

## How does it work  
You need to install this using tampermonkey or greasemonkey.  
Firefox: [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)  
Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)  
  
Once you have installed the extension, Click [here](https://github.com/TryHardHusky/DestinyRPG-Bot/raw/master/DestinyBot.user.js) to install the script.  
  
## Explanation  
The script is incomplete, And will eventually break when the website gets updated or when the developer finds this script and breaks it.  
I will **NOT** be updating this. You are welcome to contribute.  
  
### [bot.action](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L131)
The bot uses button text to detect what to do next. If the text changes you will need to update these values.  
These are important for navigating and detecting enemies.  
  
### [bot.enemies](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L156)
Like bot actions, This dictionary is to detect enemies to attack. The values are used to detect what attacks to use.  
See [attackString](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L148)  
  
### [bot.update](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L212)  
This function is run every tick, By default it's 1 tick per 1000ms. You can add a temporary delay with `bot.delay` 
If you have a bad connection, I recommend increasing `bot.interval`  
  
### [bot.doAction](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L234)  
Probably the most important action. This simply checks if an action exists then attempts to click the element on the page.  
If the element does not exist it will not fire. Only reason it won't exist is if the page hasn't finished loading or you are on the wrong page.  

### [bot.attack](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L238)  
The main actions of the bot take place here in this order:  
- Can we return to patrol? 
- Am I low health? Should I run?  
- Is my health less than 90%? Should I take cover?
- Are there any enemies in the area? Click Nothing Nearby
- Run away if the enemy is -1  
- Use ultra attack
- use heavy attack if ultra is not ready // kick chest
- use special attack if you can't use heavy // smack chest
- use regular attack if you can't use special // hit chest
- If you reach this point the bot is fucked. It should have found something to do already.

### [bot.selectEnemy](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L292)  
Search for the lowest health enemy there is and set it as the current target  
  
### [bot.onNewPage](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L317)  
Called when a new page loads. Does nothing right now.

### [bot.updatePlayerInfo](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L331)  
Gets xp / glimmer / health ect  
Can later be used to calculate time required to level up.  
  
### [bot.getEnemyInfo](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L342)  
Important function, Gets enemy health / damage / shield.  
Used to detect when to use heavy, ultra, special or regular attacks depending on their health and how much damage you output.  
  
### [bot.updateButtons](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L359)  
Build a dictionary of actions that the bot can click.  
  
### [bot._getText](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L445)  
Very important function. Is used to get information like health or enemy and player.  
Some main functions of the bot will break if this changes, But it's fairly simple to fix.  
h = hex, r = rgb, c = color(string), element = tag, io = indexOf  
See [this](https://github.com/TryHardHusky/DestinyRPG-Bot/blob/master/DestinyBot.user.js#L441) for example.  
  
# That's it.  
Enjoy.
