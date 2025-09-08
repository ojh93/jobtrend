// js/view/trendView.js
import { renderGrowthChart, renderSalaryChart } from './growthChart.js';

export function showResultSection() {
  document.querySelector('.trend-result').style.display = 'block';
}

export function renderTrendCharts(
  growthRates,
  incomeLevel,
  boundary,
  averageIncome,
  estimatedAbsoluteQuintile
) {
  renderGrowthChart(growthRates);
  renderSalaryChart(
    incomeLevel,
    estimatedAbsoluteQuintile,
    boundary,
    null,        // boundarySource
    averageIncome,
    true         // isPercentageMode
  );
}

export function renderSummary(summaryText, absoluteQuintile, insights = []) {
  // 1) 요약 텍스트
  const summaryEl = document.getElementById("summaryText");
  summaryEl.textContent = summaryText;

  // 2) 분위 강조
  document.querySelectorAll(".quintile-label").forEach((el, i) => {
    el.classList.toggle("highlight", i === absoluteQuintile - 1);
  });

  // 3) 인사이트 리스트
  const insightList = document.getElementById("insightList");
  insightList.innerHTML = insights.map(ins => `<li>${ins}</li>`).join("");
}

export function showFallback() {
  const fallbackGrowth = {
    years: ['2025', '2026', '2027'],
    values: [3.8, 4.1, 4.5]
  };

  const fallbackIncome = {
    years: ["1분위","2분위","3분위","4분위","5분위"],
    values: [20,20,20,20,20],
    highlightIndex: 2
  };

  showResultSection();
  renderTrendCharts(
    fallbackGrowth,
    fallbackIncome,
    null,   // boundary
    3500,   // averageIncome
    3       // estimatedAbsoluteQuintile
  );
  renderSummary(
    "예시: 3년간 연평균 약 4.1% 성장, 소득 중간(3분위)",
    3
  );
}
