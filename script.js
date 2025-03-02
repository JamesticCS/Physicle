/*
HOW TO ADD CUSTOM DAILY PUZZLES:

Puzzles are automatically generated using the physics equation database!
However, you can still add custom puzzles for specific dates:

1. Find the "customPuzzles" object below
2. Add new puzzles using this format:

"YYYY-MM-DD": {
    word: "XXXXX",  // 5-letter word (will be the solution)
    equations: [
        { latex: 'your-latex-equation-1', letter: "X", fullEquation: "...", explanation: "..." },
        { latex: 'your-latex-equation-2', letter: "X", fullEquation: "...", explanation: "..." },
        { latex: 'your-latex-equation-3', letter: "X", fullEquation: "...", explanation: "..." },
        { latex: 'your-latex-equation-4', letter: "X", fullEquation: "...", explanation: "..." },
        { latex: 'your-latex-equation-5', letter: "X", fullEquation: "...", explanation: "..." }
    ]
}
*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Game constants
	const MAX_GUESSES = 4;
	const WORD_LENGTH = 5;
    const PUZZLE_VERSION = 11; // Used to regenerate puzzles

    // Tracks the best status for each letter so far: "correct", "present", or "absent"
    const keyColorState = {};

	// Game state variables
	let currentGuess = 0;
	let currentPosition = 0;
	let startTime = null;
	let timerInterval = null;
	let currentWord = "QUARK"; // Default word
	let guesses = Array(MAX_GUESSES).fill().map(() => Array(WORD_LENGTH).fill(''));
	let isGameComplete = false;
	let todaysPuzzle = null;
    let validGuesses = [];


	const startButton = document.getElementById('start-button');
	const gameBoard = document.getElementById('game-board');
	const equationsContainer = document.getElementById('equations');
	const answersContainer = document.getElementById('answers');
	const dateDisplay = document.getElementById('date-display');
	const puzzleNumber = document.getElementById('puzzle-number');
	const timerElement = document.getElementById('timer');

    const physicsEquations = window.physicsEquations

    loadValidGuesses().then(words => {
        validGuesses = words;
      });

	// Custom puzzles that override the automatically generated ones for specific dates
	const customPuzzles = {
		// Format: "YYYY-MM-DD": { word: "XXXXX", equations: [{ latex: "...", letter: "X", fullEquation: "...", explanation: "..." }, ...] }
		"2025-03-01": {
			word: "BRAVE",
			equations: [{
					latex: '\\frac{\\mu_0 I}{4\\pi} \\oint \\frac{d\\vec{l} \\times \\vec{r}}{r^2}',
					letter: "B",
					fullEquation: '\\vec{B} = \\frac{\\mu_0 I}{4\\pi} \\oint \\frac{d\\vec{l} \\times \\vec{r}}{r^2}',
					explanation: "Biot-Savart Law for magnetic field"
				},
				{
					latex: '\\frac{PV}{nT}',
					letter: "R",
					fullEquation: 'R = \\frac{PV}{nT}',
					explanation: "Ideal gas constant from PV = nRT"
				},
				{
					latex: '\\frac{\\Delta v}{\\Delta t}',
					letter: "A",
					fullEquation: 'a = \\frac{\\Delta v}{\\Delta t}',
					explanation: "Average acceleration"
				},
				{
					latex: '-\\int_{\\mathbf{r}_1}^{\\mathbf{r}_2} \\mathbf{E} \\cdot d\\mathbf{r}',
					letter: "V",
					fullEquation: '\\Delta V = -\\int_{\\mathbf{r}_1}^{\\mathbf{r}_2} \\mathbf{E} \\cdot d\\mathbf{r}',
					explanation: "Electric potential difference"
				},
				{
					latex: 'hf',
					letter: "E",
					fullEquation: 'E = hf',
					explanation: "Photon energy (Planck's equation)"
				}
			]
		}
		// add more puzzles here!!!
	};

     // Initialize date display first to get today's puzzle
     updateDateDisplay().then(() => {
        // Check if we have a saved game state for today
        const hasSavedState = loadGameState();
    
    if (hasSavedState) {
        if (isGameComplete) {
            // Game was already completed
            gameBoard.style.display = 'block';
            startButton.style.display = 'none';
            restoreGameUI();
        } else {
            // Game was in progress
            gameBoard.style.display = 'block';
            startButton.style.display = 'none';
            restoreGameUI();
            
            // Restart timer for in-progress game
            if (startTime) {
                timerInterval = setInterval(updateTimer, 1000);
            }
        }
    } else {
        // No saved state, show start button
        startButton.style.display = 'block';
        gameBoard.style.display = 'none';
    }
}).catch(error => {
    console.error('Error initializing game:', error);
});
	

	/**
	 * Loads the Wordle answer list from the external file
	 * @returns {Promise<string[]>} Array of 5-letter words
	 */
	async function loadWordleAnswers() {
		try {
			// Load the file content
			const response = await fetch('wordle-answers-alphabetical.txt');
			const text = await response.text();
			
			// Split the text into an array of words
			const words = text.trim().split('\n');
			
			return words;
		} catch (error) {
			console.error('Error loading Wordle answers:', error);
			// Fallback to a small set of words if file cannot be loaded
			return [
				"force", "quark", "light", "space", "phase", 
				"laser", "power", "optic", "sound", "decay",
				"brave", "alien", "ghost", "robot", "virus"
			];
		}
	}

    async function loadValidGuesses() {
        try {
          const response = await fetch('valid-guesses.txt');
          const text = await response.text();
          // Convert each word to uppercase for comparison
          return text.trim().split('\n').map(word => word.toUpperCase());
        } catch (error) {
          console.error('Error loading valid guesses:', error);
          return [];
        }
      }
      

	/**
	 * Selects a word for a specific date using a deterministic algorithm
	 * @param {Date} date - The date to select a word for
	 * @param {string[]} wordList - Array of available words
	 * @returns {string} The selected word
	 */
	function selectWordForDate(date, wordList, version = PUZZLE_VERSION) {
		// Create a deterministic seed based on the date
		// This ensures the same word is chosen for a specific date
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();
		
		// Create a simple hash from the date
		const dateHash = (year * 10000) + (month * 100) + day + version;
		
		// Use the hash to select a word from the list
		const index = dateHash % wordList.length;
		
		return wordList[index].toUpperCase();
	}

	/**
 * Selects an equation for a given letter based on the date
 * @param {string} letter - The letter to find an equation for
 * @param {Date} date - The date to use for selection
 * @returns {Object} The selected equation object
 */
