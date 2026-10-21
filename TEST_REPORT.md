## Test Report

### Summary

### Test 1: Index.js

All test cases were run manually in Chrome on Windows, in full screen at 1920 × 1080.

| Id | Test case | Requirement | Input | Expected outcome | Result |
| -- | --------- | ----------- | ----- | ---------------- | ------ |
| TC1 | Start a game | R1 | Click EASY on the start screen | The day screen shows "DAY 1" and today's date, then the booth and the first traveller | ✅ Passed  2026-10-19 |
| TC2 | Start on every difficulty | R1 | Start one game each on EASY, MEDIUM and HARD | A game starts every time | ✅ Passed 2026-10-19 |
| TC3 | Discrepancies follow the difficulty | R2 | Open the list on EASY, then on HARD | EASY lists 4 discrepancies, HARD lists 12 | ✅ Passed 2026-10-19 |
| TC4 | Nations follow the difficulty | R2 | Look at the nationality of 15 travellers on EASY | Only Sweden, United Kingdom, Germany and Norway occur | ✅ Passed 2026-10-19 |
| TC5 | Passport when the traveller arrives | R3 | Wait after the day screen | The passport appears on the counter only when the traveller stands at the window, with the voice line | ✅ Passed  2026-10-19 |
| TC6 | Open on the inspection desk | R4 | Drag the passport to the right | The passport becomes large and open | ✅ Passed 2026-10-19 |
| TC7 | Fall onto the counter | R4 | Release the closed passport high up on the left | It falls down onto the counter | ✅ Passed 2026-10-19 |
| TC8 | Drag every item | R4 | Drag the list, both stamps and a citation to the desk and back | Every item changes size and can be moved | ✅ Passed 2026-10-19 |
| TC9 | Passport details and displays | R5 | Open a passport | Name, date of birth, sex, nationality, cities, dates, height, code and photo are shown; the displays show a height and today's date | ✅ Passed 2026-10-19 |
| TC10 | Genuine passport matches | R6 | Approve passports until one is accepted without a citation | Its details match the rules, the height display and today's date | ✅ Passed 2026-10-19 |
| TC11 | Forgery can be found | R6 | Approve every passport until a citation is printed | The reason on the citation can be seen on that passport | ✅ Passed 2026-10-19 |
| TC12 | Stamp the passport | R7 | Drag the approve stamp onto the open passport | A mark with today's date appears and the stamp sound plays | ✅ Passed 2026-10-19 |
| TC13 | Stamp beside the passport | R7 | Release a stamp next to the open passport | No mark appears | ✅ Passed 2026-10-19 |
| TC14 | Hand back a stamped passport | R8 | Stamp the passport and drag it to the booth | The passport disappears, the traveller leaves and a new one comes | ✅ Passed 2026-10-19 |
| TC15 | Unstamped passport stays | R8 | Drag an unstamped passport to the booth | The passport stays and the traveller waits | ✅ Passed 2026-10-19 |
| TC16 | Citation for denying a genuine passport | R9 | Deny every passport | A citation saying "DENIED A VALID PASSPORT" is printed for a genuine passport | ✅ Passed 2026-10-19 |
| TC17 | Citation for approving a forgery | R9 | Approve every passport | A citation naming the discrepancy is printed for a forged passport | ✅ Passed 2026-10-19 |
| TC18 | New day | R10 | Judge all 15 travellers with one citation on the counter | The day screen shows "DAY 2" and the next date; the citation is gone and the list and stamps are back where they started | ✅ Passed 2026-10-19 |
| TC19 | Date on the next day | R10 | Stamp a passport on day 2 | The mark and the date display show the new date | ✅ Passed 2026-10-19 |
| TC20 | Game over | R11 | Get three citations on the same day | The end screen is shown | ✅ Passed 2026-10-19 |
| TC21 | Citations reset each day | R11 | Get two citations on day 1 and one on day 2 | The game goes on | ✅ Passed 2026-10-19 |
| TC22 | Statistics on the end screen | R12 | Count right and wrong decisions until game over | Days played, right and missed passports match the count | ✅ Passed 2026-10-19 |
| TC23 | Start again | R12 | Click EASY on the end screen | A new game starts on day 1 without citations | ✅ Passed 2026-10-19 |
| TC24 | Background volume | R13 | Click the settings button and drag the ambient slider to 0 | The background sounds go quiet, the voices can still be heard | ✅ Passed 2026-10-19 |
| TC25 | Voice volume | R13 | Drag the voice slider to 0 | The voice lines go quiet | ✅ Passed 2026-10-19 |

