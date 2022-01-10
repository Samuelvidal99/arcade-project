
// BeetleShip Bullet.
var Bullet = new Phaser.Class({

    Extends: Phaser.Physics.Arcade.Sprite,

    initialize:

    function Bullet(scene) {
        Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, 'energyBall');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = Phaser.Math.GetSpeed(400, 1);
        this.shipX = 0;
    },

    fire: function(x, y) {
        this.setPosition(x, y - 50);
        this.shipX = x;
        this.setActive(true);
        this.setVisible(true);
        this.enableBody()
    },

    update: function(time, delta) {
        this.y -= this.speed * 25;
        this.x = this.shipX;

        this.anims.play('energyBall', true);

        if (this.y < -50)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

// Alien01 bullet.
var PurpleBubble = new Phaser.Class({

    Extends: Phaser.Physics.Arcade.Sprite,

    initialize:

    function PurpleBubble(scene) {
        Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, 'energyBall');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = Phaser.Math.GetSpeed(400, 1);
        this.shipX = 0;
    },

    fire: function(x, y) {
        this.setPosition(x, y+5);
        this.shipX = x;
        this.setActive(true);
        this.setVisible(true);
        this.enableBody()
    },

    update: function(time, delta) {
        this.y += this.speed * 25;
        this.x = this.shipX;

        this.anims.play('purpleBubble', true);

        if (this.y > 650)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});
