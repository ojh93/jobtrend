import * as d3 from 'https://unpkg.com/d3@7?module';
import { loadCommonLayout } from '../common/layoutLoader.js';
import { fetchPrediction } from '../model/trendModel.js';
import { renderSalaryChart, renderGrowthChart } from '../view/growthChart.js';
import { generateInsights } from '../utils/insightGenerator.js';
import { renderSummary, showResultSection, showFallback } from '../view/trendView.js';
import { saveTrendHistory } from '../model/mypageModel.js';

function updateJobOptions(jobs) {
  const datalist = document.getElementById('jobList');
  if (!datalist) return;
  datalist.innerHTML = '';
  jobs.forEach(job => {
    const option = document.createElement('option');
    option.value = job;
    datalist.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadCommonLayout();

  let [growthCSV, incomeCSV] = [[], []];
  try {
    [growthCSV, incomeCSV] = await Promise.all([
      d3.csv('/static/csv/growth_prediction.csv'),
      d3.csv('/static/csv/income_quintile_distribution.csv')
    ]);
  } catch (err) {
    console.error('CSV 로딩 실패:', err);
  }

  const jobs = [...new Set(incomeCSV.map(d => d.occupation_name))].sort();
  updateJobOptions(jobs);

  const baseYearSelect = document.getElementById('baseYear');
  for (let y = 1998; y <= 2023; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    baseYearSelect.appendChild(opt);
  }

  const params = new URLSearchParams(location.search);
  const jobFromQuery = params.get('job');
  if (jobFromQuery) {
    document.querySelector('.trend-title').textContent = `${jobFromQuery} 직군 트렌드`;
    document.getElementById('jobSearch').value = jobFromQuery;
  }

  document.getElementById('predictForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!growthCSV.length || !incomeCSV.length) return alert('예측 데이터가 아직 로딩되지 않았습니다.');

    const job = document.getElementById('jobSearch').value.trim();
    const year = document.getElementById('baseYear').value;
    if (!job || !year) return alert('모든 항목을 입력해주세요.');

    const button = e.target.querySelector('button');
    button.disabled = true;
    button.textContent = '예측 중...';

    try {
      // 1. 예측 실행
      const prediction = await fetchPrediction({ jobGroup: job, year, growthCSV, incomeCSV });
      const insights = generateInsights(prediction);

      // 2. 결과 영역 먼저 표시
      showResultSection();

      // 3. 약간 지연 후 차트 렌더링 (축소 방지)
      setTimeout(() => {
        renderGrowthChart(prediction.growthRates);
        renderSalaryChart(
          prediction.incomeLevel,
          prediction.estimatedAbsoluteQuintile,
          prediction.boundary,
          prediction.boundarySource,
          prediction.averageIncome ?? 3500,
          true
        );
        renderSummary(prediction.summary, prediction.estimatedAbsoluteQuintile, insights);
      }, 50);

      // 4. 예측 성공 시 자동 저장
      await saveTrendHistory({ job: job, year: year });

      alert('예측 완료! 마이페이지에 이력이 저장되었습니다.');
    } catch (err) {
      console.warn('[예측 실패]', err);
      alert(err.message || '예측에 실패했습니다.');
      showFallback();
    } finally {
      button.disabled = false;
      button.textContent = '🚀 예측 시작';
    }
  });
});
