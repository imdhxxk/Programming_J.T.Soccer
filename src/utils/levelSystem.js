export const LEVELS = [
  { level: 1, title: '풋살 루키', minXP: 0, maxXP: 499, color: '#6b7280', emoji: '⚽' },
  { level: 2, title: '아마추어', minXP: 500, maxXP: 1499, color: '#3b82f6', emoji: '🥅' },
  { level: 3, title: '세미프로', minXP: 1500, maxXP: 2999, color: '#8b5cf6', emoji: '🏆' },
  { level: 4, title: '프로페셔널', minXP: 3000, maxXP: 4999, color: '#f59e0b', emoji: '⭐' },
  { level: 5, title: '월드클래스', minXP: 5000, maxXP: Infinity, color: '#ef4444', emoji: '👑' },
];

export const XP_REWARDS = {
  multipleChoice: 10,
  oxQuiz: 5,
  fillBlank: 15,
  dailyChallenge: 30,
  comboBonus: 20,
  perfectSession: 50,
  streak3: 20,
  streak7: 50,
  streak30: 200,
};

export const BADGES = [
  { id: 'first_quiz', name: '첫 퀴즈', desc: '첫 번째 퀴즈 완료', emoji: '🎯' },
  { id: 'streak_3', name: '3일 연속', desc: '3일 연속 학습', emoji: '🔥' },
  { id: 'streak_7', name: '7일 연속', desc: '7일 연속 학습', emoji: '💥' },
  { id: 'streak_30', name: '30일 연속', desc: '30일 연속 학습', emoji: '🌟' },
  { id: 'level_2', name: '아마추어 달성', desc: '레벨 2 달성', emoji: '🥅' },
  { id: 'level_3', name: '세미프로 달성', desc: '레벨 3 달성', emoji: '🏆' },
  { id: 'level_4', name: '프로 달성', desc: '레벨 4 달성', emoji: '⭐' },
  { id: 'level_5', name: '월드클래스', desc: '레벨 5 달성', emoji: '👑' },
  { id: 'perfect_session', name: '퍼펙트 세션', desc: '한 세션 전문제 정답', emoji: '✨' },
  { id: 'combo_5', name: '콤보 마스터', desc: '5연속 정답 달성', emoji: '🔥' },
  { id: 'total_100', name: '100문제 달성', desc: '총 100문제 정답', emoji: '💯' },
];

export function getLevelInfo(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getProgress(xp) {
  const current = getLevelInfo(xp);
  if (current.level === 5) return 100;
  const range = current.maxXP - current.minXP + 1;
  const earned = xp - current.minXP;
  return Math.min(100, Math.floor((earned / range) * 100));
}

export function getXPToNextLevel(xp) {
  const current = getLevelInfo(xp);
  if (current.level === 5) return 0;
  return current.maxXP + 1 - xp;
}

export function checkNewBadges(user, sessionResult) {
  const newBadges = [];
  const has = (id) => user.badges.includes(id);

  if (!has('first_quiz') && user.totalQuestions >= 0) newBadges.push('first_quiz');
  if (!has('streak_3') && user.streak >= 3) newBadges.push('streak_3');
  if (!has('streak_7') && user.streak >= 7) newBadges.push('streak_7');
  if (!has('streak_30') && user.streak >= 30) newBadges.push('streak_30');
  if (!has('level_2') && user.level >= 2) newBadges.push('level_2');
  if (!has('level_3') && user.level >= 3) newBadges.push('level_3');
  if (!has('level_4') && user.level >= 4) newBadges.push('level_4');
  if (!has('level_5') && user.level >= 5) newBadges.push('level_5');
  if (!has('perfect_session') && sessionResult?.perfect) newBadges.push('perfect_session');
  if (!has('combo_5') && sessionResult?.maxCombo >= 5) newBadges.push('combo_5');
  if (!has('total_100') && user.totalCorrect >= 100) newBadges.push('total_100');

  return newBadges;
}

export function getTodayString() {
  return new Date().toDateString();
}

export function calculateStreakUpdate(user) {
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (user.lastStudyDate === today) {
    return { streak: user.streak, bonusXP: 0, streakUpdated: false };
  }

  let newStreak;
  if (user.lastStudyDate === yesterdayStr) {
    newStreak = user.streak + 1;
  } else {
    newStreak = 1;
  }

  let bonusXP = 0;
  if (newStreak === 3) bonusXP = XP_REWARDS.streak3;
  else if (newStreak === 7) bonusXP = XP_REWARDS.streak7;
  else if (newStreak === 30) bonusXP = XP_REWARDS.streak30;

  return { streak: newStreak, bonusXP, streakUpdated: true };
}
