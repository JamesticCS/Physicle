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
    // Game constants
    const MAX_GUESSES = 4;
    const WORD_LENGTH = 5;
    
    // Game state variables
    let currentGuess = 0;
    let currentPosition = 0;
    let startTime = null;
    let timerInterval = null;
    let currentWord = "QUARK"; // Default word
    let guesses = Array(MAX_GUESSES).fill().map(() => Array(WORD_LENGTH).fill(''));
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

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Create the answer grid
    function createAnswerGrid() {
        answersContainer.innerHTML = '';
        
        // Reset guesses
        guesses = Array(MAX_GUESSES).fill().map(() => Array(WORD_LENGTH).fill(''));
        
        // Check if mobile
        const isMobile = isMobileDevice();
        
        // Create a single hidden input for mobile that will be repositioned
        let mobileInput = null;
        if (isMobile) {
            mobileInput = document.createElement('input');
            mobileInput.type = 'text';
            mobileInput.className = 'mobile-master-input';
            mobileInput.autocomplete = 'off';
            mobileInput.autocapitalize = 'characters';
            mobileInput.style.position = 'fixed';
            mobileInput.style.opacity = '0';
            mobileInput.style.height = '1px';
            mobileInput.style.width = '1px';
            mobileInput.style.top = '50%';
            mobileInput.style.left = '50%';
            mobileInput.style.zIndex = '-1';
            document.body.appendChild(mobileInput);
    
            // Handle input
            mobileInput.addEventListener('input', function(e) {
                if (isGameComplete || currentGuess >= MAX_GUESSES) return;
                
                const val = e.target.value.toUpperCase();
                if (val && val.match(/[A-Z]/)) {
                    // Clear the input so we can capture next letter
                    mobileInput.value = '';
                    
                    // If we're at a position with a letter, replace it
                    if (currentPosition < WORD_LENGTH) {
                        guesses[currentGuess][currentPosition] = val;
                        
                        // Update display
                        const cell = document.querySelector(`.answer-box[data-row="${currentGuess}"][data-col="${currentPosition}"]`);
                        if (cell) cell.textContent = val;
                        
                        // Move to next position only if this position wasn't empty
                        currentPosition++;
                        highlightCurrentCell();
                    }
                }
            });
    

            mobileInput.addEventListener('keydown', function(e) {
                if (isGameComplete || currentGuess >= MAX_GUESSES) return;
                
                if (e.key === 'Backspace') {
                    e.preventDefault();
                    
                    // Delete the letter at the current position
                    if (currentPosition < WORD_LENGTH && guesses[currentGuess][currentPosition]) {
                        // Delete the letter at current position if there is one
                        guesses[currentGuess][currentPosition] = '';
                        const cell = document.querySelector(`.answer-box[data-row="${currentGuess}"][data-col="${currentPosition}"]`);
                        if (cell) cell.textContent = '';
                    } else if (currentPosition > 0) {
                        // If current position is empty, move back and delete the previous letter
                        currentPosition--;
                        guesses[currentGuess][currentPosition] = '';
                        const cell = document.querySelector(`.answer-box[data-row="${currentGuess}"][data-col="${currentPosition}"]`);
                        if (cell) cell.textContent = '';
                    }
                    
                    highlightCurrentCell();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    
                    // Check if current row is complete
                    if (currentPosition === WORD_LENGTH) {
                        submitGuess();
                    }
                }
            });
            
            // Hide on-screen keyboard
            document.querySelector('.keyboard').style.display = 'none';
        }
        
        // Create grid rows and cells
        for (let i = 0; i < MAX_GUESSES; i++) {
            const row = document.createElement('div');
            row.className = 'guess-row';
            
            for (let j = 0; j < WORD_LENGTH; j++) {
                const cell = document.createElement('div');
                cell.className = 'answer-box';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (isMobile) {
                    // Make cell clickable to focus the input
                    cell.addEventListener('click', function() {
                        currentGuess = parseInt(this.dataset.row);
                        // Key change: When a letter is clicked, ensure we move to that exact position
                        currentPosition = parseInt(this.dataset.col);
                        
                        // Immediately focus the input
                        highlightCurrentCell();
                        mobileInput.focus();
                    });
                } else {
                    // For desktop, use original logic
                    cell.addEventListener('click', function() {
                        selectBox(parseInt(this.dataset.row), parseInt(this.dataset.col));
                    });
                }
                
                row.appendChild(cell);
            }
            
            answersContainer.appendChild(row);
        }
        
        // Initialize game state
        if (isMobile) {
            // Focus the mobile input to bring up keyboard
            setTimeout(() => mobileInput.focus(), 100);
        } else {
            highlightCurrentCell();
        }
    }

    // Highlight the current cell
    function highlightCurrentCell() {
        // Remove highlights from all cells
        document.querySelectorAll('.answer-box').forEach(box => {
            box.classList.remove('active');
        });
        
        // Add highlight to current cell if game is not complete
        if (!isGameComplete && currentGuess < MAX_GUESSES) {
            const currentCell = document.querySelector(`.answer-box[data-row="${currentGuess}"][data-col="${currentPosition}"]`);
            if (currentCell) {
                currentCell.classList.add('active');
            }
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

    // Handle keyboard input
    function handleKeyInput(key) {
        if (isGameComplete || currentGuess >= MAX_GUESSES) return;
        
        if (key === 'ENTER') {
            if (currentPosition === WORD_LENGTH) {
                submitGuess();
            }
        } else if (key === 'BACKSPACE') {
            if (currentPosition > 0) {
                currentPosition--;
                guesses[currentGuess][currentPosition] = '';
                updateGuessDisplay();
            }
        } else if (key.length === 1 && key.match(/[A-Z]/i) && currentPosition < WORD_LENGTH) {
            guesses[currentGuess][currentPosition] = key.toUpperCase();
            updateGuessDisplay();
            currentPosition++;
        }
        
        highlightCurrentCell();
    }

    // Update the display of the current guess
    function updateGuessDisplay() {
        for (let j = 0; j < WORD_LENGTH; j++) {
            const cell = document.querySelector(`.answer-box[data-row="${currentGuess}"][data-col="${j}"]`);
            if (cell) {
                cell.textContent = guesses[currentGuess][j];
            }
        }
    }

    // Submit the current guess and check against the answer
    function submitGuess() {
        const guess = guesses[currentGuess].join('');
        
        // Check if guess is complete
        if (guess.length !== WORD_LENGTH) return;
        
        // Apply colors based on correctness
        applyColors();
        
        // Check if guess is correct
        if (guess === currentWord) {
            // Win condition
            isGameComplete = true;
            stopTimer();
            showSuccessMessage();
        } else if (currentGuess >= MAX_GUESSES - 1) {
            // Lose condition (used all guesses)
            isGameComplete = true;
            stopTimer();
            showFailureMessage();
        } else {
            // Move to next guess
            currentGuess++;
            currentPosition = 0;
            highlightCurrentCell();
        }
    }

    // Apply colors to the current guess based on letter correctness
    function applyColors() {
        const guess = guesses[currentGuess];
        const target = currentWord.split('');
        const rowCells = document.querySelectorAll(`.answer-box[data-row="${currentGuess}"]`);
        
        // Create a map to track which letters in the target are already matched
        // This helps with handling duplicate letters correctly
        const targetLetterCount = {};
        target.forEach(letter => {
            targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
        });
        
        // First pass: mark correct positions (green)
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guess[i] === target[i]) {
                rowCells[i].classList.add('correct');
                targetLetterCount[guess[i]]--;
            }
        }
        
        // Second pass: mark letters in wrong positions (yellow) or not in word (gray)
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guess[i] !== target[i]) {
                if (targetLetterCount[guess[i]] > 0) {
                    rowCells[i].classList.add('present');
                    targetLetterCount[guess[i]]--;
                } else {
                    rowCells[i].classList.add('absent');
                }
            }
        }
    }

    // Show success message
    function showSuccessMessage() {
        setTimeout(() => {
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
                <p style="color: var(--text-color);">You solved today's Physicle in ${currentGuess + 1}/${MAX_GUESSES} guesses!</p>
                <p style="color: var(--text-color);">Time: ${timerElement.textContent}</p>
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
    }

    // Show failure message
    function showFailureMessage() {
        setTimeout(() => {
            const failureMessage = document.createElement('div');
            failureMessage.style.position = 'fixed';
            failureMessage.style.top = '20%';
            failureMessage.style.left = '50%';
            failureMessage.style.transform = 'translateX(-50%)';
            failureMessage.style.backgroundColor = 'var(--card-bg)';
            failureMessage.style.padding = '20px 30px';
            failureMessage.style.borderRadius = '12px';
            failureMessage.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            failureMessage.style.zIndex = '1000';
            failureMessage.style.textAlign = 'center';
            failureMessage.innerHTML = `
                <h3 style="color: #ef4444; margin-bottom: 10px; font-size: 1.5rem;">Game Over</h3>
                <p style="color: var(--text-color);">The word was: ${currentWord}</p>
                <p style="color: var(--text-color);">Better luck next time!</p>
                <button style="
                    margin-top: 15px;
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                ">Close</button>
            `;
            document.body.appendChild(failureMessage);
            
            // Add click event to close button
            const closeButton = failureMessage.querySelector('button');
            closeButton.addEventListener('click', () => {
                document.body.removeChild(failureMessage);
            });
        }, 800);
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
        
        // Reset game state
        currentGuess = 0;
        currentPosition = 0;
        isGameComplete = false;
        
        // Initialize game
        createAnswerGrid();
        createEquations();
        startTimer();
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

        if (isMobileDevice()) return;
        
        if (e.key === 'Enter') {
            handleKeyInput('ENTER');
            e.preventDefault(); // Prevent form submission
        } else if (e.key === 'Backspace') {
            handleKeyInput('BACKSPACE');
        } else if (e.key.match(/^[a-zA-Z]$/)) {
            handleKeyInput(e.key.toUpperCase());
        } else if (e.key === 'ArrowRight') {
            if (currentPosition < WORD_LENGTH) {
                currentPosition++;
                highlightCurrentCell();
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentPosition > 0) {
                currentPosition--;
                highlightCurrentCell();
            }
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