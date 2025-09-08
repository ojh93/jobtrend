import * as d3 from 'https://unpkg.com/d3@7?module';
import { getSuggestedQuestions, getPlaceholderSamples } from "../model/insightModel.js";
import { renderSuggestedQuestions, rotatePlaceholders } from "../view/insightView.js";

const CSV_PATH = '/static/csv/income_quintile_distribution.csv';

// --- 시간 포맷 함수 ---
function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// --- 메시지 추가 (마크다운 지원) ---
function appendMessage(text, sender = "ai", isMarkdown = false) {
  const messagesDiv = document.getElementById("messages");

  let contentHTML = text;
  if (isMarkdown && window.marked && window.DOMPurify) {
    contentHTML = DOMPurify.sanitize(marked.parse(text));
  }

  const msgHTML = `
    <div class="message ${sender}">
      <div class="avatar">${sender === "ai" ? "AI" : "Me"}</div>
      <div class="bubble">
        <div class="message-content">${contentHTML}</div>
        <div class="meta"><span class="time">${getCurrentTime()}</span></div>
      </div>
    </div>
  `;

  messagesDiv.insertAdjacentHTML("beforeend", msgHTML);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// --- 데이터 관련 (기존 유지) ---
function uniqueJobs(rows) {
  const set = new Set(rows.map(d => d.occupation_name).filter(Boolean));
  return Array.from(set).sort();
}

function renderSkeleton(container, jobs) {
  container.innerHTML = jobs.map(job => `
    <div class="ai-card" id="card-${CSS.escape(job)}">
      <h3>${job}</h3>
      <div class="skeleton"></div>
    </div>
  `).join('');
}

function renderCard(job, data, error) {
  const el = document.getElementById(`card-${job}`);
  if (!el) return;
  if (error) {
    el.innerHTML = `<h3>${job}</h3><div class="error">생성 실패: ${error}</div>`;
    return;
  }
  const { trend_factors = [], outlook = '', certifications = [] } = data || {};
  el.innerHTML = `
    <h3>${job}</h3>
    <div class="section">
      <h4>트렌드 요인</h4>
      <ul>${trend_factors.map(f => `<li>${f}</li>`).join('')}</ul>
    </div>
    <div class="section">
      <h4>전망</h4>
      <p>${outlook}</p>
    </div>
    <div class="section">
      <h4>관련 자격증</h4>
      <ul>
        ${certifications.map(c => `
          <li>
            <strong>${c.name}</strong>
            ${c.issuer ? ` — ${c.issuer}` : ''}
            ${c.difficulty ? ` <span class="tag">${c.difficulty}</span>` : ''}
            ${c.why ? `<div class="why">${c.why}</div>` : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

async function fetchInsightsBatch(jobs) {
  const res = await fetch('/api/ai/insight/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobs })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function run() {
  const grid = document.getElementById('insightGrid');
  const limitInput = document.getElementById('limitInput');
  const csvRows = await d3.csv(CSV_PATH);
  let jobs = uniqueJobs(csvRows);
  const limit = Math.max(1, Math.min(50, Number(limitInput.value || 8)));
  jobs = jobs.slice(0, limit);
  renderSkeleton(grid, jobs);
  try {
    const results = await fetchInsightsBatch(jobs);
    const map = new Map(results.map(r => [r.job, r.data]));
    jobs.forEach(job => {
      const entry = map.get(job);
      renderCard(job, entry && !entry.error ? entry : null, entry && entry.error);
    });
  } catch (err) {
    jobs.forEach(job => renderCard(job, null, err.message));
  }
}

// --- 이벤트 초기화 ---
document.addEventListener("DOMContentLoaded", () => {
  // 환영 메시지 시간 세팅
  const welcomeTime = document.querySelector(".message.ai .time");
  if (welcomeTime) {
    welcomeTime.textContent = getCurrentTime();
  }

  const askBtn = document.getElementById("askBtn");
  const questionInput = document.getElementById("questionInput");

  // 추천 질문 버튼 렌더링
  renderSuggestedQuestions(getSuggestedQuestions(), (q) => {
    questionInput.value = q;
    askBtn.click();
  });

  // placeholder 순환
  rotatePlaceholders(getPlaceholderSamples(), "questionInput", 3000);

  // 메시지 전송
  askBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const question = (questionInput.value || "").trim();
    if (!question) return;

    appendMessage(question, "user");
    questionInput.value = "";
    appendMessage("AI가 응답을 준비 중입니다...", "ai");

    try {
      const res = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();

      const aiMsgs = document.querySelectorAll(".message.ai .bubble .message-content");
      const lastAiMsg = aiMsgs[aiMsgs.length - 1];
      if (lastAiMsg) {
        lastAiMsg.innerHTML = DOMPurify.sanitize(marked.parse(data.answer || data.error || "오류가 발생했습니다."));
      }
    } catch {
      const aiMsgs = document.querySelectorAll(".message.ai .bubble .message-content");
      const lastAiMsg = aiMsgs[aiMsgs.length - 1];
      if (lastAiMsg) {
        lastAiMsg.textContent = "네트워크 또는 서버 오류가 발생했습니다.";
      }
    }
  });

  // 엔터키 전송
  questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askBtn.click();
    }
  });
});
