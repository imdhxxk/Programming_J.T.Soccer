const KEYS = {
  USER: 'soccer_user',
  STUDY_LOG: 'soccer_studyLog',
  DIARY: 'soccer_diary',
  CURRICULUM: 'soccer_curriculum',
  SETTINGS: 'soccer_settings',
};

const defaultUser = {
  level: 1,
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  dailyChallengeDate: null,
  badges: [],
  totalCorrect: 0,
  totalQuestions: 0,
  bestStreak: 0,
};

const defaultCurriculum = {
  step1: { unlocked: true, completed: false },
  step2: { unlocked: false, completed: false },
  step3: { unlocked: false, completed: false },
  step4: { unlocked: false, completed: false },
};

export function getUser() {
  try {
    const data = localStorage.getItem(KEYS.USER);
    return data ? { ...defaultUser, ...JSON.parse(data) } : { ...defaultUser };
  } catch {
    return { ...defaultUser };
  }
}

export function saveUser(user) {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function getStudyLog() {
  try {
    const data = localStorage.getItem(KEYS.STUDY_LOG);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addStudyLog(entry) {
  const log = getStudyLog();
  log.unshift(entry);
  if (log.length > 90) log.length = 90;
  localStorage.setItem(KEYS.STUDY_LOG, JSON.stringify(log));
}

export function getDiary() {
  try {
    const data = localStorage.getItem(KEYS.DIARY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDiary(entries) {
  localStorage.setItem(KEYS.DIARY, JSON.stringify(entries));
}

export function getCurriculum() {
  try {
    const data = localStorage.getItem(KEYS.CURRICULUM);
    return data ? { ...defaultCurriculum, ...JSON.parse(data) } : { ...defaultCurriculum };
  } catch {
    return { ...defaultCurriculum };
  }
}

export function saveCurriculum(curriculum) {
  localStorage.setItem(KEYS.CURRICULUM, JSON.stringify(curriculum));
}

export function getSettings() {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { apiKey: '' };
  } catch {
    return { apiKey: '' };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export function clearAllData() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
