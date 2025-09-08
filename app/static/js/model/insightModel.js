// js/model/insightModel.js

// 1번 & 2번 기능 데이터 불러오기
import { suggestedQuestions, placeholderSamples } from "../utils/insightGenerator.js";

// 내부 저장 배열 (서버에서 가져온 인사이트들)
let insights = [];

// 인사이트 요청
export async function requestInsight(question, education, career) {
  const res = await fetch('/api/insight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, education, career })
  });
  const data = await res.json();

  // insights 배열에 저장 (페이지 내 사용 목적)
  if (data) {
    insights.push({
      id: Date.now(),
      question,
      education,
      career,
      ...data
    });
  }

  return data;
}

// 인사이트 전체 조회
export function getInsights() {
  return insights;
}

// 인사이트 삭제
export function deleteInsight(id) {
  const index = insights.findIndex(item => item.id === id);
  if (index !== -1) insights.splice(index, 1);
}

// === 1번 기능: 추천 질문 목록 제공 ===
export function getSuggestedQuestions() {
  return suggestedQuestions;
}

// === 2번 기능: placeholder 문구 목록 제공 ===
export function getPlaceholderSamples() {
  return placeholderSamples;
}
