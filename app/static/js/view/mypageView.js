// static/js/view/mypageView.js

import { clearLoginSession, saveLoginSession } from '../common/storage.js';
import { deleteUserAccount, updateProfile } from '../model/authModel.js'; 
// updateProfile: (oldEmail, name, email, password) 형태로 서버에 PUT 요청

/**
 * 1) 이력 카드 클릭 이동
 */
export function initCardClickEvents() {
  document.getElementById('insightCards')?.addEventListener('click', e => {
    if (e.target.closest('.delete-btn')) return;
    const card = e.target.closest('.interest-card[data-insight-id]');
    if (!card) return;
    const paragraphs = card.querySelectorAll('p');
    const summary = paragraphs[paragraphs.length - 1]?.innerText;
    if (summary) localStorage.setItem('selectedInsightText', summary);
    window.location.href = 'insight.html';
  });

  document.getElementById('trendCards')?.addEventListener('click', e => {
    if (e.target.closest('.delete-btn')) return;
    const card = e.target.closest('.interest-card[data-trend-id]');
    if (!card) return;
    const jobName = card.querySelector('h4')?.innerText;
    if (jobName) localStorage.setItem('selectedInterestJob', jobName);
    window.location.href = `trend.html?job=${encodeURIComponent(jobName)}`;
  });
}

/**
 * 2) 개인정보 수정 폼
 */
export function initUserForm() {
  const editBtn = document.querySelector('.ai-card .primary-btn');
  const nameField = document.querySelector('input[name="name"]');
  const emailField = document.querySelector('input[name="email"]');

  editBtn?.addEventListener('click', async () => {
    const isEditing = editBtn.textContent.trim() === '수정 완료';

    if (isEditing) {
      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const oldEmail = localStorage.getItem('userEmail');
      const password = prompt('비밀번호를 입력하세요'); // 서버 검증용

      if (!name || !email || !password) {
        alert('이름, 이메일, 비밀번호를 모두 입력해주세요.');
        return;
      }
      try {
        await updateProfile(oldEmail, name, email, password);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        saveLoginSession(email, name);
        nameField.disabled = true;
        emailField.disabled = true;
        editBtn.textContent = '개인정보 수정';
        alert('개인정보가 수정되었습니다.');
      } catch (err) {
        alert(err.message);
      }
    } else {
      nameField.disabled = false;
      emailField.disabled = false;
      nameField.focus();
      editBtn.textContent = '수정 완료';
    }
  });
}

/**
 * 3) 저장된 사용자 정보 로드
 */
export function loadSavedUserInfo() {
  const nameField = document.querySelector('input[name="name"]');
  const emailField = document.querySelector('input[name="email"]');
  const name = localStorage.getItem('userName');
  const email = localStorage.getItem('userEmail');
  if (name && nameField) nameField.value = name;
  if (email && emailField) emailField.value = email;
}

/**
 * 4) 회원 탈퇴
 */
export function initWithdrawal() {
  const deleteBtn = document.querySelector('.ai-card .warn-btn');
  const modal = document.getElementById('withdrawalModal');
  const pwdInput = document.getElementById('withdrawalPassword');
  const confirmBtn = document.getElementById('withdrawalConfirmBtn');
  const cancelBtn = document.getElementById('withdrawalCancelBtn');

  deleteBtn?.addEventListener('click', () => {
    pwdInput.value = '';
    modal.classList.remove('hidden');
    pwdInput.focus();
  });

  confirmBtn?.addEventListener('click', async () => {
    const password = pwdInput.value.trim();
    if (!password) {
      alert('비밀번호를 입력하세요.');
      return;
    }

    confirmBtn.disabled = true; // 중복 클릭 방지

    try {
      const result = await deleteUserAccount(password);
      clearLoginSession();
      modal.classList.add('hidden');
      alert('회원 탈퇴가 완료되었습니다.');
      const next = result?.redirect || '/auth/login';
      window.location.replace(next);
    } catch (err) {
      alert(err.message);
    } finally {
      confirmBtn.disabled = false;
    }
  });

  cancelBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
}

/**
 * 5) 인사이트 카드 렌더
 */
export function renderInsightCard({ id, job, summary, education, career, date }) {
  const container = document.getElementById('insightCards');
  const card = document.createElement('div');
  card.className = 'interest-card';
  card.dataset.insightId = id;
  card.innerHTML = `
    <h4>${new Date(date).toLocaleDateString()} – ${job}</h4>
    <p>
      ${education ? `<span>🎓 ${education}</span> ` : ''}
      ${career ? `<span>⏱️ ${career}</span>` : ''}
    </p>
    <p>${summary}</p>
    <button class="delete-btn" title="삭제">❌</button>
  `;
  container.appendChild(card);
}