### Test 2: App.js

After moving logic code from index.js to App.js, i needed to run every test-case again.

| Id | Test case | Requirement | Result |
| -- | --------- | ----------- | ------ |
| TC1 | Start a game | R1 | ✅ Passed  2026-10-19 |
| TC2 | Start on every difficulty | R1 | ✅ Passed  2026-10-19 |
| TC3 | Discrepancies follow the difficulty | R2 | ✅ Passed  2026-10-19 |
| TC4 | Nations follow the difficulty | R2 | ✅ Passed  2026-10-19 |
| TC5 | Passport when the traveller arrives | R3 | ✅ Passed  2026-10-19 |
| TC6 | Open on the inspection desk | R4 | ✅ Passed  2026-10-19 |
| TC7 | Fall onto the counter | R4 | ✅ Passed  2026-10-19 |
| TC8 | Drag every item | R4 | ✅ Passed  2026-10-19 |
| TC9 | Passport details and displays | R5 | ✅ Passed  2026-10-19 |
| TC10 | Genuine passport matches | R6 | ✅ Passed  2026-10-19 |
| TC11 | Forgery can be found | R6 | ✅ Passed  2026-10-19 |
| TC12 | Stamp the passport | R7 | ✅ Passed  2026-10-19 |
| TC13 | Stamp beside the passport | R7 | ✅ Passed  2026-10-19 |
| TC14 | Hand back a stamped passport | R8 | ✅ Passed  2026-10-19 |
| TC15 | Unstamped passport stays | R8 | ✅ Passed  2026-10-19 |
| TC16 | Citation for denying a genuine passport | R9 | ✅ Passed  2026-10-19 |
| TC17 | Citation for approving a forgery | R9 | ✅ Passed  2026-10-19 |
| TC18 | New day | R10 | ✅ Passed  2026-10-19 |
| TC19 | Date on the next day | R10 | ✅ Passed  2026-10-19 |
| TC20 | Game over | R11 | ✅ Passed  2026-10-19 |
| TC21 | Citations reset each day | R11 | ✅ Passed  2026-10-19 |
| TC22 | Statistics on the end screen | R12 | ✅ Passed  2026-10-19 |
| TC23 | Start again | R12 | ✅ Passed  2026-10-19 |
| TC24 | Background volume | R13 | ✅ Passed  2026-10-19 |
| TC25 | Voice volume | R13 | ✅ Passed  2026-10-19 |

### Test 3: Publishing on GitHub Pages v1.0.2

After making some additional changes and publishing the game again on GitHub Pages, i ran every test-case again.

