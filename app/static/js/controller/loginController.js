import { loadCommonLayout } from '../common/layoutLoader.js';
import { loginUser } from '../model/authModel.js';
import { showAlert } from '../view/authView.js';
import { saveLoginSession, isLoggedIn } from '../common/storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadCommonLayout();

  if (isLoggedIn()) {
    alert('이미 로그인된 상태입니다.');
    window.location.href = window.ROUTES.home;
    return;
  }

  const form = document.getElementById('loginForm');
  form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value.trim();
  if (!email || !password) {
    return showAlert('모든 항목을 입력해주세요.', 'error');
  }

  // 테스트 계정 처리
  if (email === 'test@example.com' && password === '1234') {
    saveLoginSession(email, '테스트유저');
    showAlert('로그인 성공!', 'success');
    return window.location.href = window.ROUTES.home;
  }

  try {
    // loginUser가 fetch를 통해 서버에 요청한다고 가정
    const res = await loginUser(email, password);

    // 서버에서 JSON { success: true/false, message, redirect } 형태로 응답한다고 가정
    if (!res.success) {
      showAlert(res.message || '로그인 실패', 'error');
      return; // 홈으로 이동하지 않음
    }

    // 성공 처리
    saveLoginSession(email, res.username || '');
    showAlert(res.message || '로그인 성공!', 'success');
    if (res.redirect) {
      window.location.href = res.redirect;
    } else {
      window.location.href = window.ROUTES.home;
    }
  } catch (err) {
    showAlert(`로그인 실패: ${err.message}`, 'error');
    // 여기서도 홈으로 이동하지 않음
  }
});

});
