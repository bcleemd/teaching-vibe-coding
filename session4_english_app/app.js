// App State Management
let sentences = [];
let currentIndex = 0;
let currentMode = 'flashcard'; // 'flashcard' | 'quiz' | 'listening'
let bookmarks = [];
let completedProgress = [];
let quizStats = { correct: 0, total: 0 };

// Audio Player State
let isPlaying = false;
let playSpeed = 1.0;
let isRepeatActive = true;
let synth = window.speechSynthesis;
let currentUtterance = null;
let autoplayTimeout = null;

// DOM Elements
const sidebarNavItems = document.querySelectorAll('.nav-item');
const modeTitle = document.getElementById('mode-title');
const modeDesc = document.getElementById('mode-desc');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const accuracyText = document.getElementById('accuracy-text');
const bookmarkCount = document.getElementById('bookmark-count');
const currentIndicator = document.getElementById('current-index-num');
const totalIndicator = document.getElementById('total-index-num');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnToggleBookmark = document.getElementById('btn-toggle-bookmark');
const btnResetData = document.getElementById('btn-reset-data');
const bookmarkList = document.getElementById('bookmark-list');
const navFooter = document.getElementById('navigation-footer');

// Mode Views
const views = {
    flashcard: document.getElementById('view-flashcard'),
    quiz: document.getElementById('view-quiz'),
    listening: document.getElementById('view-listening')
};

// Flashcard DOM Elements
const flashcard = document.getElementById('flashcard');
const cardEnglish = document.getElementById('card-english');
const cardKorean = document.getElementById('card-korean');
const cardTip = document.getElementById('card-tip');
const btnCardTts = document.getElementById('btn-card-tts');
const cardIndexFront = document.getElementById('card-index-front');

// Quiz DOM Elements
const quizIndex = document.getElementById('quiz-index');
const quizKorean = document.getElementById('quiz-korean');
const quizInput = document.getElementById('quiz-input');
const btnShowHint = document.getElementById('btn-show-hint');
const quizHintText = document.getElementById('quiz-hint-text');
const quizFeedback = document.getElementById('quiz-feedback');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackMsg = document.getElementById('feedback-msg');
const correctAnswerDisplay = document.getElementById('correct-answer-display');
const correctAnswerText = document.getElementById('correct-answer-text');
const btnCheckQuiz = document.getElementById('btn-check-quiz');
const btnNextQuiz = document.getElementById('btn-next-quiz');

// Listening DOM Elements
const playIndex = document.getElementById('play-index');
const playEnglish = document.getElementById('play-english');
const playKorean = document.getElementById('play-korean');
const playSpeedSelect = document.getElementById('play-speed');
const btnPlayPrev = document.getElementById('btn-play-prev');
const btnPlayToggle = document.getElementById('btn-play-toggle');
const btnPlayNext = document.getElementById('btn-play-next');
const btnToggleRepeat = document.getElementById('btn-toggle-repeat');
const visualizer = document.querySelector('.player-visualizer');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadLocalStorage();
    initEventListeners();
    fetchSentences();
});

// Load progress from localStorage
function loadLocalStorage() {
    bookmarks = JSON.parse(localStorage.getItem('ve_bookmarks')) || [];
    completedProgress = JSON.parse(localStorage.getItem('ve_progress')) || [];
    quizStats = JSON.parse(localStorage.getItem('ve_quiz_stats')) || { correct: 0, total: 0 };
    currentIndex = parseInt(localStorage.getItem('ve_current_index')) || 0;
}

