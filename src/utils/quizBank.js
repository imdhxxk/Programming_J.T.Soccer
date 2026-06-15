// ── 오프라인 폴백 문제은행 ──────────────────────────────────────────
// AI 호출 실패 시 자동 전환되는 내장 문제들입니다.
// 각 레벨의 문제는 앱의 커리큘럼(STEP 1~4+) 내용과 일치합니다:
//   Lv.1 → STEP 1 기초 규칙 (선수 구성·오프사이드·카드·세트피스)
//   Lv.2 → STEP 2 기본 기술 (패스·슈팅·포지션 역할)
//   Lv.3 → STEP 3 전술 이해 (포메이션·압박 전술·공격 전술)
//   Lv.4 → STEP 4 실전 심화 (세트피스 전술·게임 읽기·오프사이드 트랩)
//   Lv.5 → 심화 월드클래스 (데이터 지표·역사적 전술가)

const BANK = {
  // ── Lv.1 | STEP 1 — 기초 규칙 ────────────────────────────────
  1: [
    // 선수: 선수 구성, 오프사이드, 카드, 포지션 기본
    {
      type: 'multipleChoice', category: '선수',
      question: '축구 경기에서 한 팀의 선수는 총 몇 명일까요?',
      options: ['9명', '10명', '11명', '12명'],
      answer: 2,
      explanation: '팀당 필드 플레이어 10명 + 골키퍼 1명 = 총 11명입니다.',
    },
    {
      type: 'multipleChoice', category: '선수',
      question: '자기 진영 페널티 박스 안에서 손을 쓸 수 있는 유일한 포지션은?',
      options: ['FW (공격수)', 'MF (미드필더)', 'DF (수비수)', 'GK (골키퍼)'],
      answer: 3,
      explanation: 'GK(골키퍼)만 자기 진영 페널티 박스 안에서 손을 사용할 수 있습니다.',
    },
    {
      type: 'multipleChoice', category: '선수',
      question: '현재 규정에서 한 경기당 최대 교체 횟수는?',
      options: ['3회', '5회', '7회', '무제한'],
      answer: 1,
      explanation: '현행 규정상 한 경기당 최대 5회 교체가 가능합니다. (과거에는 3회였으나 현재 5회로 변경)',
    },
    {
      type: 'oxQuiz', category: '선수',
      question: '오프사이드 판정 기준 시점은 공격수가 패스를 받는 순간이 아니라 패스가 출발하는 순간이다.',
      answer: true,
      explanation: '오프사이드는 패스가 이루어지는(출발하는) 순간을 기준으로 판정합니다.',
    },
    {
      type: 'oxQuiz', category: '선수',
      question: '같은 경기에서 옐로카드를 2장 받으면 레드카드와 동일하게 퇴장이다.',
      answer: true,
      explanation: '한 경기에서 옐로카드 2장 누적은 즉시 퇴장(레드카드와 동일) 처리됩니다.',
    },
    {
      type: 'fillBlank', category: '선수',
      question: '코너킥, 골킥, 스로인 상황에서는 [___] 반칙을 적용하지 않는다.',
      answer: '오프사이드',
      hint: '공격수가 수비 라인보다 앞에 있어도 괜찮은 상황',
      explanation: '코너킥·골킥·스로인은 오프사이드 예외 상황으로, 판정이 적용되지 않습니다.',
    },
    // 감독: 세트피스, 감독 역할, 경기 기본
    {
      type: 'multipleChoice', category: '감독',
      question: '수비팀이 마지막으로 건드려 공이 골라인 밖으로 나갔을 때 주어지는 세트피스는?',
      options: ['스로인', '골킥', '코너킥', '페널티킥'],
      answer: 2,
      explanation: '수비팀이 공을 골라인 밖으로 내보내면 공격팀에게 코너킥이 주어집니다.',
    },
    {
      type: 'multipleChoice', category: '감독',
      question: '공격팀이 마지막으로 건드려 공이 골라인 밖으로 나갔을 때 주어지는 세트피스는?',
      options: ['코너킥', '골킥', '스로인', '페널티킥'],
      answer: 1,
      explanation: '공격팀이 공을 골라인 밖으로 내보내면 수비팀에게 골킥이 주어집니다.',
    },
    {
      type: 'multipleChoice', category: '감독',
      question: '경기 중 선발 명단을 정하고 선수 교체를 결정하는 사람은?',
      options: ['주심', '선수 대표', '감독', '구단주'],
      answer: 2,
      explanation: '감독이 선발 명단, 교체, 팀 전술을 모두 책임집니다.',
    },
    {
      type: 'oxQuiz', category: '감독',
      question: '페널티킥은 페널티 에리어 안에서 반칙이 발생했을 때 주어진다.',
      answer: true,
      explanation: '페널티 에리어 내 반칙이 발생하면 페널티킥(PK)이 주어집니다.',
    },
    {
      type: 'oxQuiz', category: '감독',
      question: '공이 터치라인 밖으로 나갔을 때 마지막으로 건드린 팀이 스로인을 한다.',
      answer: false,
      explanation: '마지막으로 건드린 팀의 상대팀이 스로인을 합니다.',
    },
    {
      type: 'fillBlank', category: '감독',
      question: '전반·후반 각 45분, 총 90분이 끝나도 승부가 나지 않으면 [___]전을 진행한다.',
      answer: '연장',
      hint: '총 30분(전·후반 각 15분) 추가',
      explanation: '정규 90분 후 승부가 나지 않으면 연장전(전·후반 각 15분)을 진행합니다.',
    },
  ],

  // ── Lv.2 | STEP 2 — 기본 기술 ────────────────────────────────
  2: [
    // 선수: 패스 종류, 슈팅 기법, 포지션 역할
    {
      type: 'multipleChoice', category: '선수',
      question: '수비수 사이 공간으로 공격수에게 절묘하게 찔러 주는 패스를 무엇이라 할까요?',
      options: ['백패스', '크로스', '스루패스', '숏패스'],
      answer: 2,
      explanation: '스루패스는 수비 뒷공간을 노려 찔러 주는 패스로, 타이밍이 핵심입니다.',
    },
    {
      type: 'multipleChoice', category: '선수',
      question: '측면에서 골문 앞으로 높고 빠르게 날리는 패스를 무엇이라 할까요?',
      options: ['숏패스', '스루패스', '백패스', '크로스'],
      answer: 3,
      explanation: '크로스는 측면에서 중앙 골 앞으로 올려 주는 패스입니다.',
    },
    {
      type: 'multipleChoice', category: '선수',
      question: '공에 회전을 줘 바나나처럼 휘어지는 궤적으로 차는 슈팅은?',
      options: ['인스텝 슈팅', '인사이드 슈팅', '커브 슈팅', '발리 슈팅'],
      answer: 2,
      explanation: '커브 슈팅은 공에 회전을 주어 휘어지는 궤적으로 차는 슈팅입니다.',
    },
    {
      type: 'oxQuiz', category: '선수',
      question: '공중에서 몸을 뒤집어 차는 슈팅을 오버헤드킥(자전거킥)이라고 한다.',
      answer: true,
      explanation: '오버헤드킥은 공이 머리 위를 지날 때 몸을 뒤집어 차는 고난도 슈팅입니다.',
    },
    {
      type: 'oxQuiz', category: '선수',
      question: '발 안쪽(인사이드)으로 차는 숏패스는 접촉 면이 좁아 정확도가 낮다.',
      answer: false,
      explanation: '인사이드 패스는 발 안쪽의 넓은 면을 사용해 정확도가 높습니다.',
    },
    {
      type: 'fillBlank', category: '선수',
      question: '최전방에서 득점을 전담하는 공격수 포지션의 약자는 [___]이다.',
      answer: 'ST',
      hint: 'Striker의 약자',
      explanation: 'ST(Striker)는 최전방 득점 전담 공격수 포지션입니다.',
    },
    // 감독: 포메이션 기초, 포지션 배치, 프리킥 차이
    {
      type: 'multipleChoice', category: '감독',
      question: '포메이션 4-3-3에서 숫자는 앞에서부터 무엇을 나타낼까요?',
      options: ['공격수-미드필더-수비수', '수비수-미드필더-공격수', '골키퍼-수비수-공격수', '미드필더-수비수-공격수'],
      answer: 1,
      explanation: '포메이션 숫자는 앞에서부터 수비수 – 미드필더 – 공격수 인원을 나타냅니다.',
    },
    {
      type: 'multipleChoice', category: '감독',
      question: '중원에서 상대 공격을 막고 빌드업을 지원하는 수비형 미드필더 약자는?',
      options: ['ST', 'CAM', 'CDM', 'LB'],
      answer: 2,
      explanation: 'CDM(Central Defensive Midfielder)은 수비형 미드필더로, 공격 차단과 빌드업 역할을 합니다.',
    },
    {
      type: 'multipleChoice', category: '감독',
      question: '측면 수비를 맡으면서 공격에도 가담하는 포지션은?',
      options: ['CB (센터백)', 'ST (스트라이커)', 'LB/RB (풀백)', 'GK (골키퍼)'],
      answer: 2,
      explanation: 'LB·RB(풀백)은 측면 수비와 함께 공격 가담도 담당하는 현대적 포지션입니다.',
    },
    {
      type: 'oxQuiz', category: '감독',
      question: '창의적인 패스와 득점 지원을 맡는 공격형 미드필더를 CAM이라고 한다.',
      answer: true,
      explanation: 'CAM(Central Attacking Midfielder)은 공격형 미드필더의 약자입니다.',
    },
    {
      type: 'oxQuiz', category: '감독',
      question: '직접 프리킥도 반드시 다른 선수에게 패스해야 하며 직접 슈팅으로 골을 넣을 수 없다.',
      answer: false,
      explanation: '직접 프리킥은 직접 슈팅으로 골이 가능합니다. 반드시 다른 선수를 거쳐야 하는 것은 간접 프리킥입니다.',
    },
    {
      type: 'fillBlank', category: '감독',
      question: '공격을 재조직하기 위해 후방 동료에게 뒤로 돌려 주는 패스를 [___]패스라고 한다.',
      answer: '백',
      hint: '영어로 back pass',
      explanation: '백패스는 공격 전환과 재조직을 위해 후방으로 돌리는 전술적 패스입니다.',
    },
  ],

  // ── Lv.3 | STEP 3 — 전술 이해 ────────────────────────────────
  3: [
    // 선수: 공격·압박 전술에서 선수 역할
    {
      type: 'multipleChoice', category: '선수',
      question: '수비 후 빠르게 전환해 역습을 이어 가는 전술을 무엇이라 할까요?',
      options: ['티키타카', '카운터어택', '포지셔널 플레이', '하이프레스'],
      answer: 1,
      explanation: '카운터어택(역습)은 수비 후 빠른 전환 공격으로 상대 빈 공간을 노리는 전술입니다.',
    },
    {
      type: 'multipleChoice', category: '선수',
      question: '짧은 패스를 연결해 점유율을 극대화하는 스페인 대표팀의 상징적 전술은?',
      options: ['파킹더버스', '카운터어택', '티키타카', '하이프레스'],
      answer: 2,
      explanation: '티키타카는 짧은 패스 연결로 점유율을 높이는 전술로, 스페인 대표팀과 바르셀로나의 상징입니다.',
    },
    {
      type: 'multipleChoice', category: '선수',
      question: '측면 풀백이 공격수보다 앞으로 달려 나가 측면에서 수적 우위를 만드는 움직임은?',
      options: ['게겐프레싱', '파킹더버스', '오버랩', '하이라인'],
      answer: 2,
      explanation: '오버랩은 풀백이 윙어 앞으로 추월해 올라가 측면에서 수적 우위를 창출하는 전술 움직임입니다.',
    },
    {
      type: 'oxQuiz', category: '선수',
      question: '하이프레스는 자기 골문 가까이에서 소극적으로 수비하는 전술이다.',
      answer: false,
      explanation: '하이프레스는 상대 진영 깊숙이 들어가 적극적으로 압박하는 공격적 수비 전술입니다.',
    },
    {
      type: 'oxQuiz', category: '선수',
      question: '게겐프레싱은 공을 빼앗긴 직후 즉시 전방에서 강하게 역압박하는 전술이다.',
      answer: true,
      explanation: '게겐프레싱(Gegenpressing)은 공을 잃은 순간 즉시 강하게 되빼앗으려는 위르겐 클롭의 전술입니다.',
    },
    {
      type: 'fillBlank', category: '선수',
      question: '수비 라인을 끌어올려 오프사이드를 유도하고 공간을 압박하는 수비 방식을 [___]라인 수비라고 한다.',
      answer: '하이',
      hint: '높게, 앞으로 올려진',
      explanation: '하이라인 수비는 수비 라인을 끌어올려 공간을 좁히고 오프사이드를 유도하는 전술입니다.',
    },
    // 감독: 포메이션, 압박 전술, 공격 전술
    {
      type: 'multipleChoice', category: '감독',
      question: '미드필더 4명으로 중원을 장악하는 균형 잡힌 전통 포메이션은?',
      options: ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'],
      answer: 1,
      explanation: '4-4-2는 수비 4·미드필더 4·공격 2로 균형 잡힌 가장 전통적인 포메이션입니다.',
    },
    {
      type: 'multipleChoice', category: '감독',
      question: '공격수 3명을 두어 다양한 공격 루트를 만드는 공격적 포메이션은?',
      options: ['4-5-1', '5-4-1', '4-3-3', '5-3-2'],
      answer: 2,
      explanation: '4-3-3은 공격수를 3명 두어 측면·중앙 다양한 공격 루트를 열어 주는 포메이션입니다.',
    },
    {
      type: 'multipleChoice', category: '감독',
      question: '골문 앞에 수비수를 대거 집결시켜 공간을 차단하는 극단적 수비 전술은?',
      options: ['하이프레스', '게겐프레싱', '파킹더버스', '티키타카'],
      answer: 2,
      explanation: '파킹더버스는 버스를 세운 것처럼 골문 앞을 빽빽하게 막는 초극단 수비 전술입니다.',
    },
    {
      type: 'oxQuiz', category: '감독',
      question: '미들블록은 하프라인 근처에서 중간 강도로 압박하는 균형 잡힌 수비 방법이다.',
      answer: true,
      explanation: '미들블록은 너무 높지도 낮지도 않은 중간 위치에서 상대를 압박하는 수비 방식입니다.',
    },
    {
      type: 'oxQuiz', category: '감독',
      question: '포지셔널 플레이는 역습 속도를 최우선으로 하는 전술이다.',
      answer: false,
      explanation: '포지셔널 플레이는 공간 선점과 점유율을 중시하는 전술로, 역습 위주의 카운터어택과는 반대입니다.',
    },
    {
      type: 'fillBlank', category: '감독',
      question: '공을 빼앗기자마자 즉시 역압박하는, 리버풀 클롭 감독의 상징적 전술은 [___]프레싱이다.',
      answer: '게겐',
      hint: '독일어로 "반격(Gegen)"',
      explanation: '게겐프레싱은 공을 잃으면 즉시 되빼앗으려는 클롭의 하이 인텐시티 전술입니다.',
    },
  ],

  // ── Lv.4 | STEP 4 — 실전 심화 ────────────────────────────────
  4: [
    // 선수: 세트피스 전술, 게임 읽기, 오프사이드 트랩 이해
    {
      type: 'multipleChoice', category: '선수',
      question: '코너킥 상황에서 오프사이드가 적용되지 않는 이유로 올바른 것은?',
      options: ['코너킥은 규칙이 없어서', '킥 순간 골키퍼가 앞에 있어서', '코너킥은 오프사이드 예외 세트피스이기 때문에', '공격수가 항상 수비 뒤에 있어서'],
      answer: 2,
      explanation: '코너킥·골킥·스로인 상황에서는 오프사이드 규칙이 적용되지 않는 예외입니다.',
    },
    {
      type: 'multipleChoice', category: '선수',
      question: '공이 없을 때 좋은 위치를 미리 선점해 득점 기회를 만드는 능력은?',
      options: ['드리블', '포지셔닝', '태클', '트래핑'],
      answer: 1,
      explanation: '포지셔닝은 공이 없을 때도 최적 위치를 선점하는 능력으로, 득점의 절반을 결정합니다.',
    },
    {
      type: 'multipleChoice', category: '선수',
      question: '프리킥 상황에서 공을 차는 척 달려가 수비를 혼란시키는 가짜 러너 움직임을?',
      options: ['게겐프레싱', '더미 런', '오버랩', '하이라인'],
      answer: 1,
      explanation: '더미 런(Dummy Run)은 수비를 교란하기 위해 공을 차는 척 달려가는 페이크 움직임입니다.',
    },
    {
      type: 'oxQuiz', category: '선수',
      question: '수비수들이 동시에 앞으로 전진해 공격수를 오프사이드 위치로 유도하는 전술을 오프사이드 트랩이라 한다.',
      answer: true,
      explanation: '오프사이드 트랩은 수비수들이 동시에 라인을 올려 공격수를 오프사이드 위치에 남겨 두는 전술입니다.',
    },
    {
      type: 'oxQuiz', category: '선수',
      question: '페널티킥 도움닫기 중 키커가 완전히 멈추는 동작은 항상 허용된다.',
      answer: false,
      explanation: '도움닫기 중 완전히 멈추는 것은 반칙으로 판정돼 상대 팀에게 간접 프리킥이 주어집니다.',
    },
    {
      type: 'fillBlank', category: '선수',
      question: '게임을 잘 읽으려면 상대 수비 라인의 [___](빈 공간)을 빠르게 파악해야 한다.',
      answer: '틈새',
      hint: '빈 공간, 구멍',
      explanation: '게임 읽기의 핵심은 상대 수비 라인의 빈 틈새(공간)를 빠르게 인식하는 것입니다.',
    },
    // 감독: 오프사이드 트랩, 압박 수비, 전술 변화
    {
      type: 'multipleChoice', category: '감독',
      question: '오프사이드 트랩이 성공하기 위한 가장 중요한 조건은?',
      options: ['공격수의 빠른 속도', '수비수들의 완벽한 팀워크와 동조', '골키퍼의 반사 신경', '미드필더의 드리블 능력'],
      answer: 1,
      explanation: '오프사이드 트랩은 수비수 전원이 동시에 올라가야 하므로 완벽한 팀워크가 필수입니다.',
    },
    {
      type: 'multipleChoice', category: '감독',
      question: '수비 라인과 미드필드 라인 간격을 좁게 유지해 공격 공간을 제거하는 수비 원칙은?',
      options: ['하이프레스', '컴팩트 수비', '파킹더버스', '게겐프레싱'],
      answer: 1,
      explanation: '컴팩트(Compact) 수비는 라인 간격을 좁혀 상대 공격 공간을 제거하는 수비 원칙입니다.',
    },
    {
      type: 'multipleChoice', category: '감독',
      question: '경기 흐름에 따라 4-3-3에서 5-3-2로 포메이션을 바꾸는 것을?',
      options: ['오버랩', '카운터어택', '전술 변화', '세트피스'],
      answer: 2,
      explanation: '감독은 경기 흐름에 따라 포메이션과 전술을 변화시켜 팀을 조율합니다.',
    },
    {
      type: 'oxQuiz', category: '감독',
      question: '압박 수비에서 1차 수비수가 공 소유자를 봉쇄하면 2차·3차 수비수가 주변 공간을 커버해야 한다.',
      answer: true,
      explanation: '압박 수비의 기본 원칙은 1차 수비수가 공을 막고, 주변 수비수가 공간을 커버하는 것입니다.',
    },
    {
      type: 'oxQuiz', category: '감독',
      question: '코너킥에서 니어포스트(가까운 골대)로 올리는 킥과 파포스트(먼 골대)로 올리는 킥은 서로 다른 공격 전술이다.',
      answer: true,
      explanation: '니어포스트와 파포스트 코너킥은 수비 배치를 혼란시키는 서로 다른 공격 전술입니다.',
    },
    {
      type: 'fillBlank', category: '감독',
      question: '오프사이드 트랩에서 수비수들은 [___]가 이루어지는 순간에 맞춰 일제히 전진해야 한다.',
      answer: '패스',
      hint: '공이 이동하기 시작하는 순간',
      explanation: '오프사이드는 패스가 출발하는 순간 기준이므로, 그 타이밍에 라인을 올려야 트랩이 성공합니다.',
    },
  ],

  // ── Lv.5 | 심화 — 월드클래스 ──────────────────────────────────
  5: [
    // 선수: 데이터 지표, 역할 심화, 용어
    {
      type: 'multipleChoice', category: '선수',
      question: 'GOAT는 무엇의 약자일까요?',
      options: ['Greatest Of All Time', 'Goal Of A Team', 'Game On A Turf', 'Guard Of The Goal'],
      answer: 0,
      explanation: 'GOAT는 Greatest Of All Time, 즉 역대 최고의 선수를 뜻합니다.',
    },
    {
      type: 'multipleChoice', category: '선수',
      question: '데이터 지표 xG(Expected Goals)는 무엇을 수치화한 것일까요?',
      options: ['슈팅이 골이 될 기대 확률', '경기 수', '교체 수', '경고 수'],
      answer: 0,
      explanation: 'xG는 슈팅 상황에서 골이 될 확률을 수치화한 지표로, 팀·선수의 공격력 평가에 사용됩니다.',
    },
    {
      type: 'multipleChoice', category: '선수',
      question: 'PPDA(Passes Per Defensive Action)가 낮을수록 의미하는 것은?',
      options: ['압박 강도가 약하다', '압박 강도가 강하다', '패스 성공률이 높다', '슈팅 수가 많다'],
      answer: 1,
      explanation: 'PPDA는 수치가 낮을수록 상대에게 패스를 적게 허용했다는 뜻으로, 압박 강도가 강한 것을 의미합니다.',
    },
    {
      type: 'oxQuiz', category: '선수',
      question: '한 선수가 한 경기에서 3골을 기록하는 것을 해트트릭이라고 한다.',
      answer: true,
      explanation: '해트트릭(Hat-trick)은 한 선수가 한 경기에서 3골을 기록하는 것입니다.',
    },
    {
      type: 'oxQuiz', category: '선수',
      question: 'xA(expected Assists)는 패스가 어시스트로 이어질 기대값을 수치화한 지표다.',
      answer: true,
      explanation: 'xA는 어떤 패스가 어시스트가 될 가능성을 수치화한 지표입니다.',
    },
    {
      type: 'fillBlank', category: '선수',
      question: '최전방 공격수(9번)가 내려와 미드필더처럼 움직이며 공간을 창출하는 역할을 [___] 나인이라고 한다.',
      answer: '폴스',
      hint: '영어로 False(가짜)',
      explanation: '폴스 나인(False 9)은 9번이 내려와 공간을 만드는 현대적 전술 역할입니다.',
    },
    // 감독: 역사적 전술가, 심화 전술 용어
    {
      type: 'multipleChoice', category: '감독',
      question: '모든 선수가 포지션을 유연하게 바꿔 공수 모두에 가담하는 토탈 풋볼(Total Football)과 가장 관련 깊은 인물은?',
      options: ['요한 크루이프', '주제 무리뉴', '디에고 시메오네', '클라우디오 라니에리'],
      answer: 0,
      explanation: '토탈 풋볼은 네덜란드 레전드 요한 크루이프가 완성하고 구현한 혁명적 전술입니다.',
    },
    {
      type: 'multipleChoice', category: '감독',
      question: '두 명의 수비형 미드필더를 나란히 배치해 중원을 안정시키는 구성을 무엇이라 할까요?',
      options: ['더블 피봇', '폴스 나인', '게겐프레싱', '파킹더버스'],
      answer: 0,
      explanation: '더블 피봇(Double Pivot)은 두 명의 수비형 미드필더가 나란히 서서 중원을 안정시키는 구성입니다.',
    },
    {
      type: 'multipleChoice', category: '감독',
      question: '주발과 반대 측면에 배치해 안쪽으로 파고들게 하는 윙어를 무엇이라 할까요?',
      options: ['인버티드 윙어', '홀딩 미드필더', '폴스 백', '스위퍼'],
      answer: 0,
      explanation: '인버티드 윙어는 주발의 반대 측면에 서서 중앙으로 파고들며 슈팅과 연계를 노리는 역할입니다.',
    },
    {
      type: 'oxQuiz', category: '감독',
      question: '요한 크루이프의 철학이 바르셀로나 점유 축구(티키타카)의 사상적 뿌리로 평가받는다.',
      answer: true,
      explanation: '크루이프의 토탈 풋볼 철학이 바르셀로나 점유 축구의 기반이 되었습니다.',
    },
    {
      type: 'oxQuiz', category: '감독',
      question: '과르디올라(점유 중심)와 클롭(압박 중심)은 현대 축구의 대표적인 대조적 철학으로 비교된다.',
      answer: true,
      explanation: '두 감독은 각각 점유(과르디올라)와 압박(클롭)이라는 서로 다른 철학으로 큰 성공을 거뒀습니다.',
    },
    {
      type: 'fillBlank', category: '감독',
      question: 'AC 밀란에서 강한 조직 [___]과 4-4-2로 현대 전술의 뿌리를 만든 감독은 아리고 사키다.',
      answer: '압박',
      hint: '공격적으로 상대를 몰아붙이는 수비 방식',
      explanation: '아리고 사키의 AC 밀란은 조직적인 압박과 4-4-2로 현대 축구 전술에 큰 영향을 주었습니다.',
    },
  ],
};

