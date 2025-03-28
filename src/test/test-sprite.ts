// Using liko, draw a sprite on the screen

import { App, Sprite } from 'liko';

async function test() {
  const app = new App();
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  const sprite1 = new Sprite();
  sprite1.url = 'assets/apple.png';
  sprite1.pos.set(200);
  sprite1.angle = 30;
  app.stage.addChild(sprite1);

  const sprite2 = new Sprite();
  sprite2.url = 'assets/strawberry.png';
  sprite2.pos.set(300, 100);
  sprite2.alpha = 0.5;
  app.stage.addChild(sprite2);
}

test();