function selectEquationForLetter(letter, date, version = PUZZLE_VERSION) {
    // Get equations available for this letter
    const availableEquations = physicsEquations[letter];
    
    // If no equations are available for this letter, return a placeholder
    if (!availableEquations || availableEquations.length === 0) {
        return {
            latex: '?',
            letter: letter,
            fullEquation: `${letter} = ?`,
            explanation: `No equation available for letter ${letter}`
        };
    }
    
    // Create a deterministic index based on the date and letter
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Use letter code as an additional seed
    const letterCode = letter.charCodeAt(0);
    
    // Create a hash from date and letter
    const dateLetterHash = (year * 10000) + (month * 100) + day + letterCode + version;
    
    // Use the hash to select an equation
    const index = dateLetterHash % availableEquations.length;
    
    // Return the selected equation with the letter property added
    return {
        ...availableEquations[index],
        letter: letter
    };
}

	/**
	 * Generates a complete puzzle for a specific date
	 * @param {Date} date - The date to generate a puzzle for
	 * @returns {Promise<Object>} The complete puzzle object
	 */
	async function generatePuzzleForDate(date, version = PUZZLE_VERSION) {
        const wordList = await loadWordleAnswers();
        const word = selectWordForDate(date, wordList, version);
        const equations = [];
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            const equation = selectEquationForLetter(letter, date, version);
            equations.push(equation);
        }
        return {
            word,
            equations
        };
    }
    

	// Display current date and load the corresponding puzzle
	async function updateDateDisplay() {
		const now = new Date();
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		dateDisplay.textContent = now.toLocaleDateString('en-US', options);
		puzzleNumber.textContent = "Daily Challenge";

		// Format date for lookup
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const dateString = `${year}-${month}-${day}`;

		// Try to load puzzle for today's date
		await loadPuzzleForDate(dateString);
	}

	// Load puzzle for a specific date - first check custom puzzles, then generate one
	async function loadPuzzleForDate(dateString) {
		// Check if we have a custom puzzle for this date
		if (customPuzzles[dateString]) {
			todaysPuzzle = customPuzzles[dateString];
			currentWord = todaysPuzzle.word.toUpperCase();
			return;
		}

		try {
			// Parse the date string
			const [year, month, day] = dateString.split('-').map(Number);
			const date = new Date(year, month - 1, day); // month is 0-indexed in JavaScript
			
			// Generate a puzzle
			todaysPuzzle = await generatePuzzleForDate(date);
			currentWord = todaysPuzzle.word;
		} catch (error) {
			console.error('Error generating puzzle:', error);
			// Fallback to default word and puzzle
			currentWord = "QUARK";
			todaysPuzzle = {
				word: currentWord,
				equations: [
					{
						latex: 'mc \\Delta T',
						letter: "Q",
						fullEquation: 'Q = mc\\Delta T',
						explanation: "Heat energy equation"
					},
					{
						latex: 'mgh',
						letter: "U",
						fullEquation: 'U = mgh',
						explanation: "Gravitational potential energy"
					},
					{
						latex: '\\frac{dv}{dt}',
						letter: "A",
						fullEquation: 'a = \\frac{dv}{dt}',
						explanation: "Acceleration definition"
					},
					{
						latex: '\\frac{V}{I}',
						letter: "R",
						fullEquation: 'R = \\frac{V}{I}',
						explanation: "Ohm's Law"
					},
					{
						latex: '\\frac{1}{2}mv^2',
						letter: "K",
						fullEquation: 'K = \\frac{1}{2}mv^2',
						explanation: "Kinetic energy"
					}
				]
			};
		}
	}

