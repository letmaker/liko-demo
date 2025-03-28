// Using liko, draw a text and write a hello world

import { App, Text } from 'liko';

async function test() {
  const app = new App();
  await app.init({ width: 800, height: 800 });
  const text = new Text({
    text: 'Hello World',
    fillColor: '#ff0000',
    fontSize: 30,
    pos: { x: 100, y: 100 },
  });
  app.stage.addChild(text);
}

test();
