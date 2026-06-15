import { getLevelInfo, LEVELS, BADGES } from '../utils/levelSystem';
import { getStudyLog } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import XPBar from '../components/XPBar';

export default function MyPage({ user }) {
  const navigate = useNavigate();
  const levelInfo = getLevelInfo(user.xp);
  const log = getStudyLog().slice(0, 14);

  const accuracy = user.totalQuestions > 0
    ? Math.round((user.totalCorrect / user.totalQuestions) * 100)
    : 0;

  const earnedBadges = BADGES.filter((b) => user.badges.includes(b.id));
  const lockedBadges = BADGES.filter((b) => !user.badges.includes(b.id));

  return (
    <div className="page">
      <h1 className="page-title">👤 마이페이지</h1>

      {/* 프로필 카드 */}
      <div className="profile-card" style={{ borderColor: levelInfo.color }}>
        <div className="profile-avatar" style={{ background: levelInfo.color }}>
          {levelInfo.emoji}
        </div>
        <div className="profile-info">
          <h2 className="profile-level" style={{ color: levelInfo.color }}>
            Lv.{levelInfo.level} {levelInfo.title}
          </h2>
          <p className="profile-xp">{user.xp.toLocaleString()} XP 보유</p>
          <p className="profile-streak">🔥 {user.streak}일 연속 학습 중</p>
        </div>
      </div>

      <XPBar xp={user.xp} />

      {/* 통계 */}
      <section>
        <h2 className="section-title">📊 내 통계</h2>
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-emoji">🎯</div>
            <div className="stat-value">{user.totalCorrect}</div>
            <div className="stat-label">총 정답</div>
          </div>
          <div className="stat-card">
            <div className="stat-emoji">📝</div>
            <div className="stat-value">{user.totalQuestions}</div>
            <div className="stat-label">총 문제</div>
          </div>
          <div className="stat-card">
            <div className="stat-emoji">📈</div>
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">정답률</div>
          </div>
          <div className="stat-card">
            <div className="stat-emoji">🔥</div>
            <div className="stat-value">{user.bestStreak || user.streak}</div>
            <div className="stat-label">최고 스트릭</div>
          </div>
        </div>
      </section>

      {/* 배지 */}
      <section>
        <h2 className="section-title">🏅 획득 배지 ({earnedBadges.length}/{BADGES.length})</h2>
        {earnedBadges.length === 0 && (
          <div className="empty-state">
            <span className="empty-emoji">🏅</span>
            <p>아직 배지가 없어요. 퀴즈를 풀어 배지를 획득하세요!</p>
          </div>
        )}
        <div className="badge-grid">
          {earnedBadges.map((b) => (
            <div key={b.id} className="badge-card earned">
              <span className="badge-emoji">{b.emoji}</span>
              <span className="badge-name">{b.name}</span>
              <span className="badge-desc">{b.desc}</span>
            </div>
          ))}
          {lockedBadges.map((b) => (
            <div key={b.id} className="badge-card locked">
              <span className="badge-emoji" style={{ filter: 'grayscale(1) opacity(0.4)' }}>{b.emoji}</span>
              <span className="badge-name" style={{ color: '#475569' }}>{b.name}</span>
              <span className="badge-desc" style={{ color: '#334155' }}>{b.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 최근 학습 기록 */}
      <section>
        <h2 className="section-title">📅 최근 학습 기록</h2>
        {log.length === 0 && (
          <div className="empty-state">
            <span className="empty-emoji">📚</span>
            <p>아직 학습 기록이 없어요!</p>
          </div>
        )}
        <div className="log-list">
          {log.map((entry, i) => (
            <div key={i} className="log-item">
              <div className="log-date">{entry.date}</div>
              <div className="log-details">
                <span className="log-score">{entry.correct}/{entry.total} 정답</span>
                {entry.perfect && <span className="log-perfect">✨ 퍼펙트</span>}
              </div>
              <div className="log-xp">+{entry.xpGained} XP</div>
            </div>
          ))}
        </div>
      </section>

      {/* 레벨 로드맵 */}
      <section>
        <h2 className="section-title">🗺️ 레벨 로드맵</h2>
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

      <div style={{ marginTop: '2rem' }}>
        <button className="btn-outline" onClick={() => navigate('/settings')}>⚙️ 설정</button>
      </div>
    </div>
  );
}
