// Simple calculator logic
(() => {
  const displayEl = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');

  let expression = '';

  function updateDisplay() {
    displayEl.textContent = expression === '' ? '0' : expression;
  }

  function appendValue(val) {
    // Avoid multiple dots in the current number
    if (val === '.') {
      const parts = expression.split(/[\+\-\*\/\s]/);
      const last = parts[parts.length - 1];
      if (last.includes('.')) return;
      if (last === '') expression += '0';
    }

    // If adding operator after operator, replace it
    if (/[+\-*/]/.test(val)) {
      if (expression === '' && val === '-') {
        expression = '-';
        updateDisplay();
        return;
      }
      if (/[+\-*/]$/.test(expression)) {
        expression = expression.slice(0, -1) + val;
        updateDisplay();
        return;
      }
      if (expression === '') return;
    }

    expression += val;
    updateDisplay();
  }

  function clearAll() {
    expression = '';
    updateDisplay();
  }

  function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
  }

  function applyPercent() {
    // Convert the last number to a percent (divide by 100)
    // Find last number in the expression
    const match = expression.match(/(\d+(\.\d+)?)(?!.*\d)/);
    if (!match) return;
    const num = match[0];
    const idx = match.index;
    expression = expression.slice(0, idx) + '(' + num + '/100)';
    updateDisplay();
  }

  function evaluateExpression() {
    if (expression === '') return;
    // basic validation: only allow digits, operators, parentheses, dot, whitespace
    if (!/^[0-9+\-*/().\s%]+$/.test(expression)) {
      displayEl.textContent = 'Error';
      expression = '';
      return;
    }
    try {
      // Replace the division sign char if any (we used "/" already)
      // Evaluate in a safe-ish way by using Function after validation
      const result = Function('"use strict"; return (' + expression + ')')();
      expression = String(result);
      updateDisplay();
    } catch (err) {
      displayEl.textContent = 'Error';
      expression = '';
    }
  }

  // Click handling
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.value;
      const action = btn.dataset.action;

      if (action === 'clear') clearAll();
      else if (action === 'backspace') backspace();
      else if (action === 'equals') evaluateExpression();
      else if (action === 'percent') applyPercent();
      else if (val) appendValue(val);
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if ((/^[0-9]$/).test(key)) {
      appendValue(key);
      e.preventDefault();
    } else if (key === '.') {
      appendValue('.');
      e.preventDefault();
    } else if (key === 'Enter' || key === '=') {
      evaluateExpression();
      e.preventDefault();
    } else if (key === 'Backspace') {
      backspace();
      e.preventDefault();
    } else if (key === 'Escape') {
      clearAll();
      e.preventDefault();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      appendValue(key);
      e.preventDefault();
    } else if (key === '%') {
      applyPercent();
      e.preventDefault();
    }
  });

  // initialize
  updateDisplay();
})();