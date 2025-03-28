import { App, Texture, Container, Sprite } from 'liko';

const count = 100000;

async function test() {
  const app = new App();
  await app.init({ width: 800, height: 800 });
  console.log('test count', count / 10000, 'W');

  const texture1 = await Texture.from('assets/apple2.png');
  const texture2 = await Texture.from('assets/strawberry2.png');

  console.time('create node');
  const container = new Container();
  app.stage.addChild(container);

  for (let i = 0; i < count; i++) {
    const texture = i % 2 === 0 ? texture1 : texture2;
    const sprite = new Sprite({
      texture,
      label: `sprite${i}`,
      pos: { x: Math.random() * 800, y: Math.random() * 800 },
      scale: { x: 0.2, y: 0.2 },
      rotation: Math.random() * Math.PI * 2,
      width: texture.width,
      height: texture.height,
      data: { speed: Math.random() * 10 + 2 },
    });
    sprite.tint = Math.random() * 0xffffff;
    container.addChild(sprite);
  }

  console.timeEnd('create node');

  function render() {
    for (let i = 0; i < count; i++) {
      const sprite = container.children[i];
      sprite.pos.y += sprite.data.speed;
      if (sprite.pos.y > 800) {
        sprite.pos.y = -texture1.height;
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

test();
