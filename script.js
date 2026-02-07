// ==================== //
// Valentine's Week App //
// ==================== //

// Valentine's Week Dates (2026)
const VALENTINE_WEEK = {
    rose: new Date('2026-02-07'),
    propose: new Date('2026-02-08'),
    chocolate: new Date('2026-02-09'),
    teddy: new Date('2026-02-10'),
    promise: new Date('2026-02-11'),
    hug: new Date('2026-02-12'),
    kiss: new Date('2026-02-13'),
    valentine: new Date('2026-02-14')
};

// Game State
let gameState = {
    completedDays: [],
    progress: 0,
    roseCount: 0,
    chocolateMatches: 0,
    hugCount: 0,
    kissScore: 0,
    promises: []
};

// Load saved state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('valentineWeekState');
    if (saved) {
        gameState = { ...gameState, ...JSON.parse(saved) };
    }
}

// Save state to localStorage
function saveGameState() {
    localStorage.setItem('valentineWeekState', JSON.stringify(gameState));
}

// ==================== //
// Initialization //
// ==================== //

document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    createFloatingHearts();
    checkUnlockStatus();
    updateProgress();
    updateCountdown();
    initializeDayCards();

    // Update countdown every minute
    setInterval(updateCountdown, 60000);
});

// Create floating hearts background
function createFloatingHearts() {
    const heartsBg = document.getElementById('heartsBg');
    const heartEmojis = ['💕', '💖', '💗', '💝', '💘', '❤️', '💓'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 8 + 's';
        heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
        heartsBg.appendChild(heart);
    }
}

// Check which days should be unlocked
function checkUnlockStatus() {
    const now = new Date();

    // Check for test mode in URL (e.g., ?test=true)
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.get('test') === 'true';

    if (isTestMode) {
        console.log('🧪 TEST MODE ENABLED - All days unlocked!');
        document.getElementById('countdownText').textContent = '🧪 Test Mode Active';
        document.getElementById('countdownText').style.background = 'rgba(255, 165, 0, 0.2)';
    }

    Object.keys(VALENTINE_WEEK).forEach(day => {
        const dayCard = document.getElementById(`day-${day}`);
        const dayDate = VALENTINE_WEEK[day];

        // Unlock if current date is on or after the day's date OR if in test mode
        if (now >= dayDate || isTestMode) {
            unlockDay(dayCard, day);
        }
    });
}

// Unlock a specific day
function unlockDay(dayCard, dayName) {
    dayCard.classList.remove('locked');
    dayCard.classList.add('unlocked');

    const button = dayCard.querySelector('.day-button');
    button.textContent = 'Open';
    button.disabled = false;

    button.addEventListener('click', () => openDayModal(dayName));
}

// Update progress bar
function updateProgress() {
    const totalDays = 8;
    const completed = gameState.completedDays.length;
    const percentage = (completed / totalDays) * 100;

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    progressBar.style.setProperty('--progress-width', percentage + '%');
    progressText.textContent = `${completed} / ${totalDays} Days Completed`;
}

// Update countdown to next unlock
function updateCountdown() {
    const now = new Date();
    const countdownText = document.getElementById('countdownText');

    // Find next unlockable day
    let nextDay = null;
    let nextDayName = '';

    for (const [day, date] of Object.entries(VALENTINE_WEEK)) {
        if (now < date) {
            if (!nextDay || date < nextDay) {
                nextDay = date;
                nextDayName = day;
            }
        }
    }

    if (nextDay) {
        const diff = nextDay - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            countdownText.textContent = `Next unlock in ${days}d ${hours}h`;
        } else if (hours > 0) {
            countdownText.textContent = `Next unlock in ${hours}h ${minutes}m`;
        } else {
            countdownText.textContent = `Next unlock in ${minutes}m`;
        }
    } else {
        countdownText.textContent = 'All days unlocked! 💝';
    }
}

// Initialize day cards
function initializeDayCards() {
    // Mark completed days
    gameState.completedDays.forEach(day => {
        const dayCard = document.getElementById(`day-${day}`);
        if (dayCard) {
            dayCard.classList.add('completed');
        }
    });
}

// ==================== //
// Modal System //
// ==================== //

