
function killAlien(bullet, alien) {
    let alienGroup;
    groups.forEach(group => {
        alienGroup = ((group.contains(alien)) ? group : alienGroup);
    });
    alienGroup.killAndHide(alien);
    alien.disableBody();

    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.disableBody();
}

function killBulletBubble(bullet, purpleBubble) {
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.disableBody();

    purpleBubble.setActive(false);
    purpleBubble.setVisible(false);
    purpleBubble.disableBody();
}

function killBeetleShip(bullet, beetleShip) {
    gameOverText.setVisible(true);
    game.scene.pause("default");
}

function alien01Shoot() {
    availableAliens01.forEach(alien => {
        if(alien.active == false) {
            aux = availableAliens01.findIndex(value => value === alien);
            availableAliens01.splice(aux, 1);
        }
    });
    var index = Phaser.Math.Between(0, (availableAliens01.length - 1));
    alien = availableAliens01[index]

    if(alien != undefined) {
        if((alien.active != false) && (availableAliens02[index].active == false)) {
            var purpleBubble = purpleBubbles.get();
            if(purpleBubble && (availableAliens01.length > 0)) {
                purpleBubble.fire(alien.x, alien.y);
                lastFired = 100 + 10;
            }
        }   
    }
}