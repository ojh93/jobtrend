


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
