// static/js/model/authModel.js

const API_BASE = '/auth'; // Flask에서 auth 관련 라우트 prefix

// 📌 회원가입
export async function registerUser({ name, email, password }) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
    credentials: 'include'
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || '회원가입 실패');
  return data; // { message: '회원가입 성공', redirect: '/auth/login' }
}

/**
 * 서버에 로그인 요청을 보내고 결과를 반환
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success:boolean, message:string, redirect?:string, username?:string}>}
 */
export async function loginUser(email, password) {
  try {
    const res = await fetch(window.ROUTES.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 세션 쿠키 포함
      body: JSON.stringify({ email, password })
    });

    // JSON 파싱 시도
    const data = await res.json().catch(() => ({}));

    // HTTP 상태 코드와 success 값 확인
    if (!res.ok || data.success === false) {
      // 서버에서 message를 내려주면 사용, 없으면 기본 메시지
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    // 성공 시 데이터 반환
    return {
      success: true,
      message: data.message || '로그인 성공!',
      redirect: data.redirect,
      username: data.username
    };
  } catch (err) {
    // 호출한 쪽에서 catch로 처리할 수 있도록 throw
    throw err;
  }
}



// 📌 로그아웃
export async function logoutUser() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || '로그아웃 실패');
  // 로그아웃 후 페이지 이동
  window.location.replace(data.redirect || '/auth/login');
}
// 📌 개인정보 수정
// oldEmail, name, email, password를 받아 서버에 전달
export async function updateProfile(oldEmail, name, email, password) {
  const res = await fetch(`${API_BASE}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldEmail, name, email, password }),
    credentials: 'include'
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || '정보 수정 실패');
  return data; // { message: '정보 수정 성공' }
}

// 📌 회원탈퇴
// password를 받아 서버에 전달
export async function deleteUserAccount(password) {
  const res = await fetch(`${API_BASE}/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
    credentials: 'include'
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || '회원탈퇴 실패');
  return data; // { message: '회원탈퇴 완료', redirect: '/auth/login' }
}
