import { describe, expect, it } from "vitest";
import { configs } from "../../data/configs";
import { rules } from "../../data/rules";
import { Game } from "../../models/game";

describe("solver", () => {
  it("runs the damn thing", () => {
    const game = new Game(configs[0], rules);
    game.newGame();
    expect(true).toEqual(true);
  });
});
