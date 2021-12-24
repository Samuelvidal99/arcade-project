var config = {
    type: Phaser.AUTO,
    width: 636,
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
var velocity = 100;
var velocityAliensX = 100;
var velocityAliensY = 0;

function create() {
    // Background
    this.add.image(268, 300, 'game-background');

    // Setting Alien Crab attributes.
    alienCrab = this.physics.add.sprite(250, 150, 'alienCrab');
    alienCrab.setCollideWorldBounds(true);

    // Spawning 4 alien crabs
    aliens = this.physics.add.group({
        key: 'alienCrab',
        repeat: 3,
        setXY: { x: 54, y: 40, stepX: 116 }
    });

    // Function that makes the aliens not go out of the world's bounds
    aliens.children.iterate( (child) => {
        this.events.on('update', () => {
            if(
                !this.physics.world.bounds.contains(child.x + 51, child.y) ||
                !this.physics.world.bounds.contains(child.x - 51, child.y)
            ) {
                // let aux = velocityAliensX;
                // velocityAliensY = 100;
                // velocityAliensX = 5;
                // setTimeout(() => {
                //     console.log("Timed out")
                //     velocityAliensX = aux;
                //     velocityAliensY = 0;


                // }, 1000);
                
                //     console.log(velocityAliensX)
                setTimeout(() => {
                    console.log("Teste")
                })
                velocityAliensX = velocityAliensX * -1;
                child.setVelocityX(velocityAliensX);
            }
        })
    });

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

// game.scene.pause("default");

function update() {
    alienCrab.anims.play('idle', true);

    // Setting initial speed and animation of the aliens group.
    aliens.children.iterate(function (child) {

        child.anims.play('idle', true);
        child.setVelocityX(velocityAliensX);
        child.setVelocityY(velocityAliensY);
    });

    if(alienCrab.body.onWall()) {
        velocity = velocity * -1;
        alienCrab.setVelocityX(velocity);
    }
    else {
        alienCrab.setVelocityX(velocity);
    }

    if (cursors.space.isDown) {
        game.scene.pause("default");
        console.log(game.scene)
    }
}
