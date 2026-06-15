import { getLevelInfo, getProgress, getXPToNextLevel, LEVELS } from '../utils/levelSystem';

export default function XPBar({ xp, compact = false }) {
  const current = getLevelInfo(xp);
  const progress = getProgress(xp);
  const toNext = getXPToNextLevel(xp);
  const next = LEVELS.find((l) => l.level === current.level + 1);

  if (compact) {
    return (
      <div className="xp-bar-compact">
        <div className="xp-bar-track">
          <div
            className="xp-bar-fill"
            style={{ width: `${progress}%`, background: current.color }}
          />
        </div>
        <span className="xp-bar-text">{progress}%</span>
      </div>
    );
  }

  return (
    <div className="xp-bar-card">
      <div className="xp-bar-header">
        <div className="xp-level-badge" style={{ borderColor: current.color, color: current.color }}>
          {current.emoji} Lv.{current.level} {current.title}
        </div>
        {next && (
          <span className="xp-to-next">다음 레벨까지 {toNext.toLocaleString()} XP</span>
        )}
        {!next && <span className="xp-to-next" style={{ color: '#f59e0b' }}>최고 레벨 달성! 🎉</span>}
      </div>
      <div className="xp-bar-track large">
        <div
          className="xp-bar-fill"
          style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${current.color}, ${next?.color || current.color})` }}
        />
      </div>
      <div className="xp-bar-footer">
        <span>{xp.toLocaleString()} XP</span>
        {next && <span>{next.emoji} {next.title} ({next.minXP.toLocaleString()} XP)</span>}
      </div>
    </div>
  );
}
