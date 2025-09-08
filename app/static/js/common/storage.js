// js/common/storage.js

const SESSION_KEY_LOGGED_IN = 'isLoggedIn';
const SESSION_KEY_EMAIL    = 'userEmail';
const SESSION_KEY_NAME     = 'userName';

/**
 * 로그인 세션 저장
 * @param {string} email 
 * @param {string} name 
 */
export function saveLoginSession(email, name = '') {
  localStorage.setItem(SESSION_KEY_LOGGED_IN, 'true');
  localStorage.setItem(SESSION_KEY_EMAIL, email);
  if (name) localStorage.setItem(SESSION_KEY_NAME, name);
}

/**
 * 로그인 세션 제거
 */
export function clearLoginSession() {
  localStorage.removeItem(SESSION_KEY_LOGGED_IN);
  localStorage.removeItem(SESSION_KEY_EMAIL);
  localStorage.removeItem(SESSION_KEY_NAME);
}

/**
 * 세션에서 이메일 조회
 * @returns {string}
 */
export function getUserEmail() {
  return localStorage.getItem(SESSION_KEY_EMAIL) || '';
}

/**
 * 세션에서 사용자명 조회
 * @returns {string}
 */
export function getUserName() {
  return localStorage.getItem(SESSION_KEY_NAME) || '';
}

/**
 * 로그인 여부 확인
 * @returns {boolean}
 */
export function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY_LOGGED_IN) === 'true';
}

// static/js/common/storage.js
export function clearAuthStorage() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('auth_token'); // 토큰 쓰는 경우
    localStorage.clear();
    sessionStorage.clear(); // 세션 스토리지 전체 삭제
}
