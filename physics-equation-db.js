/**
 * Physics Equation Database
 * 
 * This file contains a database of physics equations for each letter of the alphabet,
 * used for automatically generating Physicle puzzles.
 */

const physicsEquations = {
    'A': [
        {
            latex: '\\frac{dv}{dt}',
            fullEquation: 'a = \\frac{dv}{dt}',
            explanation: "Rate of change of velocity is acceleration"
        },
        {
            latex: '\\frac{F}{m}',
            fullEquation: 'a = \\frac{F}{m}',
            explanation: "From Newton's second law F = m a"
        },
        {
            latex: '\\frac{d\\omega}{dt}',
            fullEquation: '\\alpha = \\frac{d\\omega}{dt}',
            explanation: "Angular acceleration (rate of change of angular velocity)"
        },
        {
            latex: '\\frac{e^2}{4\\pi \\epsilon_0 \\hbar c}',
            fullEquation: '\\alpha = \\frac{e^2}{4\\pi \\epsilon_0 \\hbar c}',
            explanation: "Fine-structure constant (dimensionless fundamental constant)"
        },
        {
            latex: '\\frac{v^2}{r}',
            fullEquation: 'a_c = \\frac{v^2}{r}',
            explanation: "Formula for centripetal acceleration"
        }
    ],
    'B': [
        {
            latex: '\\frac{\\mu_0 I}{4\\pi} \\oint \\frac{d\\vec{l} \\times \\vec{r}}{r^2}',
            fullEquation: '\\vec{B} = \\frac{\\mu_0 I}{4\\pi} \\oint \\frac{d\\vec{l} \\times \\vec{r}}{r^2}',
            explanation: "Biot-Savart Law for the magnetic field from a current"
        },
        {
            latex: '2.90 \\times10^{-3} \\text{m} \\cdot \\text{K}',
            fullEquation: 'b = 2.90 \\times10^{-3} \\text{m} \\cdot \\text{K}',
            explanation: "Wien's constant, used to relate the temperature of a black body to the wavelength of its radiation"
        },
        {
            latex: '\\frac{\\mu_0 I}{2 \\pi r}',
            fullEquation: 'B = \\frac{\\mu_0 I}{2 \\pi r}',
            explanation: "The magnetic field of an infinitely long straight wire"
        }
    ],
    'C': [
        {
            latex: '3.00\\times10^8~\\text{m/s}',
            fullEquation: 'c = 3.00\\times10^8~\\text{m/s}',
            explanation: "Speed of light in vacuum (universal constant)"
        },
        {
            latex: '\\frac{q}{V}',
            fullEquation: 'C = \\frac{q}{V}',
            explanation: "Definition of capacitance (charge per potential difference)"
        },
        {
            latex: '\\kappa \\epsilon_0 \\frac{A}{d}',
            fullEquation: 'C = \\kappa \\epsilon_0 \\frac{A}{d}',
            explanation: "Capacitance of a Parallel Plate Capacitor"
        }
    ],
    'D': [
        {
            latex: 'v t',
            fullEquation: 'd = v t',
            explanation: "Distance traveled at constant velocity v for time t"
        },
        {
            latex: 'b^2 - 4 a c',
            fullEquation: 'D = b^2 - 4 a c',
            explanation: "Discriminant of a quadratic equation ax^2 + bx + c = 0"
        },
        {
            latex: 'ad - bc',
            fullEquation: 'D = \\det \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} = ad - bc',
            explanation: "Determinant of a 2 × 2 matrix"
        }
    ],
    'E': [
        {
            latex: 'm c^2',
            fullEquation: 'E = m c^2',
            explanation: "Mass–energy equivalence from special relativity (Einstein's famous equation)"
        },
        {
            latex: 'hf',
            fullEquation: 'E = hf',
            explanation: "Energy of a photon with frequency f (Planck–Einstein relation)"
        },
        {
            latex: '-\\frac{13.6~\\text{eV}}{n^2}',
            fullEquation: 'E_n = -\\frac{13.6~\\text{eV}}{n^2}',
            explanation: "Energy levels of the hydrogen atom (Bohr model)"
        },
        {
            latex: '\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n',
            fullEquation: 'e = \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n',
            explanation: "Definition of e as the limit of a sequence"
        },
        {
            latex: '\\sum_{n=0}^{\\infty} \\frac{1}{n!}',
            fullEquation: 'e = \\sum_{n=0}^{\\infty} \\frac{1}{n!}',
            explanation: "Series expansion for e"
        },
        {
            latex: '1.602 \\times 10^{-19}~\\text{C}',
            fullEquation: 'e = 1.602 \\times 10^{-19}~\\text{C}',
            explanation: "Elementary charge (charge of a proton/electron)"
        }
    ],
    'F': [
        {
            latex: 'm a',
            fullEquation: 'F = m a',
            explanation: "Newton's second law (force equals mass times acceleration)"
        },
        {
            latex: 'G \\frac{m_1 m_2}{r^2}',
            fullEquation: 'F = G \\frac{m_1 m_2}{r^2}',
            explanation: "Newton's law of universal gravitation (force between two masses)"
        },
        {
            latex: 'q(\\vec{E} + \\vec{v} \\times \\vec{B})',
            fullEquation: '\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})',
            explanation: "Lorentz force on a charge moving in electric and magnetic fields"
        },
        {
            latex: 'N_A c',
            fullEquation: 'F = N_A c',
            explanation: "Faraday constant, which describes how much charge there is in one mol of electrons"
        }
    ],
    'G': [
        {
            latex: '\\frac{G M}{r^2}',
            fullEquation: 'g = \\frac{G M}{r^2}',
            explanation: "Gravitational field (acceleration due to gravity at distance r from mass M)"
        },
        {
            latex: '\\Delta H^{\\circ} - T \\Delta S^{\\circ}',
            fullEquation: '\\Delta G^{\\circ} = \\Delta H^{\\circ} - T \\Delta S^{\\circ}',
            explanation: "Change in Gibbs Free Energy"
        },
        {
            latex: '6.674 \\times 10^{-11} Nm^2/kg^2',
            fullEquation: 'G = 6.674 \\times 10^{-11} Nm^2/kg^2',
            explanation: "Gravitational constant"
        }
    ],
    'H': [
        {
            latex: '6.626 \\times 10^{-34}~\\text{J s}',
            fullEquation: 'h = 6.626 \\times 10^{-34}~\\text{J s}',
            explanation: "Planck's constant, fundamental in quantum mechanics"
        },
        {
            latex: '\\begin{bmatrix} \\frac{\\partial^2 f}{\\partial x^2} & \\frac{\\partial^2 f}{\\partial x \\partial y} \\\\ \\frac{\\partial^2 f}{\\partial y \\partial x} & \\frac{\\partial^2 f}{\\partial y^2} \\end{bmatrix}',
            fullEquation: 'H = \\begin{bmatrix} \\frac{\\partial^2 f}{\\partial x^2} & \\frac{\\partial^2 f}{\\partial x \\partial y} \\\\ \\frac{\\partial^2 f}{\\partial y \\partial x} & \\frac{\\partial^2 f}{\\partial y^2} \\end{bmatrix}',
            explanation: "Hessian matrix for a function of two variables f(x,y)"
        }
    ],
    'I': [
        {
            latex: '\\frac{Q}{t}',
            fullEquation: 'I = \\frac{Q}{t}',
            explanation: "Electric current as charge flow per unit time"
        },
        {
            latex: '\\int r^2\\,dm',
            fullEquation: 'I = \\int r^2\\,dm',
            explanation: "Moment of inertia formula"
        },
        {
            latex: '\\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}',
            fullEquation: 'I = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}',
            explanation: "Identity matrix (3 × 3), fundamental in linear algebra"
        }
    ],
    'J': [
        {
            latex: '\\int \\textbf{F}\\,dt',
            fullEquation: '\\vec{J} = \\int \\textbf{F}\\,dt',
            explanation: "One of the definitions for Impulse"
        },
        {
            latex: '\\begin{bmatrix} \\frac{\\partial x}{\\partial u} & \\frac{\\partial x}{\\partial v} \\\\ \\frac{\\partial y}{\\partial u} & \\frac{\\partial y}{\\partial v} \\end{bmatrix}',
            fullEquation: 'J = \\begin{bmatrix} \\frac{\\partial x}{\\partial u} & \\frac{\\partial x}{\\partial v} \\\\ \\frac{\\partial y}{\\partial u} & \\frac{\\partial y}{\\partial v} \\end{bmatrix}',
            explanation: "Formula for the Jacobian matrix"
        },
        {
            latex: '-D \\frac{d\\phi}{dx}',
            fullEquation: 'J = -D \\frac{d\\phi}{dx}',
            explanation: "Fick's First Law of Diffusion"
        }
    ],
    'K': [
        {
            latex: '\\frac{1}{2} m v^2',
            fullEquation: 'K = \\frac{1}{2} m v^2',
            explanation: "Kinetic energy of an object in motion"
        },
        {
            latex: '1.38\\times10^{-23}~\\text{J/K}',
            fullEquation: 'k_B = 1.38\\times10^{-23}~\\text{J/K}',
            explanation: "Boltzmann's constant (relates temperature to energy)"
        },
        {
            latex: '\\frac{2\\pi}{\\lambda}',
            fullEquation: 'k = \\frac{2\\pi}{\\lambda}',
            explanation: "Wave number k (spatial frequency) for a wave of wavelength λ"
        },
        {
            latex: '\\frac{1}{4\\pi \\epsilon_0}',
            fullEquation: 'k = \\frac{1}{4\\pi \\epsilon_0}',
            explanation: "Coulomb constant"
        }
    ],
    'L': [
        {
            latex: '\\vec{r} \\times \\vec{p}',
            fullEquation: '\\vec{L} = \\vec{r} \\times \\vec{p}',
            explanation: "Angular momentum L is the cross product of position and momentum"
        },
        {
            latex: 'L_0 \\sqrt{1 - \\frac{v^2}{c^2}}',
            fullEquation: 'L = L_0 \\sqrt{1 - \\frac{v^2}{c^2}}',
            explanation: "Length contraction (moving object's length L is shorter by this factor)"
        },
        {
            latex: '\\int_{0}^{\\infty} e^{-st} f(t) \\, dt',
            fullEquation: '\\mathcal{L}\\{f(t)\\} = \\int_{0}^{\\infty} e^{-st} f(t) \\, dt',
            explanation: "Definition of the Laplace Transform of a function"
        }
    ],
    'M': [
        {
            latex: '\\frac{F}{a}',
            fullEquation: 'M = \\frac{F}{a}',
            explanation: "Mass equation derived from Newton's second law F = ma"
        }
    ],
    'N': [
        {
            latex: '6.022 \\times 10^{23}~\\text{mol}^{-1}',
            fullEquation: 'N_A = 6.022 \\times 10^{23}~\\text{mol}^{-1}',
            explanation: "Avogadro's number"
        },
        {
            latex: '\\text{rank}(A) + \\text{nullity}(A)',
            fullEquation: 'n = \\text{rank}(A) + \\text{nullity}(A)',
            explanation: "Rank-Nullity Theorem"
        }
    ],
    'O': [
        {
            latex: '\\omega r',
            fullEquation: 'v = \\omega r',
            explanation: "Orbital velocity relationship"
        }
    ],
    'P': [
        {
            latex: 'm v',
            fullEquation: 'p = m v',
            explanation: "Momentum defined as mass times velocity"
        },
        {
            latex: 'P V',
            fullEquation: 'P V = n R T',
            explanation: "Ideal gas law relating pressure P, volume V, and temperature T"
        },
        {
            latex: 'I V',
            fullEquation: 'P = I V',
            explanation: "Electric power as current I times voltage V"
        },
        {
            latex: '\\frac{dW}{dt}',
            fullEquation: 'P = \\frac{dW}{dt}',
            explanation: "Formula for power as the amount of energy transferred per unit time"
        },
        {
            latex: '\\tau \\omega \\cos \\theta',
            fullEquation: 'P = \\tau \\omega \\cos \\theta',
            explanation: "Rotational power equation, where torque τ and angular velocity ω contribute to power depending on angle θ"
        }
    ],
    'Q': [
        {
            latex: '\\int_{t_i}^{t_f} I \\, dt',
            fullEquation: 'q = \\int_{t_i}^{t_f} I \\, dt',
            explanation: "The total electric charge transferred over a time"
        },
        {
            latex: 'm c \\Delta T',
            fullEquation: 'Q = m c \\Delta T',
            explanation: "Heat Q gained or lost by mass m with specific heat c for temperature change ΔT"
        },
        {
            latex: '\\epsilon_0\\oint \\vec{E} \\cdot d\\vec{A}',
            fullEquation: '\\epsilon_0\\oint \\vec{E} \\cdot d\\vec{A} = Q_{\\text{enc}}',
            explanation: "Gauss's law (electric flux through closed surface equals enclosed charge over ε₀)"
        }
    ],
    'R': [
        {
            latex: '\\frac{V}{I}',
            fullEquation: 'R = \\frac{V}{I}',
            explanation: "Ohm's law (resistance R as voltage over current)"
        },
        {
            latex: '\\frac{\\rho \\ell}{A}',
            fullEquation: 'R = \\frac{\\rho \\ell}{A}',
            explanation: "Resistance of a conductor with a uniform cross-sectional area"
        },
        {
            latex: '8.314~\\text{J/(mol K)}',
            fullEquation: 'R = 8.314~\\text{J/(mol K)}',
            explanation: "Universal gas constant"
        },
        {
            latex: '\\frac{\\alpha^2 m_e c^2}{2h}',
            fullEquation: 'R_\\infty = \\frac{\\alpha^2 m_e c^2}{2h}',
            explanation: "Rydberg constant, used when concerning the electromagnetic spectra of an atom"
        }
    ],
    'S': [
        {
            latex: 'k_B \\ln \\Omega',
            fullEquation: 'S = k_B \\ln \\Omega',
            explanation: "Boltzmann's entropy formula (S entropy, Ω number of microstates)"
        },
        {
            latex: '\\int \\left(\\frac{1}{2} m v^2 - mgx \\right) dt',
            fullEquation: 'S = \\int_{t_1}^{t_2} \\left(\\frac{1}{2} m v^2(t) - mgx(t) \\right) dt',
            explanation: "Action integral in classical mechanics"
        }
    ],
    'T': [
        {
            latex: 'I \\alpha',
            fullEquation: '\\tau = I \\alpha',
            explanation: "Rotational analogue of F = m a (torque τ = moment of inertia I × angular accel. α)"
        },
        {
            latex: '2\\pi \\sqrt{\\frac{L}{g}}',
            fullEquation: 'T = 2\\pi \\sqrt{\\frac{L}{g}}',
            explanation: "Period T of a simple pendulum of length L"
        },
        {
            latex: 'R C',
            fullEquation: '\\tau = R C',
            explanation: "Time constant τ of an RC circuit (R = resistance, C = capacitance)"
        },
        {
            latex: '\\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}',
            fullEquation: '\\Delta t\' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}',
            explanation: "Time dilation (moving clocks tick slower by factor √(1 - v²/c²))"
        },
        {
            latex: '2\\pi \\sqrt{\\frac{m}{k}}',
            fullEquation: 'T = 2\\pi \\sqrt{\\frac{m}{k}}',
            explanation: "Period T of a mass-spring system"
        }
    ],
    'U': [
        {
            latex: 'm g h',
            fullEquation: 'U = m g h',
            explanation: "Gravitational potential energy near Earth's surface"
        }
    ],
    'V': [
        {
            latex: '\\frac{W}{q}',
            fullEquation: 'V = \\frac{W}{q}',
            explanation: "Electric potential V as work per unit charge"
        },
        {
            latex: '\\frac{1}{4\\pi \\epsilon_0}\\frac{q}{r}',
            fullEquation: 'V = \\frac{1}{4\\pi \\epsilon_0}\\frac{q}{r}',
            explanation: "Electric potential due to a point charge at distance r"
        }
    ],
    'W': [
        {
            latex: 'F d \\cos\\theta',
            fullEquation: 'W = F d \\cos\\theta',
            explanation: "Work done by a force F over displacement d at angle θ"
        },
        {
            latex: '\\int_{x_i}^{x_f} F(x) \\, dx',
            fullEquation: 'W = \\int_{x_i}^{x_f} F(x) \\, dx',
            explanation: "Definition of Work"
        }
    ],
    'X': [
        {
            latex: '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
            fullEquation: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
            explanation: "Quadratic formula"
        },
        {
            latex: '\\frac{d}{dx}\\left( \\frac{1}{2}x^2 \\right)',
            fullEquation: 'x = \\frac{d}{dx}\\left( \\frac{1}{2}x^2 \\right)',
            explanation: "Derivative using power rule"
        }
    ],
    'Y': [
        {
            latex: '\\frac{1}{Z}',
            fullEquation: 'Y = \\frac{1}{Z}',
            explanation: "Electrical admittance (Y) as reciprocal of impedance Z"
        },
        {
            latex: 'A \\sin(kx - \\omega t)',
            fullEquation: 'y = A \\sin(kx - \\omega t)',
            explanation: "Solution to the one-dimensional wave equation"
        }
    ],
    'Z': [
        {
            latex: '\\sum e^{-E/(k_B T)}',
            fullEquation: 'Z = \\sum_{i} e^{-E_i/(k_B T)}',
            explanation: "Partition function Z (sum of e^(-E/(k_B T)) over states)"
        },
        {
            latex: '\\sqrt{R^2 + (X_L - X_C)^2}',
            fullEquation: 'Z = \\sqrt{R^2 + (X_L - X_C)^2}',
            explanation: "Impedance magnitude in an RLC circuit"
        },
        {
            latex: '\\sqrt{\\frac{\\mu_0}{\\epsilon_0}}',
            fullEquation: 'Z_0 = \\sqrt{\\frac{\\mu_0}{\\epsilon_0}}',
            explanation: "Impedance of free space"
        }
    ]
};

// Export the database
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { physicsEquations };
}

// Export the database for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { physicsEquations };
}

window.physicsEquations = physicsEquations;