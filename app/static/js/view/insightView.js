// js/view/insightView.js


// 2) 인사이트 상세 카드 렌더러
export function renderInsightDetailCard({ job, education, career, data }) {
  const container = document.getElementById("insightCards");
  const card = document.createElement("div");
  card.className = "interest-card insight-card";
  card.dataset.insightId = `${Date.now()}`;

  card.innerHTML = `
    <div class="user-summary">
      ${education ? `<span>🎓 ${education}</span>` : ''}
      ${career    ? `<span>⏱️ ${career}</span>`    : ''}
    </div>
    <hr/>
    <p><strong>📌 트렌드 요인:</strong><br/>${data.cause}</p>
    <p><strong>🚀 진입 전략:</strong><br/>${data.strategy}</p>
    <p><strong>🔄 이직 루트:</strong><br/>${data.routes}</p>
    <p class="generated-by">⚡ GPT 기반 AI 인사이트 자동 생성</p>
    
  `;

  container.appendChild(card);
  document.querySelector('.ai-output-area').style.display = 'block';
}

// 3) 챗버블 렌더러
export function renderChatBubble(role, text) {
  const chatLog = document.getElementById('chatLog');
  const bubble  = document.createElement('div');
  bubble.className = `bubble ${role}`;
  bubble.innerText = text;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// 4) 폼 리셋 & 결과 영역 숨김
export function resetInsightForm() {
  document.getElementById('insightCards').innerHTML = '';
  document.querySelector('.ai-output-area').style.display = 'none';
  ['education','career'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

}

// 5) 인사이트 폼 초기화 (reset + 숨김)
export function initInsightForm() {
  resetInsightForm();
}

// 6) GPT 챗봇 이벤트 바인딩
export function initChatbot() {
  // 추천 질문 클릭
  document.querySelectorAll('.question-suggestions li').forEach(li => {
    li.addEventListener('click', () => {
      document.getElementById('chatInput').value = li.dataset.q;
    });
  });

  // 전송 버튼 클릭
  document.getElementById('chatSend')?.addEventListener('click', async () => {
    const inputEl = document.getElementById('chatInput');
    const msg = inputEl.value.trim();
    if (!msg) return;
    renderChatBubble('user', msg);
    inputEl.value = '';

    try {
      const res = await fetch('/api/insight/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: msg })
      });
      const { answer } = await res.json();
      renderChatBubble('ai', answer || '응답이 없습니다.');
    } catch {
      renderChatBubble('ai', '죄송합니다. 응답에 실패했습니다.');
    }
  });
}

// 7) 마이페이지용 인사이트 카드 뷰 (선택)
export function renderInsightCard(id, title, content) {
  const container = document.getElementById("insightCards");
  const card = document.createElement("div");
  card.className = "interest-card insight-card";
  card.dataset.insightId = id;
  card.innerHTML = `
    <h4>${title}</h4>
    <p>${content}</p>
    <button class="delete-btn" title="삭제">❌</button>
  `;
  container.appendChild(card);
}

// 8) 카드 제거
export function removeInsightCard(id) {
  const card = document.querySelector(`.insight-card[data-insight-id="${id}"]`);
  if (card) card.remove();
}

// === [추가] 1번 기능: 추천 질문 버튼 렌더링 ===
export function renderSuggestedQuestions(questions, onClick) {
  const container = document.getElementById("suggestedQuestions");
  if (!container) return;
  container.innerHTML = "";
  questions.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "suggested-btn";
    btn.textContent = q;
    btn.addEventListener("click", () => onClick(q));
    container.appendChild(btn);
  });
}

// === [추가] 2번 기능: placeholder 순환 변경 ===
export function rotatePlaceholders(placeholders, inputId, interval = 3000) {
  let idx = 0;
  const input = document.getElementById(inputId);
  if (!input) return;
  setInterval(() => {
    input.placeholder = `예: ${placeholders[idx]}`;
    idx = (idx + 1) % placeholders.length;
  }, interval);
}
