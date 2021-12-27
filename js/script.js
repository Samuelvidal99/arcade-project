var config = {
    type: Phaser.AUTO,
    width: 836,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('game-background', 'assets/game-background.png');
    this.load.spritesheet('alienCrab', 'assets/teste.png', {
        frameWidth: 100,
        frameHeight: 70,
    });
}
// Setting Alien Crab velocity as a global variable
var velocityX = 50;
var velocityY = 0;
var velocityAliensX = 50;
var velocityAliensY = 0;
var velocityInvertion = 8;

var singleCrabVelocityX = 100;

function create() {
    // Background
    this.add.image(268, 300, 'game-background');

    // Setting Alien Crab attributes.
    alienCrab = this.physics.add.sprite(250, 150, 'alienCrab');
    alienCrab.setCollideWorldBounds(true);

    // Spawning 4 alien crabs
    aliens = this.physics.add.group({
        key: 'alienCrab',
        repeat: 4,
        setXY: { x: 54, y: 40, stepX: 116 }
    });

    // Function that makes the aliens not go out of the world's bounds, and make them go down a bit.
    aliens.children.iterate( (child) => {
        this.events.on('update', () => {
            if(
                (!this.physics.world.bounds.contains(child.x + 51, child.y) ||
                !this.physics.world.bounds.contains(child.x - 51, child.y)) &&
                (velocityAliensY == 0)
            ) {
                setTimeout(() => {
                    console.log("velocity: " + velocityX)
                    velocityAliensX = velocityX;
                    velocityAliensY = velocityY;
                    child.setVelocityX(velocityAliensX);
                    child.setVelocityY(velocityAliensY);
                }, 1000);
                velocityInvertion = velocityInvertion * -1;
                velocityAliensX = velocityInvertion;
                velocityAliensY = 50;
                velocityX = velocityX*-1;
                child.setVelocityX(velocityAliensX);
                child.setVelocityY(velocityAliensY);
            }
        })
    });

    // Setting the main alien crab animation
    this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers('alienCrab', { start: 0, end: 4 }),
        frameRate: 4,
        repeat: -1
    });

    // Setting key input. 
    cursors = this.input.keyboard.createCursorKeys();
    console.log(cursors.space)
}

function update() {
    // Setting initial speed and animation of the aliens group.
    aliens.children.iterate(function (child) {

        child.anims.play('idle', true);
        child.setVelocityX(velocityAliensX);
        child.setVelocityY(velocityAliensY);
    });

    // Single crab to test purpose 
    alienCrab.anims.play('idle', true);

    if(alienCrab.body.onWall()) {
        singleCrabVelocityX = singleCrabVelocityX * -1;
        alienCrab.setVelocityX(singleCrabVelocityX);
    }
    else {
        alienCrab.setVelocityX(singleCrabVelocityX);
    }

    // Space key pause the game.
    if (cursors.space.isDown) {
        game.scene.pause("default");
        console.log(game.scene)
    }
}
