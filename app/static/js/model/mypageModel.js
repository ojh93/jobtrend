// js/model/mypageModel.js

// 서버에서 마이페이지 데이터 가져오기
export async function fetchMypageData() {
  const res = await fetch('/mypage/data', { credentials: 'include' });
  if (!res.ok) throw new Error('데이터 불러오기 실패');
  return res.json();
}

// 서버 API — 인사이트 이력 삭제
export async function deleteInsightHistory(id) {
  const res = await fetch(`/api/insight/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('삭제 실패');
  return res.json();
}

// 프로필 수정
export async function updateUserProfile(name, email) {
  const res = await fetch('/profile/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email })
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || '수정 실패');
  return data;
}

// trend 예측 + 자동 저장
export async function saveTrendHistory(trendData) {
  const res = await fetch('/trend/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trendData),
    credentials: 'include'
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || '트렌드 이력 저장 실패');
  return data; // { prediction: "...결과..." }
}

// ✅ 로그아웃 API 호출
export async function logoutUser() {
  const res = await fetch('/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('로그아웃 실패');
  return res.json();
}