// Save progress to localStorage
function saveLocalStorage() {
    localStorage.setItem('ve_bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('ve_progress', JSON.stringify(completedProgress));
    localStorage.setItem('ve_quiz_stats', JSON.stringify(quizStats));
    localStorage.setItem('ve_current_index', currentIndex.toString());
}

// Fetch sentences data
async function fetchSentences() {
    try {
        const response = await fetch('sentences.json');
        if (!response.ok) throw new Error('Data load failed');
        sentences = await response.ok ? await response.json() : [];
        if (sentences.length > 0) {
            totalIndicator.textContent = sentences.length;
            renderCurrentState();
            updateStats();
            renderBookmarks();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('영어 문장 데이터를 불러오지 못했습니다. 터미널에서 웹 서버(Python http.server 등)를 실행했는지 확인해주세요.');
    }
}

// Event Listeners Setup
function initEventListeners() {
    // Mode Switchers
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const selectedMode = e.currentTarget.getAttribute('data-mode');
            switchMode(selectedMode);
        });
    });

    // Navigation Controls
    btnPrev.addEventListener('click', navigatePrevious);
    btnNext.addEventListener('click', navigateNext);

    // Bookmarking Action
    btnToggleBookmark.addEventListener('click', toggleBookmark);
    
    // Reset Action
    btnResetData.addEventListener('click', resetProgress);

    // Flashcard Flip
    flashcard.addEventListener('click', (e) => {
        // Prevent flipping when clicking TTS button
        if (e.target.closest('#btn-card-tts')) return;
        flashcard.classList.toggle('flipped');
    });

    // Flashcard TTS Button
    btnCardTts.addEventListener('click', () => {
        speakText(sentences[currentIndex].english);
    });

    // Quiz Actions
    btnShowHint.addEventListener('click', () => {
        quizHintText.style.display = 'inline';
        btnShowHint.style.display = 'none';
    });

    btnCheckQuiz.addEventListener('click', checkQuizAnswer);
    quizInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (btnCheckQuiz.style.display !== 'none') {
                checkQuizAnswer();
            } else {
                navigateNextQuiz();
            }
        }
    });

    btnNextQuiz.addEventListener('click', navigateNextQuiz);

    // Player Actions (Listening Mode)
    btnPlayToggle.addEventListener('click', togglePlayer);
    btnPlayPrev.addEventListener('click', () => {
        stopPlayerAudio();
        navigatePrevious();
    });
    btnPlayNext.addEventListener('click', () => {
        stopPlayerAudio();
        navigateNext();
    });
    
    btnToggleRepeat.addEventListener('click', () => {
        isRepeatActive = !isRepeatActive;
        btnToggleRepeat.classList.toggle('active', isRepeatActive);
        btnToggleRepeat.innerHTML = isRepeatActive 
            ? '<i class="fa-solid fa-arrows-spin"></i> 연속 자동 재생 ON'
            : '<i class="fa-solid fa-ban"></i> 단일 재생 모드';
    });

    playSpeedSelect.addEventListener('change', (e) => {
        playSpeed = parseFloat(e.target.value);
        if (isPlaying) {
            stopPlayerAudio();
            playCurrentSentenceAudio();
        }
    });
}

// Switch Active Mode
function switchMode(mode) {
    if (currentMode === mode) return;
    
    // Stop any ongoing audio playback
    stopPlayerAudio();
    
    // Update menu UI
    sidebarNavItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-mode') === mode);
    });

    // Update active view
    Object.keys(views).forEach(key => {
        views[key].classList.toggle('active', key === mode);
    });

    currentMode = mode;
    saveLocalStorage();

    // Show/Hide bottom nav footer based on mode
    if (mode === 'listening') {
        navFooter.style.display = 'none';
    } else {
        navFooter.style.display = 'flex';
    }

    // Header info update
    if (mode === 'flashcard') {
        modeTitle.textContent = '플래시카드 학습';
        modeDesc.textContent = '영어를 확인하고 카드를 클릭해 한글 뜻을 확인해보세요.';
    } else if (mode === 'quiz') {
        modeTitle.textContent = '문답 퀴즈';
        modeDesc.textContent = '한글 뜻을 보고 영작해보세요. 대소문자/구두점은 자동으로 처리됩니다.';
    } else if (mode === 'listening') {
        modeTitle.textContent = '연속 흘려듣기';
        modeDesc.textContent = '원어민 발음으로 영어 문장과 해석을 자동으로 재생합니다.';
    }

    renderCurrentState();
}

// Navigate Previous
function navigatePrevious() {
    if (currentIndex > 0) {
        currentIndex--;
        renderCurrentState();
        saveLocalStorage();
    }
}