function openDayModal(dayName) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');

    // Clear previous content
    modalBody.innerHTML = '';

    // Load appropriate game/content
    switch (dayName) {
        case 'rose':
            loadRoseDay(modalBody);
            break;
        case 'propose':
            loadProposeDay(modalBody);
            break;
        case 'chocolate':
            loadChocolateDay(modalBody);
            break;
        case 'teddy':
            loadTeddyDay(modalBody);
            break;
        case 'promise':
            loadPromiseDay(modalBody);
            break;
        case 'hug':
            loadHugDay(modalBody);
            break;
        case 'kiss':
            loadKissDay(modalBody);
            break;
        case 'valentine':
            loadValentineDay(modalBody);
            break;
    }

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

// Modal close button
document.getElementById('modalClose').addEventListener('click', closeModal);

// Close on outside click
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});

// Mark day as completed
function completeDay(dayName) {
    if (!gameState.completedDays.includes(dayName)) {
        gameState.completedDays.push(dayName);
        saveGameState();
        updateProgress();

        const dayCard = document.getElementById(`day-${dayName}`);
        if (dayCard) {
            dayCard.classList.add('completed');
        }

        createConfetti();
    }
}

// ==================== //
// Rose Day Game //
// ==================== //

function loadRoseDay(container) {
    container.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">🌹 Rose Day 🌹</h2>
            <p class="game-instructions">Click on the roses to collect them and create a beautiful bouquet for Miku!</p>
            <div class="game-score">Roses Collected: <span id="roseCount">0</span> / 12</div>
            <div class="rose-garden" id="roseGarden"></div>
            <div class="game-message" id="roseMessage" style="display: none;"></div>
        </div>
    `;

    const roseGarden = document.getElementById('roseGarden');
    const roseCountEl = document.getElementById('roseCount');
    const roseMessage = document.getElementById('roseMessage');
    let collected = 0;
    const totalRoses = 12;

    // Create roses
    for (let i = 0; i < totalRoses; i++) {
        const rose = document.createElement('div');
        rose.className = 'rose';
        rose.textContent = '🌹';
        rose.addEventListener('click', () => {
            if (!rose.classList.contains('collected')) {
                rose.classList.add('collected');
                collected++;
                roseCountEl.textContent = collected;

                if (collected === totalRoses) {
                    setTimeout(() => {
                        roseMessage.style.display = 'block';
                        roseMessage.innerHTML = `
                            <h3>💐 Beautiful Bouquet Complete! 💐</h3>
                            <div style="font-size: 2.5rem; margin: 1.5rem 0; line-height: 1.2;">
                                🌹🌹🌹<br>
                                🌹🌹🌹🌹🌹<br>
                                🌹🌹🌹🌹🌹🌹🌹<br>
                                🌹🌹🌹🌹🌹🌹🌹🌹🌹
                            </div>
                            <div style="font-family: 'Pacifico', cursive; font-size: 1.8rem; background: linear-gradient(135deg, #ff4d8f 0%, #b565d8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 1rem 0;">
                                For Prachiti 💕
                            </div>
                            <p style="margin-top: 1rem;">Just like these roses, my love for you blooms brighter every day! 🌹✨</p>
                        `;
                        completeDay('rose');
                    }, 500);
                }
            }
        });
        roseGarden.appendChild(rose);
    }
}

// ==================== //
// Propose Day Game //
// ==================== //

function loadProposeDay(container) {
    container.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">💍 Propose Day 💍</h2>
            <p class="game-instructions">Prachiti, I have a very important question for you...</p>
            <div class="proposal-container" id="proposalContainer">
                <h3 class="proposal-question">Will you be mine forever? 💕</h3>
                <div class="proposal-buttons" id="proposalButtons">
                    <button class="proposal-btn yes-btn" id="yesBtn">YES! 💖</button>
                    <button class="proposal-btn no-btn" id="noBtn">No</button>
                </div>
            </div>
            <div class="game-message" id="proposeMessage" style="display: none;"></div>
        </div>
    `;

    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const proposalButtons = document.getElementById('proposalButtons');
    const proposeMessage = document.getElementById('proposeMessage');
    const proposalQuestion = document.querySelector('.proposal-question');

    let noClickCount = 0;
    let yesBtnSize = 1;

    // YES button click - The happy ending!
    yesBtn.addEventListener('click', () => {
        proposalButtons.style.display = 'none';
        proposalQuestion.style.display = 'none';
        proposeMessage.style.display = 'block';
        proposeMessage.innerHTML = `
            <h3>💍 She Said YES! 💍</h3>
            <div style="font-size: 4rem; margin: 2rem 0;">
                💖💖💖<br>
                💍✨💕✨💍<br>
                💖💖💖
            </div>
            <p style="font-size: 1.2rem; line-height: 1.8;">
                Prachiti, you've made me the happiest person in the world!<br>
                I promise to love you more each day! 💕
            </p>
        `;
        completeDay('propose');
        createHeartExplosion();
    });

    // NO button hover - runs away!
    noBtn.addEventListener('mouseenter', () => {
        moveNoButton();
        shrinkNoButton();
        growYesButton();
    });

    // NO button click - also runs away with a message!
    noBtn.addEventListener('click', () => {
        noClickCount++;
        moveNoButton();
        shrinkNoButton();
        growYesButton();

        // Change the question to be more persuasive
        const messages = [
            "Are you sure? 🥺",
            "Please? I promise to make you happy! 💕",
            "Think about it... Just click YES! 💖",
            "The YES button is looking pretty good, right? 😊",
            "Come on, you know you want to say YES! 💝"
        ];

        if (noClickCount <= messages.length) {
            proposalQuestion.textContent = messages[noClickCount - 1];
        }
    });

    function moveNoButton() {
        const containerRect = proposalButtons.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();

        // Calculate random position within container
        const maxX = containerRect.width - btnRect.width - 20;
        const maxY = 100; // Keep it in a reasonable vertical range

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY - 50;

        noBtn.style.position = 'relative';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        noBtn.style.transition = 'all 0.3s ease';
    }

    function shrinkNoButton() {
        noClickCount++;
        const newSize = Math.max(0.3, 1 - (noClickCount * 0.1));
        noBtn.style.transform = `scale(${newSize})`;

        // Make it disappear after many attempts
        if (noClickCount > 8) {
            noBtn.style.opacity = '0';
            noBtn.style.pointerEvents = 'none';
            proposalQuestion.textContent = "There's only one answer now! 💕";
        }
    }

    function growYesButton() {
        yesBtnSize += 0.1;
        yesBtn.style.transform = `scale(${yesBtnSize})`;
    }
}

