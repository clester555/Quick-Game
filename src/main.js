import { Game_Scene } from "./scenes/Game_Scene.js";



const app = new Phaser.Game({
    type: Phaser.CANVAS,
    pixelArt: false,
    scale: {
        parent: 'app-container',
        width: 1600,
        height: 900,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#000000'

});

app.scene.add('game-scene',Game_Scene);

app.scene.start('game-scene');
