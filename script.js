document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expense-form");
  const nameInput = document.getElementById("expense-name");
  const amountInput = document.getElementById("expense-amount");
  const categoryInput = document.getElementById("expense-category");
  const expenseList = document.getElementById("expense-list");
  const totalSpan = document.getElementById("total");
  const modeToggle = document.getElementById("mode-toggle");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  function save() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function render() {
    expenseList.innerHTML = "";
    let total = 0;
    expenses.forEach(({ id, name, amount, category }) => {
      total += amount;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${category} - ${name}: ₹${amount.toFixed(2)}</span>
        <button data-id="${id}">Delete</button>
      `;
      expenseList.appendChild(li);
    });
    totalSpan.textContent = total.toFixed(2);
  }

  function addExpense(name, amount, category) {
    expenses.push({ id: Date.now(), name, amount, category });
    save();
    render();
  }

  function deleteExpense(id) {
    expenses = expenses.filter((exp) => exp.id !== id);
    save();
    render();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    if (!name || isNaN(amount) || amount <= 0) return;
    addExpense(name, amount, category);
    form.reset();
  });

  expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const id = Number(e.target.getAttribute("data-id"));
      deleteExpense(id);
    }
  });

  // Dark mode persistence
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
    modeToggle.checked = true;
  }
  modeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark") ? "enabled" : "disabled"
    );
  });

  render();
});
