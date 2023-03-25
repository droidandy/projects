# README #

### Basic setup ###
#### Basic use

- The ionic test version is run using `ionic serve`
- The iOS version is created using `ionic build ios`. A test version is run using `ionic emulate ios`

#### Test versus live

- Testing locally
  - in gm-api.factory.js, set `gmAPIServerIP` to 127.0.0.1:8000 (or relevant port)
- Testing on browser:
  - in gm-api.factory.js
    - uncomment between /* Start Browser Test */ and /* End Browser Test */
    - ensure API key is correct (found in authtoken_token)
  - in index.html, change `opentok.js` to `opentok.min.js`
- Testing on device / emulator:
  - in gm-api.factory.js, comment between /* Start Browser Test */ and /* End Browser Test */
  - in index.html, change `opentok.min.js` to `opentok.js`
- Deploying to test users
  - Ensure the version number is increased by 0.1
  - Upload to iTunesConnect

#### Sockets

There are three different socket types. They are unique and only one socket can be connected at a time:
- Connections
    - Handles Pokes, Contact notifications
        - Received a Poke
            - Alert with confirmation popup
        - Received a Contact
            - Alert with Contact popup
    - Priority
        - Lowest priority, only available if no Game socket or Room socket
        - Disconnects Room, allows person to reenter Game if required
- Game
    - Handles Game logic and movement within the Game
        - Pending Game
            - Displays Pending Screen
        - Live Game
            - Displays live game
        - End Game
            - Redirects to relevant "match" screen
    - Priority
        - Top priority, overrides all others
        - Only used when in Game
        - Room socket must be ended
- Room
    - Handles Room management
        - Pending Room
            - Waiting for a Room to become available
        - Roke Later
            - Move out of Room to Poke Later screen
        - Start Room
            - Display Room
        - End Room
            - Move out of Room
        - Wait Room
            - Pauses connection to existing server
        - Time Action
            - Reduces the total time available by 10 seconds
        - None - cannot display Room
    - Priority
        - Top priority, overrides all others
        - Only used when in Room or Waiting for a Room, 
        - Game socket must be ended


#### Sockets Logic

Logic
- Connections
    - All pages except those detailed below
        - Contact received - display alert
        - Poke received - display confirmation box.
            - Confirm - go to Poke Wait room to see if both are in there. If both in, go to Room
            - Cancel - send "End" message to Poke list
        - Poke ended - display Poke missed
- Game
    - On enter
        - Set socket Game
    - On action
        - Set socket Room (if match)
        - Set socket Connections (if leave)
        - Keep socket Game (if stay)
    - Play
        - Pending - display waiting screen
        - Pending > Live - display live game
        - Live - display live game
        - Live > End - display "Match" or "Ended" screen
- Room
    - On action
        - Set socket Connections (if leave)
    - Match
        - Waiting - do nothing
        - Poke - leave screen
        - Poked - display standard screen
        - Waiting > Live - display Live Room
        - Waiting > End - display home screen
    - Room
        - Live - do nothing
        - Live > Wait - display waiting
        - Wait > Live - hide waiting
        - Live > End - display "Send Contact"
        - Live > Reported - display "Ended" screen
        - Wait > End - display "Send Contact"
        - Wait > Reported - display "Ended" screen
        (- Time Changed - display new time left) - Phase 2
    - Poke Wait
        - Poking - do nothing
        - Poking > End - display "Ended" screen
        - Leave - send message "left" to end Poke call