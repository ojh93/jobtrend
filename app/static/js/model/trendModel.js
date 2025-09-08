// js/model/trendModel.js

// 머신러닝 예측에 쓸 기본 통계(더미)
export async function fetchDefaultMetrics(job, year) {
  console.log(`[mock] 기본 통계 요청: ${job}, ${year}`);
  const mockDatabase = {
    "정보통신업": { averageGrowth: 4.5, averageIncome: 3600 },
    "금융업":     { averageGrowth: 3.8, averageIncome: 4100 },
    "제조업":     { averageGrowth: 3.2, averageIncome: 3000 }
  };
  const fallback = { averageGrowth: 3.5, averageIncome: 3500 };
  return Promise.resolve(mockDatabase[job] || fallback);
}

// 예측용 모델 함수
export async function fetchPrediction({ jobGroup, year, growthCSV, incomeCSV }) {
  // 1) 성장률 데이터 매칭 & 보간
  let growthData = growthCSV.filter(d =>
    d.occupation_name === jobGroup &&
    +d.year >= +year &&
    +d.year <= +year + 2
  );

  // 1차 fallback: 근접 연도로 채우기
  if (growthData.length < 3) {
    const candidates = growthCSV.filter(d => d.occupation_name === jobGroup);
    const knownYears = new Set(growthData.map(d => +d.year));
    [year, +year+1, +year+2]
      .filter(y => !knownYears.has(y))
      .forEach(missingY => {
        const closest = candidates.reduce((best, d) =>
          Math.abs(+d.year - missingY) < Math.abs(+best.year - missingY) ? d : best,
          candidates[0]
        );
        if (closest) {
          growthData.push({
            year: missingY,
            predicted_growth:
              parseFloat(closest.predicted_growth) + 0.1 * (missingY - +closest.year)
          });
        }
      });
  }
  // 2차 fallback: 전체 평균 보간
  if (growthData.length < 3) {
    const avg = growthCSV.reduce((sum, d) => sum + parseFloat(d.predicted_growth), 0)
                / growthCSV.length;
    growthData = [0,1,2].map(offset => ({
      year: +year + offset,
      predicted_growth: avg + 0.1 * offset
    }));
  }

  const growthRates = {
    years: growthData.map(d => d.year),
    values: growthData.map(d => (+d.predicted_growth * 100).toFixed(2))
  };

  // 2) CSV 기반 소득 분위 비율 읽어오기
  let row = incomeCSV.find(d =>
    d.occupation_name === jobGroup && +d.year === +year
  );
  if (!row) {
    // fallback: 같은 직군에서 연도 가장 근접한 행
    const same = incomeCSV.filter(d => d.occupation_name === jobGroup);
    if (same.length) {
      row = same.reduce((best, d) =>
        Math.abs(+d.year - +year) < Math.abs(+best.year - +year) ? d : best,
        same[0]
      );
    }
  }

  // 없으면 균등분포
  const raw = row
    ? [
        parseFloat(row.quintile_0),
        parseFloat(row.quintile_1),
        parseFloat(row.quintile_2),
        parseFloat(row.quintile_3),
        parseFloat(row.quintile_4)
      ]
    : [0.2,0.2,0.2,0.2,0.2];

  const values    = raw.map(v => Math.round(v * 100));          // 0~100 정수 백분율
  const highlight = values.indexOf(Math.max(...values));        // 최다 분포 분위

  return {
    jobGroup,
    growthRates,
    incomeLevel: {
      years: ["1분위","2분위","3분위","4분위","5분위"],
      values,
      highlightIndex: highlight
    },
    summary: `${year}년 '${jobGroup}' 직군의 예측 결과입니다.`,
    growthExplanation: "",      // 필요하면 채워서 사용
    estimatedAbsoluteQuintile: highlight + 1
  };
}