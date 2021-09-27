const Assets = require('..');

beforeEach(() => {
  jest.spyOn(Assets, 'data').mockImplementation();
  jest.spyOn(Assets, 'path').mockImplementation();
  jest.spyOn(Assets, 'size').mockImplementation();
  jest.spyOn(Assets, 'url').mockImplementation();
});

afterEach(() => {
  Assets.data.mockRestore();
  Assets.path.mockRestore();
  Assets.size.mockRestore();
  Assets.url.mockRestore();
});

describe('constructor', () => {
  it('is a function', () => {
    expect(Assets).toEqual(expect.any(Function));
  });

  it('is instantiable without new', () => {
    expect(Assets()).toBeInstanceOf(Assets);
  });

  it('is frozen', () => {
    expect(Object.isFrozen(new Assets())).toBe(true);
  });
});

describe('.options', () => {
  let options;

  beforeEach(() => {
    options = { basePath: 'source' };
  });

  it('defaults to an empty object', () => {
    expect(new Assets().options).toEqual({});
  });

  it('is initiable', () => {
    expect(new Assets(options).options.basePath).toBe('source');
  });

  it('breaks the reference', () => {
    expect(new Assets(options).options).not.toBe(options);
  });
});

test('.data()', () => {
  const instance = new Assets();
  instance.data();
  expect(Assets.data).toBeCalled();
});

test('.path()', () => {
  const instance = new Assets();
  instance.path();
  expect(Assets.path).toBeCalled();
});

test('.size()', () => {
  const instance = new Assets();
  instance.size();
  expect(Assets.size).toBeCalled();
});

test('.url()', () => {
  const instance = new Assets();
  instance.url();
  expect(Assets.url).toBeCalled();
});
