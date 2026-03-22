/// <reference types="cypress" />

// Reusable auth stub — sets localStorage so the app thinks user is logged in
const FREELANCER_USER = {
  token: 'fake-jwt-token',
  type: 'Bearer',
  userId: 1,
  fullName: 'John Doe',
  email: 'john@example.com',
  role: 'ROLE_FREELANCER',
};

const TASKS_STUB = {
  content: [
    {
      id: 1,
      title: 'Design homepage',
      description: 'Create wireframes',
      dueDate: '2026-04-01',
      status: 'A_FAIRE',
      projectId: 10,
      projectTitle: 'Website Revamp',
      userId: 1,
    },
    {
      id: 2,
      title: 'Write unit tests',
      description: '',
      dueDate: null,
      status: 'TERMINEE',
      projectId: 10,
      projectTitle: 'Website Revamp',
      userId: 1,
    },
  ],
  totalElements: 2,
  totalPages: 1,
  number: 0,
};

const PROJECTS_STUB = {
  content: [
    {
      id: 10,
      title: 'Website Revamp',
      description: '',
      budget: 5000,
      status: 'EN_COURS',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      createdAt: '2026-01-01',
      clientId: 5,
      clientName: 'Acme Corp',
      userId: 1,
      userFullName: 'John Doe',
    },
  ],
  totalElements: 1,
  totalPages: 1,
  number: 0,
};

function loginAsFreelancer() {
  cy.window().then((win) => {
    win.localStorage.setItem('token', FREELANCER_USER.token);
    win.localStorage.setItem('user', JSON.stringify(FREELANCER_USER));
  });
}

describe('Tasks Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    // Stub all API calls the tasks page needs
    cy.intercept('GET', '/api/tasks/user/*', TASKS_STUB).as('getTasks');
    cy.intercept('GET', '/api/projects/user/*', PROJECTS_STUB).as('getProjects');

    // Visit login first (so the app renders), then set storage, then navigate
    cy.visit('/login');
    loginAsFreelancer();
    cy.visit('/tasks');
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('shows the Tasks page heading', () => {
    cy.contains('h1', 'Tasks').should('be.visible');
  });

  it('renders To Do and Done columns', () => {
    cy.wait('@getTasks');
    cy.contains('To Do').should('be.visible');
    cy.contains('Done').should('be.visible');
  });

  it('displays tasks in the correct columns', () => {
    cy.wait('@getTasks');
    // "Design homepage" is A_FAIRE → To Do column
    cy.contains('Design homepage').should('be.visible');
    // "Write unit tests" is TERMINEE → Done column
    cy.contains('Write unit tests').should('be.visible');
  });

  it('shows task count badges correctly', () => {
    cy.wait('@getTasks');
    // There is 1 todo and 1 done task
    cy.contains('To Do').parent().contains('1').should('be.visible');
    cy.contains('Done').parent().contains('1').should('be.visible');
  });

  it('shows the project name on each task card', () => {
    cy.wait('@getTasks');
    cy.contains('Website Revamp').should('be.visible');
  });

  // ── Create Task ────────────────────────────────────────────────────────────

  it('opens the New Task modal when clicking New Task button', () => {
    cy.contains('button', 'New Task').click();
    cy.contains('New Task').should('be.visible'); // modal title
    cy.get('input[placeholder]').first().should('be.visible');
  });

  it('shows validation error when submitting empty task form', () => {
    cy.contains('button', 'New Task').click();
    cy.contains('button', 'Create Task').click();
    cy.contains('Title required').should('be.visible');
  });

  it('creates a new task and shows it in the To Do column', () => {
    const newTask = {
      id: 3,
      title: 'New cypress task',
      description: 'Created by Cypress',
      dueDate: null,
      status: 'A_FAIRE',
      projectId: 10,
      projectTitle: 'Website Revamp',
      userId: 1,
    };

    cy.intercept('POST', '/api/tasks', newTask).as('createTask');

    cy.contains('button', 'New Task').click();

    // Fill in title
    cy.get('input').filter('[placeholder*="title"], [placeholder*="Title"], [placeholder*="task"]').first().type('New cypress task');

    // Select project from dropdown
    cy.get('select').first().select('10');

    cy.contains('button', 'Create Task').click();
    cy.wait('@createTask');

    cy.contains('Task created').should('be.visible');
    cy.contains('New cypress task').should('be.visible');
  });

  // ── Mark Task Done ─────────────────────────────────────────────────────────

  it('marks a To Do task as done', () => {
    cy.wait('@getTasks');

    const updatedTask = { ...TASKS_STUB.content[0], status: 'TERMINEE' };
    cy.intercept('PATCH', '/api/tasks/1/done', updatedTask).as('markDone');

    // Click "Mark as done" button on the first task card
    cy.contains('Design homepage')
      .closest('[class*="rounded"]')
      .contains('Mark as done')
      .click();

    cy.wait('@markDone');
    cy.contains('Task completed!').should('be.visible');
  });

  // ── Delete Task ────────────────────────────────────────────────────────────

  it('deletes a task after confirmation', () => {
    cy.wait('@getTasks');

    cy.intercept('DELETE', '**/tasks/1', {}).as('deleteTask');

    // Card buttons: [0]=edit, [1]=delete, [2]=mark-as-done (A_FAIRE tasks have 3)
    // Use eq(1) for the delete icon. force:true bypasses opacity-0 hiding.
    cy.contains('Design homepage').closest('[class*="rounded"]').as('card');
    cy.get('@card').trigger('mouseover');
    cy.get('@card').find('button').eq(1).click({ force: true });

    // ConfirmModal renders a danger 'Delete' button
    cy.contains('button', 'Delete').click();
    cy.wait('@deleteTask');

    cy.contains('Task deleted').should('be.visible');
  });

  // ── Edit Task ──────────────────────────────────────────────────────────────

  it('opens the edit modal with pre-filled data', () => {
    cy.wait('@getTasks');

    // Break the chain to avoid DOM detachment after re-render
    cy.contains('Design homepage').closest('[class*="rounded"]').as('card');
    cy.get('@card').trigger('mouseover');
    cy.get('@card').find('button').first().click({ force: true });

    cy.contains('Edit Task').should('be.visible');
    cy.get('input').first().should('have.value', 'Design homepage');
  });

  // ── Auth guard ─────────────────────────────────────────────────────────────

  it('redirects unauthenticated users to /login', () => {
    cy.clearLocalStorage();
    cy.visit('/tasks');
    cy.url().should('include', '/login');
  });
});
