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
    this.load.spritesheet('beetleShip', 'assets/beetleship.png', {
        frameWidth: 100,
        frameHeight: 120,
    });
    this.load.spritesheet('shootingBeetleShip', 'assets/beetleship-shoot_animation.png', {
        frameWidth: 100,
        frameHeight: 120,
    });
    this.load.spritesheet('energyBall', 'assets/energy-ball.png', {
        frameWidth: 24,
        frameHeight: 24,
    });
}
// Setting Alien Crab velocity as a global variable
var velocityX = 50;
var velocityY = 0;
var velocityAliensX = 50;
var velocityAliensY = 0;
var velocityInvertion = 8;

var singleCrabVelocityX = 100;

// Shooting timer as global variable
var shootingTimerShip = true;

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

    energyBall = this.physics.add.sprite(250, 350, 'energyBall');

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

    // Setting beetleship sprite and animations
    beetleShip = this.physics.add.sprite(425, 550, 'beetleShip');
    beetleShip.setCollideWorldBounds(true);

    this.anims.create({
        key: "idleBeetleShip",
        frames: this.anims.generateFrameNumbers('beetleShip', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "shootingBeetleShip",
        frames: this.anims.generateFrameNumbers('shootingBeetleShip', { start: 0, end: 1 }),
        frameRate: 1,
    });

    // Setting energy ball animation
    this.anims.create({
        key: "energyBall",
        frames: this.anims.generateFrameNumbers('energyBall', { start: 0, end: 3 }),
        frameRate: 10,
    });

    // Setting key input. 
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}

function update() {
    // Setting initial speed and animation of the aliens group.
    aliens.children.iterate(function (child) {

        child.anims.play('idle', true);
        child.setVelocityX(velocityAliensX);
        child.setVelocityY(velocityAliensY);
    });

    energyBall.anims.play('energyBall', true);

    // Single crab to test purpose 
    alienCrab.anims.play('idle', true);

    if(alienCrab.body.onWall()) {
        singleCrabVelocityX = singleCrabVelocityX * -1;
        alienCrab.setVelocityX(singleCrabVelocityX);
    }
    else {
        alienCrab.setVelocityX(singleCrabVelocityX);
    }
    
    // Starting idle animations, shoot animation and velocity of the beetleship.
    if(cursors.left.isDown || keyA.isDown) {
        beetleShip.setVelocityX(-200);
    }
    else if(cursors.right.isDown || keyD.isDown) {
        beetleShip.setVelocityX(200);
    }
    else if(cursors.space.isDown) {
        beetleShip.setVelocityX(0);
        if(!flipFlop) {
            beetleShip.anims.play('shootingBeetleShip');
            setTimeout(() => {
                beetleShip.anims.play('idleBeetleShip', true);
            }, 200);
            flipFlop = true;
        }
    }
    else {
        beetleShip.anims.play('idleBeetleShip', true);
        beetleShip.setVelocityX(0);
        flipFlop = false;
    }
    // Space key pause the game.
    // if (cursors.space.isDown) {
    //     game.scene.pause("default");
    //     console.log(game.scene)
    // }
}
