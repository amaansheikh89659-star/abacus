const grades = [
  {
    id: 1,
    name: 'Grade 1',
    summary: 'Build comfort with counting, grouping, and simple number facts.',
    lessons: [
      {
        caption: 'Each lower bead is worth 1. Count them one by one to make a number.',
        title: 'Ones and counting'
      },
      {
        caption: 'Each upper bead is worth 5. Slide one upper bead to add five quickly.',
        title: 'Fives and grouping'
      },
      {
        caption: 'Use both the upper and lower beads together to build numbers from 0 to 9.',
        title: 'Building numbers'
      }
    ]
  },
  {
    id: 2,
    name: 'Grade 2',
    summary: 'Extend place value to tens and strengthen addition and subtraction.',
    lessons: [
      {
        caption: 'The rod on the right is ones. The next rod is tens, worth 10 each.',
        title: 'Tens and ones'
      },
      {
        caption: 'A full row of ten lower beads equals one tens bead on the next rod.',
        title: 'Making tens'
      },
      {
        caption: 'Read numbers by combining tens and ones to show totals clearly.',
        title: 'Reading totals'
      }
    ]
  },
  {
    id: 3,
    name: 'Grade 3',
    summary: 'Move into hundreds and use place value to solve multi-step problems.',
    lessons: [
      {
        caption: 'The third rod shows hundreds, where each bead is worth 100.',
        title: 'Hundreds place'
      },
      {
        caption: 'Trade a bundle of 10 tens for 1 hundred to regroup cleanly.',
        title: 'Regrouping'
      },
      {
        caption: 'Combine hundreds, tens, and ones to represent a full number.',
        title: 'Three-digit numbers'
      }
    ]
  },
  {
    id: 4,
    name: 'Grade 4',
    summary: 'Work fluently with larger numbers, regrouping, and multi-digit operations.',
    lessons: [
      {
        caption: 'The far left rod can show thousands, helping you work with larger totals.',
        title: 'Thousands and beyond'
      },
      {
        caption: 'Regroup carefully across place values when adding and subtracting.',
        title: 'Large number strategies'
      },
      {
        caption: 'Use the abacus to check the value of each digit before you answer.',
        title: 'Checking work'
      }
    ]
  }
];

const modes = [
  { id: 'learn', label: 'Learn' },
  { id: 'practice', label: 'Practice' },
  { id: 'drill', label: 'Drill' }
];

const state = {
  grade: 1,
  mode: 'learn',
  exampleIndex: 0,
  score: 0,
  totalAnswered: 0,
  currentProblem: null,
  currentFeedback: '',
  feedbackClass: '',
  abacus: buildAbacus()
};

const placeNames = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];

const gradeTabsEl = document.getElementById('grade-tabs');
const modeTabsEl = document.getElementById('mode-tabs');
const contentEl = document.getElementById('content');
const columnsEl = document.getElementById('columns');

function buildAbacus() {
  return Array.from({ length: 5 }, () => ({
    heaven: Array(2).fill(false),
    earth: Array(5).fill(false)
  }));
}

function getGrade() {
  return grades.find((grade) => grade.id === state.grade);
}

function getCurrentLesson() {
  const grade = getGrade();
  return grade.lessons[state.exampleIndex % grade.lessons.length];
}

function renderTabs() {
  gradeTabsEl.innerHTML = grades
    .map(
      (grade) => `
        <button
          type="button"
          class="${state.grade === grade.id ? 'active' : ''}"
          data-type="grade"
          data-grade="${grade.id}"
        >
          ${grade.name}
        </button>
      `
    )
    .join('');

  modeTabsEl.innerHTML = modes
    .map(
      (mode) => `
        <button
          type="button"
          class="${state.mode === mode.id ? 'active' : ''}"
          data-type="mode"
          data-mode="${mode.id}"
        >
          ${mode.label}
        </button>
      `
    )
    .join('');
}