// 주제별 학습 인트로 카드 (오프라인용)
const INTRO = {
  선수: {
    title: '선수와 포지션',
    emoji: '⚽',
    summary: '축구 포지션은 GK·DF·MF·FW로 나뉘어요. 각 포지션마다 역할이 다르고, 전술에 따라 더 세부적인 역할(ST·CAM·CDM·CB·풀백 등)로 나뉩니다.',
    tip: '💡 GK·DF·MF·FW 네 글자만 기억하면 포지션의 절반은 끝!',
  },
  감독: {
    title: '감독과 전술',
    emoji: '🎯',
    summary: '감독은 선발 명단·교체·팀 전술을 책임지는 사람이에요. 4-4-2·4-3-3 같은 포메이션과 하이프레스·티키타카 같은 전술로 팀의 색깔을 만들어요.',
    tip: '💡 포메이션 숫자는 앞에서부터 수비-미드필더-공격 인원 순!',
  },
  default: {
    title: '오늘의 축구 학습',
    emoji: '📘',
    summary: '선수와 감독, 두 가지 주제를 넘나들며 다양한 형식의 문제로 축구를 배워봐요. 문제는 커리큘럼 단계에 맞게 출제됩니다.',
    tip: '💡 틀려도 괜찮아요. 해설을 읽으면 실력이 쑥쑥 늘어요!',
  },
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

function poolForTopic(level, topic) {
  const wanted = topic === '선수' ? ['선수'] : topic === '감독' ? ['감독'] : ['선수', '감독'];
  return (BANK[level] || []).filter((q) => wanted.includes(q.category));
}

export function getFallbackQuiz(topic, count, userLevel) {
  const level = clampLevel(userLevel);
  const needed = Math.max(1, count || 1);

  let pool = poolForTopic(level, topic);
  for (let l = level - 1; l >= 1 && pool.length < needed; l--) pool = pool.concat(poolForTopic(l, topic));
  for (let l = level + 1; l <= 5 && pool.length < needed; l++) pool = pool.concat(poolForTopic(l, topic));

  return shuffle(pool).slice(0, needed).map((q, i) => ({
    ...q,
    id: `fb_${Date.now()}_${i}`,
    offline: true,
  }));
}

export function getFallbackIntro(topic) {
  return { ...(INTRO[topic] || INTRO.default) };
}
