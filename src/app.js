import validate from './validator.js';
import initView from './view.js';

export default () => {
  const elements = {
    taskInput: document.querySelector('#task-input'),
    button: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    navigation: document.querySelectorAll('a.nav-link'),
    tasks: document.querySelector('ul[class="list-group"]'),
    clearBtn: document.querySelector('button[type="button"]'),
  };

  const state = {
    selectedNavLink: 'All',
    selectedTaskId: '',
    newTaskText: '',
    ids: [],
    tasks: [],
    valid: null,
  };

  const getRandomId = () => {
    const newId = Math.floor(Math.random() * 100) + 1;
    return state.ids.includes(newId) ? getRandomId() : newId;
  };

  const watchedState = initView(state, elements);

  document.addEventListener('DOMContentLoaded', () => {
    const loadedTasks = JSON.parse(localStorage.getItem('tasks'));
    watchedState.tasks = loadedTasks.length > 0 ? loadedTasks : [];
    watchedState.selectedNavLink = 'All';
    watchedState.ids = state.tasks.map((task) => task.id);
  });

  elements.button.addEventListener('click', (e) => {
    e.preventDefault();
    const newTaskText = elements.taskInput.value;
    const taskValid = validate(newTaskText);
    watchedState.valid = taskValid;
    if (taskValid) {
      const newTaskId = getRandomId();
      watchedState.selectedNavLink = 'All';
      watchedState.tasks = [...state.tasks, { id: newTaskId, text: newTaskText, status: 'Active' }];
      watchedState.ids = [...state.ids, newTaskId];
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    }
    elements.taskInput.value = '';
  });

  elements.navigation.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.selectedNavLink = e.target.id;
    });
  });

  elements.tasks.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.valid = null;
    const [currentTask] = state.tasks.filter((task) => task.id === Number(e.target.id));
    const remainedTasks = state.tasks.filter((task) => task.id !== Number(e.target.id));
    watchedState.currentTaskId = currentTask.id;
    const currentStatus = currentTask.status === 'Active' ? 'Completed' : 'Active';
    const numberId = Number(e.target.id);
    currentTask.status = currentStatus;
    watchedState.tasks = [...remainedTasks, currentTask];
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  });

  elements.clearBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();
  })
};
