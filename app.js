let currentDayIndex = 0;
let chartInstance = null;

// Tab Switching
document.querySelectorAll(".pill").forEach(button => {
  button.onclick = () => {
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));

    button.classList.add("active");
    const tabId = `tab-${button.dataset.tab}`;
    document.getElementById(tabId).classList.add("active");
  };
});

function loadLesson(index) {
  const data = courseModules[index];

  // Header Elements
  document.getElementById("module-badge").textContent = `Track: ${data.track}`;
  document.getElementById("xp-counter").textContent = `⚡ ${data.xp} XP`;
  document.getElementById("day-select-btn").textContent = `Day ${data.day}: ${data.title} ▾`;
  document.getElementById("progress-fill").style.width = `${((index + 1) / courseModules.length) * 100}%`;

  // Theory Tab
  document.getElementById("theory-title").textContent = data.title;
  document.getElementById("theory-intuition").textContent = data.theory.intuition;
  document.getElementById("theory-industry").textContent = data.theory.industry;
  document.getElementById("theory-pitfall").textContent = data.theory.pitfall;

  // Code Tab
  document.getElementById("code-display").textContent = data.code;
  document.getElementById("code-output").textContent = data.output;

  // Challenge Tab
  document.getElementById("quiz-scenario").textContent = data.quiz.scenario;
  const optionsContainer = document.getElementById("quiz-options-container");
  const explanationBox = document.getElementById("quiz-explanation");
  optionsContainer.innerHTML = "";
  explanationBox.classList.add("hidden");

  data.quiz.options.forEach((optText, optIdx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = optText;
    btn.onclick = () => {
      document.querySelectorAll(".option-btn").forEach(b => b.disabled = true);
      if (optIdx === data.quiz.answer) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
        optionsContainer.children[data.quiz.answer].classList.add("correct");
      }
      explanationBox.textContent = data.quiz.explanation;
      explanationBox.className = "explanation-box " + (optIdx === data.quiz.answer ? "success-msg" : "warning-msg");
    };
    optionsContainer.appendChild(btn);
  });

  // Render Visualizer
  initInteractiveCanvas(data);
}

// Chart.js Live Rendering Engine
function initInteractiveCanvas(data) {
  const ctx = document.getElementById("liveChart").getContext("2d");
  const controls = document.getElementById("dynamic-controls");
  controls.innerHTML = "";

  if (chartInstance) {
    chartInstance.destroy();
  }

  if (data.visualType === "regression") {
    let slope = data.initialSlope;
    let intercept = data.initialIntercept;

    const generateLineData = (m, c) => [0, 10, 20, 30, 40, 50, 60, 70].map(x => ({ x, y: m * x + c }));

    chartInstance = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Actual Observations",
            data: data.dataset,
            backgroundColor: "#38bdf8",
            pointRadius: 6
          },
          {
            type: "line",
            label: "Model Prediction Line",
            data: generateLineData(slope, intercept),
            borderColor: "#f43f5e",
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: 'linear', position: 'bottom', grid: { color: '#1e293b' } },
          y: { grid: { color: '#1e293b' } }
        }
      }
    });

    // Add interactive controls
    controls.innerHTML = `
      <div class="slider-group">
        <span>Slope (m): <b id="val-slope">${slope}</b></span>
        <input type="range" id="slider-slope" min="0.5" max="3" step="0.1" value="${slope}">
      </div>
      <div class="slider-group">
        <span>Intercept (c): <b id="val-intercept">${intercept}</b></span>
        <input type="range" id="slider-intercept" min="-10" max="30" step="1" value="${intercept}">
      </div>
    `;

    document.getElementById("slider-slope").oninput = (e) => {
      slope = parseFloat(e.target.value);
      document.getElementById("val-slope").textContent = slope;
      chartInstance.data.datasets[1].data = generateLineData(slope, intercept);
      chartInstance.update();
    };

    document.getElementById("slider-intercept").oninput = (e) => {
      intercept = parseFloat(e.target.value);
      document.getElementById("val-intercept").textContent = intercept;
      chartInstance.data.datasets[1].data = generateLineData(slope, intercept);
      chartInstance.update();
    };
  } else {
    // Sigmoid Curve Visualizer
    const sigmoidPoints = [];
    for (let x = -6; x <= 6; x += 0.5) {
      sigmoidPoints.push({ x: x, y: 1 / (1 + Math.exp(-x)) });
    }

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [{
          label: "Sigmoid S-Curve P(Y=1)",
          data: sigmoidPoints,
          borderColor: "#10b981",
          borderWidth: 3,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: 'linear', position: 'bottom', grid: { color: '#1e293b' } },
          y: { min: 0, max: 1, grid: { color: '#1e293b' } }
        }
      }
    });
  }
}

// Next and Previous Topic Actions
document.getElementById("next-btn").onclick = () => {
  if (currentDayIndex < courseModules.length - 1) {
    currentDayIndex++;
    loadLesson(currentDayIndex);
  }
};

document.getElementById("prev-btn").onclick = () => {
  if (currentDayIndex > 0) {
    currentDayIndex--;
    loadLesson(currentDayIndex);
  }
};

// Copy code action
document.getElementById("copy-code-btn").onclick = () => {
  const code = document.getElementById("code-display").textContent;
  navigator.clipboard.writeText(code);
  document.getElementById("copy-code-btn").textContent = "Copied!";
  setTimeout(() => document.getElementById("copy-code-btn").textContent = "Copy", 1500);
};

// Initial Load
loadLesson(0);