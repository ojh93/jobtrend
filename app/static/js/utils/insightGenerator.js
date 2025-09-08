// js/utils/insightGenerator.js

/**
 * 예측 결과를 바탕으로 텍스트 인사이트 배열 생성
 * @param {Object} prediction 
 * @param {string} prediction.jobGroup – 사용자 입력 직군명
 * @param {{ years: string[], values: string[] }} prediction.growthRates – 성장률 예측치
 * @param {{ years: string[], values: number[], highlightIndex: number }} prediction.incomeLevel – 소득 분위 분포 및 강조 인덱스
 * @param {number} prediction.estimatedAbsoluteQuintile – 소득 절대 분위 (1~5)
 * @returns {string[]} 인사이트 문장 목록
 */
export function generateInsights({
  jobGroup,
  growthRates: { years: growthYears, values: growthValues },
  incomeLevel: { values: quintileValues, highlightIndex },
  estimatedAbsoluteQuintile
}) {
  const insights = [];

  // 1) 성장률 변화
  const startRate = parseFloat(growthValues[0]);
  const endRate = parseFloat(growthValues[growthValues.length - 1]);
  const delta = (endRate - startRate).toFixed(2);
  insights.push(
    `예측 성장률: ${growthYears[0]}년 ${startRate}% → ` +
    `${growthYears[growthYears.length - 1]}년 ${endRate}% ` +
    `(${delta >= 0 ? '+' : ''}${delta}%p)`
  );

  // 2) 소득분포 집중 분위
  const dominantQuintile = highlightIndex + 1;
  const dominantPercent = quintileValues[highlightIndex];
  insights.push(
    `${jobGroup} 직군의 소득 분포 중 ` +
    `${dominantQuintile}분위에 약 ${dominantPercent}%의 직원이 몰려 있습니다.`
  );

  // 3) 직군별 동적 소득 위치
  let positionMsg;
  switch (estimatedAbsoluteQuintile) {
    case 1:
      positionMsg = '전체 노동자 중 하위 20%에 해당해 소득이 낮은 편입니다.';
      break;
    case 2:
      positionMsg = '전체 노동자 중 하위 40% 구간에 있어 개선 여지가 있습니다.';
      break;
    case 3:
      positionMsg = '전체 노동자 중 중간 20%에 위치해 평균 수준의 소득입니다.';
      break;
    case 4:
      positionMsg = '전체 노동자 중 상위 40% 구간에 속해 비교적 높은 소득입니다.';
      break;
    case 5:
      positionMsg = '전체 노동자 중 상위 20%에 해당해 소득 상위권입니다.';
      break;
    default:
      positionMsg = '소득 위치를 정확히 파악할 수 없습니다.';
  }
  insights.push(`${jobGroup} 직군은 ${positionMsg}`);

  // 4) 추천 액션
  const action = estimatedAbsoluteQuintile <= 2
    ? `${jobGroup} 분야에서 추가 스킬업 또는 자격증 취득을 고려해보세요.`
    : `${jobGroup} 분야에서 현재 강점을 활용해 연봉 협상 또는 이직을 검토해보세요.`;
  insights.push(`추천 액션: ${action}`);

  return insights;
}

/* ------------------------------
 * 1번 기능: 추천 질문 데이터
 * ------------------------------ */
export const suggestedQuestions = [
  "데이터 분석가의 향후 5년 전망은 어떨까?",
  "프론트엔드 개발자에게 필요한 핵심 스킬은?",
  "게임 산업의 평균 연봉은 얼마일까?",
  "마케팅 직군 이직 시 유리한 경로는 뭐야?",
  "재생에너지 분야의 해외 취업 기회가 많을까?"
];

/* ------------------------------
 * 2번 기능: placeholder 문구 데이터
 * ------------------------------ */
export const placeholderSamples = [
  "AI 개발자의 미래 전망은?",
  "데이터 분석가로 커리어 전환 가능성",
  "마케팅 분야 연봉 협상 팁",
  "프론트엔드 개발자의 필수 스킬",
  "디자이너 해외 취업 전략"
];