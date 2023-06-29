"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorialSkeleton = void 0;
exports.tutorialSkeleton = {
    menu: {
        selectTutorial: {
            text: "Succesfult connection. Pick a name and click the Start tutorial game for a test game!",
        },
    },
    preparation: {
        selectHero: {
            text: "Game created succesfuly! Click on the hero color you want to play! (If you move your cursor over the white popup it will stay there so you can read it)",
        },
        startGame: {
            text: "If everione selected a hero click on the Start game room button! (Click or swipe on this so it goes away)",
        },
    },
    game: {
        move: {
            text: "Use the (⬆⬇⬅→) keys or on mobile touch the colored cake slices to move!",
            done: false,
        },
        bomb: {
            text: "Great! Now hit the spacebar, or touch the red rectangle on mobile to bomb! Plant bombs next to the green walls to destroy them. BE CAREFUL: try not to stay in line with a bomb.",
            done: false,
        },
        allHealth: {
            text: "If someones health reach zero the player dies. You can see the healthpoints on the top right corner. Try to rach the bottom right side of the map and dmage your opponent",
            done: false,
        },
        damage: {
            text: "YOU LOST A HEALTH. If you loose all you're out. Look at the top corner how much health you have. After a damage a player is transparent for a while, so it can't be damaged.",
        },
        win: {
            text: "These explosion fields can damage all players. The winner is who can stay alive. Try to destroy a lot of green walls for power ups to collect.",
            done: false,
        },
        range: {
            text: "+1: With this power up your bomb range is increased. Now the bomb will reach one more block than before",
        },
        speed: {
            text: "+1: With this power up your speed is increased. You can move around a bit faster now.",
        },
        add: {
            text: "+1: With this power up you can increase the bombs you can plant at once by one. Try planting bombs multiplie times.",
        },
        gameOver: {
            text: "This game is over. Feel free to start a real game now. 😊",
        },
    },
};