| Id | Test case | Requirement | Result |
| -- | --------- | ----------- | ------ |
| TC1 | Start a game | R1 | ✅ Passed  2026-10-20 |
| TC2 | Start on every difficulty | R1 | ✅ Passed  2026-10-20 |
| TC3 | Discrepancies follow the difficulty | R2 | ✅ Passed  2026-10-20 |
| TC4 | Nations follow the difficulty | R2 | ✅ Passed  2026-10-20 |
| TC5 | Passport when the traveller arrives | R3 | ✅ Passed  2026-10-20 |
| TC6 | Open on the inspection desk | R4 | ✅ Passed  2026-10-20 |
| TC7 | Fall onto the counter | R4 | ✅ Passed  2026-10-20 |
| TC8 | Drag every item | R4 | ✅ Passed  2026-10-20 |
| TC9 | Passport details and displays | R5 | ✅ Passed  2026-10-20 |
| TC10 | Genuine passport matches | R6 | ✅ Passed  2026-10-20 |
| TC11 | Forgery can be found | R6 | ✅ Passed  2026-10-20 |
| TC12 | Stamp the passport | R7 | ✅ Passed  2026-10-20 |
| TC13 | Stamp beside the passport | R7 | ✅ Passed  2026-10-20 |
| TC14 | Hand back a stamped passport | R8 | ✅ Passed  2026-10-20 |
| TC15 | Unstamped passport stays | R8 | ✅ Passed  2026-10-20 |
| TC16 | Citation for denying a genuine passport | R9 | ✅ Passed  2026-10-20 |
| TC17 | Citation for approving a forgery | R9 | ✅ Passed  2026-10-20 |
| TC18 | New day | R10 | ✅ Passed  2026-10-20 |
| TC19 | Date on the next day | R10 | ✅ Passed  2026-10-20 |
| TC20 | Game over | R11 | ✅ Passed  2026-10-20 |
| TC21 | Citations reset each day | R11 | ✅ Passed  2026-10-20 |
| TC22 | Statistics on the end screen | R12 | ✅ Passed  2026-10-20 |
| TC23 | Start again | R12 | ✅ Passed  2026-10-20 |
| TC24 | Background volume | R13 | ✅ Passed  2026-10-20 |
| TC25 | Voice volume | R13 | ✅ Passed  2026-10-20 |

### Test 4: Version 1.0.3

| Id | Test case | Requirement | Result |
| -- | --------- | ----------- | ------ |
| TC1 | Start a game | R1 | ✅ Passed  2026-10-21 |
| TC2 | Start on every difficulty | R1 | ✅ Passed  2026-10-21 |
| TC3 | Discrepancies follow the difficulty | R2 | ✅ Passed  2026-10-21 |
| TC4 | Nations follow the difficulty | R2 | ✅ Passed  2026-10-21 |
| TC5 | Passport when the traveller arrives | R3 | ✅ Passed  2026-10-21 |
| TC6 | Open on the inspection desk | R4 | ✅ Passed  2026-10-21 |
| TC7 | Fall onto the counter | R4 | ✅ Passed  2026-10-21 |
| TC8 | Drag every item | R4 | ✅ Passed  2026-10-21 |
| TC9 | Passport details and displays | R5 | ✅ Passed  2026-10-21 |
| TC10 | Genuine passport matches | R6 | ✅ Passed  2026-10-21 |
| TC11 | Forgery can be found | R6 | ✅ Passed  2026-10-21 |
| TC12 | Stamp the passport | R7 | ✅ Passed  2026-10-21 |
| TC13 | Stamp beside the passport | R7 | ✅ Passed  2026-10-21 |
| TC14 | Hand back a stamped passport | R8 | ✅ Passed  2026-10-21 |
| TC15 | Unstamped passport stays | R8 | ✅ Passed  2026-10-21 |
| TC16 | Citation for denying a genuine passport | R9 | ✅ Passed  2026-10-21 |
| TC17 | Citation for approving a forgery | R9 | ✅ Passed  2026-10-21 |
| TC18 | New day | R10 | ✅ Passed  2026-10-21 |
| TC19 | Date on the next day | R10 | ✅ Passed  2026-10-21 |
| TC20 | Game over | R11 | ✅ Passed  2026-10-21 |
| TC21 | Citations reset each day | R11 | ✅ Passed  2026-10-21 |
| TC22 | Statistics on the end screen | R12 | ✅ Passed  2026-10-21 |
| TC23 | Start again | R12 | ✅ Passed  2026-10-21 |
| TC24 | Background volume | R13 | ✅ Passed  2026-10-21 |
| TC25 | Voice volume | R13 | ✅ Passed  2026-10-21 |

### Known issues in Third-Party Modules
As i have found out none. As i was developing my application i thought about using a different module 
than the one i did. After continuing to develop my application i found that i couldn't use the intended module 
and instead had to go looking for another students. 

I found the `dice-rng-toolkit` and looked at how similar it looked to my own Random class. I therefore just 
implemented the logic into my own class, and it has worked as intended.
