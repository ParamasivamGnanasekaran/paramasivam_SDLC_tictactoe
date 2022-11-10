import { userValidation } from "./service.js";

 
let attempt = 3;

/**
 * @description signin page validation and routing to game page
 *
 */
async function siginValidate() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let data;
  if (email !== "" && password !== "") {
    data = await userValidation(email, password);
  
    if (data.email) {
      alert("Login successfully");
      localStorage.setItem("data",JSON.stringify(data));
      window.location = "game.html"; // Redirecting to other page.
      return false;
    } else if (data.message === "Password incorrect") {
      attempt--; // Decrementing by one.
      document.getElementById("error").innerHTML =
        "Password incorrect.<br> You have left " + attempt + " attempt";
      // Disabling fields after 3 attempts.
      if (attempt == 0) {
        document.getElementById("email").disabled = true;
        document.getElementById("password").disabled = true;
        document.getElementById("submit").disabled = true;
        return false;
      }
    } else if (data.message === "user not found") {
      document.getElementById("error").innerHTML =
        "Email Not Found. Please Sign Up";
    }
  } else {
    document.getElementById("error").innerHTML =
      "Enter correct Email and Password";
  }
}

/**
 * @description Initialize Sigin Page section
 *
 * @export {function}
 */
export function signin() {
  window.signinValidate = siginValidate;
}
