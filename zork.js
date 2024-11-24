// Zork Game Logic
const gameData = {
    currentRoom: "entrance",
    inventory: [],
    rooms: {
        entrance: {
            description: "You are at the entrance of a dark cave. There is a torch on the wall.",
            items: ["torch"],
            commands: {
                take: ["take", "grab", "pick up"],
                look: ["look", "examine", "inspect"],
                north: ["north", "forward", "go north"]
            },
            next: { north: "darkRoom" }
        },
        darkRoom: {
            description: "You are now in a pitch-dark room. You can hear the sound of dripping water.",
            items: [],
            commands: {
                light: ["light", "ignite", "burn"],
                listen: ["listen", "hear"],
                look: ["look", "examine", "inspect"],
                north: ["north", "forward", "go north"],
                south: ["south", "back", "go south"],
                east: ["east", "right", "go east"]
            },
            next: { north: "treasureRoom", south: "entrance", east: "puzzleRoom" }
        },
        treasureRoom: {
            description: "You enter a room glittering with treasure! You've found the lost gold!",
            items: ["gold"],
            commands: {
                take: ["take", "grab", "pick up"],
                look: ["look", "examine", "inspect"],
                south: ["south", "back", "go south"]
            },
            next: { south: "darkRoom" }
        },
        puzzleRoom: {
            description: "You are in a room with a locked door. There is a puzzle to solve.",
            items: [],
            commands: {
                solve: ["solve", "complete", "answer"],
                look: ["look", "examine", "inspect"],
                west: ["west", "left", "go west"]
            },
            next: { west: "darkRoom" }
        }
    },
    end: {
        description: "The adventure is over. Thank you for playing!",
        commands: {}
    }
};

let outputBox, inputBox;

function startZorkGame() {
    outputBox = document.getElementById("output");
    inputBox = document.getElementById("input");

    outputBox.textContent = "";
    addOutput(gameData.rooms[gameData.currentRoom].description);
    inputBox.focus();

    // Ensure inputBox event listener is added here
    inputBox.addEventListener("keyup", handleZorkInput);
}

// Remove the event listener from DOMContentLoaded
document.addEventListener("DOMContentLoaded", startZorkGame);

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

    for (let key in commands) {
        if (commands[key].includes(command)) {
            executeCommand(key);
            return;
        }
    }

    addOutput("I don't understand that command. Try something else.");
}

function executeCommand(command) {
    const currentRoom = gameData.rooms[gameData.currentRoom];
    const nextRoom = currentRoom.next[command];

    if (command === "take" && currentRoom.items.length > 0) {
        gameData.inventory.push(currentRoom.items.pop());
        addOutput("You take the item.");
    } else if (command === "look") {
        addOutput(currentRoom.description);
    } else if (nextRoom) {
        gameData.currentRoom = nextRoom;
        addOutput(gameData.rooms[gameData.currentRoom].description);
    } else {
        addOutput(currentRoom.commands[command]);
    }
}

function addOutput(text) {
    const newParagraph = document.createElement("p");
    newParagraph.textContent = text;
    outputBox.appendChild(newParagraph);
    outputBox.scrollTop = outputBox.scrollHeight;
}
