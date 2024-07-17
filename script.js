let budget = document.querySelector("#budget");
let budgetBtn = document.querySelector("#budget-btn");
let totalBudget = document.querySelector("#total-budget");
let totalExpense = document.querySelector("#expense");
let totalBalance = document.querySelector("#balance");
let productBtn = document.querySelector("#product-btn");
let title = document.querySelector("#title");
let cost = document.querySelector("#cost");
let productDate = document.querySelector("#date");
let expenseList = document.querySelector("#expense-list");
let search = document.querySelector("#search");

// Budget button
budgetBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (budget.value != "") {
    localStorage.setItem("budget", budget.value);
    budget.value = "";
    total_budget();
    // location.reload();
  } else {
    alert("Please Enter Budget Amount");
  }
});

title.addEventListener("input", function () {
  if (/\d/.test(this.value)) {
    alert("Numbers are not allowed in the title field!");
    this.value = this.value.replace(/\d/g, "");
  }
});
search.addEventListener("input", function () {
  if (/\d/.test(this.value)) {
    alert("Numbers are not allowed in the title field!");
  }
  this.value = this.value.replace(/\d/g, "");
});
// Expense product
// function product_button() {
productBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (title.value != "" && cost.value != "" && productDate.value != "") {
    let newExpense = parseInt(cost.value);
    let currentBudget = parseInt(localStorage.getItem("budget"));
    let currentExpenses = calculateCurrentExpenses();

    if (currentExpenses + newExpense <= currentBudget) {
      let data = {
        title: title.value,
        cost: newExpense,
        productDate: productDate.value,
      };
      localStorage.setItem("budget_" + title.value, JSON.stringify(data));

      title.value = "";
      cost.value = "";
      productDate.value = "";
      // calculateCurrentExpenses();
      total_budget();
      // location.reload();
    } else {
      alert("Adding this expense would exceed your budget!");
    }
  } else {
    alert("Inside (expense block) field is empty");
  }
});
// }

// Calculate current expenses
function calculateCurrentExpenses() {
  let finalExpense = 0;
  for (let i = 0; i < localStorage.length; i++) {
    let allKeys = localStorage.key(i);
    console.log(allKeys);
    if (allKeys.startsWith("budget_")) {
      let jsonData = localStorage.getItem(allKeys); //return object with string value
      console.log(jsonData);
      let jsonParse = JSON.parse(jsonData); //convert string into number
      console.log(jsonParse);
      finalExpense += jsonParse.cost; //get cost value form object
      console.log(finalExpense);
    }
  }
  return finalExpense;
}

// Get value from localStorage
function total_budget() {
  renderExpenseList(); // Initial render

  totalExpense.innerHTML = calculateCurrentExpenses();
  let ourBudget = parseInt(localStorage.getItem("budget") || 0);
  totalBudget.innerHTML = ourBudget;

  // Calculate balance and ensure it is not negative
  let balance = ourBudget - calculateCurrentExpenses();
  totalBalance.innerHTML = balance < 0 ? 0 : balance;

  // Delete entries
  let deleteBtn = document.getElementsByClassName("delete-btn");
  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].onclick = function () {
      if (confirm("Do you wanna delete it?")) {
        let h5 = this.parentElement.parentElement.querySelector("h5").innerHTML;
        localStorage.removeItem("budget_" + h5);
        renderExpenseList();
        total_budget();
        // location.reload();
      }
    };
  }

  let editBtn = document.getElementsByClassName("edit-btn");
  for (let i = 0; i < editBtn.length; i++) {
    editBtn[i].onclick = function () {
      if (confirm("Do you wanna update it?")) {
        let colParent = this.parentElement.parentElement;
        let h5Data = colParent.querySelectorAll("h5"); // Node list
        let originalTitle = h5Data[0].innerHTML;

        // Populate input fields with current data
        title.value = h5Data[0].innerHTML;
        cost.value = h5Data[1].innerHTML;
        productDate.value = h5Data[2].innerHTML;
        title.focus();
        productBtn.onclick = function (e) {
          e.preventDefault();
          if (
            title.value != "" &&
            cost.value != "" &&
            productDate.value != ""
          ) {
            let newExpense = parseInt(cost.value);
            let currentBudget = parseInt(localStorage.getItem("budget"));
            let currentExpenses = calculateCurrentExpenses();

            if (currentExpenses + newExpense <= currentBudget) {
              let data = {
                title: title.value,
                cost: newExpense,
                productDate: productDate.value,
              };
              localStorage.setItem(
                "budget_" + title.value,
                JSON.stringify(data)
              );

              title.value = "";
              cost.value = "";
              productDate.value = "";
              total_budget();
            }
            renderExpenseList();
            total_budget();
          }
        };
      }
    };
  }
}

// Render expense list
function renderExpenseList() {
  expenseList.innerHTML = ""; // Clear the list
  let searchValue = search.value.toLowerCase();

  for (let i = 0; i < localStorage.length; i++) {
    let allKeys = localStorage.key(i);
    if (allKeys.startsWith("budget_")) {
      let jsonData = localStorage.getItem(allKeys);
      let jsonParse = JSON.parse(jsonData);

      if (jsonParse.title.toLowerCase().includes(searchValue)) {
        expenseList.innerHTML += `<div class="row mt-3 mb-3 bg-light b-border">
            <div class="col-md-7 mt-3 d-flex justify-content-between">
              <h5>${jsonParse.title}</h5>
              <h5 class="price">${jsonParse.cost}</h5>
              <h5>${jsonParse.productDate}</h5>
            </div>
            <div class="col-md-5 mt-3 d-flex justify-content-end icon-size">
              <i class="fa fa-edit edit-btn"></i>
              &nbsp;&nbsp;&nbsp;
              <i class="fa fa-trash delete-btn"></i>
            </div>
          </div>`;
      }
    }
  }
}
// Search functionality
search.addEventListener("input", function () {
  renderExpenseList();
});

total_budget();
