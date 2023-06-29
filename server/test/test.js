const assert = require("assert");
const { GameInstance } = require("../dist/game/initializer/gameInstance");
const { removeItem } = require("../dist/game/utils");
const {
  isFreeFromWalls,
  getSoftWallIndex,
  getBombIndex,
  isWithin,
} = require("../dist/game/cycle/utils");
const { DENSITY } = require("../dist/sharedConstants/density");

let game = new GameInstance("");

game.bombs.all[0] = {
  playerNumber: 0,
  range: 1,
  endTime: 9000,
  pos: { x: 1, y: 1 },
};

game.walls.softs.all[0].pos = { x: 2, y: 1 };

describe("Basic functions", function () {
  describe("#indexOf()", function () {
    it("should return -1 when the value is not present", function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  describe("#removeItem()", function () {
    it("asserts basic usage", function () {
      assert.deepStrictEqual(removeItem([1, 2, 3], 2), [1, 3]);
    });
  });
  describe("#isfFreeFromWalls()", function () {
    it("asserts usage when false", function () {
      assert.equal(isFreeFromWalls(game, { x: 0, y: 0 }, false), false);
    });
    it("asserts usage when true", function () {
      assert.equal(isFreeFromWalls(game, { x: 1, y: 1 }, false), true);
    });
    it("asserts usage when bomb sensitive", function () {
      assert.equal(isFreeFromWalls(game, { x: 1, y: 1 }, true), false);
    });
  });
  describe("#getSoftWallIndex()", function () {
    it("asserts usage when it can't find", function () {
      assert.equal(getSoftWallIndex(game, { x: 1, y: 1 }), -1);
    });
    it("asserts usage when it can find a wall", function () {
      assert.equal(getSoftWallIndex(game, { x: 2, y: 1 }), 0);
    });
  });
  describe("#getBombIndex()", function () {
    it("asserts usage when it can't find", function () {
      assert.equal(getBombIndex(game, { x: 2, y: 1 }), -1);
    });
    it("asserts usage when it can find a bomb", function () {
      assert.equal(getBombIndex(game, { x: 1, y: 1 }), 0);
    });
  });
  describe("#isWithin()", function () {
    it("asserts usage when they intersect", function () {
      assert.equal(isWithin({ x: 2, y: 1.5 }, { x: 2, y: 1 }), true);
    });
    it("asserts usage when it doesn't intersects", function () {
      assert.equal(isWithin({ x: DENSITY * 2, y: 0 }, { x: 2, y: 1 }), false);
    });
  });

  // After all the tests have finished running
  after(function () {
    console.log("Server closed.");
    process.exit(0);
  });
});
