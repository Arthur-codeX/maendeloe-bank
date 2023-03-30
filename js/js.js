let acc_balance = document.getElementById("acc-balance");
let input = document.getElementById("input_box");
let prevBalance = 0;

// Will get the balance from the json server
// Set the account balance in our element
function setBalance() {
  let url = "http://localhost:3000/balance/0";
  fetch(url, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      acc_balance.innerText = `Balance:${data.amount} Ksh`;
      prevBalance = data.amount;
    });
}

//Get the dom element
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
    });
}

setBalance();
