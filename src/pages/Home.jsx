import { useNavigate } from 'react-router-dom';
import { getLevelInfo, LEVELS } from '../utils/levelSystem';
import { getStudyLog, getSettings } from '../utils/storage';
import { getTodayString } from '../utils/levelSystem';
import XPBar from '../components/XPBar';

export default function Home({ user }) {
  const navigate = useNavigate();
  const levelInfo = getLevelInfo(user.xp);
  const todayStr = getTodayString();
  const studiedToday = user.lastStudyDate === todayStr;
  const dailyDone = user.dailyChallengeDate === todayStr;
  const log = getStudyLog();
  const todayLog = log.filter((e) => e.date === todayStr);
  const todayXP = todayLog.reduce((s, e) => s + e.xpGained, 0);

  const streakColor = user.streak >= 7 ? '#f59e0b' : user.streak >= 3 ? '#ef4444' : '#22c55e';
  const { apiKey } = getSettings();
  const aiEnabled = !!(apiKey || import.meta.env.VITE_GEMINI_API_KEY);

  return (
    <div className="page">
      {/* AI 상태 배너 */}
      {!aiEnabled && (
        <div className="ai-notice" onClick={() => navigate('/settings')}>
          🤖 AI 문제 생성 비활성화 — 내장 문제로 출제 중 | <strong>설정에서 API 키 입력하기 →</strong>
        </div>
      )}
      {aiEnabled && (
        <div className="ai-notice active">
          🤖 AI 문제 생성 활성화 ✅ — Gemini가 레벨에 맞는 문제를 자동 생성합니다
        </div>
      )}

      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-text">
          <h1 className="hero-title">
            안녕하세요! <span style={{ color: levelInfo.color }}>{levelInfo.emoji} {levelInfo.title}</span>
          </h1>
          <p className="hero-sub">오늘도 축구 지식을 쌓아볼까요?</p>
        </div>
        <div className="streak-badge" style={{ borderColor: streakColor }}>
          <span className="streak-fire">🔥</span>
          <span className="streak-count" style={{ color: streakColor }}>{user.streak}</span>
          <span className="streak-label">연속 학습</span>
        </div>
      </section>

      {/* XP 바 */}
      <XPBar xp={user.xp} />

      {/* 오늘 현황 */}
      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-emoji">📅</div>
          <div className="stat-value">{studiedToday ? '✅' : '⏳'}</div>
          <div className="stat-label">오늘 학습</div>
        </div>
        <div className="stat-card">
          <div className="stat-emoji">⭐</div>
          <div className="stat-value">{todayXP}</div>
          <div className="stat-label">오늘 획득 XP</div>
        </div>
        <div className="stat-card">
          <div className="stat-emoji">🔥</div>
          <div className="stat-value">{user.streak}</div>
          <div className="stat-label">연속 일수</div>
        </div>
        <div className="stat-card">
          <div className="stat-emoji">🎯</div>
          <div className="stat-value">{user.totalCorrect}</div>
          <div className="stat-label">총 정답</div>
        </div>
      </section>

      {/* 퀴즈 빠른 시작 */}
      <section className="quick-actions">
        <h2 className="section-title">⚡ 빠른 시작</h2>
        <div className="action-grid">
          <button className="action-btn primary" onClick={() => navigate('/quiz?type=mixed')}>
            <span className="action-icon">🎲</span>
            <span className="action-label">랜덤 퀴즈</span>
            <span className="action-xp">+10~15 XP</span>
          </button>
          <button
            className={`action-btn ${dailyDone ? 'done' : 'accent'}`}
            onClick={() => navigate('/quiz?type=daily')}
            disabled={dailyDone}
          >
            <span className="action-icon">🌟</span>
            <span className="action-label">오늘의 챌린지</span>
            <span className="action-xp">{dailyDone ? '완료 ✅' : '+30 XP'}</span>
          </button>
          <button className="action-btn blue" onClick={() => navigate('/quiz?type=선수')}>
            <span className="action-icon">⚽</span>
            <span className="action-label">선수 퀴즈</span>
            <span className="action-xp">+5~15 XP</span>
          </button>
          <button className="action-btn purple" onClick={() => navigate('/quiz?type=감독')}>
            <span className="action-icon">🎯</span>
            <span className="action-label">감독 퀴즈</span>
            <span className="action-xp">+5~15 XP</span>
          </button>
          <button className="action-btn dark" onClick={() => navigate('/curriculum')}>
            <span className="action-icon">📚</span>
            <span className="action-label">커리큘럼 보기</span>
            <span className="action-xp">학습하기</span>
          </button>
        </div>
      </section>

      {/* 스트릭 보너스 안내 */}
      <section className="bonus-info">
        <h2 className="section-title">🔥 연속 학습 보너스</h2>
        <div className="bonus-grid">
          {[
            { days: 3, xp: 20, achieved: user.streak >= 3 },
            { days: 7, xp: 50, achieved: user.streak >= 7 },
            { days: 30, xp: 200, achieved: user.streak >= 30 },
          ].map((b) => (
            <div key={b.days} className={`bonus-card ${b.achieved ? 'achieved' : ''}`}>
              <span className="bonus-days">{b.days}일 연속</span>
              <span className="bonus-xp">+{b.xp} XP {b.achieved ? '✅' : ''}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 레벨 로드맵 */}
      <section className="level-roadmap">
        <h2 className="section-title">🏆 레벨 로드맵</h2>
        <div className="roadmap-list">
          {LEVELS.map((lv) => (
            <div
              key={lv.level}
              className={`roadmap-item ${user.level === lv.level ? 'current' : user.level > lv.level ? 'done' : 'locked'}`}
              style={{ borderColor: user.level >= lv.level ? lv.color : '#334155' }}
            >
              <span className="roadmap-emoji">{lv.emoji}</span>
              <div className="roadmap-info">
                <span className="roadmap-title" style={{ color: user.level >= lv.level ? lv.color : '#64748b' }}>
                  Lv.{lv.level} {lv.title}
                </span>
                <span className="roadmap-xp">{lv.minXP.toLocaleString()} XP~</span>
              </div>
              {user.level > lv.level && <span className="roadmap-check">✅</span>}
              {user.level === lv.level && <span className="roadmap-check" style={{ color: lv.color }}>◀ 현재</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