// Save the current game state to localStorage
function saveGameState() {
    // Get current date string for the key
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    // Calculate elapsed time if timer is running
    let elapsedTime = timerElement.textContent;
    let elapsedMs = 0;
    if (startTime) {
        elapsedMs = Date.now() - startTime;
    }
    
    // Create an object with all the necessary game state
    const gameState = {
        date: dateString,
        word: currentWord,
        guesses: guesses,
        currentGuess: currentGuess,
        currentPosition: currentPosition,
        isGameComplete: isGameComplete,
        startTime: startTime ? elapsedMs : null,
        elapsedTime: elapsedTime,
        puzzleData: todaysPuzzle
    };
    
    // Save to localStorage
    localStorage.setItem('physicle_state', JSON.stringify(gameState));
    console.log('Game state saved:', gameState); // Debugging
}

// Load saved game state from localStorage
function loadGameState() {
    try {
        // Get saved state
        const savedState = localStorage.getItem('physicle_state');
        if (!savedState) {
            console.log('No saved state found'); // Debugging
            return false;
        }
        
        const gameState = JSON.parse(savedState);
        console.log('Loaded game state:', gameState); // Debugging
        
        // Check if the saved state is for today
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        if (gameState.date !== dateString) {
            // State is from a different day, don't use it
            console.log('Saved state is from a different day:', gameState.date); // Debugging
            return false;
        }
        
        // Restore game state
        currentWord = gameState.word;
        guesses = gameState.guesses;
        currentGuess = gameState.currentGuess;
        currentPosition = gameState.currentPosition || 0;
        isGameComplete = gameState.isGameComplete;
        todaysPuzzle = gameState.puzzleData;
        
        // If the game was in progress, restore the timer
        if (gameState.startTime && !isGameComplete) {
            // Set start time based on elapsed time
            startTime = Date.now() - gameState.startTime;
            
            // Update timer display
            const elapsedMilliseconds = gameState.startTime;
            const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else if (isGameComplete && gameState.elapsedTime) {
            // Game was complete, just show the final time
            timerElement.textContent = gameState.elapsedTime;
        }
        
        return true;
    } catch (error) {
        console.error('Error loading game state:', error);
        return false;
    }
}

// Function to update the UI based on loaded game state
function restoreGameUI() {
    console.log('Restoring UI with current state. isGameComplete:', isGameComplete);

    // Create the answer grid
    createAnswerGrid(true);

    // Create the equations
    createEquations();

    // Restore completed guesses (rows 0 to currentGuess-1)
    for (let i = 0; i < currentGuess; i++) {
        const guess = guesses[i];
        for (let j = 0; j < WORD_LENGTH; j++) {
            const cell = document.querySelector(`.answer-box[data-row="${i}"][data-col="${j}"]`);
            if (cell) {
                cell.textContent = guess[j];
            }
        }
        applyColorsToRow(i);
    }

    // If game is not complete, clear any partial letters from the current guess row
    if (!isGameComplete && currentGuess < MAX_GUESSES) {
        // Reset the current row in the guesses array
        guesses[currentGuess] = Array(WORD_LENGTH).fill('');
        // Also reset the current position to the beginning of the row
        currentPosition = 0;
    }

    if (isGameComplete) {
        console.log('Game is complete, showing completion message');
        const lastGuess = guesses[currentGuess - 1].join('');
        const isWin = (lastGuess === currentWord);
        setTimeout(() => {
            if (isWin) {
                showSuccessMessage();
            } else {
                showFailureMessage();
            }
        }, 500);
    } else {
        highlightCurrentCell();
    }
}


	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	// Create the answer grid
	function createAnswerGrid(isRestoring = false) {
    answersContainer.innerHTML = '';

    // Only reset guesses if we're not restoring a saved game
    if (!isRestoring) {
        guesses = Array(MAX_GUESSES).fill().map(() => Array(WORD_LENGTH).fill(''));
    }

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
                  mobileInput.value = '';
                  if (currentPosition < WORD_LENGTH) {
                    guesses[currentGuess][currentPosition] = val;
                    const cell = document.querySelector(`.answer-box[data-row="${currentGuess}"][data-col="${currentPosition}"]`);
                    if (cell) cell.textContent = val;
                    // Only advance the position if not in the last cell.
                    if (currentPosition < WORD_LENGTH - 1) {
                      currentPosition++;
                    }
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

					// Check if row has any letters filled in
					const currentRowFilled = guesses[currentGuess].some(letter => letter !== '');

					// Only allow submission if the row is complete
					if (guesses[currentGuess].every(letter => letter !== '') && currentRowFilled) {
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
						// Fix: Only allow clicking on the current active row
						const clickedRow = parseInt(this.dataset.row);
						if (clickedRow !== currentGuess) {
							// If clicking on a future row, do nothing
							return;
						}

						// Set position within the current row
						currentPosition = parseInt(this.dataset.col);

						// Immediately focus the input
						highlightCurrentCell();
						mobileInput.focus();
					});
				} else {
					// For desktop, use original logic
					cell.addEventListener('click', function() {
						const clickedRow = parseInt(this.dataset.row);
						// Only allow clicking on the current active row
						if (clickedRow !== currentGuess) return;

						currentPosition = parseInt(this.dataset.col);
						highlightCurrentCell();
					});
				}

				row.appendChild(cell);
			}

			answersContainer.appendChild(row);
		}

		// Initialize game state
		if (isMobile) {
			// Focus the mobile input to bring up keyboard
			setTimeout(() => {
				// Highlight the first cell more prominently for mobile
				const firstCell = document.querySelector(`.answer-box[data-row="0"][data-col="0"]`);
				if (firstCell) {
					firstCell.classList.add('active', 'mobile-pulse');

					// Instead of removing the pulse on any touch,
					// only remove it when the user actually types a letter
					// We'll keep track of whether typing has started
					let typingStarted = false;

					// Add an event listener to the mobile input to detect actual typing
					mobileInput.addEventListener('input', function handleFirstInput() {
						typingStarted = true;

						// Remove the pulse animation when typing starts
						const pulsingCell = document.querySelector('.mobile-pulse');
						if (pulsingCell) {
							pulsingCell.classList.remove('mobile-pulse');
						}

						// Remove this event listener once typing has started
						mobileInput.removeEventListener('input', handleFirstInput);
					});

					// Also make answer box clicks remove the pulse only when clicked
					document.querySelectorAll('.answer-box').forEach(box => {
						box.addEventListener('click', function removePulseOnBoxClick() {
							// Only remove if this is the first row
							if (parseInt(this.dataset.row) === 0) {
								const pulsingCell = document.querySelector('.mobile-pulse');
								if (pulsingCell) {
									pulsingCell.classList.remove('mobile-pulse');
								}

								// Remove event listeners from all boxes
								document.querySelectorAll('.answer-box').forEach(b => {
									b.removeEventListener('click', removePulseOnBoxClick);
								});
							}
						});
					});

					// Focus mobile input
					mobileInput.focus();
				}
			}, 100);
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

		// Use today's puzzle equations
		const equations = todaysPuzzle ? todaysPuzzle.equations : [];

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
		makeEquationsClickable();
	}

	function makeEquationsClickable() {
		// Get all equations
		const equations = document.querySelectorAll('.equation');

		// Add click event to each equation
		equations.forEach((equation, index) => {
			equation.addEventListener('click', function() {
				// Get the equation's LaTeX content
				const latexElement = this.querySelector('.latex');
				if (!latexElement) return;

				// Create modal container
				const modalOverlay = document.createElement('div');
				modalOverlay.className = 'equation-modal-overlay';

				// Create modal content
				const modalContent = document.createElement('div');
				modalContent.className = 'equation-modal-content';

				// Create close button
				const closeButton = document.createElement('button');
				closeButton.className = 'equation-modal-close';
				closeButton.innerHTML = '&times;';
				closeButton.style.color = '#ef4444'; // Red X
				modalContent.appendChild(closeButton);

				// Create equation container 
				const expandedEq = document.createElement('div');
				expandedEq.className = 'expanded-equation';

				// Create LaTeX container
				const expandedLatex = document.createElement('span');
				expandedLatex.className = 'latex';
				expandedEq.appendChild(expandedLatex);

				// Use today's puzzle equations
				const puzzleEquations = todaysPuzzle ? todaysPuzzle.equations : [];

				// During gameplay, only show the equation that's already visible
				if (puzzleEquations && puzzleEquations[index] && puzzleEquations[index].latex) {
					katex.render(puzzleEquations[index].latex, expandedLatex, {
						throwOnError: false,
						displayMode: true
					});
				} else {
					// Fallback if something goes wrong
					katex.render(latexElement.textContent, expandedLatex, {
						throwOnError: false,
						displayMode: true
					});
				}

				modalContent.appendChild(expandedEq);
				modalOverlay.appendChild(modalContent);
				document.body.appendChild(modalOverlay);

				// Close modal when clicking close button
				closeButton.addEventListener('click', function() {
					document.body.removeChild(modalOverlay);
				});

				// Close modal when clicking outside
				modalOverlay.addEventListener('click', function(e) {
					if (e.target === modalOverlay) {
						document.body.removeChild(modalOverlay);
					}
				});
			});
		});
	}

