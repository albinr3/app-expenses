//Variables
const form = document.querySelector("#agregar-gasto");
const expensesList = document.querySelector("#gastos ul");


//events
eventListeners();
function eventListeners() {

     //load expenses localStorage
    document.addEventListener("DOMContentLoaded", () => {
        expensesLocal = JSON.parse(localStorage.getItem("Expenses")) || [];
    });  

    //ask for budget 
    document.addEventListener("DOMContentLoaded", askBudget);


    form.addEventListener("submit", addExpense);

}


//classes
class Budget {
    constructor(budget, rest) {
        this.budget = Number(budget);
        this.rest = Number(rest);
        this.expenses = expensesLocal;
    }

    newExpense(expense) {
        this.expenses = [...this.expenses, expense];
        this.calculateRest();
        localStorage.setItem("Expenses", JSON.stringify(this.expenses));
    }

    calculateRest() {
        const spent = this.expenses.reduce( (total, expense) => total + expense.ammount, 0);
        this.rest = this.budget - spent;
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter( expense => expense.id !== id);
        this.calculateRest();
       
    }

    

}

class UI {
    insertBudget(budgetAmount) {
        //getting the values
        const {budget, rest} = budgetAmount;

        //writing it to the html
        document.querySelector("#total").textContent = budget;
        document.querySelector("#restante").textContent = rest;
    };

    printAlert(mesagge, type) {
        const divMessage = document.createElement("div");
        divMessage.classList.add("text-center", "alert");
        
        if(type === "error") {
            divMessage.classList.add("alert-danger");
        } else {
            divMessage.classList.add("alert-success");
        };

        //message
        divMessage.textContent = mesagge;

        //insert to html
        document.querySelector(".primario").insertBefore(divMessage, form);

        //delete alert
        setTimeout(() => {
            divMessage.remove();
        }, 3000);
    };

    addExpenseHTML(expenses) {

        //clear previus html expenses
        this.clearHTML();

        //we iterate over the expenses list
        for(let i of expenses) {
            //create li
            const expenseRow = document.createElement("li");
            expenseRow.className = "list-group-item d-flex justify-content-between align-items-center";
            expenseRow.dataset.id = i.id;

            //add html of the expense
            expenseRow.innerHTML = `
                ${i.name} <span class="badge badge-primary badge-pill">$${i.ammount}</span>
            
            `;

            //add a delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("btn", "btn-danger", "delete-expense");
            deleteBtn.textContent = "X";
            deleteBtn.onclick = ()=> deleteExpense(i.id);
            expenseRow.appendChild(deleteBtn);

            //add to the html
            expensesList.appendChild(expenseRow);
        }
    }

    clearHTML(){
        while(expensesList.firstChild) {
            expensesList.removeChild(expensesList.firstChild);
        }
    }

    updateRest(rest) {
        document.querySelector("#restante").textContent = rest;
        //insert rest to localstorage
        localStorage.setItem("Budget", JSON.stringify(budget));
    }

    checkBudget(budgetObj) {
        const {rest, budget} = budgetObj;
        const restDiv = document.querySelector(".restante");

        //check 25% left
        if( (budget/4) > rest) {
            restDiv.classList.remove("alert-success", "alert-warning");
            restDiv.classList.add("alert-danger");
        } else if( (budget/2) > rest) {
            restDiv.classList.remove("alert-success", "alert-danger");
            restDiv.classList.add("alert-warning");
        } else {
            restDiv.classList.remove("alert-danger", "alert-warning");
            restDiv.classList.add("alert-success");
        }

        //print out of budget

        if(rest <= 0) {
            this.printAlert("The budget is out!", "error");
        };
    }
};

//instantiate UI
const ui = new UI();


//variable to storage the budget value
let budget;

//functions
function askBudget() {
    if(localStorage.getItem("Budget")) {
        const budgetLocal = JSON.parse(localStorage.getItem("Budget"))
        console.log(budgetLocal.rest);
        budget = new Budget(budgetLocal.budget, budgetLocal.rest);

        //check if the budget is down and change color also create the html of the expenses
        updateExpensesHTML(expensesLocal);
        
    } else {
        const userBudget = prompt("What is your budget?");
        
        if(userBudget === "" || userBudget == null || isNaN(userBudget) || userBudget <= 0) {
            window.location.reload();
        };

        //Valid budget
        budget = new Budget(userBudget, userBudget);
        

        //insert budget to localstorage
        localStorage.setItem("Budget", JSON.stringify(budget));

    }
    ui.insertBudget(budget);
    

}

function addExpense(e) {
    e.preventDefault();

    //read form values
    const name = document.querySelector("#gasto").value;
    const ammount = Number(document.querySelector("#cantidad").value);

    if(name === "" || ammount === "") {
        ui.printAlert("Both fields are requeried!", "error");

        return;
    } else if(ammount <= 0 || isNaN(ammount)) {
        ui.printAlert("You can not add 0 or negative ammount!", "error");

        return;
    };
    //create an object  with the values
    const expense = {name, ammount, id: Date.now()};
    
    
    //add a new expense
    budget.newExpense(expense);
    
    //print alert
    ui.printAlert("Correcto!", "correcto");

    

    //adding expenses to the html
    const {expenses, rest} = budget
    ui.addExpenseHTML(expenses);


    //update the remaining budget
    ui.updateRest(rest);

    //check if budget is down
    ui.checkBudget(budget);

    //reset form
    form.reset();

}

function deleteExpense(id) {

    //delete from the object
    budget.deleteExpense(id);

    //delete from html
    const {expenses, rest} = budget;
    ui.addExpenseHTML(expenses);

    //delete from localstorage
    localStorage.setItem("Expenses", JSON.stringify(expenses));

    //update the remaining budget
    ui.updateRest(rest);

    //check if budget is down and change color
    ui.checkBudget(budget);

};


function updateExpensesHTML(expenses) {
    ui.addExpenseHTML(expenses);

    //check if budget is down and change color
    ui.checkBudget(budget);
};

