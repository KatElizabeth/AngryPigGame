/*Javascript Document
 * Exercise Angry Pig - Kat Nelson
 * 09 April 2019*/

/* eslint-env browser */

// Global variables
var canvasElem;
var world;
var score = 0;
var bottom;
var kickCounter = 0;

// my impact sound
var mySound = new Audio("woodWhack.mp3");

window.onload = initAll;

function initAll() {

    console.log("initAll Starting...");

    // if button is clicked, reload window for new game
    document.getElementById("myButton").onclick = newGame;

    canvasElem = document.getElementById("game");
    world = boxbox.createWorld(canvasElem, {
        gravity: {x: 0, y: 10},
        scale: 15,
        collisionOutlines: false
    });

    world.createEntity({
        name: "player",
        image: "images/tinyPig.png",
        shape: "circle",
        imageStretchToFit: true,
        radius: 1,
        density: 4,
        x: 2,
        onKeyDown: kick
    });

    var ground = {
        name: "ground",
        shape: "square",
        type: "static",
        color: "#009788",
        borderColor: "white",
        width: 18,
        height: .5,
        y: 12
    };

    // made to be an invisible border for all edges of screen
    var wall = {
        name: "ground",
        shape: "square",
        type: "static",
        color: "transparent",
        borderColor: "transparent",
        width: 18,
        height: .5,
        y: 12
    };

    // default square blocks for stacking
    var block = {
        name: "block",
        shape: "square",
        image: "images/verticalColumn.png",
        imageStretchToFit: true,
        height: 1.5,
        width: 1.5,
        onImpact: impact
    };

    // changes image used for long horizontal blocks
    var horizontalBlock = {
        name: "block",
        shape: "square",
        image: "images/horizontalColumn.png",
        imageStretchToFit: true,
        height: 1.5,
        width: 5,
        onImpact: impact
    };

    // Magical star for extra bonus points!
    var star = {
        name: "star",
        shape: "square",
        image: "images/star.png",
        type: "static",
        imageStretchToFit: true,
        height: 2,
        width: 2,
        onImpact: impact

    };

    // Create Stuff

    // creates two ground "islands" in sky
    world.createEntity(ground, {width: 18, y: 12});
    world.createEntity(ground, {width: 15, x: 28, y: 20});

    // boundaries to prevent anything from going off screen
    world.createEntity(wall, {width: 0.5, height: 30, x: 40, y: 15}); // right boundary
    bottom = world.createEntity(wall, {width: 600, height: .5, y: 28.2}); // bottom boundary
    world.createEntity(wall, {width: 0.5, height: 30, x: 0, y: 15}); // left boundary
    world.createEntity(wall, {width: 600, height: .5, y: 0}); // top boundary

    // create the bonus star!!!
    world.createEntity(star, {x: 5, y: 24});

    // create first stack of blocks
    world.createEntity(block, {x: 12, y: 7});
    world.createEntity(block, {x: 12, y: 8});
    world.createEntity(block, {x: 12, y: 9});
    world.createEntity(block, {x: 14, y: 4});
    world.createEntity(block, {x: 16, y: 4});

    // create second stack of blocks
    world.createEntity(block, {x: 17, y: 7});
    world.createEntity(block, {x: 17, y: 8});
    world.createEntity(block, {x: 17, y: 9});

    // horizontal top block
    world.createEntity(horizontalBlock, {height: 1.5, width: 8, x: 13, y: 5});

    // create third stack of blocks
    world.createEntity(block, {x: 27, y: 7});
    world.createEntity(block, {x: 27, y: 9});
    world.createEntity(block, {x: 27, y: 11});

    // create fourth stack of blocks
    world.createEntity(block, {x: 30, y: 7});
    world.createEntity(block, {x: 30, y: 9});
    world.createEntity(block, {x: 30, y: 11});

    // horizontal mid block
    world.createEntity(horizontalBlock, {height: 1.5, width: 4, x: 28, y: 5});

    // create fourth stack of blocks
    world.createEntity(block, {x: 12, y: 23});
    world.createEntity(block, {x: 12, y: 24});
    world.createEntity(block, {x: 12, y: 25});

    // create fifth stack of blocks
    world.createEntity(block, {x: 30, y: 23});
    world.createEntity(block, {x: 30, y: 24});
    world.createEntity(block, {x: 30, y: 25});

    // horizontal lower block
    world.createEntity(horizontalBlock, {height: 1.5, width: 5, x: 12, y: 21});
}

// Functions

function kick() {
    // random ints for our kicks
    var x = getRandomInt(300, 800); // I used a higher impulse
    var y = getRandomInt(50, 86); // used a lower min for angle
    this.applyImpulse(x, y);

    // show current direction and impulse on screen
    document.getElementById("direction").innerHTML = "Direction: " + y + "<br>Impulse: " + x;

    // if this is the first kick, start the timer and countdown clock
    if (kickCounter < 1) {
        setTimeout(killFloor, 30000);
        timer();
    }
    kickCounter++;
}

function impact(entity) {

    if (entity.name() === "player") {
        this.image("images/explosion.png");
        this.imageStretchToFit(false);

        // play sound & reset it to beginning
        mySound.play();
        mySound.currentTime = 0;

        // bye bye, block (or star)!
        this.destroy();

        // if you hit the star, get bonus points otherwise, get regular points
        if (this.name() === "star") {
            bonusScore();
        } else {
            updateScore();
        }
    }
}

// block points
function updateScore() {
    score += 10;
    document.getElementById("txtScore").innerHTML = "score: " + score;
}

// star points
function bonusScore() {
    score += 70;
    document.getElementById("txtScore").innerHTML = "score: " + score;
}

// deletes floor, making game more dangerous!
function killFloor() {
    bottom.destroy();
}

// reloads window to start a new game
function newGame() {
    location.reload();
}

// sets and displays countdown timer on screen
function timer() {
    var sec = 30;
    var timer = setInterval(function () {
        sec--;

        if (sec > 9) {
            document.getElementById('safeTimerDisplay').innerHTML = 'Time Until Floor Kill: ' + sec;
        } else if (sec < 10 && sec >= 0) {
            document.getElementById('safeTimerDisplay').innerHTML = 'Time Until Floor Kill: 0' + sec;
        } else {
            document.getElementById('safeTimerDisplay').innerHTML = 'TIME IS UP! BYE BYE FLOOR!';
        }
        if (sec < 0) {
            document.getElementById('safeTimerDisplay').innerHTML = 'TIME IS UP! BYE BYE FLOOR!';
            clearInterval(timer);
        }
    }, 1000);
}

// From MDN docs
// Returns a random integer between the specified values.
// The value is no lower than min (inclusive), and is less than (but not equal to) max.
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
