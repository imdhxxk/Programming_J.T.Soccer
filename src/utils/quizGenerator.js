import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallbackQuiz, getFallbackIntro } from './quizBank';

// ── 레벨별 학습 단계 정의 ────────────────────────────────────────
export const LEVEL_INFO = {
  1: {
    label: 'STEP 1 — 기초 (Lv.1 풋살 루키)',
    rules: `기본 규칙: 팀당 선수 11명, 경기 시간 90분(전·후반 각 45분), 교체 횟수 최대 5회,
오프사이드(조건과 예외), 옐로카드/레드카드 기준,
세트피스 종류(코너킥·골킥·스로인·페널티킥)와 규칙`,
    players: `기본 포지션 역할: GK(골키퍼), DF(수비수), MF(미드필더), FW(공격수),
쉽게 알 수 있는 세계적인 축구 선수 (메시, 호날두, 손흥민 등) 이름과 포지션`,
    managers: `감독의 기본 역할: 선발 명단 결정, 교체 카드 사용, 팀 훈련 지도,
유명 감독 이름: 거스 히딩크(한국), 박지성 시절 퍼거슨(맨유)`,
    difficulty: '쉬움 — 축구를 처음 배우는 학생 수준',
    tip: '정답은 100% 명확해야 하며, 헷갈릴 여지가 없어야 함',
  },
  2: {
    label: 'STEP 2 — 아마추어 (Lv.2)',
    rules: `오프사이드 상세(기준 시점, 신체 부위 기준), 직접·간접 프리킥 차이,
VAR 시스템 개요(어떤 상황에 개입하는지), 경기 중단 규칙`,
    players: `포지션별 세부 역할: ST, CAM, CDM, CB, LB/RB,
패스 종류(숏패스·롱패스·스루패스·크로스), 슈팅 기법,
현역 유명 선수 특징 (음바페의 속도, 살라의 드리블 등)`,
    managers: `기본 전술 포메이션: 4-4-2 vs 4-3-3 vs 3-5-2,
교체 전술(수비적/공격적 교체),
유명 감독: 위르겐 클롭(리버풀), 카를로 안첼로티(레알)`,
    difficulty: '보통 — 축구를 즐기는 팬 수준',
    tip: '헷갈리기 쉬운 규칙이나 포지션 혼동을 노려 출제',
  },
  3: {
    label: 'STEP 3 — 세미프로 (Lv.3)',
    rules: `오프사이드 트랩, 세트피스 세부 규칙(페널티킥 리바운드, 코너킥 오프사이드 없음),
경고 누적 출장 정지, 추가 시간 산정 기준`,
    players: `유명 선수 플레이 스타일 분석: 메시(드리블·비전), 호날두(헤딩·슈팅),
손흥민(양발 능력), 음바페(역습), 데브라위너(패스),
역사적 명선수: 마라도나, 호나우두(브라질), 지단`,
    managers: `전술 스타일 분석:
- 펩 과르디올라(맨시티): 포지셔널 플레이, 높은 수비 라인
- 위르겐 클롭(리버풀): 게겐프레싱, 하이 인텐시티
- 주제 무리뉴: 파킹더버스, 수비 조직력`,
    difficulty: '어려움 — 축구 전술을 이해하는 열성 팬 수준',
    tip: '실제 경기 사례나 유명 감독의 명언을 활용해 흥미롭게 출제',
  },
  4: {
    label: 'STEP 4 — 프로페셔널 (Lv.4)',
    rules: `핸드볼 새 규정, DOGSO 판정, 페어플레이 규정, FFP(재정 공정성)`,
    players: `포지션별 특화 능력치, 발롱도르 수상자,
포지션 변화 사례(CF→Falso 9, 풀백의 현대적 역할),
숨겨진 스탯: xG, 키패스, 프레스 횟수`,
    managers: `전술 트렌드: 하이라인 수비, 인버티드 윙어, 더블 피봇,
유명 감독 철학 비교: 과르디올라 vs 클롭 vs 무리뉴,
감독 교체가 팀에 미치는 영향, 홍명보·클린스만 체제 논란`,
    difficulty: '매우 어려움 — 축구 마니아 수준',
    tip: '통계 수치나 구체적 경기 결과를 활용해 전문성 높이기',
  },
  5: {
    label: 'STEP 4+ — 월드클래스 (Lv.5)',
    rules: `국제 대회 특별 규칙, FIFA 규정 역사적 변천사, 심판 판정의 법적 기준`,
    players: `역사상 최고 선수 논쟁(GOAT), 포지션별 역대 최고,
데이터 축구: xG·PPDA·OBV 지표, 선수 시장 가치 분석`,
    managers: `전술 혁명가: 요한 크루이프(토탈 풋볼), 아리고 사키(4-4-2),
역대 가장 성공한 감독 논쟁, 감독 심리전·기자회견 전략`,
    difficulty: '최고 난이도 — 축구 전문 해설가·기자 수준',
    tip: '역사적 사실과 현대 통계를 결합한 심층 분석 문제 출제',
  },
};

