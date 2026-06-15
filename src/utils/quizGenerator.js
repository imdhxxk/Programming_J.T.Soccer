import Groq from 'groq-sdk';
import { getFallbackQuiz, getFallbackIntro } from './quizBank';

// ── 레벨별 학습 단계 정의 ────────────────────────────────────────
export const LEVEL_INFO = {
  // 앱 커리큘럼 STEP 1 내용에 맞춤
  1: {
    label: 'STEP 1 — 기초 규칙 (Lv.1 풋살 루키)',
    players: `[선수 관점의 기초 규칙]
팀당 선수 11명(필드 10명 + GK 1명), 경기 시간 전·후반 각 45분 총 90분, 교체 최대 5회,
오프사이드 조건(패스 순간 기준, 마지막 수비수보다 앞에 있으면 반칙)과 예외(코너킥·골킥·스로인),
옐로카드(경고)·레드카드(퇴장) 기준, 한 경기 옐로 2장 = 퇴장,
포지션 기본 역할: GK(골키퍼·손 사용 가능), DF(수비수), MF(미드필더), FW(공격수)`,
    managers: `[감독 관점의 기초 규칙]
세트피스 종류와 규칙:
- 코너킥: 수비팀이 골라인 밖으로 → 공격팀 코너에서 킥
- 골킥: 공격팀이 골라인 밖으로 → 수비팀 골 에리어에서 킥
- 스로인: 터치라인 밖으로 → 상대팀이 두 손 머리 위로 투척
- 페널티킥: 페널티 에리어 내 반칙 → 11m 지점 1:1 킥
- 직접·간접 프리킥 차이
감독의 기본 역할: 선발 명단 결정, 교체 횟수 관리, 경기 중 전술 지시,
연장전(승부 미결 시 전·후반 각 15분)과 승부차기`,
    difficulty: '쉬움 — 축구 기초 규칙을 처음 배우는 학생 수준',
    tip: '정답은 100% 명확해야 하며 커리큘럼 STEP 1 내용 범위에서만 출제',
  },
  // 앱 커리큘럼 STEP 2 내용에 맞춤
  2: {
    label: 'STEP 2 — 기본 기술 (Lv.2 아마추어)',
    players: `[선수 기본 기술]
패스 종류:
- 숏패스: 가까운 거리, 발 안쪽(인사이드) 사용, 정확도 높음
- 롱패스: 먼 거리, 발등(인스텝)으로 강하게
- 스루패스: 수비 뒷공간으로 찔러주는 패스, 타이밍이 핵심
- 백패스: 뒤로 돌려 공격 재조직
- 크로스: 측면에서 골문 앞으로 올리는 패스
슈팅 기법:
- 인스텝 슈팅: 발등으로 차는 강한 슈팅(파워)
- 인사이드 슈팅: 발 안쪽으로 정확히 차는 슈팅(정확도)
- 커브 슈팅: 공에 회전을 줘 휘어지는 슈팅(바나나킥)
- 발리슈팅: 공이 땅에 닿기 전 바로 차는 슈팅
- 오버헤드킥: 몸을 뒤집어 차는 슈팅(자전거킥)
포지션 세부 역할: ST(최전방 득점), CAM(공격형 미드필더), CM(중앙 미드필더),
CDM(수비형 미드필더), CB(센터백), LB/RB(풀백·측면 수비+공격 가담), GK(골키퍼)`,
    managers: `[포메이션 기초와 포지션 배치]
포메이션 표기법: 수비수 – 미드필더 – 공격수 순 (골키퍼 제외)
기본 포메이션:
- 4-4-2: 균형 잡힌 전통 포메이션, 미드필더 4명 중원 장악
- 4-3-3: 공격적, 공격수 3명으로 다양한 공격 루트
- 4-5-1: 수비적, 미드필드 두텁게
포지션 배치 전략, CDM(수비형 미드필더)의 역할과 중요성,
교체 전략 기초(수비적/공격적 교체 시점)`,
    difficulty: '보통 — 패스·슈팅·포지션 기술을 이해하는 학생 수준',
    tip: '커리큘럼 STEP 2 내용(패스 종류, 슈팅 기법, 포지션 역할) 범위에서 출제',
  },
  // 앱 커리큘럼 STEP 3 내용에 맞춤
  3: {
    label: 'STEP 3 — 전술 이해 (Lv.3 세미프로)',
    players: `[선수의 전술 참여]
공격 전술에서 선수 역할:
- 카운터어택(역습): 수비 후 빠른 전환 공격, 상대 빈 공간 활용
- 티키타카: 짧은 패스 연결로 점유율 극대화, 스페인·바르셀로나 스타일
- 오버랩: 측면 풀백이 윙어 앞으로 올라가 수적 우위 창출
압박 전술에서 선수 역할:
- 하이프레스: 상대 진영에서 적극 압박
- 게겐프레싱: 공 잃은 직후 즉시 역압박
- 미들블록: 중간 위치에서 균형 있게 압박
하이라인 수비에서 선수 위치와 오프사이드 유도`,
    managers: `[전술 설계와 포메이션 운용]
주요 포메이션:
- 4-4-2: 균형, 4-3-3: 공격, 4-5-1: 수비, 3-5-2: 윙백 활용
압박 전술 유형과 적용:
- 하이프레스: 상대 진영 깊숙이 압박 (클롭 리버풀)
- 게겐프레싱: 공 빼앗긴 즉시 역압박
- 미들블록: 하프라인 근처 중간 압박
- 파킹더버스: 골문 앞 수비 집결, 극단적 수비
공격 전술 유형:
- 카운터어택(역습): 수비 후 빠른 전환
- 티키타카: 짧은 패스 점유
- 포지셔널 플레이: 공간 선점과 점유 (과르디올라 맨시티)
- 오버랩: 풀백의 측면 공격 가담`,
    difficulty: '어려움 — 전술을 이해하는 축구 팬 수준',
    tip: '커리큘럼 STEP 3 내용(포메이션·압박 전술·공격 전술) 범위에서 출제',
  },
  // 앱 커리큘럼 STEP 4 내용에 맞춤
  4: {
    label: 'STEP 4 — 실전 심화 (Lv.4 프로)',
    players: `[세트피스 전술과 게임 읽기]
세트피스 전술 세부:
- 코너킥: 니어포스트·파포스트 공중볼, 쇼트코너, 다이렉트 슈팅
- 프리킥: 직접 슈팅, 더미 런(가짜 러너), 벽 활용
- 페널티킥: 방향 페이크, 심리전 (도움닫기 중 완전 멈춤은 반칙)
게임 읽기 능력:
- 공간 인식: 수비 라인 틈새 빠르게 파악
- 포지셔닝: 공 없을 때 최적 위치 선점
- 타이밍: 패스·드리블·슈팅의 타이밍이 결정적
- 매치업 이해: 상대와 나의 매치업 분석
오프사이드 트랩에서 선수 역할(수비 라인 동시 전진)`,
    managers: `[오프사이드 트랩과 압박 수비]
오프사이드 트랩 전술:
- 수비수들이 패스 순간에 동시에 전진해 공격수를 오프사이드 위치에 남김
- 성공 조건: 수비수 전원의 완벽한 팀워크와 타이밍
압박 수비 원칙:
- 1차 수비수: 공 소유자 봉쇄
- 2차·3차 수비수: 주변 공간 커버
- 컴팩트(Compact): 수비-미드 라인 간격 좁혀 공간 제거
전술 변화:
- 경기 흐름에 따라 포메이션 교체 시점 판단
- 리드 시 수비적 교체, 뒤질 때 공격적 교체`,
    difficulty: '매우 어려움 — 실전 전술을 분석하는 축구 마니아 수준',
    tip: '커리큘럼 STEP 4 내용(세트피스 전술·게임 읽기·오프사이드 트랩) 범위에서 출제',
  },
  // 심화 월드클래스 (커리큘럼 STEP 4 이상)
  5: {
    label: '심화 — 월드클래스 (Lv.5)',
    players: `[데이터 지표와 심화 역할]
역사상 최고 선수 논쟁(GOAT: Greatest Of All Time)
데이터 지표:
- xG(Expected Goals): 슈팅이 골이 될 기대 확률
- xA(Expected Assists): 패스가 어시스트로 이어질 기대값
- PPDA(Passes Per Defensive Action): 압박 강도 지표, 낮을수록 강한 압박
- 키패스(Key Pass): 슈팅 기회를 만드는 마지막 패스
심화 역할:
- 폴스 나인(False 9): 최전방 공격수가 내려와 미드필더처럼 움직이는 역할
- 인버티드 풀백: 측면 수비수가 중앙으로 좁혀 빌드업 참여
특수 기록: 해트트릭(한 경기 3골), 어시스트, 클린시트`,
    managers: `[역사적 전술 혁명가와 심화 전술]
전술 혁명가:
- 요한 크루이프: 토탈 풋볼(Total Football) — 전원 포지션 유연하게 바꾸는 전술, 바르셀로나 티키타카의 뿌리
- 아리고 사키(AC 밀란): 조직적 압박과 4-4-2로 현대 전술의 뿌리
현대 심화 전술:
- 더블 피봇(Double Pivot): 수비형 미드필더 2명 나란히, 중원 안정
- 인버티드 윙어: 주발 반대 측면 → 중앙으로 파고드는 윙어
- 하이라인 수비: 수비 라인 끌어올려 오프사이드 유도
감독 철학 비교: 과르디올라(점유·포지셔널) vs 클롭(압박·게겐프레싱)`,
    difficulty: '최고 난이도 — 축구 전문 해설가·기자 수준',
    tip: '데이터 지표·역사적 전술가·심화 전술 용어를 결합한 분석적 문제 출제',
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
  return new Groq({ apiKey, dangerouslyAllowBrowser: true });
}

export function resolveApiKey(settingsKey) {
  return settingsKey || import.meta.env.VITE_GROQ_API_KEY || '';
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
    const groq = makeClient(apiKey);
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });
    const text = completion.choices[0].message.content.trim();
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

  const groq = makeClient(apiKey);
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  });
  const text = completion.choices[0].message.content.trim();

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