// Navigate Next
function navigateNext() {
    if (currentIndex < sentences.length - 1) {
        currentIndex++;
        renderCurrentState();
        saveLocalStorage();
    }
}

// Render values based on current state
function renderCurrentState() {
    if (sentences.length === 0) return;
    
    const current = sentences[currentIndex];
    currentIndicator.textContent = currentIndex + 1;

    // Update bookmark button state
    const isBookmarked = bookmarks.includes(current.id);
    btnToggleBookmark.classList.toggle('active', isBookmarked);
    btnToggleBookmark.innerHTML = isBookmarked
        ? '<i class="fa-solid fa-bookmark"></i>'
        : '<i class="fa-regular fa-bookmark"></i>';

    // Render Mode-specific values
    if (currentMode === 'flashcard') {
        // Reset card flipped state
        flashcard.classList.remove('flipped');
        
        cardIndexFront.textContent = `#${current.id}`;
        cardEnglish.textContent = current.english;
        cardKorean.textContent = current.korean;
        cardTip.textContent = current.hint || '꿀팁이 없습니다.';
    } 
    
    else if (currentMode === 'quiz') {
        quizIndex.textContent = `#${current.id}`;
        quizKorean.textContent = current.korean;
        quizInput.value = '';
        quizInput.disabled = false;
        quizInput.focus();
        
        // Reset hint
        btnShowHint.style.display = 'inline-flex';
        quizHintText.style.display = 'none';
        quizHintText.textContent = current.hint || '힌트가 없습니다.';
        
        // Reset feedback
        quizFeedback.style.display = 'none';
        quizFeedback.className = 'quiz-feedback';
        correctAnswerDisplay.style.display = 'none';
        
        btnCheckQuiz.style.display = 'block';
        btnNextQuiz.style.display = 'none';
    } 
    
    else if (currentMode === 'listening') {
        playIndex.textContent = `#${current.id} / ${sentences.length}`;
        playEnglish.textContent = current.english;
        playKorean.textContent = current.korean;

        if (isPlaying) {
            playCurrentSentenceAudio();
        }
    }
}

// Check Quiz Answer
function checkQuizAnswer() {
    const current = sentences[currentIndex];
    const userInput = quizInput.value.trim();
    if (!userInput) return;

    // Normalize strings: lowercase, remove punctuation (, . ? ! ' ")
    const normalize = (str) => {
        return str.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?']/g, "")
            .replace(/\s+/g, " ")
            .trim();
    };

    const isCorrect = normalize(userInput) === normalize(current.english);

    // Save progress
    if (!completedProgress.includes(current.id)) {
        completedProgress.push(current.id);
    }

    // Update Stats
    quizStats.total++;
    if (isCorrect) {
        quizStats.correct++;
        quizFeedback.className = 'quiz-feedback correct';
        feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        feedbackMsg.textContent = '정답입니다! 잘하셨어요!';
        speakText(current.english);
    } else {
        quizFeedback.className = 'quiz-feedback incorrect';
        feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        feedbackMsg.textContent = '아쉽네요. 다시 한번 확인해보세요!';
        
        correctAnswerText.textContent = current.english;
        correctAnswerDisplay.style.display = 'block';
    }

    quizFeedback.style.display = 'flex';
    quizFeedback.style.flexDirection = 'column';
    quizInput.disabled = true;
    
    btnCheckQuiz.style.display = 'none';
    btnNextQuiz.style.display = 'block';

    updateStats();
    saveLocalStorage();
}

// Navigate Next Quiz
function navigateNextQuiz() {
    if (currentIndex < sentences.length - 1) {
        navigateNext();
    } else {
        alert('마지막 문장입니다! 학습 진도를 다시 시작하시려면 상단 초기화 버튼을 눌러주세요.');
    }
}

