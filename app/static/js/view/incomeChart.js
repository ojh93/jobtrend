<<<<<<< HEAD
// js/view/incomeChart.js




let employmentChart;



export function renderEmploymentChart({ years, values }) {
  const ctx = document.getElementById("employmentChart");
  if (!ctx) return;

  if (employmentChart) employmentChart.destroy();

  employmentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: years,
      datasets: [{
        label: "고용률 (%)",
        data: values,
        backgroundColor: "#ff9800"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
=======
// js/view/incomeChart.js




let employmentChart;



export function renderEmploymentChart({ years, values }) {
  const ctx = document.getElementById("employmentChart");
  if (!ctx) return;

  if (employmentChart) employmentChart.destroy();

  employmentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: years,
      datasets: [{
        label: "고용률 (%)",
        data: values,
        backgroundColor: "#ff9800"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
>>>>>>> a9ccfb7 (feat: 최신 Dockerfile 및 라우트 오류 수정 사항 반영)
}