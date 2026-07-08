/* BlazeRent Studio — planner.js
 * Weekly content planner with statuses: idea → drafted → ready → posted.
 */
window.BR = window.BR || {};

(function () {
  const $ = id => document.getElementById(id);
  const STATUSES = ['idea', 'drafted', 'ready', 'posted'];
  const STATUS_LABELS = { idea: '💭 idea', drafted: '✏️ drafted', ready: '✅ ready', posted: '📤 posted' };
  const TYPE_ICONS = { post: '▣ post', carousel: '⧉ carousel', reel: '▷ reel' };

  function init() {
    $('planGenerate').addEventListener('click', () => {
      const existing = BR.store.state.planner;
      const fresh = BR.content.weekPlan();
      BR.store.setPlanner([...fresh, ...existing.filter(i => i.status !== 'posted')].slice(0, 30));
      render();
      BR.ui.toast('📅 Your week is planned — open a studio and start with Monday');
    });
    $('planAdd').addEventListener('click', () => {
      const title = prompt('What do you want to post?');
      if (!title) return;
      const items = BR.store.state.planner;
      items.push({
        id: 'plan_' + Date.now(),
        day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        type: 'post', title, status: 'idea'
      });
      BR.store.setPlanner(items);
      render();
    });
    $('planClear').addEventListener('click', () => {
      if (!confirm('Clear the whole plan?')) return;
      BR.store.setPlanner([]);
      render();
    });
    render();
  }

  function render() {
    const list = $('planList');
    const items = BR.store.state.planner;
    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = '<div class="empty-note">No plan yet. Hit <b>⚡ Generate my week</b> and get 7 days of content ideas instantly.</div>';
      return;
    }
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'plan-item';
      el.innerHTML = `
        <span class="plan-date">${esc(item.day)}</span>
        <span class="plan-type">${TYPE_ICONS[item.type] || item.type}</span>
        <span class="plan-title">${esc(item.title)}</span>
        <button class="plan-status s-${item.status}">${STATUS_LABELS[item.status]}</button>
        <button class="plan-del" title="Remove">✕</button>`;
      el.querySelector('.plan-status').addEventListener('click', () => {
        item.status = STATUSES[(STATUSES.indexOf(item.status) + 1) % STATUSES.length];
        BR.store.setPlanner(items);
        render();
      });
      el.querySelector('.plan-del').addEventListener('click', () => {
        BR.store.setPlanner(items.filter(i => i.id !== item.id));
        render();
      });
      el.querySelector('.plan-title').addEventListener('dblclick', () => {
        const t = prompt('Edit item:', item.title);
        if (t) { item.title = t; BR.store.setPlanner(items); render(); }
      });
      list.appendChild(el);
    });
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  BR.planner = { init, render };
})();