function renderLearnContent() {
  const grade = getGrade();
  const lesson = getCurrentLesson();

  const rows = [
    ['Lower bead', '1', 'Each bead below the bar counts as one.'],
    ['Upper bead', '5', 'Each bead above the bar counts as five.'],
    ['Rod', 'ones / tens / hundreds', 'Read the rod from right to left as place value.']
  ];

  contentEl.innerHTML = `
    <h2>${grade.name}</h2>
    <p class="lead">${grade.summary}</p>
    <div class="example-caption">${lesson.caption}</div>
    <div class="example-nav">
      <button type="button" class="action" data-action="previous-example">Previous</button>
      <div class="idx">${state.exampleIndex + 1} / ${grade.lessons.length}</div>
      <button type="button" class="action" data-action="next-example">Next</button>
    </div>
    <table class="ref-table">
      <thead>
        <tr>
          <th>Part</th>
          <th>Value</th>
          <th>What it means</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            ([name, value, meaning]) => `
              <tr>
                <td>${name}</td>
                <td>${value}</td>
                <td>${meaning}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePracticeProblem() {
  const grade = getGrade();
  const maxNumber = grade.id === 1 ? 9 : grade.id === 2 ? 29 : grade.id === 3 ? 199 : 999;
  const a = randomInt(1, maxNumber);
  const b = randomInt(1, Math.min(9, maxNumber));
  const total = a + b;

  return {
    prompt: `Build ${total} on the frame and check your answer.`,
    answer: total,
    hint: `Try ${a} + ${b} = ${total}`
  };
}

function generateDrillProblem() {
  const grade = getGrade();

  if (grade.id === 1) {
    const a = randomInt(2, 9);
    const b = randomInt(1, 9);
    return { prompt: `${a} + ${b} = ?`, answer: a + b };
  }

  if (grade.id === 2) {
    const a = randomInt(10, 29);
    const b = randomInt(1, 12);
    return { prompt: `${a} + ${b} = ?`, answer: a + b };
  }

  if (grade.id === 3) {
    const a = randomInt(50, 180);
    const b = randomInt(25, 90);
    return { prompt: `${a} + ${b} = ?`, answer: a + b };
  }

  const a = randomInt(100, 499);
  const b = randomInt(50, 250);
  return { prompt: `${a} + ${b} = ?`, answer: a + b };
}

function renderPracticeContent() {
  if (!state.currentProblem) {
    state.currentProblem = generatePracticeProblem();
  }

  const label = getGrade().name;

  contentEl.innerHTML = `
    <h2>${label} Practice</h2>
    <p class="lead">Use the abacus frame to model your thinking before you enter the answer.</p>
    <div class="prompt-box">
      <div class="prompt-text">${state.currentProblem.prompt}</div>
      <div class="prompt-sub">${state.currentProblem.hint}</div>
    </div>
    <div class="row">
      <input id="answer-input" type="number" min="0" step="1" aria-label="Answer" />
      <button type="button" class="action primary" id="check-answer">Check</button>
      <button type="button" class="action" id="new-problem">New problem</button>
    </div>
    <div class="feedback ${state.feedbackClass}">${state.currentFeedback}</div>
  `;

  const answerInput = document.getElementById('answer-input');
  if (answerInput) {
    answerInput.focus();
  }
}

function renderDrillContent() {
  if (!state.currentProblem) {
    state.currentProblem = generateDrillProblem();
  }

  contentEl.innerHTML = `
    <h2>Speed Drill</h2>
    <p class="lead">Solve as many as you can with the frame in front of you.</p>
    <div class="drill-summary">
      <div class="big">${state.score}</div>
      <div>Correct answers: ${state.score} / ${state.totalAnswered || 0}</div>
    </div>
    <div class="prompt-box">
      <div class="prompt-text">${state.currentProblem.prompt}</div>
      <div class="prompt-sub">Enter the value and keep going.</div>
    </div>
    <div class="row">
      <input id="answer-input" type="number" min="0" step="1" aria-label="Drill answer" />
      <button type="button" class="action primary" id="check-answer">Check</button>
      <button type="button" class="action" id="new-problem">Next</button>
    </div>
    <div class="feedback ${state.feedbackClass}">${state.currentFeedback}</div>
  `;

  const answerInput = document.getElementById('answer-input');
  if (answerInput) {
    answerInput.focus();
  }
}

function renderContent() {
  if (state.mode === 'learn') {
    renderLearnContent();
    return;
  }

  if (state.mode === 'practice') {
    renderPracticeContent();
    return;
  }

  renderDrillContent();
}

function toggleBead(columnIndex, beadType, beadIndex) {
  const column = state.abacus[columnIndex];
  if (!column) {
    return;
  }

  if (beadType === 'heaven') {
    column.heaven[beadIndex] = !column.heaven[beadIndex];
  } else {
    column.earth[beadIndex] = !column.earth[beadIndex];
  }

  renderAbacus();
}

function getColumnValue(column) {
  const heavenValue = column.heaven.filter(Boolean).length * 5;
  const earthValue = column.earth.filter(Boolean).length;
  return heavenValue + earthValue;
}

function renderAbacus() {
  columnsEl.innerHTML = '';

  state.abacus.forEach((column, columnIndex) => {
    const columnEl = document.createElement('div');
    columnEl.className = 'column';

    const heavenTrack = document.createElement('div');
    heavenTrack.className = 'heaven-track';
    heavenTrack.innerHTML = '<div class="beam"></div>';

    column.heaven.forEach((active, beadIndex) => {
      const bead = document.createElement('button');
      bead.type = 'button';
      bead.className = `bead heaven ${active ? 'active' : ''}`;
      bead.dataset.column = String(columnIndex);
      bead.dataset.type = 'heaven';
      bead.dataset.index = String(beadIndex);
      bead.style.top = `${12 + beadIndex * 18}px`;
      bead.setAttribute('aria-label', `Upper bead ${beadIndex + 1} in column ${columnIndex + 1}`);
      heavenTrack.appendChild(bead);
    });

    const earthTrack = document.createElement('div');
    earthTrack.className = 'earth-track';
    column.earth.forEach((active, beadIndex) => {
      const bead = document.createElement('button');
      bead.type = 'button';
      bead.className = `bead earth ${active ? 'active' : ''}`;
      bead.dataset.column = String(columnIndex);
      bead.dataset.type = 'earth';
      bead.dataset.index = String(beadIndex);
      bead.style.top = `${18 + beadIndex * 26}px`;
      bead.setAttribute('aria-label', `Lower bead ${beadIndex + 1} in column ${columnIndex + 1}`);
      earthTrack.appendChild(bead);
    });

    const rod = document.createElement('div');
    rod.className = 'rod';

    const label = document.createElement('div');
    label.className = 'place-label';
    label.textContent = placeNames[Math.min(columnIndex, placeNames.length - 1)];

    const valueTag = document.createElement('div');
    valueTag.className = 'place-label';
    valueTag.textContent = getColumnValue(column);

    columnEl.appendChild(rod);
    columnEl.appendChild(heavenTrack);
    columnEl.appendChild(earthTrack);
    columnEl.appendChild(label);
    columnEl.appendChild(valueTag);
    columnsEl.appendChild(columnEl);
  });
}

function setFeedback(message, kind) {
  state.currentFeedback = message;
  state.feedbackClass = kind;
}

function handleCheckAnswer() {
  const answerInput = document.getElementById('answer-input');
  if (!answerInput) {
    return;
  }

  const userAnswer = Number(answerInput.value);
  const isCorrect = userAnswer === state.currentProblem.answer;

  if (state.mode === 'drill') {
    state.totalAnswered += 1;
    if (isCorrect) {
      state.score += 1;
      setFeedback('Nice work! You solved it.', 'good');
    } else {
      setFeedback(`Not quite — the answer was ${state.currentProblem.answer}.`, 'bad');
    }

    state.currentProblem = generateDrillProblem();
    renderDrillContent();
    return;
  }

  if (isCorrect) {
    setFeedback('Correct! Great job using place value.', 'good');
    state.currentProblem = generatePracticeProblem();
    renderPracticeContent();
    return;
  }

  setFeedback(`Try again. The answer is ${state.currentProblem.answer}.`, 'bad');
  renderPracticeContent();
}

function handleTabChange(type, value) {
  if (type === 'grade') {
    state.grade = Number(value);
    state.exampleIndex = 0;
    state.currentProblem = null;
    state.currentFeedback = '';
    state.feedbackClass = '';
    state.abacus = buildAbacus();
  }

  if (type === 'mode') {
    state.mode = value;
    state.currentProblem = null;
    state.currentFeedback = '';
    state.feedbackClass = '';
  }

  renderTabs();
  renderContent();
  renderAbacus();
}

document.addEventListener('click', (event) => {
  const tab = event.target.closest('[data-type]');
  if (tab) {
    const type = tab.dataset.type;
    if (type === 'grade') {
      handleTabChange('grade', tab.dataset.grade);
      return;
    }

    if (type === 'mode') {
      handleTabChange('mode', tab.dataset.mode);
      return;
    }
  }

  const action = event.target.closest('[data-action]');
  if (action) {
    const actionName = action.dataset.action;
    if (actionName === 'previous-example') {
      const grade = getGrade();
      state.exampleIndex = (state.exampleIndex - 1 + grade.lessons.length) % grade.lessons.length;
      renderLearnContent();
      return;
    }

    if (actionName === 'next-example') {
      const grade = getGrade();
      state.exampleIndex = (state.exampleIndex + 1) % grade.lessons.length;
      renderLearnContent();
      return;
    }
  }

  const problemButton = event.target.closest('#new-problem');
  if (problemButton) {
    state.currentProblem = state.mode === 'drill' ? generateDrillProblem() : generatePracticeProblem();
    state.currentFeedback = '';
    state.feedbackClass = '';
    renderContent();
    return;
  }

  const checkButton = event.target.closest('#check-answer');
  if (checkButton) {
    handleCheckAnswer();
    return;
  }

  const bead = event.target.closest('.bead');
  if (bead) {
    toggleBead(Number(bead.dataset.column), bead.dataset.type, Number(bead.dataset.index));
  }
});

renderTabs();
renderContent();
renderAbacus();