// Handle keyboard input
function handleKeyInput(key) {
    if (isGameComplete || currentGuess >= MAX_GUESSES) return;

    if (key === 'ENTER') {
        // For PC - Check if we have entered all 5 letters
        if (guesses[currentGuess].every(letter => letter !== '')) {
            submitGuess();
            // submitGuess already saves state
        }
    } else if (key === 'BACKSPACE') {
        // Fix for backspace on PC
        // If there's a letter at the current position, delete it
        if (guesses[currentGuess][currentPosition] !== '') {
            guesses[currentGuess][currentPosition] = '';
            updateGuessDisplay();
            saveGameState(); // Save state after deleting
        }
        // Otherwise, move back and delete the previous letter
        else if (currentPosition > 0) {
            currentPosition--;
            guesses[currentGuess][currentPosition] = '';
            updateGuessDisplay();
            saveGameState(); // Save state after deleting
        }
    }  else if (key.length === 1 && key.match(/[A-Z]/i)) {
        // If not at the last box, write letter and advance; if at last, just write letter.
        if (currentPosition < WORD_LENGTH - 1) {
          guesses[currentGuess][currentPosition] = key.toUpperCase();
          updateGuessDisplay();
          currentPosition++;
        } else if (currentPosition === WORD_LENGTH - 1) {
          guesses[currentGuess][currentPosition] = key.toUpperCase();
          updateGuessDisplay();
          // Do not increment currentPosition further.
        }
        saveGameState();
        highlightCurrentCell();
      }
      

    highlightCurrentCell();
}

	function handleEnterKey() {
		if (isGameComplete || currentGuess >= MAX_GUESSES) return;

		// For PC - Check if row is complete
		const currentRowFilled = guesses[currentGuess].every(letter => letter !== '');
		if (currentRowFilled) {
			submitGuess();
		}
	}

	function showEquationExplanations() {
        // Remove existing explanation section if it exists
        const existingExplanation = document.getElementById('explanation-section');
        if (existingExplanation) {
            existingExplanation.remove();
        }
    
        const puzzleData = todaysPuzzle;
        if (!puzzleData) return;
    
        // Create the explanation section container...
        const explanationSection = document.createElement('div');
        explanationSection.id = 'explanation-section';
        explanationSection.className = 'explanation-section';
    
        // Title, subtitle, etc. ...
        const explanationTitle = document.createElement('h3');
        explanationTitle.className = 'explanation-title';
        explanationTitle.textContent = `Today's Solution: ${puzzleData.word}`;
        explanationSection.appendChild(explanationTitle);
    
        const explanationSubtitle = document.createElement('p');
        explanationSubtitle.className = 'explanation-subtitle';
        explanationSubtitle.textContent = 'Here are the physics equations behind each letter:';
        explanationSection.appendChild(explanationSubtitle);
    
        const explanationList = document.createElement('div');
        explanationList.className = 'explanation-list';
    
        // === NEW: Find the final guess row ===
        // If the game ended, the final guess row is currentGuess - 1
        // (whether you won or used all guesses).
        const finalGuessIndex = currentGuess - 1;
        const finalGuessCells = document.querySelectorAll(`.answer-box[data-row="${finalGuessIndex}"]`);
    
        // Loop over each letter/equation
        puzzleData.equations.forEach((eq, index) => {
            // Create a container for each letter’s explanation
            const explanationItem = document.createElement('div');
            explanationItem.className = 'explanation-item';
    
            // Create the colored letter badge
            const letterBadge = document.createElement('div');
            letterBadge.className = 'explanation-letter';
            letterBadge.textContent = eq.letter || puzzleData.word[index]; // Show the letter
    
            // === NEW: Copy color from the final guess cell ===
            // Check if the final guess cell has .correct, .present, or .absent
            if (finalGuessCells[index].classList.contains('correct')) {
                letterBadge.classList.add('correct');
            } else if (finalGuessCells[index].classList.contains('present')) {
                letterBadge.classList.add('present');
            } else {
                // Default to absent
                letterBadge.classList.add('absent');
            }
    
            explanationItem.appendChild(letterBadge);
    
            // Create a container for the equation + explanation text
            const equationContainer = document.createElement('div');
            equationContainer.className = 'explanation-equation';
    
            // Render the LaTeX for the full equation
            const eqSpan = document.createElement('span');
            eqSpan.className = 'latex';
            katex.render(eq.fullEquation, eqSpan, { throwOnError: false, displayMode: false });
            equationContainer.appendChild(eqSpan);
    
            // Explanation text
            const explanationText = document.createElement('div');
            explanationText.className = 'explanation-text';
            explanationText.textContent = eq.explanation;
            equationContainer.appendChild(explanationText);
    
            explanationItem.appendChild(equationContainer);
            explanationList.appendChild(explanationItem);
        });
    
        explanationSection.appendChild(explanationList);
    
        // Finally, add the explanation section after the game board
        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(explanationSection);
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

    function showInvalidGuessFeedback() {
        const rowCells = document.querySelectorAll(`.answer-box[data-row="${currentGuess}"]`);
        rowCells.forEach(cell => cell.classList.add('shake'));
        setTimeout(() => {
          rowCells.forEach(cell => cell.classList.remove('shake'));
        }, 500);
      
        const errorMessage = document.createElement('div');
        errorMessage.className = 'invalid-word-message';
        errorMessage.textContent = 'Not a valid word';
        document.body.appendChild(errorMessage);
        setTimeout(() => {
          errorMessage.style.opacity = '0';
          setTimeout(() => {
            if (errorMessage.parentElement) errorMessage.parentElement.removeChild(errorMessage);
          }, 300);
        }, 1000);
      }

	// Submit the current guess and check against the answer
    function submitGuess() {
        const guess = guesses[currentGuess].join('');
        if (guess.length !== WORD_LENGTH) return;

        if (!validGuesses.includes(guess)) {
            showInvalidGuessFeedback();
            return;
          }
    
        // Apply colors based on correctness
        applyColors();
    
        if (guess === currentWord) {
            // Include the final guess in the count
            currentGuess++;
            isGameComplete = true;
            stopTimer();
            updateStreakOnSolve()
            saveGameState(); // Save state including the last guess
            showSuccessMessage();
        } else if (currentGuess >= MAX_GUESSES - 1) {
            // Include the final guess before marking game complete
            currentGuess++;
            isGameComplete = true;
            stopTimer();
            saveGameState(); // Save state including the last guess
            showFailureMessage();
        } else {
            // Move to next guess
            currentGuess++;
            currentPosition = 0;
            highlightCurrentCell();
            saveGameState();
        }
    }

    function updateKeyboardFromRow(guess, rowCells) {
        // For each letter in the row, determine if it's correct/present/absent
        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            let newStatus = '';
    
            if (rowCells[i].classList.contains('correct')) {
                newStatus = 'correct';
            } else if (rowCells[i].classList.contains('present')) {
                newStatus = 'present';
            } else {
                newStatus = 'absent';
            }
    
            // Check if we already had a status for this letter
            const oldStatus = keyColorState[letter];
    
            // Only "upgrade" if the new status is better
            // Priority: correct > present > absent
            if (!oldStatus) {
                // No status yet, just set it
                keyColorState[letter] = newStatus;
            } else {
                if (oldStatus === 'correct') {
                    // Remain correct
                } else if (oldStatus === 'present' && newStatus === 'correct') {
                    keyColorState[letter] = 'correct';
                } else if (oldStatus === 'absent' && newStatus !== 'absent') {
                    keyColorState[letter] = newStatus;
                }
            }
        }
    
        // Now apply the final color to the keyboard keys
        for (const letter in keyColorState) {
            const keyEl = document.querySelector(`.key[data-key="${letter}"]`);
            if (!keyEl) continue;
    
            // Remove old classes
            keyEl.classList.remove('correct', 'present', 'absent');
            // Add the new one
            keyEl.classList.add(keyColorState[letter]);
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
        updateKeyboardFromRow(guess, rowCells);
	}

    // Apply colors to a specific row (for restoring saved game)
function applyColorsToRow(rowIndex) {
    const guess = guesses[rowIndex];
    const target = currentWord.split('');
    const rowCells = document.querySelectorAll(`.answer-box[data-row="${rowIndex}"]`);
    
    // Map to track which letters have been matched
    const targetLetterCount = {};
    target.forEach(letter => {
        targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
    });
    
    // First pass: mark correct positions (green)
    for (let j = 0; j < WORD_LENGTH; j++) {
        if (guess[j] === target[j]) {
            rowCells[j].classList.add('correct');
            targetLetterCount[guess[j]]--;
        }
    }
    
    // Second pass: mark other positions
    for (let j = 0; j < WORD_LENGTH; j++) {
        if (guess[j] !== target[j]) {
            if (targetLetterCount[guess[j]] > 0) {
                rowCells[j].classList.add('present');
                targetLetterCount[guess[j]]--;
            } else {
                rowCells[j].classList.add('absent');
            }
        }
    }
    updateKeyboardFromRow(guess, rowCells);
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
                <p style="color: var(--text-color);">You solved today's Physicle in ${currentGuess}/${MAX_GUESSES} guesses!</p>
                <p style="color: var(--text-color);">Time: ${timerElement.textContent}</p>
                <p style="color: var(--light-text); margin-top: 8px; font-style: italic;">Close this message to see the full equations and explanations below.</p>
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
				// Show explanation section when dialog is closed
				showEquationExplanations();
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
                <p style="color: var(--light-text); margin-top: 8px; font-style: italic;">Close this message to discover the physics behind today's puzzle below.</p>
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
				// Show explanation section when dialog is closed
				showEquationExplanations();
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
async function startGame() {
    // Hide start button and show game board
    startButton.style.display = 'none';
    gameBoard.style.display = 'block';

    // Reset game state
    currentGuess = 0;
    currentPosition = 0;
    isGameComplete = false;

    // Make sure the puzzle is loaded before starting
    if (!todaysPuzzle) {
        await updateDateDisplay();
    }

    // Initialize game
    createAnswerGrid();
    createEquations();
    startTimer();
    
    saveGameState();
}

	// Add event listeners
	startButton.addEventListener('click', () => {
		startGame().catch(error => {
			console.error('Error starting game:', error);
			alert('There was an error starting the game. Please try refreshing the page.');
		});
	});

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
			e.preventDefault(); // Prevent browser back
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

	// Initialize date display and load puzzle
	updateDateDisplay().catch(error => {
		console.error('Error initializing date display:', error);
	});

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

    function getStreakData() {
        const data = localStorage.getItem('physicle_streak');
        if (data) {
            return JSON.parse(data);
        } else {
            return {
                streak: 0,
                bestStreak: 0,
                lastSolvedDate: null
            };
        }
    }
    
    function saveStreakData(streakData) {
        localStorage.setItem('physicle_streak', JSON.stringify(streakData));
    }
    
    function updateStreakOnSolve() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;
    
        let streakData = getStreakData();
    
        if (!streakData.lastSolvedDate) {
            // First time solving
            streakData.streak = 1;
            streakData.bestStreak = 1;
        } else {
            // Compare with last solved date
            const last = new Date(streakData.lastSolvedDate);
            const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    
            if (diff === 1) {
                // Solved 1 day after last solve => increment streak
                streakData.streak++;
                if (streakData.streak > streakData.bestStreak) {
                    streakData.bestStreak = streakData.streak;
                }
            } else if (diff === 0) {
                // Same day solve => do nothing (they already solved today)
                // This shouldn't be possible in normal mode
            } else {
                // Missed a day or more => reset streak
                streakData.streak = 1;
                if (streakData.bestStreak < 1) {
                    streakData.bestStreak = 1;
                }
            }
        }
    
        // Update last solved date
        streakData.lastSolvedDate = todayString;
    
        saveStreakData(streakData);
    
        updateStreakUI();
    }
    
    function updateStreakUI() {
        const streakData = getStreakData();
        const streakDisplay = document.getElementById('streak-display');
        if (!streakDisplay) return;
    
         streakDisplay.textContent = `Streak: ${streakData.streak} | Best: ${streakData.bestStreak}`;
    }
    

    updateStreakUI();

});