// ==================== //
// Chocolate Day Game //
// ==================== //

function loadChocolateDay(container) {
    container.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">🍫 Chocolate Day 🍫</h2>
            <p class="game-instructions">Find all the matching chocolate pairs!</p>
            <div class="game-score">Matches: <span id="matchCount">0</span> / 6</div>
            <div class="memory-grid" id="memoryGrid"></div>
            <div class="game-message" id="chocolateMessage" style="display: none;"></div>
        </div>
    `;

    const memoryGrid = document.getElementById('memoryGrid');
    const matchCountEl = document.getElementById('matchCount');
    const chocolateMessage = document.getElementById('chocolateMessage');

    const chocolates = ['🍫', '🍬', '🍭', '🍩', '🍪', '🧁'];
    const cards = [...chocolates, ...chocolates].sort(() => Math.random() - 0.5);

    let firstCard = null;
    let secondCard = null;
    let matches = 0;
    let canFlip = true;

    cards.forEach((chocolate, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.chocolate = chocolate;
        card.dataset.index = index;

        card.addEventListener('click', () => {
            if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;

            card.classList.add('flipped');
            card.textContent = chocolate;

            if (!firstCard) {
                firstCard = card;
            } else {
                secondCard = card;
                canFlip = false;

                if (firstCard.dataset.chocolate === secondCard.dataset.chocolate) {
                    // Match found!
                    firstCard.classList.add('matched');
                    secondCard.classList.add('matched');
                    matches++;
                    matchCountEl.textContent = matches;

                    firstCard = null;
                    secondCard = null;
                    canFlip = true;

                    if (matches === chocolates.length) {
                        setTimeout(() => {
                            chocolateMessage.style.display = 'block';
                            chocolateMessage.innerHTML = `
                                <h3>🍫 Sweet Success! 🍫</h3>
                                <p>You found all the matches! Life with you is sweeter than the finest chocolate, Miku! 💝</p>
                            `;
                            completeDay('chocolate');
                        }, 500);
                    }
                } else {
                    // No match
                    setTimeout(() => {
                        firstCard.classList.remove('flipped');
                        secondCard.classList.remove('flipped');
                        firstCard.textContent = '';
                        secondCard.textContent = '';
                        firstCard = null;
                        secondCard = null;
                        canFlip = true;
                    }, 1000);
                }
            }
        });

        memoryGrid.appendChild(card);
    });
}

// ==================== //
// Teddy Day Game //
// ==================== //

function loadTeddyDay(container) {
    container.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">🧸 Teddy Day 🧸</h2>
            <p class="game-instructions">Customize this teddy bear with love!</p>
            <div class="teddy-wrapper" id="teddyWrapper">
                <div class="teddy-display">🧸</div>
                <div class="teddy-accessories-overlay" id="teddyAccessoriesOverlay"></div>
            </div>
            <div class="teddy-accessories">
                <button class="accessory-btn" data-accessory="🎀" data-position="neck">Add Bow</button>
                <button class="accessory-btn" data-accessory="💝" data-position="center">Add Heart</button>
                <button class="accessory-btn" data-accessory="👑" data-position="top">Add Crown</button>
                <button class="accessory-btn" data-accessory="🌹" data-position="right">Add Rose</button>
                <button class="accessory-btn" data-accessory="✨" data-position="random">Add Sparkle</button>
            </div>
            <button class="btn-primary" id="saveTeddy" style="margin-top: 2rem;">Save My Teddy</button>
            <div class="game-message" id="teddyMessage" style="display: none;"></div>
        </div>
    `;

    const teddyOverlay = document.getElementById('teddyAccessoriesOverlay');
    const accessoryBtns = container.querySelectorAll('.accessory-btn');
    const saveTeddyBtn = document.getElementById('saveTeddy');
    const teddyMessage = document.getElementById('teddyMessage');

    let accessoryCount = 0;

    accessoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const accessory = btn.dataset.accessory;
            const position = btn.dataset.position;

            // Create accessory element
            const accessoryEl = document.createElement('div');
            accessoryEl.className = 'teddy-accessory';
            accessoryEl.textContent = accessory;

            // Position based on type
            const positions = getAccessoryPosition(position, accessoryCount);
            accessoryEl.style.left = positions.left;
            accessoryEl.style.top = positions.top;

            // Add with animation
            accessoryEl.style.opacity = '0';
            accessoryEl.style.transform = 'translate(-50%, -50%) scale(0)';
            teddyOverlay.appendChild(accessoryEl);

            setTimeout(() => {
                accessoryEl.style.opacity = '1';
                accessoryEl.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 50);

            accessoryCount++;
        });
    });

    function getAccessoryPosition(type, count) {
        // Precise positions on the 160x160 teddy canvas
        const positions = {
            top: {  // Crown - sits on head
                left: '50%',
                top: '-5%'
            },
            neck: { // Bow - sits at neck
                left: '50%',
                top: '40%'
            },
            center: {  // Heart - Center Chest/Belly
                left: '50%',
                top: '60%'
            },
            right: {  // Rose - Right Hand
                left: '80%',
                top: '60%'
            },
            random: {  // Sparkles
                left: (20 + (Math.random() * 60)) + '%',
                top: (20 + (Math.random() * 60)) + '%'
            }
        };

        return positions[type] || positions.center;
    }

    saveTeddyBtn.addEventListener('click', () => {
        teddyMessage.style.display = 'block';
        teddyMessage.innerHTML = `
            <h3>🧸 Adorable Teddy Created! 🧸</h3>
            <p>This teddy represents all the comfort and warmth you bring to my life, Prachiti! 💕</p>
        `;
        completeDay('teddy');
    });
}

