import Queue from "./queue";

const delay = function(text, ms, callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // console.log("done " + text);
      callback(text);
      resolve(text);
    }, ms);
  });
};

const enqueue = (text, ms, callback) => {
  return Queue.enqueue(() => {
    return delay(text, ms, callback);
  });
};

describe("queue suite", () => {
  it("with queue order is preserved", async () => {
    const mock = jest.fn();

    // console.log("start");
    const q1 = enqueue("1", 100, mock);
    const q2 = enqueue("2", 20, mock);
    const q3 = enqueue("3", 10, mock);
    await Promise.all([q1, q2, q3]);
    // console.log("end");
    // console.log(mock.mock);
    expect(mock.mock.calls).toEqual([["1"], ["2"], ["3"]]);
  });

  it("without queue order is based on duration", async () => {
    const mock = jest.fn();

    // console.log("start2");
    await Promise.all([
      delay("1", 100, mock),
      delay("2", 20, mock),
      delay("3", 10, mock)
    ]);
    // console.log("end2");
    // console.log(mock.mock);
    expect(mock.mock.calls).toEqual([["3"], ["2"], ["1"]]);
  });
});
