class LocalStorageMock {
  data = {};
  clear = jest.fn(() => { this.data = {}; });
  getItem = jest.fn(key => this.data[key]);
  removeItem = jest.fn(key => delete this.data[key]);
  setItem = jest.fn((key, value) => { this.data[key] = value; });
}

global.localStorage = new LocalStorageMock();