// ==================== //
// Promise Day Game //
// ==================== //

function loadPromiseDay(container) {
    container.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">🤝 Promise Day 🤝</h2>
            <p class="game-instructions">Add promises to our growing tree of love!</p>
            <div class="promise-tree">🌳</div>
            <div class="promise-input-container">
                <input type="text" class="promise-input" id="promiseInput" placeholder="Enter a promise..." maxlength="80">
                <button class="btn-primary" id="addPromise">Add 🍃</button>
            </div>
            <ul class="promise-list" id="promiseList"></ul>
            <div class="game-message" id="promiseMessage" style="display: none;"></div>
        </div>
    `;

    const promiseInput = document.getElementById('promiseInput');
    const addPromiseBtn = document.getElementById('addPromise');
    const promiseList = document.getElementById('promiseList');
    const promiseMessage = document.getElementById('promiseMessage');

    // Load existing promises
    if (gameState.promises && gameState.promises.length > 0) {
        gameState.promises.forEach(promise => addPromiseToList(promise));
    }

    function addPromiseToList(promiseText) {
        const li = document.createElement('li');
        li.className = 'promise-item';
        li.textContent = `🍃 ${promiseText}`;
        promiseList.appendChild(li);
    }

    function addPromise() {
        const promise = promiseInput.value.trim();
        if (promise) {
            gameState.promises.push(promise);
            saveGameState();
            addPromiseToList(promise);
            promiseInput.value = '';

            if (gameState.promises.length >= 3) {
                promiseMessage.style.display = 'block';
                promiseMessage.innerHTML = `
                    <h3>🌳 Promise Tree Growing! 🌳</h3>
                    <p>Our tree of promises is flourishing, Miku! I'll keep every single one! 💚</p>
                `;
                completeDay('promise');
            }
        }
    }

    addPromiseBtn.addEventListener('click', addPromise);
    promiseInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPromise();
    });
}

// ==================== //
// Hug Day Game //
// ==================== //

function loadHugDay(container) {
    container.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">🤗 Hug Day 🤗</h2>
            <p class="game-instructions">Click the button to send warm virtual hugs!</p>
            <div class="hug-display">🤗</div>
            <div class="warmth-meter">
                <div class="warmth-fill" id="warmthFill"></div>
            </div>
            <div class="game-score">Hugs Sent: <span id="hugCounter">0</span></div>
            <button class="hug-button" id="hugButton">Send Hug 💕</button>
            <div class="game-message" id="hugMessage" style="display: none;"></div>
        </div>
    `;

    const hugButton = document.getElementById('hugButton');
    const hugCounter = document.getElementById('hugCounter');
    const warmthFill = document.getElementById('warmthFill');
    const hugMessage = document.getElementById('hugMessage');
    let hugs = 0;
    const targetHugs = 20;

    hugButton.addEventListener('click', () => {
        hugs++;
        hugCounter.textContent = hugs;
        const percentage = Math.min((hugs / targetHugs) * 100, 100);
        warmthFill.style.width = percentage + '%';

        // Animate button
        hugButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
            hugButton.style.transform = 'scale(1)';
        }, 100);

        if (hugs >= targetHugs) {
            hugMessage.style.display = 'block';
            hugMessage.innerHTML = `
                <h3>🤗 Warmth Meter Full! 🤗</h3>
                <p>Your hugs warm my heart, Miku! I'm sending all my love wrapped in these hugs! 💕</p>
            `;
            completeDay('hug');
        }
    });
}

