import onChange from 'on-change';

const renderTasks = (state, elements) => {
  const numberOfAllTasks = Object.keys(state.tasks).length;
  const allNav = document.getElementById('All');
  allNav.textContent = `All (${numberOfAllTasks})`;

  const numberOfCompleted = Object.keys(state.tasks.filter((task) => task.status === 'Completed')).length;
  const completedNav = document.getElementById('Completed');
  completedNav.textContent = `Completed (${numberOfCompleted})`;
  const activeNav = document.getElementById('Active');
  const numberOfActive = Object.keys(state.tasks.filter((task) => task.status === 'Active')).length;
  activeNav.textContent = `Active (${numberOfActive})`;

  const activeLink = document.querySelector('.active');
  if (activeLink.id !== state.selectedNavLink) {
    activeLink.classList.remove('active');
  }

  switch (state.selectedNavLink) {
    case 'All':
      allNav.classList.add('active');
      elements.tasks.replaceChildren([]);
      Object.entries(state.tasks).map(([id, task]) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        if (task.status === 'Completed') {
          li.classList.add('text-decoration-line-through');
        }
        li.textContent = task.text;
        li.setAttribute('id', task.id);
        elements.tasks.appendChild(li);
      });

      break;
    case 'Completed':

      completedNav.classList.add('active');
      elements.tasks.replaceChildren([]);
      Object.entries(state.tasks)
        .filter(([id, task]) => task.status === 'Completed')
        .map(([id, task]) => {
          const li = document.createElement('li');
          li.classList.add('list-group-item');
          li.classList.add('text-decoration-line-through');
          li.textContent = task.text;
          li.setAttribute('id', task.id);
          elements.tasks.appendChild(li);
        });
      break;
    case 'Active':

      activeNav.classList.add('active');
      elements.tasks.replaceChildren([]);
      Object.entries(state.tasks)
        .filter(([id, task]) => task.status === 'Active')
        .map(([id, task]) => {
          const li = document.createElement('li');
          li.classList.add('list-group-item');
          li.textContent = task.text;
          li.setAttribute('id', task.id);
          elements.tasks.appendChild(li);
        });
      break;
  }
};

const renderFeedback = (state, elements) => {
  if (state.valid) {
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    elements.feedback.textContent = 'Задача внесена в список';
  } else if (state.valid === false) {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = 'Длина текста должна составлять не менее 3 символов!';
  } else {
    elements.feedback.textContent = ' ';
  }
};

const initView = (state, elements) => onChange(state, (path, value) => {
  switch (path) {
    case 'selectedNavLink':
      renderTasks(state, elements);
      break;
    case 'selectedTaskId':
      renderTasks(state, elements);
      break;
    case 'newTaskText':
      if (state.valid !== false) {
        renderTasks(state, elements);
      }
      break;
    case 'tasks':
      renderTasks(state, elements);
      break;
    case 'valid':
      renderTasks(state, elements);
      renderFeedback(state, elements);
      break;
  }
});
export default initView;