// Web Speech API TTS helper
function speakText(text, callback) {
    if (!synth) return;
    
    // Cancel active speakers
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = playSpeed;

    // Pick an English voice
    const voices = synth.getVoices();
    const enVoice = voices.find(voice => voice.lang.startsWith('en') && voice.name.includes('Google')) 
                 || voices.find(voice => voice.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;

    if (callback) {
        utterance.onend = callback;
        utterance.onerror = callback;
    }

    synth.speak(utterance);
    currentUtterance = utterance;
}

// Audio Player Toggle
function togglePlayer() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        btnPlayToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
        visualizer.classList.add('playing');
        playCurrentSentenceAudio();
    } else {
        btnPlayToggle.innerHTML = '<i class="fa-solid fa-play"></i>';
        visualizer.classList.remove('playing');
        stopPlayerAudio();
    }
}

// Play Audio logic in Listening Mode
function playCurrentSentenceAudio() {
    if (sentences.length === 0) return;
    const current = sentences[currentIndex];
    
    // Add to progress if played
    if (!completedProgress.includes(current.id)) {
        completedProgress.push(current.id);
        updateStats();
        saveLocalStorage();
    }

    speakText(current.english, () => {
        if (!isPlaying) return;
        
        // Wait 1.5 seconds after speaking English, then continue
        autoplayTimeout = setTimeout(() => {
            if (!isPlaying) return;
            
            if (isRepeatActive) {
                if (currentIndex < sentences.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // Wrap around
                }
                renderCurrentState();
                saveLocalStorage();
            } else {
                togglePlayer(); // Stop playing if single play
            }
        }, 1500);
    });
}

// Stop Player Audio
function stopPlayerAudio() {
    if (synth) synth.cancel();
    if (autoplayTimeout) clearTimeout(autoplayTimeout);
    if (currentMode === 'listening') {
        btnPlayToggle.innerHTML = '<i class="fa-solid fa-play"></i>';
        visualizer.classList.remove('playing');
        isPlaying = false;
    }
}

// Bookmark toggler
function toggleBookmark() {
    if (sentences.length === 0) return;
    const currentId = sentences[currentIndex].id;
    const index = bookmarks.indexOf(currentId);

    if (index === -1) {
        bookmarks.push(currentId);
    } else {
        bookmarks.splice(index, 1);
    }

    saveLocalStorage();
    updateStats();
    renderCurrentState();
    renderBookmarks();
}

// Render Bookmarks Sidebar
function renderBookmarks() {
    bookmarkList.innerHTML = '';
    
    const bookmarkedSentences = sentences.filter(s => bookmarks.includes(s.id));

    if (bookmarkedSentences.length === 0) {
        bookmarkList.innerHTML = '<li class="empty-state">북마크된 문장이 없습니다.</li>';
        return;
    }

    bookmarkedSentences.forEach(s => {
        const li = document.createElement('li');
        li.className = 'bookmark-item';
        li.innerHTML = `
            <div class="bookmark-en">${s.english}</div>
            <div class="bookmark-ko">${s.korean}</div>
        `;
        
        // Click bookmark item to jump to that sentence
        li.addEventListener('click', () => {
            const targetIndex = sentences.findIndex(item => item.id === s.id);
            if (targetIndex !== -1) {
                currentIndex = targetIndex;
                renderCurrentState();
                saveLocalStorage();
            }
        });
        
        bookmarkList.appendChild(li);
    });
}

// Update UI statistics
function updateStats() {
    if (sentences.length === 0) return;
    
    // Progress calculation
    const progressPercent = Math.round((completedProgress.length / sentences.length) * 100);
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${completedProgress.length} / ${sentences.length} (${progressPercent}%)`;

    // Accuracy calculation
    const accuracy = quizStats.total > 0 ? Math.round((quizStats.correct / quizStats.total) * 100) : 0;
    accuracyText.textContent = `${accuracy}%`;

    // Bookmarks count
    bookmarkCount.textContent = `${bookmarks.length}개`;
}

// Reset Progress Data
function resetProgress() {
    if (confirm('모든 학습 진도 및 북마크 내역을 초기화하시겠습니까?')) {
        stopPlayerAudio();
        bookmarks = [];
        completedProgress = [];
        quizStats = { correct: 0, total: 0 };
        currentIndex = 0;
        
        saveLocalStorage();
        updateStats();
        renderCurrentState();
        renderBookmarks();
    }
}

// Voice list reload handler (safari/chrome fix)
if (synth) {
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = () => {
            // Hotreload voices if needed
        };
    }
}
