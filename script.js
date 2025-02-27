/*
HOW TO ADD CUSTOM DAILY PUZZLES:

1. Find the "dailyPuzzles" object below
2. Add new puzzles using this format:

"YYYY-MM-DD": {
    word: "XXXXX",  // 5-letter word (will be the solution)
    equations: [
        { latex: 'your-latex-equation-1', letter: "X" },
        { latex: 'your-latex-equation-2', letter: "X" },
        { latex: 'your-latex-equation-3', letter: "X" },
        { latex: 'your-latex-equation-4', letter: "X" },
        { latex: 'your-latex-equation-5', letter: "X" }
    ]
}

LaTeX Examples:
- Fractions: \frac{a}{b}
- Exponents: a^2
- Subscripts: a_i
- Greek letters: \alpha, \beta, \gamma, \Delta, \lambda
- Integrals: \int_a^b f(x) \, dx
- Square roots: \sqrt{x}
- Vectors: \vec{F}
- Partial derivatives: \frac{\partial f}{\partial x}
- Nabla operator: \nabla
- Infinity: \infty
- For more LaTeX examples, visit: https://katex.org/docs/supported.html
*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Game state variables
    let selectedBoxIndex = null;
    let startTime = null;
    let timerInterval = null;
    let currentWord = "QUARK"; // Default word
    let userAnswer = ["", "", "", "", ""];
    let isGameComplete = false;
    
    // Custom puzzles database - you can add new puzzles here
    const dailyPuzzles = {
        // Format: "YYYY-MM-DD": { word: "XXXXX", equations: [{ latex: "...", letter: "X" }, ...] }
        "2025-02-27": {
            word: "QUARK",
            equations: [
                { latex: 'mc \\Delta T', letter: "Q" },
                { latex: 'mgh', letter: "U" },
                { latex: '\\frac{dv}{dt}', letter: "A" },
                { latex: '\\frac{V}{I}', letter: "R" },
                { latex: '\\frac{1}{2}mv^2', letter: "K" }
            ]
        },
        "2025-02-28": {
            word: "FORCE",
            equations: [
                { latex: 'ma', letter: "F" },
                { latex: '\\omega r', letter: "O" },
                { latex: '\\rho V g', letter: "R" },
                { latex: '\\lambda f', letter: "C" },
                { latex: 'mc^2', letter: "E" }
            ]
        },
        "2025-02-29": {
            word: "FIELD",
            equations: [
                { latex: '\\oint \\vec{E} \\cdot d\\vec{A}', letter: "F" },
                { latex: '\\int_a^b f(x) dx', letter: "I" },
                { latex: 'mc^2', letter: "E" },
                { latex: '\\frac{dL}{dt}', letter: "L" },
                { latex: '\\frac{d^2x}{dt^2}', letter: "D" }
            ]
        },
        // You can add more puzzles here following the same format
    };

    // Get DOM elements
    const startButton = document.getElementById('start-button');
    const gameBoard = document.getElementById('game-board');
    const equationsContainer = document.getElementById('equations');
    const answersContainer = document.getElementById('answers');
    const dateDisplay = document.getElementById('date-display');
    const puzzleNumber = document.getElementById('puzzle-number');
    const timerElement = document.getElementById('timer');

    // Display current date and load the corresponding puzzle
    function updateDateDisplay() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('en-US', options);
        puzzleNumber.textContent = "Daily Challenge";
        
        // Format date for lookup
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        // Try to load puzzle for today's date
        loadPuzzleForDate(dateString);
    }
    
    // Load puzzle for a specific date
    function loadPuzzleForDate(dateString) {
        // Check if we have a puzzle for this date
        if (dailyPuzzles[dateString]) {
            currentWord = dailyPuzzles[dateString].word.toUpperCase();
        } else {
            // If no puzzle exists for today, use the default
            const dates = Object.keys(dailyPuzzles).sort();
            if (dates.length > 0) {
                // Find the most recent puzzle
                const pastDates = dates.filter(date => date <= dateString);
                const mostRecent = pastDates.length > 0 ? 
                    pastDates[pastDates.length - 1] : dates[0];
                
                currentWord = dailyPuzzles[mostRecent].word.toUpperCase();
            } else {
                // Fallback to default if no puzzles exist
                currentWord = "QUARK";
            }
        }
    }

    // Create the answer boxes
    function createAnswerBoxes() {
        answersContainer.innerHTML = '';
        userAnswer = ["", "", "", "", ""];
        
        for (let i = 0; i < 5; i++) {
            const box = document.createElement('div');
            box.className = 'answer-box';
            box.dataset.index = i;
            box.addEventListener('click', function() {
                selectBox(i);
            });
            answersContainer.appendChild(box);
        }
    }

    // Add pre-formatted equations (fallback to simple text if formatting fails)
    function createEquations() {
        equationsContainer.innerHTML = '';
        
        // Get today's date
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        // Get puzzle for today or fallback
        let equations;
        if (dailyPuzzles[dateString]) {
            equations = dailyPuzzles[dateString].equations;
        } else {
            // Find the most recent puzzle
            const dates = Object.keys(dailyPuzzles).sort();
            const pastDates = dates.filter(date => date <= dateString);
            const mostRecent = pastDates.length > 0 ? 
                pastDates[pastDates.length - 1] : dates[0];
            
            equations = dailyPuzzles[mostRecent].equations;
        }
        
        for (let i = 0; i < equations.length; i++) {
            const eqDiv = document.createElement('div');
            eqDiv.className = 'equation';
            const eqSpan = document.createElement('span');
            eqSpan.className = 'latex';
            eqDiv.appendChild(eqSpan);
            equationsContainer.appendChild(eqDiv);
            
            // Render LaTeX
            katex.render(equations[i].latex, eqSpan, {
                throwOnError: false,
                displayMode: true
            });
            
            // Check if equation is too large and adjust size if needed
            const katexEl = eqSpan.querySelector('.katex');
            if (katexEl) {
                // Start with a scale factor of 1
                let scaleFactor = 1;
                const maxWidth = eqDiv.clientWidth - 20; // Subtract padding
                const maxHeight = eqDiv.clientHeight - 20;
                
                const eqWidth = katexEl.offsetWidth;
                const eqHeight = katexEl.offsetHeight;
                
                // If equation is too wide or tall, reduce scale
                if (eqWidth > maxWidth || eqHeight > maxHeight) {
                    const widthRatio = maxWidth / eqWidth;
                    const heightRatio = maxHeight / eqHeight;
                    scaleFactor = Math.min(widthRatio, heightRatio, 1) * 0.9; // 10% safety margin
                    katexEl.style.transform = `scale(${scaleFactor})`;
                    katexEl.style.transformOrigin = 'center center';
                }
            }
        }
    }

    // Select an answer box
    function selectBox(index) {
        if (isGameComplete) return;
        
        // Remove active class from all boxes
        const boxes = document.querySelectorAll('.answer-box');
        boxes.forEach(box => box.classList.remove('active'));
        
        // Add active class to selected box
        if (selectedBoxIndex !== index) {
            boxes[index].classList.add('active');
            selectedBoxIndex = index;
        } else {
            selectedBoxIndex = null;
        }
    }

    // Handle keyboard input with improved backspace behavior
    function handleKeyInput(key) {
        if (isGameComplete) return;
        
        if (key === 'ENTER') {
            checkAnswer();
        } else if (key === 'BACKSPACE') {
            // Modified backspace behavior
            if (selectedBoxIndex !== null) {
                // If current box has content, clear it
                if (userAnswer[selectedBoxIndex]) {
                    userAnswer[selectedBoxIndex] = '';
                    document.querySelectorAll('.answer-box')[selectedBoxIndex].textContent = '';
                } 
                // Otherwise, move to previous box (if exists) and clear it
                else {
                    const prevIndex = selectedBoxIndex - 1;
                    if (prevIndex >= 0) {
                        selectBox(prevIndex);
                        userAnswer[prevIndex] = '';
                        document.querySelectorAll('.answer-box')[prevIndex].textContent = '';
                    }
                }
            } else {
                // If no box is selected, find the rightmost filled box and clear it
                for (let i = userAnswer.length - 1; i >= 0; i--) {
                    if (userAnswer[i]) {
                        selectBox(i);
                        userAnswer[i] = '';
                        document.querySelectorAll('.answer-box')[i].textContent = '';
                        break;
                    }
                }
            }
        } else if (key.length === 1 && key.match(/[A-Z]/i)) {
            if (selectedBoxIndex !== null) {
                userAnswer[selectedBoxIndex] = key.toUpperCase();
                document.querySelectorAll('.answer-box')[selectedBoxIndex].textContent = key.toUpperCase();
                
                // Auto-move to next empty box
                const nextIndex = getNextEmptyBox(selectedBoxIndex);
                if (nextIndex !== -1) {
                    selectBox(nextIndex);
                }
            }
        }
    }

    // Get next empty box
    function getNextEmptyBox(currentIndex) {
        for (let i = currentIndex + 1; i < 5; i++) {
            if (!userAnswer[i]) {
                return i;
            }
        }
        for (let i = 0; i < currentIndex; i++) {
            if (!userAnswer[i]) {
                return i;
            }
        }
        return -1;
    }

    // Check if the answer is correct
    function checkAnswer() {
        // Make sure all boxes are filled
        if (userAnswer.some(letter => !letter)) {
            // Flash empty boxes in red
            const firstEmptyIndex = userAnswer.findIndex(letter => !letter);
            const boxes = document.querySelectorAll('.answer-box');
            
            userAnswer.forEach((letter, index) => {
                if (!letter) {
                    const box = boxes[index];
                    box.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        box.style.borderColor = '';
                    }, 800);
                }
            });
            
            // Focus the first empty box
            if (firstEmptyIndex !== -1) {
                selectBox(firstEmptyIndex);
            }
            
            return;
        }
        
        const userWordJoined = userAnswer.join('');
        if (userWordJoined.toUpperCase() === currentWord.toUpperCase()) {
            // Correct answer!
            isGameComplete = true;
            stopTimer();
            
            // Apply success animation
            const boxes = document.querySelectorAll('.answer-box');
            boxes.forEach((box, index) => {
                // Stagger the animation
                setTimeout(() => {
                    box.classList.add('completed');
                    box.classList.add('success-animation');
                }, index * 100);
            });
            
            setTimeout(() => {
                // Create a success message
                const successMessage = document.createElement('div');
                successMessage.style.position = 'fixed';
                successMessage.style.top = '20%';
                successMessage.style.left = '50%';
                successMessage.style.transform = 'translateX(-50%)';
                successMessage.style.backgroundColor = 'var(--card-bg)';
                successMessage.style.padding = '20px 30px';
                successMessage.style.borderRadius = '12px';
                successMessage.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                successMessage.style.zIndex = '1000';
                successMessage.style.textAlign = 'center';
                successMessage.innerHTML = `
                    <h3 style="color: var(--accent-color); margin-bottom: 10px; font-size: 1.5rem;">Congratulations!</h3>
                    <p style="color: var(--text-color);">You solved today's Physicle in ${timerElement.textContent}!</p>
                    <button style="
                        margin-top: 15px;
                        background-color: var(--accent-color);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 8px;
                        cursor: pointer;
                    ">Close</button>
                `;
                document.body.appendChild(successMessage);
                
                // Add click event to close button
                const closeButton = successMessage.querySelector('button');
                closeButton.addEventListener('click', () => {
                    document.body.removeChild(successMessage);
                });
            }, 800);
        } else {
            // Wrong answer - shake the boxes
            const boxes = document.querySelectorAll('.answer-box');
            boxes.forEach(box => {
                box.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    box.style.animation = '';
                }, 500);
            });
        }
    }

    // Start timer
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Update timer
    function updateTimer() {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Stop timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Start the game
    function startGame() {
        // Hide start button and show game board
        startButton.style.display = 'none';
        gameBoard.style.display = 'block';
        
        // Initialize game
        createAnswerBoxes();
        createEquations();
        startTimer();
        
        // Select the first box
        selectBox(0);
    }

    // Add event listeners
    startButton.addEventListener('click', startGame);

    // On-screen keyboard clicks
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', function() {
            handleKeyInput(key.dataset.key);
        });
    });

    // Physical keyboard presses
    document.addEventListener('keydown', function(e) {
        if (gameBoard.style.display === 'none') return;
        
        if (e.key === 'Enter') {
            handleKeyInput('ENTER');
            e.preventDefault(); // Prevent form submission
        } else if (e.key === 'Backspace') {
            handleKeyInput('BACKSPACE');
        } else if (e.key.match(/^[a-zA-Z]$/)) {
            handleKeyInput(e.key.toUpperCase());
        } else if (e.key === 'ArrowRight' && selectedBoxIndex !== null) {
            selectBox((selectedBoxIndex + 1) % 5);
        } else if (e.key === 'ArrowLeft' && selectedBoxIndex !== null) {
            selectBox((selectedBoxIndex - 1 + 5) % 5);
        }
    });

    // Initialize date display
    updateDateDisplay();
    
    // Render all LaTeX on the page and adjust sizes
    document.querySelectorAll('.latex').forEach(element => {
        if (element.textContent) {
            katex.render(element.textContent, element, {
                throwOnError: false,
                displayMode: true
            });
            
            // For example equation
            if (element.closest('.equation-example')) {
                const katexEl = element.querySelector('.katex');
                if (katexEl) {
                    const container = element.closest('.equation-box');
                    if (container) {
                        const maxWidth = container.clientWidth - 20;
                        const maxHeight = container.clientHeight - 20;
                        const eqWidth = katexEl.offsetWidth;
                        const eqHeight = katexEl.offsetHeight;
                        
                        if (eqWidth > maxWidth || eqHeight > maxHeight) {
                            const widthRatio = maxWidth / eqWidth;
                            const heightRatio = maxHeight / eqHeight;
                            const scaleFactor = Math.min(widthRatio, heightRatio, 1) * 0.9;
                            katexEl.style.transform = `scale(${scaleFactor})`;
                            katexEl.style.transformOrigin = 'center center';
                        }
                    }
                }
            }
        }
    });
});