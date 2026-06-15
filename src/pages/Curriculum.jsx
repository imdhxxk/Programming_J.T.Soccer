import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLevelInfo } from '../utils/levelSystem';

const CURRICULUM = [
  {
    step: 1,
    title: '기초 규칙',
    emoji: '📖',
    minLevel: 1,
    color: '#22c55e',
    lessons: [
      {
        title: '경기 기본 규칙',
        content: `⚽ **선수 구성**: 팀당 11명 (골키퍼 1명 + 필드 플레이어 10명)
⏱ **경기 시간**: 전반 45분 + 하프타임 15분 + 후반 45분 = 총 90분
🔄 **교체**: 경기당 최대 5회 교체 가능 (전통적으로 3회였으나 현재는 5회)
🏃 **동수 상황**: 연장전 (30분) 또는 승부차기로 결판`,
      },
      {
        title: '오프사이드 규칙',
        content: `🚩 **오프사이드 조건**: 공격 선수가 공보다 앞에 있고, 상대팀 마지막 수비수(골키퍼 제외)보다 앞에 있을 때
✅ **기준 시점**: 패스가 이루어지는 순간
❌ **오프사이드 아닌 경우**: 코너킥, 골킥, 스로인 상황
💡 **팁**: 발뒤꿈치 등 몸 어느 부위라도 수비 라인을 넘으면 오프사이드!`,
      },
      {
        title: '파울과 카드',
        content: `🟡 **옐로카드 (경고)**: 반칙, 항의, 시간 지연 등
🔴 **레드카드 (퇴장)**: 폭력, 침 뱉기, 득점 기회 저지 등
⚠️ **옐로 2장**: 레드카드 = 퇴장
👊 **직접 프리킥**: 밀치기, 태클, 핸드볼 등 신체 접촉 반칙
🦵 **간접 프리킥**: 위험한 플레이, 방해 행위 등`,
      },
      {
        title: '세트피스 완전 정복',
        content: `🔵 **코너킥**: 수비팀이 마지막으로 건드려 골라인 밖으로 → 공격팀 코너에서 킥
⚪ **골킥**: 공격팀이 마지막으로 건드려 골라인 밖으로 → 수비팀 골 에리어에서 킥
🤲 **스로인**: 공이 터치라인 밖으로 → 마지막 건드린 팀의 상대팀이 두 손으로 머리 위에서 투척
🥅 **페널티킥**: 페널티 에리어 내 반칙 → 골라인에서 11m 지점에서 킥 (1:1 상황)
🎯 **프리킥**: 반칙 지점에서 킥 (직접/간접)`,
      },
    ],
  },
  {
    step: 2,
    title: '기본 기술',
    emoji: '🦶',
    minLevel: 2,
    color: '#3b82f6',
    lessons: [
      {
        title: '패스의 종류',
        content: `👟 **숏패스**: 가까운 거리의 동료에게 정확하게 전달. 발 안쪽(인사이드)을 사용
🏹 **롱패스**: 먼 거리 동료에게. 발등(인스텝)으로 강하게 차는 킥
🔍 **스루패스**: 수비수 사이 공간으로 공격수에게 보내는 패스 — 타이밍이 핵심!
🔄 **백패스**: 뒤로 돌려줘 공격을 재조직하는 패스 (전술적 리셋)
↗️ **크로스**: 측면에서 골문 앞으로 날리는 패스`,
      },
      {
        title: '슈팅 기법',
        content: `💥 **인스텝 슈팅**: 발등으로 차는 강한 슈팅 — 파워 최대
🎯 **인사이드 슈팅**: 발 안쪽으로 정확히 차는 슈팅 — 정확도 높음
🌀 **커브 슈팅**: 공에 회전을 줘 휘어지는 궤적 — 바나나킥
✈️ **발리슈팅**: 공이 땅에 닿기 전에 바로 차는 슈팅 — 위험 지역에서 유용
🦵 **오버헤드킥**: 공중에서 몸을 뒤집어 차는 슈팅 — 일명 자전거 킥`,
      },
      {
        title: '드리블과 포지션',
        content: `🏃 **드리블**: 공을 발로 컨트롤하며 이동하는 기술
📏 **포지션별 역할**:
- **ST (스트라이커)**: 최전방 득점 전담
- **CAM (공격형 미드필더)**: 창의적인 패스, 득점 지원
- **CM (중앙 미드필더)**: 공수 연결 고리
- **CB (센터백)**: 중앙 수비 핵심
- **LB/RB (풀백)**: 측면 수비 + 공격 가담
- **GK (골키퍼)**: 최후방 방어선`,
      },
    ],
  },
  {
    step: 3,
    title: '전술 이해',
    emoji: '🗺️',
    minLevel: 3,
    color: '#8b5cf6',
    lessons: [
      {
        title: '주요 포메이션',
        content: `📊 **4-4-2**: 균형 잡힌 전통 포메이션. 미드필더 4명이 중원을 장악
⚔️ **4-3-3**: 공격적 포메이션. 3명의 공격수로 다양한 공격 루트
🛡️ **4-5-1 / 4-1-4-1**: 수비적 포메이션. 미드필드를 두텁게 구성
🌊 **3-5-2**: 윙백을 활용한 공격적 3백 시스템
⚡ **3-4-3**: 매우 공격적. 날개 공격수를 강조하는 포메이션`,
      },
      {
        title: '압박 전술',
        content: `🔥 **하이프레스**: 상대 진영 깊숙이 압박. 위르겐 클롭의 리버풀이 대표 사례
🎯 **게겐프레싱**: 공을 뺏긴 직후 즉시 역압박 — 전환을 막는 전술
🛡️ **미들블록**: 하프라인 근처에서 중간 압박. 균형 잡힌 수비 방법
🚗 **파킹더버스**: 자기 골문 앞에 수비수 집결. 수비 전용 초극단 전술`,
      },
      {
        title: '공격 전술',
        content: `🏃 **카운터어택 (역습)**: 수비 후 빠른 역습. 상대 공격 후 생기는 공백 활용
⚽ **티키타카**: 짧은 패스를 연결해 점유율 극대화. 스페인 대표팀과 바르셀로나의 상징
📐 **포지셔널 플레이**: 공간을 만들어 조직적으로 공격. 과르디올라 스타일
🌊 **오버랩**: 풀백이 측면 공격수보다 앞으로 오버랩해 수적 우위 창출`,
      },
    ],
  },
  {
    step: 4,
    title: '실전 심화',
    emoji: '🏆',
    minLevel: 4,
    color: '#f59e0b',
    lessons: [
      {
        title: '세트피스 전술',
        content: `🎯 **코너킥 전술**: 니어포스트/파포스트 공중볼, 쇼트코너, 다이렉트 슈팅
⚽ **프리킥 전술**: 직접 슈팅, 더미 런(가짜 러너), 벽 활용
🥅 **페널티킥 심리전**: 방향 페이크, 킥커 루틴 분석, 골키퍼 집중력
🔄 **킥오프 전술**: 롱볼로 압박 즉시 시작, 짧은 패스 연결 후 전개`,
      },
      {
        title: '게임 읽기',
        content: `👁️ **공간 인식**: 상대 수비 라인의 틈새를 빠르게 파악하는 능력
🧠 **포지셔닝**: 공 없을 때 좋은 위치를 선점하는 것이 득점의 절반
📊 **매치업 이해**: 상대 선수와 나의 매치업을 분석해 유리한 상황 만들기
⏱️ **타이밍**: 패스, 드리블, 슈팅 — 모든 것은 타이밍이 결정함
🔀 **전술 변화**: 경기 흐름에 따라 포메이션·전술을 바꾸는 능력 (전술 교체)`,
      },
      {
        title: '오프사이드 트랩 & 압박 수비',
        content: `🚩 **오프사이드 트랩**: 수비수들이 일제히 전진해 공격수를 오프사이드로 유도
⚡ **타이밍**: 패스 순간에 맞춰 라인 올리기 — 팀워크가 핵심
🛡️ **압박 수비 원칙**: 1차 수비수가 공을 소유한 선수를 봉쇄 → 2차·3차 수비수가 공간 커버
📌 **컴팩트함 유지**: 수비 라인과 미드필드 라인 간격을 좁게 유지해 공간 제거
🎯 **트랩 성공 조건**: 수비수 전원의 완벽한 동조화 + 상대의 패스 방향 예측`,
      },
    ],
  },
];

