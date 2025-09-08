// js/controller/mypageController.js
import { loadCommonLayout } from '../common/layoutLoader.js';
import {
  initCardClickEvents,
  initUserForm,
  initWithdrawal,
  renderInsightCard
} from '../view/mypageView.js';
import { fetchMypageData, deleteInsightHistory } from '../model/mypageModel.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadCommonLayout();

  initCardClickEvents();
  initUserForm();
  initWithdrawal();

  try {
    const data = await fetchMypageData();

    // 사용자 정보 세팅
    document.querySelector('input[name="name"]').value = data.user.name;
    document.querySelector('input[name="email"]').value = data.user.email;

    // AI 인사이트 카드 렌더링
    data.insights.forEach(item => renderInsightCard(item));

    // 📌 트렌드 예측 이력 렌더링
    const trendList = document.getElementById('trendHistoryList');
    if (trendList && data.trend_history) {
      trendList.innerHTML = '';
      if (data.trend_history.length === 0) {
        trendList.innerHTML = '<li>저장된 트렌드 예측 이력이 없습니다.</li>';
      } else {
        data.trend_history.forEach(t => {
          const li = document.createElement('li');
          li.textContent = `${t.year}년 ${t.job} (예측일: ${t.created_at})`;
          trendList.appendChild(li);
        });
      }
    }

    // 인사이트 카드 삭제 이벤트
    document.getElementById('insightCards')?.addEventListener('click', async e => {
      const btn = e.target.closest('.delete-btn');
      const card = e.target.closest('.interest-card[data-insight-id]');
      if (btn && card) {
        try {
          await deleteInsightHistory(card.dataset.insightId);
          card.remove();
          alert('삭제되었습니다.');
        } catch (err) {
          alert(err.message);
        }
      }
    });

  } catch (err) {
    alert(err.message);
  }
  });