// ==================== //
// Kiss Day Game //
// ==================== //

function loadKissDay(container) {
    container.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">💋 Kiss Day 💋</h2>
            <p class="game-instructions">Move your mouse/finger to catch falling kisses!</p>
            <div class="game-score">Score: <span id="kissScore">0</span></div>
            <div class="kiss-game-area" id="kissGameArea">
                <div class="kiss-catcher" id="kissCatcher">💝</div>
            </div>
            <button class="btn-primary" id="startKissGame">Start Game</button>
            <div class="game-message" id="kissMessage" style="display: none;"></div>
        </div>
    `;

    const gameArea = document.getElementById('kissGameArea');
    const catcher = document.getElementById('kissCatcher');
    const kissScoreEl = document.getElementById('kissScore');
    const startBtn = document.getElementById('startKissGame');
    const kissMessage = document.getElementById('kissMessage');

    let score = 0;
    let gameActive = false;
    let gameInterval;

    // Move catcher with mouse/touch
    gameArea.addEventListener('mousemove', (e) => {
        if (!gameActive) return;
        const rect = gameArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        catcher.style.left = Math.max(40, Math.min(rect.width - 40, x)) + 'px';
    });

    gameArea.addEventListener('touchmove', (e) => {
        if (!gameActive) return;
        e.preventDefault();
        const rect = gameArea.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        catcher.style.left = Math.max(40, Math.min(rect.width - 40, x)) + 'px';
    });

    function createFallingKiss() {
        const kiss = document.createElement('div');
        kiss.className = 'falling-kiss';
        kiss.textContent = '💋';
        kiss.style.left = Math.random() * (gameArea.offsetWidth - 40) + 'px';
        gameArea.appendChild(kiss);

        const checkCollision = setInterval(() => {
            const kissRect = kiss.getBoundingClientRect();
            const catcherRect = catcher.getBoundingClientRect();

            if (!(kissRect.right < catcherRect.left ||
                kissRect.left > catcherRect.right ||
                kissRect.bottom < catcherRect.top ||
                kissRect.top > catcherRect.bottom)) {
                score++;
                kissScoreEl.textContent = score;
                kiss.remove();
                clearInterval(checkCollision);

                if (score >= 15) {
                    endGame();
                }
            }

            if (kissRect.top > gameArea.offsetHeight) {
                kiss.remove();
                clearInterval(checkCollision);
            }
        }, 50);
    }

    function startGame() {
        gameActive = true;
        score = 0;
        kissScoreEl.textContent = score;
        startBtn.style.display = 'none';

        gameInterval = setInterval(createFallingKiss, 800);

        setTimeout(() => {
            if (gameActive) endGame();
        }, 30000);
    }

    function endGame() {
        gameActive = false;
        clearInterval(gameInterval);
        document.querySelectorAll('.falling-kiss').forEach(k => k.remove());
        startBtn.style.display = 'inline-block';
        startBtn.textContent = 'Play Again';

        if (score >= 15) {
            kissMessage.style.display = 'block';
            kissMessage.innerHTML = `
                <h3>💋 Amazing Catch! 💋</h3>
                <p>You caught ${score} kisses! Every kiss from you is precious, Miku! 💕</p>
            `;
            completeDay('kiss');
        }
    }

    startBtn.addEventListener('click', startGame);
}

// ==================== //
// Valentine's Day Love Letter //
// ==================== //

function loadValentineDay(container) {
    container.innerHTML = `
        <div class="love-letter">
            <h2 class="love-letter-title">Happy Valentine's Day, Miku! 💖</h2>
            <img src="couple-photo.jpg" alt="Us Together" class="couple-photo" onerror="this.style.display='none'">
            <div class="letter-content">
                <p>My Dearest Miku,</p>
                <p>As this special week comes to an end, I want you to know that every moment we've shared has been magical. You bring color to my world, warmth to my heart, and joy to my soul.</p>
                <p>From the roses of day one to this final moment, every experience we've created together has been a treasure. You're not just my Valentine—you're my every day, my forever.</p>
                <p>Thank you for being you, for your smile that lights up my darkest days, for your laugh that makes everything better, and for your love that completes me.</p>
                <p>Here's to us, to our journey, and to all the beautiful moments yet to come. I love you more than words could ever express.</p>
                <p class="letter-signature">Forever Yours,<br>Sourav 💕</p>
            </div>
            <button class="btn-primary" onclick="alert('Thank you for this amazing week, Miku! 💝')">Share Your Love</button>
        </div>
    `;

    completeDay('valentine');
    createHeartExplosion();
}

// ==================== //
// Visual Effects //
// ==================== //

function createConfetti() {
    const colors = ['#ff4d8f', '#b565d8', '#ff85b3', '#ff6ba6'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        confetti.style.transition = 'all 3s ease-out';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.style.top = window.innerHeight + 'px';
            confetti.style.opacity = '0';
            confetti.style.transform = 'rotate(' + (Math.random() * 720) + 'deg)';
        }, 100);

        setTimeout(() => {
            confetti.remove();
        }, 3100);
    }
}

function createHeartExplosion() {
    const hearts = ['💕', '💖', '💗', '💝', '💘', '❤️'];

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.fontSize = '2rem';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.transform = 'translate(-50%, -50%)';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.transition = 'all 2s ease-out';

        document.body.appendChild(heart);

        const angle = (Math.PI * 2 * i) / 30;
        const distance = 200 + Math.random() * 200;

        setTimeout(() => {
            heart.style.left = (50 + Math.cos(angle) * distance) + '%';
            heart.style.top = (50 + Math.sin(angle) * distance) + '%';
            heart.style.opacity = '0';
            heart.style.transform = 'translate(-50%, -50%) scale(2)';
        }, 100);

        setTimeout(() => {
            heart.remove();
        }, 2100);
    }
}