const FORMAT_GUIDE = `
JSON 형식 (유형별):
- 객관식: {"type":"multipleChoice","category":"선수|감독","question":"질문","options":["A","B","C","D"],"answer":인덱스(0~3),"explanation":"해설"}
- OX: {"type":"oxQuiz","category":"선수|감독","question":"참/거짓 판단 문장","answer":true또는false,"explanation":"해설"}
- 빈칸: {"type":"fillBlank","category":"선수|감독","question":"[___]가 포함된 문장","answer":"정답단어","hint":"힌트","explanation":"해설"}
`;

// ── 클라이언트 생성 ──────────────────────────────────────────────
function makeClient(apiKey) {
  return new GoogleGenerativeAI(apiKey);
}

export function resolveApiKey(settingsKey) {
  return settingsKey || import.meta.env.VITE_GEMINI_API_KEY || '';
}

// ── 학습 인트로 카드 생성 (주제별) ──────────────────────────────
// topic: '선수' | '감독' | 'mixed' | 'daily'
export async function generateIntro(topic, userLevel, settingsKey) {
  const level = Math.min(Math.max(userLevel, 1), 5);
  const apiKey = resolveApiKey(settingsKey);
  if (!apiKey) return getFallbackIntro(topic);

  const lvInfo = LEVEL_INFO[level];
  const isManager = topic === '감독';
  const topicLabel = isManager ? '감독·전술' : '선수·포지션';
  const topicScope = isManager ? lvInfo.managers : lvInfo.players;

  const prompt = `당신은 한국 고등학생을 위한 축구 학습 앱의 AI 튜터입니다.
퀴즈 시작 전 "${topicLabel}" 주제의 짧은 학습 카드를 만들어주세요.

[학습자 단계]
${lvInfo.label}

[이 단계 학습 범위]
${topicScope}

[요청]
이 범위에서 핵심 개념 하나를 골라 쉽게 설명하는 학습 카드를 JSON으로 만드세요.
형식: {"title":"카드 제목","emoji":"관련 이모지","summary":"핵심 설명 2~3문장 (쉽고 명확하게)","tip":"💡 기억법 또는 팁 1문장"}

JSON만 출력 (코드 블록 없이):`;

  try {
    const genAI = makeClient(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return getFallbackIntro(topic);
    return JSON.parse(match[0]);
  } catch {
    return getFallbackIntro(topic);
  }
}

// ── AI 퀴즈 생성 ─────────────────────────────────────────────────
// topic: '선수' | '감독' | 'mixed'(둘 다) | 'daily'(특별 1문제)
export async function generateAIQuiz(topic, count, userLevel, settingsKey) {
  const apiKey = resolveApiKey(settingsKey);
  if (!apiKey) throw new Error('API 키가 없습니다. 설정 페이지에서 입력해주세요.');

  const level = Math.min(Math.max(userLevel, 1), 5);
  const lvInfo = LEVEL_INFO[level];

  // 주제별 출제 범위 (규칙은 사용하지 않고 선수/감독만)
  const SCOPES = {
    선수: `⚽ [선수] — 이 단계 선수 관련 범위:\n${lvInfo.players}`,
    감독: `🎯 [감독] — 이 단계 감독 관련 범위:\n${lvInfo.managers}`,
  };
  let scopeBlock;
  if (topic === '선수') scopeBlock = SCOPES.선수;
  else if (topic === '감독') scopeBlock = SCOPES.감독;
  else scopeBlock = `${SCOPES.선수}\n\n${SCOPES.감독}`; // mixed / daily

  // 형식 배분 (한 형식에 몰리지 않게 객관식·OX·빈칸을 섞음)
  let formatInstruction;
  if (topic === 'daily' || count <= 1) {
    formatInstruction = `흥미롭고 약간 어려운 특별 문제 1개. 객관식·OX·빈칸 중 자유롭게 출제.`;
  } else {
    const mc = Math.ceil(count * 0.4);
    const ox = Math.max(1, Math.round(count * 0.3));
    const fb = Math.max(1, count - mc - ox);
    formatInstruction = `총 ${count}개를 세 가지 형식으로 골고루 섞어 출제(한 형식에 몰리지 않게):
- 객관식 4지선다 약 ${mc}개 (options 4개 필수, answer 0~3)
- O/X 퀴즈 약 ${ox}개 (흔히 오해하는 내용, answer true/false)
- 빈칸 채우기 약 ${fb}개 (문장에 반드시 [___] 포함, answer는 짧은 용어)`;
  }

  const prompt = `당신은 한국 고등학생을 위한 축구 학습 퀴즈 생성 AI입니다.

━━━ 학습자 단계 ━━━
${lvInfo.label}
난이도: ${lvInfo.difficulty}
출제 방향: ${lvInfo.tip}

━━━ 출제 주제 ━━━
${scopeBlock}

━━━ 문제 형식 (섞어서 출제) ━━━
${formatInstruction}

━━━ 출력 형식 ━━━
${FORMAT_GUIDE}

━━━ 필수 규칙 ━━━
- 한국어로만 작성
- category는 반드시 "선수" 또는 "감독" 중 하나
- 정답은 논란 없이 명확할 것
- 해설은 "왜 정답인지" 친절하게 1~2문장
- 중복 없이 다양하게 출제
- 코드 블록(\`\`\`) 없이 순수 JSON 배열만 출력

JSON 배열 출력:`;

  const genAI = makeClient(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('AI 응답을 JSON으로 파싱하지 못했습니다. 다시 시도해주세요.');

  const questions = JSON.parse(match[0]);
  return questions.map((q, i) => ({ id: `ai_${Date.now()}_${i}`, ...q }));
}

// ── 데일리 챌린지 ────────────────────────────────────────────────
export async function generateDailyChallenge(userLevel, settingsKey) {
  const apiKey = resolveApiKey(settingsKey);
  if (apiKey) {
    try {
      const qs = await generateAIQuiz('daily', 1, userLevel, settingsKey);
      if (qs && qs[0]) return qs[0];
    } catch (e) {
      console.warn('[quiz] 데일리 AI 생성 실패 → 오프라인 문제로 전환:', e?.message || e);
    }
  }
  return getFallbackQuiz('daily', 1, userLevel)[0];
}

// ── 일반 퀴즈 진입점 ────────────────────────────────────────────
// API 키가 있으면 AI로 생성하고, 실패하면 오프라인 문제은행으로 자동 전환합니다.
export async function generateQuiz(topic, count, userLevel, settingsKey) {
  const apiKey = resolveApiKey(settingsKey);
  if (apiKey) {
    try {
      return await generateAIQuiz(topic, count, userLevel, settingsKey);
    } catch (e) {
      console.warn('[quiz] AI 생성 실패 → 오프라인 문제로 전환:', e?.message || e);
    }
  }
  return getFallbackQuiz(topic, count, userLevel);
}
