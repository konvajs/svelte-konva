import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Konva from 'konva';

// svelte-konva
import Sprite from '$lib/Sprite.svelte';
import { CONTAINER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';

// Mocks
import { createMockParentContext } from './mocks/context';
import './mocks/mouse';
import type { MockStage } from './mocks/mouse';

// Assets
import sprite from './assets/test-image.png';

test('throws an error if not placed inside a Container (Layer, Group, Label) component', () => {
  const spriteImage = document.createElement('img');
  spriteImage.src = sprite;

  spriteImage.onload = () => {
    expect(() => {
      render(Sprite, {
        props: {
          config: {
            image: spriteImage,
            animation: 'default',
            animations: { default: [0, 0, 50, 100, 50, 0, 50, 100] },
            frameRate: 7,
            frameIndex: 0
          }
        }
      });
    }).toThrow(CONTAINER_ERROR);

    const div = document.createElement('div');
    expect(() => {
      render(Sprite, {
        context: createMockParentContext(Container.Stage, div),
        props: {
          config: {
            image: spriteImage,
            animation: 'default',
            animations: { default: [0, 0, 50, 100, 50, 0, 50, 100] },
            frameRate: 7,
            frameIndex: 0
          }
        }
      });
    }).toThrow(CONTAINER_ERROR);
  };
});

test('is correctly added to the parent Layer', () => {
  const spriteImage = document.createElement('img');
  spriteImage.src = sprite;

  spriteImage.onload = () => {
    const mockContext = createMockParentContext(Container.Layer);
    const rendered = render(Sprite, {
      context: mockContext,
      props: {
        config: {
          image: spriteImage,
          animation: 'default',
          animations: { default: [0, 0, 50, 100, 50, 0, 50, 100] },
          frameRate: 7,
          frameIndex: 0
        }
      }
    });

    const component = rendered.component.$$;
    const parent: Konva.Container = get(
      mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!
    );
    const handle = component.ctx[component.props['handle']];

    expect(parent.children).toBeTruthy();

    if (parent.children) {
      expect(parent.children.length).toBe(1);
      expect(parent.children[0]).toStrictEqual(handle);
    }
  };
});

test('is correctly added to the parent Group', () => {
  const spriteImage = document.createElement('img');
  spriteImage.src = sprite;

  spriteImage.onload = () => {
    const mockContext = createMockParentContext(Container.Group);
    const rendered = render(Sprite, {
      context: mockContext,
      props: {
        config: {
          image: spriteImage,
          animation: 'default',
          animations: { default: [0, 0, 50, 100, 50, 0, 50, 100] },
          frameRate: 7,
          frameIndex: 0
        }
      }
    });

    const component = rendered.component.$$;
    const parent: Konva.Container = get(
      mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Group])!
    );
    const handle = component.ctx[component.props['handle']];

    expect(parent.children).toBeTruthy();

    if (parent.children) {
      expect(parent.children.length).toBe(1);
      expect(parent.children[0]).toStrictEqual(handle);
    }
  };
});

test('is correctly added to the parent Label', () => {
  const spriteImage = document.createElement('img');
  spriteImage.src = sprite;

  spriteImage.onload = () => {
    const mockContext = createMockParentContext(Container.Label);
    const rendered = render(Sprite, {
      context: mockContext,
      props: {
        config: {
          image: spriteImage,
          animation: 'default',
          animations: { default: [0, 0, 50, 100, 50, 0, 50, 100] },
          frameRate: 7,
          frameIndex: 0
        }
      }
    });

    const component = rendered.component.$$;
    const parent: Konva.Container = get(
      mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Label])!
    );
    const handle = component.ctx[component.props['handle']];

    expect(parent.children).toBeTruthy();

    if (parent.children) {
      expect(parent.children.length).toBe(1);
      expect(parent.children[0]).toStrictEqual(handle);
    }
  };
});

test('Can listen to Konva events', () => {
  const spriteImage = document.createElement('img');
  spriteImage.src = sprite;

  spriteImage.onload = () => {
    const rendered = render(Sprite, {
      context: createMockParentContext(Container.Layer),
      props: {
        config: {
          image: spriteImage,
          animation: 'default',
          animations: { default: [0, 0, 50, 100, 50, 0, 50, 100] },
          frameRate: 7,
          frameIndex: 0
        }
      }
    });

    const component = rendered.component.$$;
    const handle: Konva.Ring = component.ctx[component.props['handle']];

    const div = document.createElement('div');
    const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

    stage.add(handle.getLayer()!);

    const mockFn = jest.fn();
    rendered.component.$on('mousedown', mockFn);

    (stage as MockStage).simulateMouseDown({ x: 50, y: 50 });

    expect(mockFn).toHaveBeenCalledTimes(1);
  };
});

test('Correctly updates bound config on dragend', async () => {
  const spriteImage = document.createElement('img');
  spriteImage.src = sprite;

  spriteImage.onload = () => {
    const CONFIG = {
      x: 0,
      image: spriteImage,
      animation: 'default',
      animations: { default: [0, 0, 50, 100, 50, 0, 50, 100] },
      frameRate: 7,
      frameIndex: 0,
      draggable: true
    };
    const rendered = render(Sprite, {
      context: createMockParentContext(Container.Layer),
      props: {
        config: CONFIG
      }
    });

    const component = rendered.component.$$;
    const handle: Konva.Ring = component.ctx[component.props['handle']];

    const div = document.createElement('div');
    const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

    stage.add(handle.getLayer()!);

    (stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
    (stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
    (stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

    const config = component.ctx[component.props['config']];

    expect(config).toStrictEqual({ ...CONFIG, x: 50 });
  };
});

test('Does not alter the context', () => {
  const spriteImage = document.createElement('img');
  spriteImage.src = sprite;

  spriteImage.onload = () => {
    const mockContext = createMockParentContext(Container.Layer);
    const rendered = render(Sprite, {
      context: mockContext,
      props: {
        config: {
          image: spriteImage,
          animation: 'default',
          animations: { default: [0, 0, 50, 100, 50, 0, 50, 100] },
          frameRate: 7,
          frameIndex: 0
        }
      }
    });

    const component = rendered.component.$$;
    const context = component.context;

    expect(context).toStrictEqual(mockContext);
  };
});

test('Konva instance is correctly destroyed on component unmount', () => {
  const spriteImage = document.createElement('img');
  spriteImage.src = sprite;

  spriteImage.onload = () => {
    const mockContext = createMockParentContext(Container.Layer);
    const rendered = render(Sprite, {
      context: mockContext,
      props: {
        config: {
          image: spriteImage,
          animation: 'default',
          animations: { default: [0, 0, 50, 100, 50, 0, 50, 100] },
          frameRate: 7,
          frameIndex: 0
        }
      }
    });

    const parent: Konva.Container = get(
      mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!
    );

    expect(parent.children).toBeTruthy();

    if (parent.children) {
      expect(parent.children.length).toBe(1);
    }

    rendered.unmount();

    const component = rendered.component.$$;
    const handle = component.ctx[component.props['handle']];

    expect(parent.children).toBeTruthy();

    if (parent.children) {
      expect(parent.children.length).toBe(0);
    }

    expect(handle).toBeUndefined();
  };
});
