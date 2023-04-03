let acc_balance = document.getElementById("acc-balance");
let input = document.getElementById("input_box");
let prevBalance = 0;

let tableData = document.getElementById("table_data");

// Will get the balance from the json server
// Set the account balance in our element

document.getElementById("withdrawBtn").addEventListener("click", handleWithdraw);
document.getElementById("depositBtn").addEventListener("click", handleDeposit);

function setBalance() {
  let url = "http://localhost:3000/balance/0";
  fetch(url, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      acc_balance.innerText = `Balance:${data.amount} Ksh`;
      prevBalance = data.amount;
    });
}

function generateTransactionCode(type) {
  //This line declares a function called generateTransactionCode that takes one parameter, type.

  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  //This line declares a constant variable called letters that contains a string of capital letters (excluding I, O).This line declares a constant variable called letters that contains a string of capital letters (excluding I, O).
  let code = `MBK${type}`;
  //This line initializes a variable called code with a string that starts with "MBK" and adds the type parameter to the end.
  for (let i = 0; i < 4; i++) {
    if (i < 3) {
      let num = Math.floor(Math.random() * 9) + 1;
      code += num;
    }
    ///This code block is inside the for loop and will only run for the first three iterations. It generates a random number between 1 and 9 (inclusive) and appends it to the code variable.
    let letter = letters[Math.floor(Math.random() * letters.length)];
    code += letter;
  }
  ///This code block is also inside the for loop and will run for all four iterations. It generates a random letter from the letters string and appends it to the code variable.
  return code;
}
  

// Get the dom element
// We need to get the deposit amount
// Check to confirm if amount is correct.
// Post Request to deposit the amount
function handleDeposit() {
  let amount = input.value;
  let d = new Date(Date.now());
  if (amount < 0 || amount === "") {
    alert("Amount should be greater than zero");
    return;
  }

  let data = {
    date: d,
    transaction_type: "Deposit",
    amount: amount,
    balance: prevBalance,
    transaction_code: generateTransactionCode('D')
  };

  data = JSON.stringify(data);

  let url = "http://localhost:3000/transaction_history";

  fetch(url, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      input.value = "";
      updateBalance(parseInt(prevBalance) + parseInt(amount));
      alert(`Amount Deposited`);
    });
}

function handleWithdraw() {
  let amount = input.value;
  let d = new Date(Date.now());
  if (amount < 0 || amount === "") {
    alert("Amount should be greater than zero");
    return;
  }

  let data = {
    date: d,
    transaction_type: "Withdraw",
    amount: amount,
    balance: prevBalance,
    transaction_code: generateTransactionCode('W')
  };

  data = JSON.stringify(data);

  let url = "http://localhost:3000/transaction_history";

  fetch(url, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      input.value = "";
      updateBalance(parseInt(prevBalance) - parseInt(amount));
      alert(`Amount Withdrawn`);
    });
}

function updateBalance(amount) {
  let data = {
    amount: amount,
    id: 0,
  };

  data = JSON.stringify(data);

  let url = "http://localhost:3000/balance/0";
  fetch(url, {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setBalance();
      populateTable();
    });
}

// To populate the table from the database.
// To identy the element where this data is going.
// Get request to get the data from our back_end.
// We need to create a html template.<we already have this template>.
// We need to loop over it .
// Inject the html to our table Data element.
function populateTable() {
  let url = "http://localhost:3000/transaction_history";

  //   <tr>
  //   <th scope="row">1</th>
  //   <td>12-May-2023</td>
  //   <td>2000</td>
  //   <td>Withdraw</td>
  //   <td>200000</td>
  // </tr>

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let el = "";
      data = data.reverse();
      for (let doc of data) {
        el =
          el +
          `<tr>
        <th scope="row">${doc.id}</th>
        <td>${doc.date}</td>
        <td>${doc.amount}</td>
        <td>${doc.transaction_type}</td>
        <td>${doc.balance}</td>
        <td>${doc.transaction_code}</td>
      </tr>`;
      }

      // console.log(el);
      tableData.innerHTML = el;
    });
}

setBalance();
populateTable();
