import { useState, useCallback } from 'react';
import { getUser, saveUser, addStudyLog } from '../utils/storage';
import {
  getLevelInfo,
  checkNewBadges,
  calculateStreakUpdate,
  XP_REWARDS,
  getTodayString,
} from '../utils/levelSystem';

export function useUser() {
  const [user, setUser] = useState(() => getUser());

  const refresh = useCallback(() => {
    setUser(getUser());
  }, []);

  const applySessionResult = useCallback((sessionResult) => {
    const current = getUser();

    const { totalXP, correctCount, totalCount, type, perfect, maxCombo, isDaily } = sessionResult;

    let xpGained = totalXP;
    if (perfect) xpGained += XP_REWARDS.perfectSession;
    if (maxCombo >= 5) xpGained += XP_REWARDS.comboBonus;

    const streakData = calculateStreakUpdate(current);
    xpGained += streakData.bonusXP;

    const newXP = current.xp + xpGained;
    const newLevelInfo = getLevelInfo(newXP);

    const updated = {
      ...current,
      xp: newXP,
      level: newLevelInfo.level,
      totalCorrect: current.totalCorrect + correctCount,
      totalQuestions: current.totalQuestions + totalCount,
      streak: streakData.streakUpdated ? streakData.streak : current.streak,
      bestStreak: Math.max(current.bestStreak || 0, streakData.streakUpdated ? streakData.streak : current.streak),
      lastStudyDate: getTodayString(),
      ...(isDaily ? { dailyChallengeDate: getTodayString() } : {}),
    };

    const newBadges = checkNewBadges(updated, sessionResult);
    updated.badges = [...new Set([...current.badges, ...newBadges])];

    saveUser(updated);
    setUser(updated);

    addStudyLog({
      date: getTodayString(),
      xpGained,
      correct: correctCount,
      total: totalCount,
      perfect,
      type,
    });

    return { xpGained, newBadges, streakBonus: streakData.bonusXP, leveledUp: newLevelInfo.level > current.level };
  }, []);

  return { user, refresh, applySessionResult };
}
