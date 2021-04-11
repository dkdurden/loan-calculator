// UI VARIABLES

// Loading element
const loading = document.querySelector('.card__loading');

// Error element
const errorMsg = document.querySelector('.card__error');

// Input section
const form = document.querySelector('.card__form');
const loanInput = document.querySelector('#amount-input');
const interestInput = document.querySelector('#interest-input');
const repaymentInput = document.querySelector('#repayment-input');
const submitBtn = document.querySelector('.card__form-submit');

// Results section
const results = document.querySelector('.card__output-group');
const monthlyOutput = document.querySelector(
  '#monthly-payment span:nth-child(2)'
);
const totalOutput = document.querySelector('#total-payment span:nth-child(2)');
const interestOutput = document.querySelector(
  '#total-interest span:nth-child(2)'
);

loadEventListeners();

// Load all event listeners
function loadEventListeners() {
  form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();

  // Get the input values
  const loanAmount = parseFloat(loanInput.value);
  const annualInterest = parseFloat(interestInput.value);
  const repaymentYears = parseFloat(repaymentInput.value);

  // Clear error message
  if (errorMsg.style.display === 'block') errorMsg.style.display = 'none';

  // Clear results
  clearResults();

  // Show the loading element
  showLoading();

  // Calculate the results
  const [monthlyPayment, totalPayment, totalInterest, error] = calculateResults(
    loanAmount,
    annualInterest,
    repaymentYears
  );

  // Only render results if there is no error
  if (!error) renderResults(monthlyPayment, totalPayment, totalInterest);

  // Hide the loading element and show the results after 3 seconds
  setTimeout(() => showResults(error), 3000);
}

function showLoading() {
  // Check if results section is displayed
  if (results.style.display === 'flex') results.style.display = 'none';

  loading.style.display = 'block';
}

function showResults(error) {
  // Hide loading element
  if (loading.style.display === 'block') loading.style.display = 'none';

  // If there is an error, show the error message and return from function
  if (error) {
    errorMsg.style.display = 'block';
    return;
  }

  results.style.display = 'flex';
}

// Calculate the results and return them in an array
/* 
    r = interest
    P = loan amount
    N = monthly payments

    formula for fixed monthly payment:

    (r * P * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1)
*/
function calculateResults(amount, interest, years) {
  // Check for bad input - empty or negative
  if (
    isNaN(amount) ||
    isNaN(interest) ||
    isNaN(years) ||
    amount <= 0 ||
    interest <= 0 ||
    years <= 0
  )
    return [-1, -1, -1, true];

  const monthlyInterest = interest / 100.0 / 12.0;

  const paymentPeriods = years * 12.0;

  const monthlyPayment = round(
    (monthlyInterest * amount * Math.pow(1 + monthlyInterest, paymentPeriods)) /
      (Math.pow(1 + monthlyInterest, paymentPeriods) - 1)
  );

  const totalPayment = round(monthlyPayment * paymentPeriods);

  const totalInterest = round(totalPayment - amount);

  return [monthlyPayment, totalPayment, totalInterest, false];
}

// Round to two decimal places
function round(float) {
  return parseFloat(float).toFixed(2);
}

// Show the new results
function renderResults(monthlyPayment, totalPayment, totalInterest) {
  monthlyOutput.textContent = `$${monthlyPayment}`;
  totalOutput.textContent = `$${totalPayment}`;
  interestOutput.textContent = `$${totalInterest}`;
}

// Clear the old results
function clearResults() {
  monthlyOutput.textContent = ``;
  totalOutput.textContent = ``;
  interestOutput.textContent = ``;
}
