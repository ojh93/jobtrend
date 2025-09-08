// static/js/common/layoutLoader.js
import { clearLoginSession } from './storage.js';
import { logoutUser } from '../model/authModel.js';
import { clearAuthStorage } from './storage.js';
let initialized = false;

function injectRoutes(root = document) {
  if (!window.ROUTES) return;

  const map = [
    ['.nav-logo', 'home'],
    ['.nav-home', 'home'],
    ['.nav-trend', 'trend'],
    ['.nav-insight', 'insight'],
    ['.nav-login', 'login']
    // '.nav-mypage'는 의도적으로 제외
  ];

  for (const [selector, key] of map) {
    root.querySelectorAll(selector).forEach(a => {
      if (window.ROUTES[key]) a.setAttribute('href', window.ROUTES[key]);
    });
  }
}

function bindHeaderInteractions(root = document) {
  // 헤더 루트 탐색: <header> 우선, 없으면 대체 선택자
  const headerEl = root.querySelector('header, .site-header, #site-header');
  if (!headerEl) return;

  // 햄버거 토글
  const hamburgerBtn = headerEl.querySelector('.hamburger');
  const navMenu = headerEl.querySelector('.nav-menu');
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // 로그인/로그아웃 링크 처리
  const email = localStorage.getItem('userEmail');
  const loginLink = headerEl.querySelector('.login-link');

  if (email && loginLink) {
    // 로그인 상태로 간주 → 로그아웃 링크로 전환
    loginLink.textContent = '로그아웃';
    loginLink.setAttribute('href', '#');
    loginLink.addEventListener(
      'click',
      e => {
        e.preventDefault();
        clearLoginSession();
        if (window.ROUTES?.logout) {
          window.location.href = window.ROUTES.logout;
        } else {
          window.location.reload();
        }
      },
      { once: true }
    );

    // 메뉴에 마이페이지 항목 동적 추가(중복 방지)
    if (navMenu) {
      const mypageUrl = window.ROUTES?.mypage || '/mypage'; // fallback 보장
      const exists = navMenu.querySelector(`a[href="${mypageUrl}"]`);
      if (!exists) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${mypageUrl}">마이페이지</a>`;
        navMenu.appendChild(li);
      }
    }
  }
}

function initFooter(root = document) {
  const copy = root.querySelector('.footer-copy');
  if (copy) copy.textContent = `© ${new Date().getFullYear()} JobTrends`;
}

function hideLoader(root = document) {
  // include로 이미 붙어있는 로더를 감추는 용도
  const loaderEl = root.querySelector('.loader');
  if (loaderEl) loaderEl.style.setProperty('display', 'none');
}

/**
 * Jinja include 구조용 초기화:
 * - 컴포넌트 fetch 제거
 * - DOM에 이미 존재하는 헤더/푸터에 이벤트 바인딩
 * - 라우트 주입 및 로더 정리
 */
export function loadCommonLayout() {
  if (initialized) return;
  initialized = true;

  injectRoutes(document);
  bindHeaderInteractions(document);
  initFooter(document);
  hideLoader(document);
}

// 자동 초기화: 다른 코드가 명시적으로 호출하지 않아도 동작
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCommonLayout, { once: true });
} else {
  loadCommonLayout();
}




document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                // 1. 클라이언트 저장소 초기화
                clearLoginSession();
                clearAuthStorage();

                // 2. 서버 세션 삭제 (logoutUser는 /auth/logout 호출)
                const result = await logoutUser();

                // 3. 로그인 페이지로 이동
                window.location.replace(result?.redirect || '/auth/login');
            } catch (err) {
                alert(err.message || '로그아웃 실패');
            }
        });
    }
});