## What is it?
A bot for the game destinyrpg.com

## This allowed?
Long story short. No. The developer does not want automation scripts.  
Using this script will get you banned if caught.

## Installation
You need to install this using tampermonkey or greasemonkey.  
Firefox: [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)  
Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)  
  
Once you have installed the extension, Click [here](https://github.com/LenAnderson/DestinyRPG-Bot/raw/master/DestinyBot.user.js) to install the script.

## How does it work?
You need to be on patrol, on the travel screen, or in a battle for the bot to start.
The following is a general outline of what the bot does:

- **Orbit**
  1. If you have just died, go back on patrol.
- **Patrol**
  1. Attack chest or cache with highest HP.
  2. No chest or cache available? Attack enemy with highest SH.
  3. No shielded enemy available? Attack enemy with highest HP.
  4. No enemies and no chests / caches available? Look around for a couple of times and then go somewhere else.
- **Battle**
  1. If very low on health, run away.
  2. If low on health, take cover.
  3. If enemy is an Ultra and their SP / HP is more than 4 times our minimum damage (min damage as recorded during all battles during this session), use *Ultra Attack* (Golden Gun, Arc Blade, Shadowshot).
  4. If enemy is an Ultra and their SP / HP is more than 2 times our minimum damage, use *Heavy Attack*.
  5. If enemy has a shield, use *Special Attack*.
  6. Use *Regular Attack*.
  7. If you have died, respawn.
  8. If you have won the battle. go back to patrol.
- **Travel**
  1. If not already in the last subregion on the list: travel to the next available subregion.
  2. If not already in the last region on the list: travel to the next available region.
  3. Travel to the next available location.

### Pausing the bot
You can pause (and unpause) the bot at any time if you want to take control for a while.
In the Tampermonkey / Greasemonkey menu you should see an entry `[DRB] Pause Bot` (or `[DRB] Unpause Bot` if already paused) that will stop the bot from performing any actions.
  
### Preferences
You can customize some of the bot's behavior. In the Tampermonkey / Greasemonkey menu you should see an entry `[DRB] Preferences` that will launch a popup window. Your preferences are saved locally in your browser and are not linked to your account (if you switch computers your preferences won't be there).

- **General Preferences**
  - **Update Interval (ms)** Time in milliseconds between clicks.
  - **Update Interval Range (ms)** Time range in milliseconds to randomly add / substract from the update interval. If your update interval is 1000ms (1 second) and your range is 500ms the time between clicks will range from 500ms (1000-500) to 1500ms (1000+500).
- **Travel**
  - **Don't Change Location** When traveling, don't change the location (e.g. Earth, Moon, Mars, ...).
  - **Don't Change Region** When traveling, don't change the region (e.g. The City, Old Russia, Old Chicago, ...).
- **Patrol**
  - **Max Times Looking Around Before Travel** Number of times the *Seach Nearby* button is clicked before going somewhere else.
  - **Avoid Enemies With x Times Player's Health** Enemies with health or shield this number of times as high as the player's health are put to the bottom of the list when prioritizing enemies to attack. If your health is 1000 and this value is set to 10 enemies with 10000 HP or SH are attacked only if no other enemies are available.
  - **Lucky Day Bonus** The bonus / boost to pick when the "It's your lucky day" prompt appears.
- **Battle**
  - **Take Cover At (% max health)** If your health goes below this percentage of max health you take cover.
  - **Run Away At (% max health)** If your health goes below this percentage of max health you run away from the fight.

  
# That's it.  
Enjoy.
