document.addEventListener('DOMContentLoaded', () => {
    const predefinedShifts = [
        { id: 'm', code: 'M', hours: 6, startTime: '7am', endTime: '1pm' },
        { id: 'm1', code: 'M1', hours: 6, startTime: '8am', endTime: '2pm' },
        { id: 'm2', code: 'M2', hours: 7, startTime: '8am', endTime: '3pm' },
        { id: 'm3', code: 'M3', hours: 6, startTime: '9am', endTime: '3pm' },
        { id: 'm4', code: 'M4', hours: 7, startTime: '9am', endTime: '4pm' },
        { id: 'm5', code: 'M5', hours: 8, startTime: '8am', endTime: '4pm' },
        { id: 'm6', code: 'M6', hours: 7, startTime: '7am', endTime: '2pm' },
        { id: 'a1', code: 'A1', hours: 6, startTime: '2pm', endTime: '8pm' },
        { id: 'a2', code: 'A2', hours: 6, startTime: '3pm', endTime: '9pm' },
        { id: 'x1', code: 'X1', hours: 9, startTime: '8am', endTime: '5pm' },
        { id: 'x2', code: 'X2', hours: 9, startTime: '9am', endTime: '6pm' },
        { id: 'x3', code: 'X3', hours: 9, startTime: '7am', endTime: '4pm' },
        { id: 'x4', code: 'X4', hours: 9, startTime: '11am', endTime: '8pm' },
        { id: 'l1', code: 'L1', hours: 12, startTime: '8am', endTime: '8pm' },
        { id: 'l2', code: 'L2', hours: 12, startTime: '9am', endTime: '9pm' },
        { id: 'l3', code: 'L3', hours: 12, startTime: '7am', endTime: '7pm' },
        { id: 'n1', code: 'N1', hours: 12, startTime: '8pm', endTime: '8am' },
        { id: 'n2', code: 'N2', hours: 12, startTime: '9pm', endTime: '9am' },
        { id: 'n3', code: 'N3', hours: 12, startTime: '7pm', endTime: '7am' },
        { id: 'd', code: 'D', hours: 9, startTime: '8am', endTime: '5pm' },
    ];

    let selectedShifts = [];
    let history = [];
    
    // Calculator state
    let displayValue = "0";
    let operand1 = null;
    let operator = null;
    let waitingForOperand2 = false;

    const calculatorDisplayElement = document.getElementById('calculator-display');
    const selectedShiftsDisplayElement = document.getElementById('selected-shifts-display');
    const shiftButtonsGridElement = document.getElementById('shift-buttons-grid');
    const calculatorButtonsGridElement = document.getElementById('calculator-buttons-grid');
    const clearButtonElement = document.getElementById('clear-button');
    const undoButtonElement = document.getElementById('undo-button');

    function updateTotalHoursAndDisplay() {
        const newTotal = selectedShifts.reduce((acc, curr) => acc + curr.hours, 0);
        displayValue = newTotal.toString();
        operand1 = null; // Reset calculator operand
        operator = null; // Reset calculator operator
        waitingForOperand2 = false;
        renderCalculatorDisplay();
        renderSelectedShiftsDisplay();
        undoButtonElement.disabled = history.length === 0;
    }

    function renderCalculatorDisplay() {
        if (displayValue === "Error") {
            calculatorDisplayElement.innerHTML = `<span class="error-text">خطأ</span>`;
        } else {
            const num = parseFloat(displayValue === "" ? "0" : displayValue);
            calculatorDisplayElement.innerHTML = `${num.toLocaleString('ar-SA', { minimumFractionDigits: 0, maximumFractionDigits: 4 })}<span class="unit-text">ساعة</span>`;
        }
    }

    function renderSelectedShiftsDisplay() {
        if (selectedShifts.length === 0) {
            selectedShiftsDisplayElement.innerHTML = `<span class="italic">لم يتم اختيار ورديات</span>`;
        } else {
            selectedShiftsDisplayElement.innerHTML = selectedShifts.map((s, i) => 
                `<span class="shift-badge" data-id="${s.id}-${i}">${s.code}</span>`
            ).join(' ');
        }
    }

    function handleShiftClick(shift) {
        history.push([...selectedShifts]);
        selectedShifts.push(shift);
        updateTotalHoursAndDisplay();
    }

    clearButtonElement.addEventListener('click', () => {
        if (selectedShifts.length > 0) {
            history.push([...selectedShifts]);
        }
        selectedShifts = [];
        // Calculator specific reset
        displayValue = "0";
        operand1 = null;
        operator = null;
        waitingForOperand2 = false;
        updateTotalHoursAndDisplay();
    });

    undoButtonElement.addEventListener('click', () => {
        if (history.length > 0) {
            selectedShifts = history.pop();
            updateTotalHoursAndDisplay();
        }
    });

    // Populate Shift Buttons
    predefinedShifts.forEach(shift => {
        const button = document.createElement('button');
        button.classList.add('button', 'shift-button');
        button.setAttribute('aria-label', `إضافة وردية ${shift.code}, من ${shift.startTime} إلى ${shift.endTime}`);
        button.innerHTML = `
            <span class="shift-code">${shift.code}</span>
            <span class="shift-time">${shift.startTime} - ${shift.endTime}</span>
        `;
        button.addEventListener('click', () => handleShiftClick(shift));
        shiftButtonsGridElement.appendChild(button);
    });

    // Calculator Logic
    function performCalculation() {
        const prev = operand1;
        const current = parseFloat(displayValue);

        if (prev === null || operator === null || isNaN(current)) {
            return "Error";
        }

        switch (operator) {
            case '+': return prev + current;
            case '-': return prev - current;
            case '*': return prev * current;
            case '/': return current === 0 ? "Error" : prev / current;
            default: return "Error";
        }
    }

    function handleNumberInput(number) {
        if (displayValue === "Error") {
            displayValue = number;
            waitingForOperand2 = false;
        } else if (waitingForOperand2) {
            displayValue = number;
            waitingForOperand2 = false;
        } else {
            displayValue = displayValue === "0" ? number : displayValue + number;
        }
        renderCalculatorDisplay();
    }

    function handleDecimalInput() {
        if (displayValue === "Error") {
            displayValue = "0.";
            waitingForOperand2 = false;
        } else if (waitingForOperand2) {
            displayValue = "0.";
            waitingForOperand2 = false;
        } else if (!displayValue.includes(".")) {
            displayValue += ".";
        }
        renderCalculatorDisplay();
    }

    function handleOperatorInput(nextOperator) {
        if (displayValue === "Error") return;

        const currentValue = parseFloat(displayValue);

        if (operand1 !== null && operator !== null && !waitingForOperand2) {
            const result = performCalculation();
            if (result === "Error") {
                displayValue = "Error";
                operand1 = null;
                operator = null;
                waitingForOperand2 = false;
                renderCalculatorDisplay();
                return;
            }
            displayValue = result.toString();
            operand1 = result;
        } else {
            operand1 = currentValue;
        }
        
        operator = nextOperator;
        waitingForOperand2 = true;
        renderCalculatorDisplay(); // Show current display before next input
    }

    function handleEqualsInput() {
        if (operand1 === null || operator === null || waitingForOperand2 || displayValue === "Error") {
            return;
        }
        const result = performCalculation();
        displayValue = result === "Error" ? "Error" : result.toString();
        operand1 = null; 
        operator = null;
        waitingForOperand2 = false;
        renderCalculatorDisplay();
    }

    const calculatorButtonLayout = [
        { label: '7', action: () => handleNumberInput('7'), type: 'number', aria: 'رقم سبعة' },
        { label: '8', action: () => handleNumberInput('8'), type: 'number', aria: 'رقم ثمانية' },
        { label: '9', action: () => handleNumberInput('9'), type: 'number', aria: 'رقم تسعة' },
        { label: '÷', action: () => handleOperatorInput('/'), type: 'operator', aria: 'عملية القسمة' },
        { label: '4', action: () => handleNumberInput('4'), type: 'number', aria: 'رقم اربعة' },
        { label: '5', action: () => handleNumberInput('5'), type: 'number', aria: 'رقم خمسة' },
        { label: '6', action: () => handleNumberInput('6'), type: 'number', aria: 'رقم ستة' },
        { label: '×', action: () => handleOperatorInput('*'), type: 'operator', aria: 'عملية الضرب' },
        { label: '1', action: () => handleNumberInput('1'), type: 'number', aria: 'رقم واحد' },
        { label: '2', action: () => handleNumberInput('2'), type: 'number', aria: 'رقم اثنان' },
        { label: '3', action: () => handleNumberInput('3'), type: 'number', aria: 'رقم ثلاثة' },
        { label: '-', action: () => handleOperatorInput('-'), type: 'operator', aria: 'عملية الطرح' },
        { label: '0', action: () => handleNumberInput('0'), type: 'number', aria: 'رقم صفر' },
        { label: '.', action: handleDecimalInput, type: 'number', aria: 'فاصلة عشرية' },
        { label: '=', action: handleEqualsInput, type: 'equals', aria: 'يساوي' },
        { label: '+', action: () => handleOperatorInput('+'), type: 'operator', aria: 'عملية الجمع' },
    ];

    // Populate Calculator Buttons
    // Create rows for calculator buttons
    for (let i = 0; i < calculatorButtonLayout.length; i += 4) {
        const row = document.createElement('div');
        row.classList.add('grid', 'grid-cols-4');
        const buttonsInRow = calculatorButtonLayout.slice(i, i + 4);
        
        buttonsInRow.forEach(btnConfig => {
            const button = document.createElement('button');
            button.classList.add('button');
            if (btnConfig.type === 'operator') {
                button.classList.add('secondary-button');
            } else if (btnConfig.type === 'equals') {
                button.classList.add('default-button');
            } else {
                button.classList.add('outline-button');
            }
            button.textContent = btnConfig.label;
            button.setAttribute('aria-label', btnConfig.aria);
            button.addEventListener('click', btnConfig.action);
            row.appendChild(button);
        });
        calculatorButtonsGridElement.appendChild(row);
    }

    // Initial render
    updateTotalHoursAndDisplay();
});
