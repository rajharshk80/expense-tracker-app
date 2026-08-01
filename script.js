document.addEventListener('DOMContentLoaded', loadExpenses);

function getExpenses() {
    let expenses = localStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
}

function saveExpenses(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function addExpense() {
    const title = document.getElementById('expenseTitle').value.trim();
    const amount = document.getElementById('expenseAmount').value.trim();
    const category = document.getElementById('expenseCategory').value;

    if (title === "" || amount === "") {
        alert("Please fill in all fields!");
        return;
    }

    if (parseFloat(amount) <= 0) {
        alert("Please enter a valid amount!");
        return;
    }

    const currentDate = new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });

    const newExpense = {
        id: Date.now(),
        title: title,
        amount: parseFloat(amount),
        category: category,
        date: currentDate
    };

    const expenses = getExpenses();
    expenses.unshift.push ? expenses.unshift(newExpense) : expenses.push(newExpense); // Newest on top
    saveExpenses(expenses);

    // Clear inputs
    document.getElementById('expenseTitle').value = "";
    document.getElementById('expenseAmount').value = "";

    loadExpenses();
}

function loadExpenses() {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = "";

    const expenses = getExpenses();
    let total = 0;

    if (expenses.length === 0) {
        expenseList.innerHTML = `<div class="empty-state">No expenses recorded yet.</div>`;
        document.getElementById('totalAmount').innerText = "0.00";
        return;
    }

    expenses.forEach((expense) => {
        total += expense.amount;

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="expense-info">
                <h4>${expense.title}</h4>
                <p>${expense.category} • ${expense.date}</p>
            </div>
            <div class="expense-right">
                <span class="expense-amount">-₹${expense.amount}</span>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        expenseList.appendChild(li);
    });

    document.getElementById('totalAmount').innerText = total.toFixed(2);
}

function deleteExpense(id) {
    let expenses = getExpenses();
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses(expenses);
    loadExpenses();
}