import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { generateQuiz, generateDailyChallenge, generateIntro, resolveApiKey } from '../utils/quizGenerator';
import { getSettings } from '../utils/storage';
import { XP_REWARDS, getTodayString } from '../utils/levelSystem';
import { useToast } from '../components/Toast';
import { useUser } from '../hooks/useUser';

// 퀴즈 모드 = 주제(선수/감독) 선택. 각 주제 안에서 객관식·OX·빈칸이 골고루 섞여 출제됩니다.
const TYPE_INFO = {
  선수:  { label: '선수 퀴즈',         icon: '⚽', color: '#22c55e' },
  감독:  { label: '감독 퀴즈',         icon: '🎯', color: '#f59e0b' },
  mixed: { label: '랜덤 (선수+감독)',  icon: '🎲', color: '#3b82f6' },
  daily: { label: '오늘의 챌린지',     icon: '🌟', color: '#ef4444' },
};

const CATEGORY_INFO = {
  선수: { icon: '⚽', color: '#22c55e', label: '선수' },
  감독: { icon: '🎯', color: '#f59e0b', label: '감독' },
};

const SESSION_SIZE = 5;

export default function Quiz({ onComplete }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const { user, applySessionResult } = useUser();

  // ── 상태 ──────────────────────────────────────────────────────
  const [phase, setPhase] = useState('select');
  const [activeType, setActiveType] = useState('mixed'); // 현재 실행 중인 퀴즈 타입
  const [intro, setIntro] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [results, setResults] = useState([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const dailyDone = user.dailyChallengeDate === getTodayString();
  const apiKey = resolveApiKey(getSettings().apiKey);
  // 커리큘럼 "이 단계 퀴즈 풀기" 버튼이 ?level=X를 넘기면 해당 레벨로 문제를 출제
  const overrideLevel = parseInt(params.get('level')) || null;

  // URL에 type 파라미터가 있을 때만 자동 시작
  useEffect(() => {
    const urlType = params.get('type');
    if (urlType) handleStart(urlType);
  }, []);

  // ── 퀴즈 시작 ─────────────────────────────────────────────────
  async function handleStart(type) {
    const isThisDaily = type === 'daily';

    if (isThisDaily && dailyDone) {
      showToast('오늘의 챌린지는 이미 완료했어요! 내일 다시 도전하세요 🌟', 'info');
      return;
    }

    setActiveType(type);
    setPhase('loading');
    setError('');
    setResults([]);
    setCurrent(0);
    setSelected(null);
    setTextInput('');
    setCombo(0);
    setMaxCombo(0);
    setSessionXP(0);
    setIntro(null);

    try {
      const settingsApiKey = getSettings().apiKey;

      const quizLevel = overrideLevel || user.level;
      const [introData, qs] = await Promise.all([
        generateIntro(type, quizLevel, settingsApiKey).catch(() => null),
        isThisDaily
          ? generateDailyChallenge(quizLevel, settingsApiKey).then(q => [q])
          : generateQuiz(type, SESSION_SIZE, quizLevel, settingsApiKey),
      ]);

      if (!qs || qs.length === 0) throw new Error('문제가 생성되지 않았습니다. 다시 시도해주세요.');

      setIntro(introData);
      setQuestions(qs);
      if (qs.some((q) => q.offline)) {
        showToast('⚡ AI 연결 없이 오프라인 문제로 진행합니다', 'info');
      }
      setPhase(introData ? 'intro' : 'question');
    } catch (e) {
      console.error('Quiz generation error:', e);
      // API 인증 에러 감지
      const msg = e.message || '';
      if (msg.includes('401') || msg.includes('authentication') || msg.includes('invalid') || msg.includes('api_key')) {
        setError('❌ API 키가 유효하지 않습니다. 설정 페이지에서 올바른 Gemini API 키를 확인해주세요.');
      } else if (msg.includes('429') || msg.includes('rate')) {
        setError('⏳ 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      } else if (msg.includes('JSON') || msg.includes('파싱')) {
        setError('🔄 AI 응답 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      } else {
        setError(`오류: ${msg || '문제 생성에 실패했습니다. 다시 시도해주세요.'}`);
      }
      setPhase('select');
    }
  }

  // ── XP 계산 ───────────────────────────────────────────────────
  function getXPForQuestion(q) {
    if (activeType === 'daily') return XP_REWARDS.dailyChallenge;
    if (q.type === 'multipleChoice') return XP_REWARDS.multipleChoice;
    if (q.type === 'oxQuiz') return XP_REWARDS.oxQuiz;
    if (q.type === 'fillBlank') return XP_REWARDS.fillBlank;
    return XP_REWARDS.multipleChoice;
  }

  // ── 정답 확인 ─────────────────────────────────────────────────
  function checkAnswer() {
    const q = questions[current];
    let isCorrect = false;

    if (q.type === 'multipleChoice') {
      isCorrect = selected === q.answer;
    } else if (q.type === 'oxQuiz') {
      isCorrect = selected === q.answer;
    } else if (q.type === 'fillBlank') {
      const norm = textInput.trim().replace(/\s/g, '').toLowerCase();
      const ans = String(q.answer).replace(/\s/g, '').toLowerCase();
      isCorrect = norm === ans;
    }

    const xp = isCorrect ? getXPForQuestion(q) : 0;
    const newCombo = isCorrect ? combo + 1 : 0;
    setCombo(newCombo);
    setMaxCombo(prev => Math.max(prev, newCombo));
    setSessionXP(prev => prev + xp);
    setResults(prev => [...prev, { correct: isCorrect, xp, question: q }]);
    setPhase('feedback');
  }

  // ── 다음 문제 ─────────────────────────────────────────────────
  function nextQuestion() {
    if (current + 1 >= questions.length) {
      finishSession();
    } else {
      setCurrent(prev => prev + 1);
      setSelected(null);
      setTextInput('');
      setPhase('question');
    }
  }

  // ── 세션 종료 ─────────────────────────────────────────────────
  function finishSession() {
    const correct = results.filter(r => r.correct).length;
    const total = results.length;
    const perfect = correct === total && total > 0;

    const result = applySessionResult({
      totalXP: sessionXP,
      correctCount: correct,
      totalCount: total,
      type: activeType,
      perfect,
      maxCombo,
      isDaily: activeType === 'daily',
    });

    setSummary({ correct, total, perfect, maxCombo, sessionXP, ...result });
    setPhase('summary');
    if (onComplete) onComplete();
  }

  // ── 카테고리 배지 컴포넌트 ────────────────────────────────────
  function CategoryBadge({ category }) {
    const info = CATEGORY_INFO[category] || { icon: '📌', color: '#6b7280', label: category };
    return (
      <span className="category-badge" style={{ background: info.color + '22', color: info.color, borderColor: info.color + '55' }}>
        {info.icon} {info.label}
      </span>
    );
  }

  const curTypeInfo = TYPE_INFO[activeType] || TYPE_INFO.mixed;

  // ══════════════════════════════════════════════════════════════
  // 퀴즈 선택 화면
  // ══════════════════════════════════════════════════════════════
  if (phase === 'select') {
    return (
      <div className="page">
        <h1 className="page-title">❓ 퀴즈 선택</h1>
        <p className="page-sub">주제(선수·감독)를 고르면 객관식·OX·빈칸이 섞여 나와요. (키가 없으면 기본 문제로 진행)</p>

        {!apiKey && (
          <div
            className="info-box"
            style={{
              cursor: 'pointer',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid var(--color-blue)',
              color: 'var(--color-text)',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              fontSize: '0.9rem',
            }}
            onClick={() => navigate('/settings')}
          >
            💡 API 키 없이도 <strong>기본(오프라인) 문제</strong>로 바로 풀 수 있어요. AI 맞춤 문제를 원하면 여기를 눌러 키를 등록하세요 →
          </div>
        )}
        {error && (
          <div className="error-box">
            {error}
            <br />
            <button className="btn-outline small" style={{ marginTop: '8px' }} onClick={() => navigate('/settings')}>
              ⚙️ 설정으로 이동
            </button>
          </div>
        )}

        <div className="quiz-type-grid">
          {Object.entries(TYPE_INFO).map(([key, info]) => (
            <button
              key={key}
              className="quiz-type-btn"
              style={{ borderColor: info.color }}
              onClick={() => handleStart(key)}
              disabled={key === 'daily' && dailyDone}
            >
              <span className="quiz-type-icon">{info.icon}</span>
              <span className="quiz-type-label">{info.label}</span>
              {key === 'daily' && dailyDone
                ? <span className="quiz-type-done">오늘 완료 ✅</span>
                : <span className="quiz-type-xp" style={{ color: info.color }}>
                    {key === 'daily' ? '+30 XP' : '+5~15 XP'}
                  </span>
              }
            </button>
          ))}
        </div>

        <div className="quiz-category-info">
          <h3 className="section-title">📚 두 가지 주제로 배워요</h3>
          <div className="quiz-category-grid">
            {Object.values(CATEGORY_INFO).map(c => (
              <div key={c.label} className="quiz-category-card" style={{ borderColor: c.color + '55' }}>
                <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                <span style={{ color: c.color, fontWeight: 700 }}>{c.label}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {c.label === '선수' ? '포지션·기술·유명 선수' : '전술·포메이션·명장'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 로딩 화면
  // ══════════════════════════════════════════════════════════════
  if (phase === 'loading') {
    return (
      <div className="page center-content">
        <div className="loading-spinner">⚽</div>
        <p className="loading-text">AI가 문제를 생성하는 중...</p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>
          선수 · 감독 문제를 레벨에 맞게 준비하고 있어요
        </p>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 규칙 학습 카드 (Intro)
  // ══════════════════════════════════════════════════════════════
  if (phase === 'intro' && intro) {
    return (
      <div className="page center-content">
        <div className="intro-card fade-in">
          <div className="intro-badge">📘 오늘의 학습</div>
          <div className="intro-emoji">{intro.emoji}</div>
          <h2 className="intro-title">{intro.title}</h2>
          <p className="intro-summary">{intro.summary}</p>
          <div className="intro-tip">{intro.tip}</div>
          <button className="btn-primary intro-start-btn" onClick={() => setPhase('question')}>
            퀴즈 시작하기 →
          </button>
          <p className="intro-hint">내용을 읽었다면 퀴즈로 실력을 확인해보세요!</p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 세션 결과 화면
  // ══════════════════════════════════════════════════════════════
  if (phase === 'summary' && summary) {
    const { correct, total, perfect, maxCombo: mc, sessionXP: sXP, xpGained, newBadges, streakBonus, leveledUp } = summary;
    return (
      <div className="page center-content">
        <div className="summary-card">
          <div className="summary-emoji">{perfect ? '🏆' : correct / total >= 0.6 ? '👍' : '💪'}</div>
          <h2 className="summary-title">{perfect ? '퍼펙트 세션!' : '세션 완료!'}</h2>

          {/* 카테고리별 점수 */}
          <div className="summary-category-breakdown">
            {['선수', '감독'].map(cat => {
              const catResults = results.filter(r => r.question?.category === cat);
              if (catResults.length === 0) return null;
              const catCorrect = catResults.filter(r => r.correct).length;
              return (
                <div key={cat} className="summary-cat-item">
                  <span>{CATEGORY_INFO[cat]?.icon} {cat}</span>
                  <span style={{ color: catCorrect === catResults.length ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: 700 }}>
                    {catCorrect}/{catResults.length}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="summary-score">
            <span className="summary-correct">{correct}</span>
            <span className="summary-divider"> / </span>
            <span className="summary-total">{total}</span>
            <span className="summary-label"> 정답</span>
          </div>

          <div className="summary-xp-list">
            <div className="summary-xp-item"><span>기본 XP</span><span className="xp-green">+{sXP} XP</span></div>
            {perfect && <div className="summary-xp-item"><span>퍼펙트 보너스 ✨</span><span className="xp-green">+{XP_REWARDS.perfectSession} XP</span></div>}
            {mc >= 5  && <div className="summary-xp-item"><span>콤보 보너스 🔥 (x{mc})</span><span className="xp-green">+{XP_REWARDS.comboBonus} XP</span></div>}
            {streakBonus > 0 && <div className="summary-xp-item"><span>스트릭 보너스 🔥</span><span className="xp-green">+{streakBonus} XP</span></div>}
            <div className="summary-xp-total"><span>총 획득</span><span className="xp-gold">+{xpGained} XP</span></div>
          </div>

          {leveledUp && <div className="level-up-banner">🎉 레벨 업! 새로운 레벨 달성!</div>}
          {newBadges?.length > 0 && (
            <div className="new-badges">
              <p>🏅 새 배지 획득!</p>
              {newBadges.map(b => <span key={b} className="badge-pill">{b}</span>)}
            </div>
          )}

          <div className="summary-actions">
            <button className="btn-primary" onClick={() => handleStart(activeType)}>다시 도전</button>
            <button className="btn-outline" onClick={() => navigate('/')}>홈으로</button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 문제 풀이 화면 (question / feedback)
  // ══════════════════════════════════════════════════════════════
  const q = questions[current];
  if (!q) return null;

  return (
    <div className="page">
      {/* 헤더 */}
      <div className="quiz-header">
        <span className="quiz-type-tag" style={{ background: curTypeInfo.color }}>
          {curTypeInfo.icon} {curTypeInfo.label}
        </span>
        <span className="quiz-progress">{current + 1} / {questions.length}</span>
        {combo > 1 && <span className="quiz-combo">🔥 {combo} 콤보</span>}
      </div>

      {/* 진행 바 */}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>

      {/* ── 문제 ── */}
      {phase === 'question' && (
        <div className="question-card fade-in">
          {q.category && <CategoryBadge category={q.category} />}
          <p className="question-text">{q.question}</p>
          {q.hint && <p className="question-hint">💡 힌트: {q.hint}</p>}

          {q.type === 'multipleChoice' && (
            <div className="options-grid">
              {(q.options || []).map((opt, i) => (
                <button
                  key={i}
                  className={`option-btn ${selected === i ? 'selected' : ''}`}
                  onClick={() => setSelected(i)}
                >
                  <span className="option-label">{['A', 'B', 'C', 'D'][i]}</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          )}

          {q.type === 'oxQuiz' && (
            <div className="ox-grid">
              <button className={`ox-btn o-btn ${selected === true ? 'selected' : ''}`} onClick={() => setSelected(true)}>⭕</button>
              <button className={`ox-btn x-btn ${selected === false ? 'selected' : ''}`} onClick={() => setSelected(false)}>❌</button>
            </div>
          )}

          {q.type === 'fillBlank' && (
            <div className="fill-blank-area">
              <input
                ref={inputRef}
                className="fill-blank-input"
                type="text"
                placeholder="정답을 입력하세요"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && textInput.trim() && checkAnswer()}
                autoFocus
              />
            </div>
          )}

          <button
            className="btn-primary submit-btn"
            onClick={checkAnswer}
            disabled={q.type === 'fillBlank' ? !textInput.trim() : selected === null}
          >
            확인
          </button>
        </div>
      )}

      {/* ── 피드백 ── */}
      {phase === 'feedback' && (() => {
        const last = results[results.length - 1];
        const isCorrect = last?.correct;
        return (
          <div className={`feedback-card fade-in ${isCorrect ? 'correct' : 'incorrect'}`}>
            {q.category && <CategoryBadge category={q.category} />}
            <div className="feedback-icon">{isCorrect ? '✅' : '❌'}</div>
            <h3 className="feedback-title">{isCorrect ? '정답!' : '오답'}</h3>
            {!isCorrect && q.type === 'multipleChoice' && q.options && (
              <p className="feedback-answer">정답: {q.options[q.answer]}</p>
            )}
            {!isCorrect && q.type === 'oxQuiz' && (
              <p className="feedback-answer">정답: {q.answer ? '⭕ (O)' : '❌ (X)'}</p>
            )}
            {!isCorrect && q.type === 'fillBlank' && (
              <p className="feedback-answer">정답: {q.answer}</p>
            )}
            {isCorrect && <p className="feedback-xp">+{getXPForQuestion(q)} XP 획득!</p>}
            <p className="feedback-explanation">{q.explanation}</p>
            <button className="btn-primary" onClick={nextQuestion}>
              {current + 1 >= questions.length ? '결과 보기 →' : '다음 문제 →'}
            </button>
          </div>
        );
      })()}
    </div>
  );
}
