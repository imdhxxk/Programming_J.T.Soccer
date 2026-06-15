// ── 오프라인 폴백 문제은행 ──────────────────────────────────────────
// AI(제미나이) 호출이 실패하거나 API 키가 없을 때 앱이 멈추지 않도록,
// 미리 준비해 둔 축구 문제로 자동 전환하기 위한 데이터/함수 모음입니다.
//
// 구조: 주제(선수·감독)로 나누고, 한 주제 안에서 객관식·OX·빈칸이 섞여 나옵니다.
// 문제 형식은 quizGenerator.js 의 AI 출력 형식과 동일합니다.

// 레벨별 문제 풀 (1~5). 각 문제는 category('선수' | '감독')와 type을 가집니다.
const BANK = {
  1: [
    // 선수
    { type: 'multipleChoice', category: '선수', question: '상대 골문에 골을 넣는 것이 가장 중요한 임무인 포지션은?', options: ['골키퍼(GK)', '수비수(DF)', '공격수(FW)', '미드필더(MF)'], answer: 2, explanation: '공격수(FW, Forward)는 득점이 주 임무입니다.' },
    { type: 'multipleChoice', category: '선수', question: '포지션 약자 GK는 무엇을 뜻할까요?', options: ['공격수', '골키퍼', '미드필더', '수비수'], answer: 1, explanation: 'GK는 Goal Keeper, 골키퍼를 뜻합니다.' },
    { type: 'multipleChoice', category: '선수', question: '리오넬 메시의 국적은 어디일까요?', options: ['브라질', '아르헨티나', '포르투갈', '스페인'], answer: 1, explanation: '메시는 아르헨티나 대표로 2022 월드컵 우승을 이끌었습니다.' },
    { type: 'oxQuiz', category: '선수', question: '손흥민은 대한민국 국가대표 축구 선수다.', answer: true, explanation: '손흥민은 대한민국을 대표하는 공격수입니다.' },
    { type: 'oxQuiz', category: '선수', question: '크리스티아누 호날두는 포르투갈 국가대표 선수다.', answer: true, explanation: '호날두는 포르투갈 대표 선수입니다.' },
    { type: 'fillBlank', category: '선수', question: '골문을 지키며 손을 쓸 수 있는 유일한 포지션은 [___]이다.', answer: '골키퍼', hint: '영어 약자로 GK', explanation: '골키퍼(GK)만 자기 진영 박스 안에서 손을 쓸 수 있습니다.' },
    // 감독
    { type: 'multipleChoice', category: '감독', question: '경기 중 선발 명단을 정하고 선수 교체를 결정하는 사람은?', options: ['주심', '감독', '골키퍼', '관중'], answer: 1, explanation: '감독이 선발·교체·전술을 책임집니다.' },
    { type: 'multipleChoice', category: '감독', question: '다음 중 감독이 결정하는 일이 아닌 것은?', options: ['선발 명단', '선수 교체', '심판 판정', '팀 전술'], answer: 2, explanation: '심판 판정은 심판의 몫이며, 감독은 선발·교체·전술을 정합니다.' },
    { type: 'multipleChoice', category: '감독', question: '감독을 영어로 뭐라고 할까요?', options: ['player', 'referee', 'manager', 'fan'], answer: 2, explanation: '감독은 영어로 manager(또는 coach)라고 합니다.' },
    { type: 'oxQuiz', category: '감독', question: '감독은 경기가 시작되면 선수를 교체할 수 없다.', answer: false, explanation: '감독은 경기 중 정해진 횟수만큼 선수를 교체할 수 있습니다.' },
    { type: 'oxQuiz', category: '감독', question: '감독은 경기 중 선수에게 전술 지시를 내릴 수 있다.', answer: true, explanation: '감독은 경기 중에도 작전과 지시를 전달합니다.' },
    { type: 'fillBlank', category: '감독', question: '2002 한일 월드컵에서 대한민국을 4강으로 이끈 네덜란드 출신 감독은 거스 [___]이다.', answer: '히딩크', hint: '영어로 Hiddink', explanation: '거스 히딩크 감독이 2002년 4강 신화를 이끌었습니다.' },
  ],
  2: [
    // 선수
    { type: 'multipleChoice', category: '선수', question: '포지션 약자 CB는 무엇일까요?', options: ['중앙 수비수', '중앙 공격수', '측면 수비수', '수비형 미드필더'], answer: 0, explanation: 'CB는 Center Back, 중앙 수비수입니다.' },
    { type: 'multipleChoice', category: '선수', question: '주로 상대 공격을 막고 자기 골문을 지키는 포지션은?', options: ['공격수(FW)', '미드필더(MF)', '수비수(DF)', '윙어'], answer: 2, explanation: '수비수(DF)는 상대 공격을 차단하는 것이 주 임무입니다.' },
    { type: 'multipleChoice', category: '선수', question: '공격과 수비를 연결하며 경기를 조율하는 포지션은?', options: ['골키퍼', '미드필더', '공격수', '수비수'], answer: 1, explanation: '미드필더(MF)는 공수를 연결하는 중원 포지션입니다.' },
    { type: 'oxQuiz', category: '선수', question: '측면에서 중앙으로 높고 빠르게 올려 주는 패스를 크로스라고 한다.', answer: true, explanation: '크로스는 측면에서 골 앞으로 올려 주는 패스입니다.' },
    { type: 'oxQuiz', category: '선수', question: '손흥민은 주로 골키퍼로 활약하는 선수다.', answer: false, explanation: '손흥민은 공격수(윙어·스트라이커)입니다.' },
    { type: 'fillBlank', category: '선수', question: '상대 수비 뒷공간으로 찔러 주는 날카로운 패스를 [___] 패스라고 한다.', answer: '스루', hint: '영어로 through', explanation: '스루패스는 수비 뒷공간을 노려 찔러 주는 패스입니다.' },
    // 감독
    { type: 'multipleChoice', category: '감독', question: '포메이션 4-4-2의 숫자가 나타내는 것은?', options: ['골키퍼-수비-공격', '수비수-미드필더-공격수의 인원', '교체 횟수', '경고 수'], answer: 1, explanation: '앞에서부터 수비수 4, 미드필더 4, 공격수 2명을 뜻합니다.' },
    { type: 'multipleChoice', category: '감독', question: '다음 중 공격적인 포메이션으로 자주 쓰이는 것은?', options: ['4-3-3', '5-4-1', '4-5-1', '5-3-2'], answer: 0, explanation: '4-3-3은 공격수 3명을 두는 대표적인 공격적 포메이션입니다.' },
    { type: 'oxQuiz', category: '감독', question: '위르겐 클롭은 리버풀을 이끌었던 감독이다.', answer: true, explanation: '클롭은 리버풀에서 프리미어리그·챔피언스리그 우승을 이끌었습니다.' },
    { type: 'oxQuiz', category: '감독', question: '카를로 안첼로티는 레알 마드리드를 이끈 적이 있다.', answer: true, explanation: '안첼로티는 레알 마드리드에서 여러 차례 우승을 차지했습니다.' },
    { type: 'fillBlank', category: '감독', question: '경기 중 선수들의 위치와 배치를 숫자로 나타낸 것을 [___]이라고 한다. (예: 4-3-3)', answer: '포메이션', hint: '영어로 formation', explanation: '포메이션은 선수 배치 형태를 숫자로 표현한 것입니다.' },
    { type: 'multipleChoice', category: '감독', question: '감독이 수비적 교체를 하는 이유로 가장 알맞은 것은?', options: ['이기고 있을 때 리드를 지키려고', '무조건 골을 더 넣으려고', '관중을 즐겁게 하려고', '선수 휴식만을 위해'], answer: 0, explanation: '리드를 지키기 위해 수비를 강화하는 교체를 수비적 교체라고 합니다.' },
  ],
  3: [
    // 선수
    { type: 'multipleChoice', category: '선수', question: '왼발과 오른발을 모두 능숙하게 쓰는 양발 능력으로 특히 유명한 대한민국 선수는?', options: ['김민재', '손흥민', '조규성', '황인범'], answer: 1, explanation: '손흥민은 양발을 자유자재로 쓰는 슈팅 능력으로 유명합니다.' },
    { type: 'multipleChoice', category: '선수', question: '케빈 더브라위너가 세계 최고로 평가받는 능력은?', options: ['선방', '정확한 패스와 킬패스', '태클', '골키핑'], answer: 1, explanation: '더브라위너는 정교한 패스와 결정적인 킬패스로 유명한 미드필더입니다.' },
    { type: 'multipleChoice', category: '선수', question: '보통 측면을 빠르게 돌파해 크로스와 드리블을 담당하는 포지션은?', options: ['센터백', '윙어', '골키퍼', '수비형 미드필더'], answer: 1, explanation: '윙어는 측면에서 돌파와 크로스를 담당하는 공격 포지션입니다.' },
    { type: 'oxQuiz', category: '선수', question: '1986 월드컵 신의 손으로 유명한 아르헨티나의 전설적 선수는 디에고 마라도나다.', answer: true, explanation: '마라도나는 1986 월드컵에서 아르헨티나의 우승을 이끈 전설입니다.' },
    { type: 'oxQuiz', category: '선수', question: 'CAM은 공격형 미드필더를 뜻한다.', answer: true, explanation: 'CAM은 Central Attacking Midfielder, 공격형 미드필더입니다.' },
    { type: 'fillBlank', category: '선수', question: '손흥민과 해리 케인이 함께 활약했던 잉글랜드 런던의 클럽은 [___] 홋스퍼다.', answer: '토트넘', hint: '런던을 연고로 하는 클럽', explanation: '두 선수는 토트넘 홋스퍼에서 손케 듀오로 불렸습니다.' },
    // 감독
    { type: 'multipleChoice', category: '감독', question: '공을 빼앗긴 직후 전방에서 곧바로 강하게 압박하는 전술로 유명한 감독은?', options: ['주제 무리뉴', '위르겐 클롭', '카를로 안첼로티', '디에고 시메오네'], answer: 1, explanation: '클롭은 공을 뺏기면 즉시 되빼앗는 게겐프레싱으로 유명합니다.' },
    { type: 'multipleChoice', category: '감독', question: '강한 수비 조직력을 빗댄 파킹 더 버스와 가장 관련 깊은 감독은?', options: ['펩 과르디올라', '위르겐 클롭', '주제 무리뉴', '아르센 벵거'], answer: 2, explanation: '무리뉴는 단단한 수비 조직력으로 유명해 이 표현과 자주 연결됩니다.' },
    { type: 'multipleChoice', category: '감독', question: '점유율 중심의 포지셔널 플레이로 유명한 감독은?', options: ['펩 과르디올라', '디에고 시메오네', '주제 무리뉴', '클라우디오 라니에리'], answer: 0, explanation: '과르디올라는 점유와 위치 선정을 강조하는 축구로 유명합니다.' },
    { type: 'oxQuiz', category: '감독', question: '게겐프레싱은 공을 빼앗긴 직후 곧바로 다시 압박해 되찾으려는 전술이다.', answer: true, explanation: '게겐프레싱은 공을 잃은 즉시 강하게 압박해 빠르게 되찾는 전술입니다.' },
    { type: 'oxQuiz', category: '감독', question: '포메이션은 경기 중에는 절대 바꿀 수 없다.', answer: false, explanation: '감독은 경기 흐름에 따라 포메이션을 바꿀 수 있습니다.' },
    { type: 'fillBlank', category: '감독', question: '맨체스터 시티에서 점유 축구를 구현한 스페인 출신 명장은 펩 [___]이다.', answer: '과르디올라', hint: '영어로 Guardiola', explanation: '펩 과르디올라는 바르셀로나·맨시티 등에서 점유 축구를 완성했습니다.' },
  ],
  4: [
    // 선수
    { type: 'multipleChoice', category: '선수', question: '축구 통계 xG는 무엇을 뜻할까요?', options: ['기대 득점', '경기 수', '교체 수', '경고 수'], answer: 0, explanation: 'xG는 Expected Goals(기대 득점)로, 슈팅이 골이 될 확률을 수치화한 지표입니다.' },
    { type: 'multipleChoice', category: '선수', question: '발롱도르(Ballon d Or)는 무엇을 시상하는 상일까요?', options: ['최우수 감독', '그 해 최고의 축구 선수', '최고의 구단', '최고의 심판'], answer: 1, explanation: '발롱도르는 한 해 동안 가장 뛰어난 활약을 한 선수에게 주는 상입니다.' },
    { type: 'oxQuiz', category: '선수', question: '폴스 나인(False 9)은 최전방 공격수가 아래로 내려와 미드필더처럼 움직이는 역할이다.', answer: true, explanation: '폴스 나인은 9번(중앙 공격수)이 내려와 공간을 만드는 전술적 역할입니다.' },
    { type: 'oxQuiz', category: '선수', question: '키패스(key pass)는 슈팅으로 이어진 마지막 패스를 뜻한다.', answer: true, explanation: '키패스는 동료의 슈팅 기회를 만들어 준 패스를 가리킵니다.' },
    { type: 'fillBlank', category: '선수', question: '측면 풀백이 안쪽 미드필더 위치로 좁혀 들어오는 현대적 역할을 [___] 풀백이라고 한다.', answer: '인버티드', hint: '영어로 inverted(안으로 접힌)', explanation: '인버티드 풀백은 측면 수비수가 중앙으로 좁혀 빌드업을 돕는 역할입니다.' },
    // 감독
    { type: 'multipleChoice', category: '감독', question: '인버티드 윙어를 가장 잘 설명한 것은?', options: ['주발과 반대쪽 측면에 서서 중앙으로 파고드는 윙어', '수비만 전담하는 골키퍼', '후방 빌드업만 하는 수비수', '세트피스만 전담하는 선수'], answer: 0, explanation: '인버티드 윙어는 주발과 반대 측면에 서서 안쪽으로 파고들며 슈팅·연계를 노립니다.' },
    { type: 'multipleChoice', category: '감독', question: '두 명의 수비형 미드필더를 나란히 두는 중원 구성을 무엇이라 할까요?', options: ['더블 피봇', '폴스 나인', '게겐프레싱', '파킹 더 버스'], answer: 0, explanation: '더블 피봇은 두 명의 수비형 미드필더로 중원을 안정시키는 구성입니다.' },
    { type: 'oxQuiz', category: '감독', question: '과르디올라와 클롭은 점유 대 압박이라는 대조적 철학으로 자주 비교된다.', answer: true, explanation: '과르디올라(점유)와 클롭(압박)은 현대 축구의 대표적 라이벌 전술가로 꼽힙니다.' },
    { type: 'oxQuiz', category: '감독', question: '하이라인 수비는 수비 라인을 상대 진영 쪽으로 끌어올려 압박하는 전술이다.', answer: true, explanation: '하이라인은 수비 라인을 높여 공간을 좁히고 강하게 압박하는 전술입니다.' },
    { type: 'fillBlank', category: '감독', question: '펩 과르디올라의 대표 철학으로, 점유율을 높이고 선수 위치 선정을 중시하는 것을 [___] 플레이라고 한다.', answer: '포지셔널', hint: '영어로 positional(위치의)', explanation: '포지셔널 플레이는 점유와 위치 선정을 강조하는 과르디올라의 축구 철학입니다.' },
  ],
  5: [
    // 선수
    { type: 'multipleChoice', category: '선수', question: '축구에서 자주 쓰는 GOAT는 무엇의 약자일까요?', options: ['Greatest Of All Time', 'Goal Of A Team', 'Game On A Turf', 'Guard Of The goal'], answer: 0, explanation: 'GOAT는 Greatest Of All Time, 즉 역대 최고의 선수를 뜻합니다.' },
    { type: 'multipleChoice', category: '선수', question: '데이터 지표 PPDA가 측정하는 것은?', options: ['압박 강도', '선수 키', '관중 수', '경기장 크기'], answer: 0, explanation: 'PPDA(Passes Per Defensive Action)는 팀의 압박 강도를 나타내는 지표입니다.' },
    { type: 'oxQuiz', category: '선수', question: 'PPDA는 값이 낮을수록 더 강하게 압박한다는 의미다.', answer: true, explanation: '상대 패스를 적게 허용할수록(PPDA가 낮을수록) 압박이 강하다는 뜻입니다.' },
    { type: 'oxQuiz', category: '선수', question: 'xA(expected Assists)는 패스가 도움(어시스트)으로 이어질 기대값을 나타내는 지표다.', answer: true, explanation: 'xA는 어떤 패스가 어시스트가 될 가능성을 수치화한 지표입니다.' },
    { type: 'fillBlank', category: '선수', question: '한 선수가 한 경기에서 3골을 기록하는 것을 [___]이라고 한다.', answer: '해트트릭', hint: '영어로 hat-trick', explanation: '한 경기에서 3골을 넣는 것을 해트트릭이라고 합니다.' },
    // 감독
    { type: 'multipleChoice', category: '감독', question: '토탈 풋볼(Total Football)과 가장 관련 깊은 인물은?', options: ['요한 크루이프', '주제 무리뉴', '디에고 시메오네', '클라우디오 라니에리'], answer: 0, explanation: '토탈 풋볼은 요한 크루이프와 네덜란드 축구로 대표되는 혁명적 전술입니다.' },
    { type: 'multipleChoice', category: '감독', question: '토탈 풋볼의 핵심 개념에 가장 가까운 것은?', options: ['모든 선수가 포지션을 유연하게 바꿔 공수에 참여', '골키퍼가 공격을 전담', '수비수는 절대 전진하지 않음', '한 명의 스타에게만 의존'], answer: 0, explanation: '토탈 풋볼은 선수들이 포지션을 유연하게 바꾸며 전원이 공수에 가담하는 전술입니다.' },
    { type: 'oxQuiz', category: '감독', question: '아리고 사키는 AC 밀란에서 강한 압박과 조직적인 4-4-2로 명성을 떨친 감독이다.', answer: true, explanation: '사키의 AC 밀란은 압박과 라인 조절로 현대 축구에 큰 영향을 주었습니다.' },
    { type: 'oxQuiz', category: '감독', question: '요한 크루이프는 바르셀로나 점유 축구(티키타카)의 사상적 뿌리로 평가받는다.', answer: true, explanation: '크루이프의 철학이 바르셀로나 점유 축구의 토대가 되었습니다.' },
    { type: 'fillBlank', category: '감독', question: '경기 막판 수비를 꽉 채워 리드를 지키는 소극적 전술을 흔히 영어로 파킹 더 [___]라고 부른다.', answer: '버스', hint: '영어로 bus', explanation: '파킹 더 버스는 버스를 세운 듯 수비를 빽빽하게 채우는 것을 빗댄 표현입니다.' },
  ],
};

