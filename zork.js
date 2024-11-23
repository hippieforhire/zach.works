// Zork Game Logic
const gameData = {
    currentRoom: "entrance",
    rooms: {
        entrance: {
            description: "You are at the entrance of a dark cave. There is a torch on the wall.",
            commands: {
                take: "You take the torch.",
                go: "You step into the cave. It's very dark. You feel the air grow colder.",
                look: "The cave entrance looms ahead. The torch flickers faintly."
            },
            next: "darkRoom"
        },
        darkRoom: {
            description: "You are now in a pitch-dark room. You can hear the sound of dripping water.",
            commands: {
                light: "You light the torch and see a narrow passage ahead.",
                listen: "You hear faint whispers echoing in the distance.",
                go: "You walk into the passage cautiously.",
            },
            next: "treasureRoom"
        },
        treasureRoom: {
            description: "You enter a room glittering with treasure! You've found the lost gold!",
            commands: {
                take: "You gather as much treasure as you can carry.",
                leave: "You decide to leave the treasure and exit the cave safely."
            },
            next: "end"
        }
    },
    end: {
        description: "The adventure is over. Thank you for playing!",
        commands: {}
    }
};

let outputBox, inputBox;

function startZorkGame() {
    const gameContainer = document.getElementById("zorkGame");
    outputBox = document.getElementById("output");
    inputBox = document.getElementById("input");

    gameContainer.style.display = "block";
    outputBox.textContent = "";
    addOutput(gameData.rooms[gameData.currentRoom].description);
    inputBox.focus();
}

function handleZorkInput(event) {
    if (event.key === "Enter") {
        const command = inputBox.value.trim().toLowerCase();
        inputBox.value = "";
        processCommand(command);
    }
}

function processCommand(command) {
    const currentRoom = gameData.rooms[gameData.currentRoom];
    const commands = currentRoom.commands;

    if (commands[command]) {
        addOutput(commands[command]);

        // Progress to the next room if available
        if (command === "go" && currentRoom.next) {
            gameData.currentRoom = currentRoom.next;
            addOutput(gameData.rooms[gameData.currentRoom].description);
        }
    } else if (command === "quit") {
        addOutput("You have quit the game.");
        gameData.currentRoom = "entrance"; // Reset the game
    } else {
        addOutput("I don't understand that command. Try something else.");
    }
}

function addOutput(text) {
    const newParagraph = document.createElement("p");
    newParagraph.textContent = text;
    outputBox.appendChild(newParagraph);
    outputBox.scrollTop = outputBox.scrollHeight;
}
