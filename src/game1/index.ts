import { App, physics, Register, Scene } from 'liko';
import { Camera } from './scripts/camera';
import { EnemyCreator } from './scripts/enemy-creator';
import { Enemy1 } from './scripts/enemy1';
import { Hero } from './scripts/hero';
import { Scroller } from './scripts/scroller';

async function test() {
  const app = new App();
  await app.init({ width: 720, height: 500, bgColor: 0x333333 });

  Register.regScript('Hero', Hero);
  Register.regScript('Enemy1', Enemy1);
  Register.regScript('Scroller', Scroller);
  Register.regScript('EnemyCreator', EnemyCreator);
  Register.regScript('Camera', Camera);
  physics.enable();
  physics.debug();

  const scene = new Scene();
  scene.load('game1/scene/scene1.scene', true);
  app.stage.addChild(scene);
  scene.play();

  console.log(scene);
}

test();