// 주제별 학습 인트로 카드 (오프라인용)
const INTRO = {
  선수: { title: '선수와 포지션', emoji: '⚽', summary: '축구 포지션은 크게 골키퍼(GK)·수비수(DF)·미드필더(MF)·공격수(FW)로 나뉘어요. 메시·호날두·손흥민처럼 선수마다 포지션과 강점이 달라요.', tip: '💡 GK·DF·MF·FW 네 글자만 기억하면 포지션의 절반은 끝!' },
  감독: { title: '감독과 전술', emoji: '🎯', summary: '감독은 선발 명단과 교체, 팀 전술을 책임지는 사람이에요. 4-4-2·4-3-3 같은 포메이션과 압박·점유 같은 전술로 팀의 색깔을 만들어요.', tip: '💡 포메이션 숫자는 앞에서부터 수비-미드필더-공격 인원!' },
  default: { title: '오늘의 축구 학습', emoji: '📘', summary: '선수와 감독, 두 가지 주제를 넘나들며 다양한 형식의 문제로 축구를 배워봐요.', tip: '💡 틀려도 괜찮아요. 해설을 읽으면 실력이 쑥쑥 늘어요!' },
};

function clampLevel(n) {
  return Math.min(Math.max(Number(n) || 1, 1), 5);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 한 레벨에서 요청한 주제(선수/감독, mixed·daily는 둘 다)에 해당하는 문제만 추립니다.
function poolForTopic(level, topic) {
  const wanted = topic === '선수' ? ['선수'] : topic === '감독' ? ['감독'] : ['선수', '감독'];
  return (BANK[level] || []).filter((q) => wanted.includes(q.category));
}

// ── 외부 공개 함수 ───────────────────────────────────────────────
// 주제별로 문제를 골라 돌려줍니다. 형식(객관식·OX·빈칸)은 자연스럽게 섞입니다.
export function getFallbackQuiz(topic, count, userLevel) {
  const level = clampLevel(userLevel);
  const needed = Math.max(1, count || 1);

  // 해당 레벨에서 시작하고, 부족하면 같은 주제로 인접 레벨에서 보충 (낮은 레벨 우선)
  let pool = poolForTopic(level, topic);
  for (let l = level - 1; l >= 1 && pool.length < needed; l--) pool = pool.concat(poolForTopic(l, topic));
  for (let l = level + 1; l <= 5 && pool.length < needed; l++) pool = pool.concat(poolForTopic(l, topic));

  return shuffle(pool).slice(0, needed).map((q, i) => ({
    ...q,
    id: `fb_${Date.now()}_${i}`,
    offline: true,
  }));
}

// 주제별 학습 인트로 카드를 돌려줍니다. (선수/감독, 그 외는 기본 카드)
export function getFallbackIntro(topic) {
  return { ...(INTRO[topic] || INTRO.default) };
}
