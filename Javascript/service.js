let hostname = location.hostname;
let port = location.port;

/**
 * @description connecting with nodejs server for validating signin page
 *
 * @param {string} email email for validation
 * @param {string} password  password for validation
 * @returns string of messgae
 */
export async function userValidation(email, password) {
  const postUrl = `http://${hostname}:${port}/api/login`;
  let bodyData = {};
  bodyData.email = email;
  bodyData.password = password;
  bodyData = JSON.stringify(bodyData);
  const data = new Promise((resolve, reject) => {
    fetch(postUrl, {
      method: "POST",
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        "Content-Type": "application/json",
      },
      body: bodyData,
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

  return data;
}

/**
 * @description creating account for app
 *
 * @param {string} username username for account
 * @param {string} email email for account
 * @param {string} password password for account
 * @returns
 */
export async function createAccount(username, email, password) {
  const postUrl = `http://${hostname}:${port}/api/signup`;
  let bodyData = {};
  bodyData.username = username;
  bodyData.email = email;
  bodyData.password = password;
  bodyData = JSON.stringify(bodyData);
  const data = new Promise((resolve, reject) => {
    fetch(postUrl, {
      method: "POST",
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        "Content-Type": "application/json",
      },
      body: bodyData,
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

  return data;
}

/**
 * @description updating value history, scores to backend
 *
 * @param {string} email
 * @param {string} player1
 * @param {string} player2
 * @param {string} computer
 * @param {string} history
 * @returns
 */
export async function updateResult(email, player1, player2, computer, history) {
  const postUrl = `http://${hostname}:${port}/api/game`;
  let bodyData = {};
  bodyData.email = email;
  bodyData.player1 = player1;
  bodyData.player2 = player2;
  bodyData.computer = computer;
  bodyData.history = history;
  bodyData = JSON.stringify(bodyData);
  const data = new Promise((resolve, reject) => {
    fetch(postUrl, {
      method: "POST",
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        "Content-Type": "application/json",
      },
      body: bodyData,
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

  return data;
}
