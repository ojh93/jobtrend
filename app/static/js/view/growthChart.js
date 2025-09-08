// js/view/growthChart.js

let growthChart;

export function renderGrowthChart({ years, values }) {
  const ctx = document.getElementById("growthChart");
  if (!ctx) return;

  if (growthChart) growthChart.destroy();

  growthChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: [{
        label: "산업 성장률 (%)",
        data: values,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

let salaryChart;

export function renderSalaryChart(
  incomeLevel,
  estimatedAbsoluteQuintile,
  // boundary, boundarySource, averageIncome 모두 제거
  _boundary,
  _boundarySource,
  _averageIncome,
  isPercentageMode = true    // 항상 true로 고정
) {
  const ctx = document.getElementById("salaryChart");
  if (!ctx) return;
  if (salaryChart) salaryChart.destroy();
  if (!incomeLevel || !incomeLevel.values) return;

  const { values, highlightIndex = -1 } = incomeLevel;

  // 1~5분위 고정 라벨
  const labels = [
    `1분위 (하위 20%)`,
    `2분위 (20~40%)`,
    `3분위 (40~60%)`,
    `4분위 (60~80%)`,
    `5분위 (상위 20%)`
  ];

  // 막대 높이: 이미 백분율 정수값
  const chartValues = values;

  salaryChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "소득분위별 인구 비율 (%)",
        data: chartValues,
        backgroundColor: chartValues.map((_, i) =>
          i === highlightIndex ? "#f44336" : "#2196f3"
        )
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw}%`
          }
        },
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: v => `${v}%`
          }
        }
      }
    }
  });
}
