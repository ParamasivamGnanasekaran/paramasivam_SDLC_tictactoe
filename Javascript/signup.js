import { createAccount } from "./service.js";

/**
 * @description creating new account and routing to signin page
 */
async function signupValidate() {
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let data;
  if (email !== "" && password !== "" && username !== "") {
    if (password.length >= 6 && ValidateEmail(email)) {
      data = await createAccount(username, email, password);
      if (data.message === "user created") {
        alert("Signup successfully");
        window.location = "index.html"; // Redirecting to other page.
        return false;
      } else if (data.message === "already have a account") {
        document.getElementById("errorEmail").innerHTML =
          "Already Have an account In This Mail";
        document.getElementById("errorName").innerHTML = "";
        document.getElementById("errorEmpty").innerHTML = "";
        return false;
      } else if (data.message === "already have that username") {
        document.getElementById("errorEmail").innerHTML = "";
        document.getElementById("errorEmpty").innerHTML = "";
        document.getElementById("errorName").innerHTML =
          "Already Have That User Name";
        return false;
      }
    } else {
      document.getElementById("errorEmail").innerHTML = "";
      document.getElementById("errorName").innerHTML = "";
      document.getElementById("errorEmpty").innerHTML =
        "Enter valid Email and 6 letter Password";
    }
  } else {
    document.getElementById("errorEmail").innerHTML = "";
    document.getElementById("errorName").innerHTML = "";
    document.getElementById("errorEmpty").innerHTML =
      "All Fields Must Be Filled";
  }
}

/**
 * @description validating email
 *
 * @param {string} inputText input email
 * @returns true or false whether vaild or not
 */
function ValidateEmail(inputText) {
  let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (inputText.match(mailformat)) {
    return true;
  } else {
    return false;
  }
}

/**
 * @description Initialize signup page section
 *
 * @export {function}
 */
export function signup() {
  window.signupValidate = signupValidate;
}
