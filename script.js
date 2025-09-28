document.addEventListener('DOMContentLoaded', () => {
    const slidersContainer = document.getElementById('sliders-container');
    const totalScoreEl = document.getElementById('total-score');
    const facultyScoreEl = document.getElementById('faculty-score');
    const weightingsInput = document.getElementById('weightings');
    const editButton = document.getElementById('edit-button');
    const resetButton = document.getElementById('reset-button');

    const subjects = [
        { name: 'Chinese', id: 'chn' },
        { name: 'English', id: 'eng' },
        { name: 'Mathematics (Core)', id: 'mat' },
        { name: 'Elective 1', id: 'chm' },
        { name: 'Elective 2', id: 'bio' }
    ];

    const sliderValues = [1, 2, 3, 4, 5.5, 7, 8.5];
    const sliderDisplayValues = ['1', '2', '3', '4', '5', '5*', '5**'];

    let totalScore = 0;
    let facultyScore = 0;
    let scaleFactors;

    function updateScaleFactors() {
        const weightings = weightingsInput.value;
        const parts = weightings.match(/.{1,2}/g).map(Number);
        scaleFactors = {};
        subjects.forEach((subject, index) => {
            scaleFactors[subject.id] = parts[index];
        });
    }

    function updateSliderLabels() {
        subjects.forEach(subject => {
            const label = document.querySelector(`label[for="${subject.id}"]`);
            if (label) {
                const valueSpan = document.getElementById(`${subject.id}-value`);
                label.textContent = `${subject.name} (Weight: ${scaleFactors[subject.id]}): `;
                label.appendChild(valueSpan);
            }
        });
    }

    updateScaleFactors();
    initializeSliders();
    updateScores();

    function initializeSliders() {
        subjects.forEach(subject => {
            const sliderWrapper = document.createElement('div');
            sliderWrapper.classList.add('slider-container', 'mb-4');

            const label = document.createElement('label');
            label.setAttribute('for', subject.id);
            label.classList.add('form-label');
            label.textContent = `${subject.name} (Weight: ${scaleFactors[subject.id]}): `;

            const valueSpan = document.createElement('span');
            valueSpan.id = `${subject.id}-value`;
            // valueSpan.textContent = sliderDisplayValues[3];
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

    editButton.addEventListener('click', () => {
        if (weightingsInput.disabled) {
            weightingsInput.disabled = false;
            editButton.textContent = 'Save';
        } else {
            const weightings = weightingsInput.value;
            if (weightings.length !== 10) {
                alert('Invalid settings code!');
                return;
            }

            const parts = weightings.match(/.{1,2}/g).map(Number);
            const invalid = parts.some((part, index) => {
                if (index < 3) {
                    return ![7, 10].includes(part);
                } else {
                    return ![5, 7, 10].includes(part);
                }
            });

            if (invalid) {
                alert('Invalid settings code!');
                return;
            }

            updateScaleFactors();
            updateSliderLabels();
            updateScores();

            weightingsInput.disabled = true;
            editButton.textContent = 'Edit';
        }
    });

    resetButton.addEventListener('click', () => {
        weightingsInput.value = '0710101010';
        updateScaleFactors();
        updateSliderLabels();
        updateScores();
        weightingsInput.disabled = true;
        editButton.textContent = 'Edit';
    });
});