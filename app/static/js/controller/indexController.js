<<<<<<< HEAD
import { loadCommonLayout } from '../common/layoutLoader.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadCommonLayout();

  // 버튼 클릭 시 ROUTES 기반 이동
  document.querySelector('.split-panel.left')?.addEventListener('click', () => {
    window.location.href = window.ROUTES.trend;
  });
  document.querySelector('.split-panel.right')?.addEventListener('click', () => {
    window.location.href = window.ROUTES.insight;
  });
});
=======
import { loadCommonLayout } from '../common/layoutLoader.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadCommonLayout();

  // 버튼 클릭 시 ROUTES 기반 이동
  document.querySelector('.split-panel.left')?.addEventListener('click', () => {
    window.location.href = window.ROUTES.trend;
  });
  document.querySelector('.split-panel.right')?.addEventListener('click', () => {
    window.location.href = window.ROUTES.insight;
  });
});
>>>>>>> a9ccfb7 (feat: 최신 Dockerfile 및 라우트 오류 수정 사항 반영)
