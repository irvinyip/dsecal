document.addEventListener('DOMContentLoaded', () => {
    const slidersContainer = document.getElementById('sliders-container');
    const totalScoreEl = document.getElementById('total-score');
    const facultyScoreEl = document.getElementById('faculty-score');

    const subjects = [
        { name: 'Chinese', id: 'chn' },
        { name: 'English', id: 'eng' },
        { name: 'Mathematics (Core)', id: 'mat' },
        { name: 'Chemistry', id: 'chm' },
        { name: 'Biology', id: 'bio' }
    ];

    const sliderValues = [1, 2, 3, 4, 5.5, 7, 8.5];
    const sliderDisplayValues = ['1', '2', '3', '4', '5', '5*', '5**'];

    let totalScore = 0;
    let facultyScore = 0;
    let scaleFactors;

    fetch('scale.json')
        .then(response => response.json())
        .then(data => {
            scaleFactors = data.polyu;
            initializeSliders();
            updateScores();
        });

    function initializeSliders() {
        subjects.forEach(subject => {
            const sliderWrapper = document.createElement('div');
            sliderWrapper.classList.add('slider-container', 'mb-4');

            const label = document.createElement('label');
            label.setAttribute('for', subject.id);
            label.classList.add('form-label');
            label.textContent = `${subject.name}: `;

            const valueSpan = document.createElement('span');
            valueSpan.id = `${subject.id}-value`;
            valueSpan.textContent = sliderDisplayValues[3];

            label.appendChild(valueSpan);

            const sliderInput = document.createElement('input');
            sliderInput.type = 'range';
            sliderInput.id = subject.id;
            sliderInput.min = 0;
            sliderInput.max = 6;
            sliderInput.value = 3;
            sliderInput.classList.add('form-range');

            const ticksContainer = document.createElement('div');
            ticksContainer.classList.add('ticks-container');

            sliderDisplayValues.forEach(val => {
                const tick = document.createElement('div');
                tick.classList.add('tick');
                tick.textContent = val;
                ticksContainer.appendChild(tick);
            });

            sliderInput.addEventListener('input', () => {
                const displayValue = sliderDisplayValues[sliderInput.value];
                valueSpan.textContent = displayValue;
                updateScores();
            });

            sliderWrapper.appendChild(label);
            sliderWrapper.appendChild(sliderInput);
            sliderWrapper.appendChild(ticksContainer);
            slidersContainer.appendChild(sliderWrapper);
        });
    }

    function updateScores() {
        totalScore = 0;
        facultyScore = 0;
        subjects.forEach(subject => {
            const slider = document.getElementById(subject.id);
            const sliderValue = sliderValues[slider.value];
            totalScore += sliderValue;
            if (scaleFactors && scaleFactors[subject.id]) {
                facultyScore += sliderValue * scaleFactors[subject.id];
            }
        });
        totalScoreEl.textContent = totalScore;
        facultyScoreEl.textContent = facultyScore;
    }
});