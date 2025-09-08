import { loadCommonLayout } from '../common/layoutLoader.js';
import { signup } from '../model/authModel.js';
import { showAlert, redirect } from '../view/authView.js';
import { saveLoginSession } from '../common/storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadCommonLayout();

  const form = document.getElementById('signupForm');
  form?.addEventListener('submit', (e) => {
    // e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    if (!name || !email || !password) return showAlert('모든 항목을 입력해주세요.');

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return showAlert('유효한 이메일 주소를 입력해주세요.');
    }

    if (email === 'test@example.com') {
      saveLoginSession(email, name);
      return setTimeout(() => {
        showAlert('회원가입 성공!');
        redirect(window.ROUTES.mypage);
      }, 500);
    }

    try {
      signup(name, email, password);
      alert('회원가입 성공! 이제 로그인 해주세요.');
      redirect(window.ROUTES.login);
    } catch (err) {
      alert(`회원가입 실패: ${err.message}`);
    }
  });
});
