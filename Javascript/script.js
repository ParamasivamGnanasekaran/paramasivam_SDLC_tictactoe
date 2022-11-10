import { gameStart } from "./game.js";
import { signin } from "./signin.js";
import { signup } from "./signup.js";

/**
 * @description Initialize HTML page
 */
(function () {
  signin();
  signup();
  gameStart();
})();
