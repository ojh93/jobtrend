<<<<<<< HEAD



// js/view/indexView.js

/**
 * 메인 페이지 CTA(네비 버튼) 이벤트 연결
 */
export function renderCTA() {
  document.querySelectorAll('.nav-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      const href = btn.dataset.href;
      if (href) {
        window.location.href = href;
      }
    });
  });
}
=======



// js/view/indexView.js

/**
 * 메인 페이지 CTA(네비 버튼) 이벤트 연결
 */
export function renderCTA() {
  document.querySelectorAll('.nav-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      const href = btn.dataset.href;
      if (href) {
        window.location.href = href;
      }
    });
  });
}
>>>>>>> a9ccfb7 (feat: 최신 Dockerfile 및 라우트 오류 수정 사항 반영)
