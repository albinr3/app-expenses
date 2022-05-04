//Variables
const form = document.querySelector("#agregar-gasto");
const expensesList = document.querySelector("#gastos ul");


//events
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", askBudget);

    form.addEventListener("submit", addExpense);
}


//classes
class Budget {
    constructor(budget) {
        this.budget = Number(budget);
        this.rest = Number(budget);
        this.expenses = [];
    }


}

class UI {
    insertBudget(amount) {
        //getting the values
        const {budget, rest} = amount;

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
            divMessage.classList.add("alert-sucess");
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
};

//instantiate UI
const ui = new UI();


//variable to storage the budget value
let budget;

//functions
function askBudget() {
    // const userBudget = prompt("What is your budget?");
    // console.log(userBudget);
    // if(userBudget === "" || userBudget == null || isNaN(userBudget) || userBudget <= 0) {
    //     window.location.reload();
    // };

    const userBudget = 500;

    //Valid budget
    budget = new Budget(userBudget);
    ui.insertBudget(budget);

}

function addExpense(e) {
    e.preventDefault();

    //read form values
    const name = document.querySelector("#gasto");
    const ammount = document.querySelector("#cantidad");

    if(name.value === "" || ammount.value === "") {
        ui.printAlert("Both fields are requeried!", "error");

        return;
    } else if(ammount.value <= 0 || isNaN(ammount.value)) {
        ui.printAlert("You can not add 0 or negative ammount!", "error");

        return;
    };

    console.log("agregando gasto...");
}