export default function Curriculum({ user }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});
  const [openLesson, setOpenLesson] = useState({});
  const userLevel = getLevelInfo(user.xp).level;

  function toggleStep(step) {
    setExpanded((prev) => ({ ...prev, [step]: !prev[step] }));
  }

  function toggleLesson(key) {
    setOpenLesson((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function renderContent(text) {
    return text.split('\n').map((line, i) => {
      const cleaned = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} dangerouslySetInnerHTML={{ __html: cleaned }} style={{ margin: '4px 0' }} />;
    });
  }

  return (
    <div className="page">
      <h1 className="page-title">📚 커리큘럼</h1>
      <p className="page-sub">단계별로 축구 지식을 쌓아보세요. 레벨이 오를수록 새로운 STEP이 열립니다!</p>

      <div className="curriculum-list">
        {CURRICULUM.map((step) => {
          const unlocked = userLevel >= step.minLevel;
          const isOpen = expanded[step.step];

          return (
            <div
              key={step.step}
              className={`curriculum-card ${unlocked ? 'unlocked' : 'locked'}`}
              style={{ borderColor: unlocked ? step.color : '#334155' }}
            >
              <button className="curriculum-header" onClick={() => unlocked && toggleStep(step.step)}>
                <div className="curriculum-header-left">
                  <span className="curriculum-step-num" style={{ background: unlocked ? step.color : '#334155' }}>
                    STEP {step.step}
                  </span>
                  <span className="curriculum-emoji">{unlocked ? step.emoji : '🔒'}</span>
                  <div className="curriculum-header-text">
                    <span className="curriculum-title" style={{ color: unlocked ? step.color : '#64748b' }}>
                      {step.title}
                    </span>
                    {!unlocked && (
                      <span className="curriculum-unlock-hint">Lv.{step.minLevel} 달성 시 해금</span>
                    )}
                  </div>
                </div>
                {unlocked && <span className="curriculum-arrow">{isOpen ? '▲' : '▼'}</span>}
              </button>

              {unlocked && isOpen && (
                <div className="curriculum-body">
                  {step.lessons.map((lesson, li) => {
                    const key = `${step.step}-${li}`;
                    const isLessonOpen = openLesson[key];
                    return (
                      <div key={li} className="lesson-item">
                        <button className="lesson-header" onClick={() => toggleLesson(key)}>
                          <span>📄 {lesson.title}</span>
                          <span>{isLessonOpen ? '▲' : '▼'}</span>
                        </button>
                        {isLessonOpen && (
                          <div className="lesson-content fade-in">
                            {renderContent(lesson.content)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button
                    className="btn-outline curriculum-quiz-btn"
                    onClick={() => navigate(`/quiz?type=mixed&level=${step.minLevel}`)}
                    style={{ borderColor: step.color, color: step.color }}
                  >
                    이 단계 퀴즈 풀기 →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
