// ===== STATE =====
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';
let currentSort = 'date';
let editingId = null;

// ===== DOM REFS =====
const form        = document.getElementById('todo-form');
const taskInput   = document.getElementById('task-input');
const prioritySel = document.getElementById('priority');
const dueDateInp  = document.getElementById('due-date');
const taskList    = document.getElementById('task-list');
const taskCount   = document.getElementById('task-count');
const clearDone   = document.getElementById('clear-done');
const searchInput = document.getElementById('search-input');
const sortSel     = document.getElementById('sort-by');
const progressBar = document.getElementById('progress-bar');
const progressPct = document.getElementById('progress-pct');
const emptyState  = document.getElementById('empty-state');

// ===== HELPERS =====
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ===== RENDER =====
function render() {
  const query = searchInput ? searchInput.value.toLowerCase() : '';

  // Filter
  let visible = tasks.filter(t => {
    if (currentFilter === 'active' && t.done) return false;
    if (currentFilter === 'done'   && !t.done) return false;
    if (query && !t.text.toLowerCase().includes(query)) return false;
    return true;
  });

  // Sort
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  if (currentSort === 'priority') {
    visible.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (currentSort === 'date') {
    visible.sort((a, b) => {
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return new Date(a.due) - new Date(b.due);
    });
  } else {
    // Default: newest first
    visible.sort((a, b) => b.createdAt - a.createdAt);
  }

  taskList.innerHTML = '';

  visible.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' completed' : '');
    li.dataset.id = task.id;
    li.dataset.priority = task.priority;

    const overdue = isOverdue(task.due) && !task.done;
    const dateLabel = task.due
      ? `<span class="due-date ${overdue ? 'overdue' : ''}">${overdue ? '⚠ ' : ''}${formatDate(task.due)}</span>`
      : '';

    if (editingId === task.id) {
      // Inline edit mode
      li.innerHTML = `
        <input type="checkbox" class="task-check" id="chk-${task.id}" ${task.done ? 'checked' : ''}>
        <input type="text" class="task-edit-input" value="${escapeHtml(task.text)}" id="edit-${task.id}" autofocus>
        <div class="task-actions">
          <button class="save-btn" data-id="${task.id}" aria-label="Save task">✓</button>
          <button class="delete-btn" data-id="${task.id}" aria-label="Delete task">🗑</button>
        </div>
      `;
    } else {
      li.innerHTML = `
        <input type="checkbox" class="task-check" id="chk-${task.id}" ${task.done ? 'checked' : ''}>
        <label for="chk-${task.id}" class="task-text">${escapeHtml(task.text)}</label>
        <span class="priority-badge ${task.priority}">${capitalize(task.priority)}</span>
        ${dateLabel}
        <div class="task-actions">
          <button class="edit-btn" data-id="${task.id}" aria-label="Edit task">✏️</button>
          <button class="delete-btn" data-id="${task.id}" aria-label="Delete task">🗑</button>
        </div>
      `;
    }

    taskList.appendChild(li);

    // Focus edit input
    if (editingId === task.id) {
      const inp = document.getElementById('edit-' + task.id);
      if (inp) { inp.focus(); inp.select(); }
    }
  });

  // Empty state
  if (emptyState) {
    emptyState.classList.toggle('show', visible.length === 0);
  }

  updateStats();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===== STATS =====
function updateStats() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  const left  = total - done;

  if (taskCount) {
    taskCount.textContent = left === 0 && total > 0
      ? 'All done! 🎉'
      : `${left} task${left !== 1 ? 's' : ''} left`;
  }

  if (progressBar) {
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    progressBar.value = pct;
    if (progressPct) progressPct.textContent = `${done}/${total} done`;
  }
}

// ===== ADD TASK =====
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id:        genId(),
    text,
    priority:  prioritySel.value,
    due:       dueDateInp.value || null,
    done:      false,
    createdAt: Date.now()
  });

  saveTasks();
  render();

  // Reset form
  taskInput.value   = '';
  dueDateInp.value  = '';
  prioritySel.value = 'medium';
  taskInput.focus();
});

// ===== LIST EVENTS (delegation) =====
taskList.addEventListener('change', e => {
  if (e.target.classList.contains('task-check')) {
    const id = e.target.closest('.task-item').dataset.id;
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.done = e.target.checked;
      saveTasks();
      render();
    }
  }
});

taskList.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;

  // Delete
  if (btn.classList.contains('delete-btn')) {
    tasks = tasks.filter(t => t.id !== id);
    if (editingId === id) editingId = null;
    saveTasks();
    render();
    return;
  }

  // Edit — enter edit mode
  if (btn.classList.contains('edit-btn')) {
    editingId = id;
    render();
    return;
  }

  // Save inline edit
  if (btn.classList.contains('save-btn')) {
    const inp = document.getElementById('edit-' + id);
    if (inp) {
      const newText = inp.value.trim();
      if (newText) {
        const task = tasks.find(t => t.id === id);
        if (task) task.text = newText;
      }
    }
    editingId = null;
    saveTasks();
    render();
  }
});

// Save on Enter in edit input
taskList.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('task-edit-input')) {
    const id = e.target.id.replace('edit-', '');
    const newText = e.target.value.trim();
    if (newText) {
      const task = tasks.find(t => t.id === id);
      if (task) task.text = newText;
    }
    editingId = null;
    saveTasks();
    render();
  }
  if (e.key === 'Escape' && e.target.classList.contains('task-edit-input')) {
    editingId = null;
    render();
  }
});

// ===== FILTER BUTTONS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

// ===== SORT =====
if (sortSel) {
  sortSel.addEventListener('change', () => {
    currentSort = sortSel.value;
    render();
  });
}

// ===== SEARCH =====
if (searchInput) {
  searchInput.addEventListener('input', render);
}

// ===== CLEAR COMPLETED =====
if (clearDone) {
  clearDone.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.done);
    saveTasks();
    render();
  });
}

// ===== INIT =====
render();