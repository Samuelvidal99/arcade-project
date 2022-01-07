// const  { PurpleBubble } = require('./bullets'); 

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
    this.load.spritesheet('purpleBubble', 'assets/purple-bubble.png', {
        frameWidth: 32,
        frameHeight: 32,
    });
    this.load.image('collisionBox', 'assets/collision-box.png');
}
// Setting Alien Crab velocity as a global variable
var velocityX = 50;
var velocityY = 0;
var velocityAliensX = 50;
var velocityAliensY = 0;
var velocityInvertion = 8;

function create() {

    // Defining the bullets group.
    bullets = this.add.group({
        defaultKey: "bullet",
        classType: Bullet,
        maxSize: 10,
        runChildUpdate: true,
    });

    // Defining the purpleBubbles group.
    purpleBubbles = this.add.group({
        defaultKey: "purpleBubble",
        classType: PurpleBubble,
        maxSize: 10,
        runChildUpdate: true,
    });

    // Background.
    this.add.image(268, 300, 'game-background');

    // Text that appears when the player dies.
    gameOverText = this.add.text(200, 200, 'PERDEU O JOGO', { fontSize: '64px', fill: '#FF0000' });
    gameOverText.setVisible(false);

    // Spawning 4 alien crabs.
    aliens01 = this.physics.add.group({
        key: 'alienCrab',
        repeat: 4,
        setXY: { x: 54, y: 40, stepX: 116 }
    });

    // Function that makes the aliens not go out of the world's bounds, and make them go down a bit.
    aliens01.children.iterate( (child) => {
        this.events.on('update', () => {
            if(
                (!this.physics.world.bounds.contains(child.x + 51, child.y) ||
                !this.physics.world.bounds.contains(child.x - 51, child.y)) &&
                (velocityAliensY == 0)
            ) {
                setTimeout(() => {
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

    this.anims.create({
        key: "purpleBubble",
        frames: this.anims.generateFrameNumbers('purpleBubble', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    // Setting the main alien crab animation
    this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers('alienCrab', { start: 0, end: 4 }),
        frameRate: 4,
        repeat: -1
    });

    // Setting beetleship sprite and animations.
    beetleShip = this.physics.add.sprite(425, 550, 'beetleShip');
    beetleShip.setCollideWorldBounds(true);

    // Setting collisionBox that follows the ship.
    collisionBox = this.physics.add.sprite(425, 550, 'collisionBox');
    collisionBox.setVisible(false);

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

    // Setting collision between aliens and bullets
    this.physics.add.collider(aliens01, bullets, killAlien);

    // Setting collision between aliens and beetleship
    this.physics.add.collider(aliens01, beetleShip, killBeetleShip);

    // Setting collision between beetleship and purpleBubble
    this.physics.add.collider(purpleBubbles, collisionBox, killBeetleShip);

    // Setting key input. 
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.time.addEvent({
        delay: 2000,
        loop: true,
        callback: alien01Shoot
    });
}

function update(time, delta) {
    // Setting initial speed and animation of the aliens group.
    aliens01.children.iterate(function (child) {

        child.anims.play('idle', true);
        child.setVelocityX(velocityAliensX);
        child.setVelocityY(velocityAliensY);
    });
    
    // Starting idle animations, shoot animation and velocity of the beetleship.
    if(cursors.left.isDown || keyA.isDown) {
        beetleShip.setVelocityX(-200);
        collisionBox.setX(beetleShip.x);
    }
    else if(cursors.right.isDown || keyD.isDown) {
        beetleShip.setVelocityX(200);
        collisionBox.setX(beetleShip.x);
    }
    else if(cursors.space.isDown) {
        beetleShip.setVelocityX(0);

        if(!flipFlop) {
            var bullet = bullets.get();
            if (bullet)
            {
                bullet.fire(beetleShip.x, beetleShip.y);
                lastFired = time + 10;
            }
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
    // Up key pause the game.
    if (cursors.up.isDown) {
        game.scene.pause("default");
        console.log(game.scene)
    }
}

function killAlien(bullet, alien) {
    console.log("Colidindo")
    aliens01.killAndHide(alien);
    alien.disableBody();

    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.disableBody()
}

function killBeetleShip(bullet, beetleShip) {
    gameOverText.setVisible(true);
    game.scene.pause("default");
}

function alien01Shoot() {
    var index = Phaser.Math.Between(0, 4);
    alien = aliens01.children.entries[index]
    if(alien.active) {
        var purpleBubble = purpleBubbles.get();
        if (purpleBubble)
        {
            purpleBubble.fire(alien.x, alien.y);
            lastFired = 100 + 10;
        }
    }
}