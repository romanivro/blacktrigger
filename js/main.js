import { initState } from './state.js';
import { initRule } from './rule.js';
import { initPlan } from './plan.js';
import { initReminders } from './reminders.js';
import { initEnvironment } from './environment.js';
import { initFitness } from './fitness.js';
import { initFinance } from './finance.js';
import { initArchetypes } from './archetypes.js';
import { initStrategy } from './strategy.js';
import { initActivity } from './activity.js';
import { initAnalytics } from './analytics.js';
import { initSettings } from './settings.js';
import { checkInactivity } from './notifications.js';

document.addEventListener('DOMContentLoaded', () => {
  initState();
  initRule();
  initPlan();
  initReminders();
  initEnvironment();
  initFitness();
  initFinance();
  initArchetypes();
  initStrategy();
  initActivity();
  initAnalytics();
  initSettings();
  checkInactivity();

  // Регистрация Service Worker для PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  }
});