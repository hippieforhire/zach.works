// Zork Game Logic with Weapons and Advanced Enemies
const gameData = {
    currentRoom: "entrance",
    inventory: [],
    equippedWeapon: null,
    player: {
        health: 100,
        baseAttackPower: 10,
        get attackPower() {
            return this.baseAttackPower + (gameData.equippedWeapon?.power || 0);
        },
        defensePower: 5
    },
    synonyms: {
        take: ["take", "grab", "pick up", "nab", "get", "snatch", "retrieve", "acquire"],
        look: ["look", "examine", "inspect", "observe", "check out", "peer"],
        use: ["use", "apply", "utilize", "activate"],
        equip: ["equip", "wield", "use weapon", "arm", "prepare"],
        attack: ["attack", "hit", "strike", "fight", "punch", "stab", "shoot"],
        block: ["block", "defend", "shield", "parry"],
        north: ["north", "forward", "go north", "move forward", "proceed north"],
        south: ["south", "back", "go south", "retreat", "move back"],
        east: ["east", "right", "go east", "move east"],
        west: ["west", "left", "go west", "move west"]
    },
    weapons: {
        sword: { name: "sword", power: 15 },
        bow: { name: "bow", power: 10 },
        magicStaff: { name: "magic staff", power: 20 }
    },
    rooms: {
        entrance: {
            description: "You are at the entrance of a dark cave. There is a torch on the wall.",
            items: ["torch", "sword"],
            enemies: [],
            next: { north: "darkRoom" }
        },
        darkRoom: {
            description: "You are in a pitch-dark room. A faint growl echoes in the darkness.",
            items: [],
            enemies: [
                {
                    name: "Goblin",
                    health: 30,
                    attackPower: 8,
                    behavior: "basic"
                }
            ],
            next: { north: "treasureRoom", south: "entrance" }
        },
        treasureRoom: {
            description: "You enter a room glittering with treasure! But a dragon guards it!",
            items: ["gold", "magicStaff"],
            enemies: [
                {
                    name: "Dragon",
                    health: 100,
                    attackPower: 20,
                    behavior: "defensive"
                }
            ],
            next: { south: "darkRoom" }
        },
        ambushRoom: {
            description: "You are ambushed by a shadowy figure!",
            items: [],
            enemies: [
                {
                    name: "Shadow Assassin",
                    health: 50,
                    attackPower: 15,
                    behavior: "ambush"
                }
            ],
            next: { east: "darkRoom" }
        }
    },
    end: {
        description: "The adventure is over. Thank you for playing!"
    }
};

let outputBox, inputBox;

function startZorkGame() {
    outputBox = document.getElementById("output");
    inputBox = document.getElementById("input");

    outputBox.textContent = "";
    addOutput(gameData.rooms[gameData.currentRoom].description);
    inputBox.focus();

    inputBox.addEventListener("keyup", handleZorkInput);
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
    const synonyms = gameData.synonyms;

    // Match command to a synonym category
    for (let action in synonyms) {
        if (synonyms[action].some(phrase => command.includes(phrase))) {
            executeCommand(action, command);
            return;
        }
    }

    addOutput("I don't understand that command. Try something else.");
}

function executeCommand(action, input) {
    const currentRoom = gameData.rooms[gameData.currentRoom];
    const inventory = gameData.inventory;

    // Handle "take" actions
    if (action === "take") {
        if (currentRoom.items.length > 0) {
            const item = currentRoom.items.find(item => input.includes(item)) || currentRoom.items.pop();
            gameData.inventory.push(item);
            currentRoom.items = currentRoom.items.filter(i => i !== item);
            addOutput(`You take the ${item}.`);
        } else {
            addOutput("There's nothing here to take.");
        }
    }

    // Handle "look" actions
    else if (action === "look") {
        addOutput(currentRoom.description);
        if (currentRoom.items.length > 0) {
            addOutput(`You see: ${currentRoom.items.join(", ")}`);
        }
        if (currentRoom.enemies.length > 0) {
            const enemyNames = currentRoom.enemies.map(e => e.name).join(", ");
            addOutput(`Enemies present: ${enemyNames}`);
        }
    }

    // Handle "equip" actions
    else if (action === "equip") {
        const weapon = Object.keys(gameData.weapons).find(w => input.includes(w));
        if (weapon && inventory.includes(weapon)) {
            gameData.equippedWeapon = gameData.weapons[weapon];
            addOutput(`You equip the ${weapon}. Your attack power increases.`);
        } else {
            addOutput("You don't have that weapon to equip.");
        }
    }

    // Handle "attack" actions
    else if (action === "attack") {
        if (currentRoom.enemies.length > 0) {
            const enemy = currentRoom.enemies[0];
            enemy.health -= gameData.player.attackPower;
            addOutput(`You attack the ${enemy.name} for ${gameData.player.attackPower} damage.`);
            if (enemy.health <= 0) {
                addOutput(`You have defeated the ${enemy.name}!`);
                currentRoom.enemies.shift(); // Remove defeated enemy
            } else {
                enemyAction(enemy);
            }
        } else {
            addOutput("There's nothing to attack here.");
        }
    }

    // Handle "block" actions
    else if (action === "block") {
        if (currentRoom.enemies.length > 0) {
            const enemy = currentRoom.enemies[0];
            const damageBlocked = Math.min(gameData.player.defensePower, enemy.attackPower);
            gameData.player.health -= (enemy.attackPower - damageBlocked);
            addOutput(`You block the ${enemy.name}'s attack, reducing damage to ${enemy.attackPower - damageBlocked}.`);
            if (gameData.player.health <= 0) {
                addOutput("You have been defeated! Game over.");
                resetGame();
            }
        } else {
            addOutput("There's nothing to block here.");
        }
    }

    // Handle movement
    else if (currentRoom.next[action]) {
        if (currentRoom.enemies.length > 0) {
            addOutput(`The ${currentRoom.enemies[0].name} blocks your path! Defeat it first.`);
        } else {
            gameData.currentRoom = currentRoom.next[action];
            addOutput(gameData.rooms[gameData.currentRoom].description);
        }
    }

    // Default response
    else {
        addOutput("You can't do that here.");
    }
}

function enemyAction(enemy) {
    if (enemy.behavior === "basic") {
        gameData.player.health -= enemy.attackPower;
        addOutput(`The ${enemy.name} attacks you for ${enemy.attackPower} damage.`);
    } else if (enemy.behavior === "defensive") {
        enemy.health += 10;
        addOutput(`The ${enemy.name} heals itself for 10 health!`);
    } else if (enemy.behavior === "ambush") {
        gameData.player.health -= enemy.attackPower * 2;
        addOutput(`The ${enemy.name} ambushes you for ${enemy.attackPower * 2} damage!`);
    }
    if (gameData.player.health <= 0) {
        addOutput("You have been defeated! Game over.");
        resetGame();
    } else {
        addOutput(`Your health: ${gameData.player.health}`);
    }
}

function resetGame() {
    gameData.currentRoom = "entrance";
    gameData.inventory = [];
    gameData.equippedWeapon = null;
    gameData.player.health = 100;
    addOutput("The game resets. Try again!");
}

function addOutput(text) {
    const newParagraph = document.createElement("p");
    newParagraph.textContent = text;
    outputBox.appendChild(newParagraph);
    outputBox.scrollTop = outputBox.scrollHeight;
}
