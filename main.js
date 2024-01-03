// Selectors
const goalsEl = document.querySelector('#goals');
const form = document.querySelector('#new-goal-form');
const input = document.querySelector('#new-goal-input');

// Form submit handler  
form.addEventListener('submit', e => {
  e.preventDefault();

  const text = input.value;
  const dueDate = getDueDateInput();
  console.log('Submit clicked!');

  const goal = createGoal(text, dueDate);
  goalsEl.appendChild(goal);
  input.value = '';
});

// Create goal item
function createGoal(text, dueDate) {
  console.log('Creating new goal:', text, dueDate);

  // Create goal element
  const goal = document.createElement('div');
  goal.classList.add('goal');

  const textEl = document.createElement('p');
  textEl.classList.add('text');
  textEl.textContent = text;

  const dueDateEl = document.createElement('p');
  dueDateEl.classList.add('due-date');
  dueDateEl.textContent = dueDate ? 'Due Date: ' + formatDueDate(dueDate) : 'No Due Date';

  // Create complete button
  const completeButton = document.createElement('button');
  completeButton.classList.add('complete');
  completeButton.textContent = 'Complete';
  completeButton.addEventListener('click', () => {
    toggleCompleteGoal(goal);
  });

  goal.appendChild(textEl);
  goal.appendChild(dueDateEl);
  goal.appendChild(completeButton);

  // Create edit button
  const editButton = document.createElement('button');
  editButton.classList.add('edit');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    handleEditButtonClick(text, textEl, editButton, goal);
  });

  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    handleDeleteButtonClick(goal);
  });

  // Add buttons to the goal
  goal.appendChild(editButton);
  goal.appendChild(deleteButton);

  return goal;
}

// Function to handle edit button click
function handleEditButtonClick(text, textEl, editButton, goal) {
  // Replace the text content with an editable input field
  const editTextInput = document.createElement('input');
  editTextInput.value = text;
  textEl.textContent = ''; // Clear the existing text
  textEl.appendChild(editTextInput);

  // Focus on the input field
  editTextInput.focus();

  // Update goal when Enter key is pressed
  editTextInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      textEl.textContent = editTextInput.value;

      // Clean up: Remove the input field
      editButton.parentNode.removeChild(editTextInput);

      // Update box shadow to teal when editing is complete
      goal.style.boxShadow = 'none'; // Lightened teal box shadow
    }
  });
}

// Function to handle delete button click
function handleDeleteButtonClick(goal) {
  // Implement delete functionality here
  if (confirm('Are you sure you want to delete this goal?')) {
    goalsEl.removeChild(goal);
    updateGoals(); // To update sorting and other goal-related functionalities
  }
}

// Function to toggle goal completion
function toggleCompleteGoal(goal) {

    const isCompleted = goal.classList.contains('completed');
  
    goal.classList.toggle('completed', !isCompleted);
  
    if (isCompleted) {
      // Remove shadow if not completed
      goal.style.boxShadow = '0 4px 6px rgba(66, 153, 153, 0.463)'; 
    } else {
      // Add shadow when completed
      goal.style.boxShadow = '0 4px 6px hsl(169, 54%, 21%)';
    }
  
    updateGoals();
  
  }

// Get due date from input
function getDueDateInput() {
  const dueDateInput = document.querySelector('#due-date-input');
  return dueDateInput ? dueDateInput.value : null;
}

// Format due date
function formatDueDate(dueDate) {
  return dueDate ? new Date(dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC'
  }) : '';
}

// Get timestamp from date 
function getDueDateTimestamp(goal) {
  const dueDateText = goal.querySelector('.due-date').textContent;
  const datePortion = dueDateText.replace('Due Date: ', '');
  return new Date(datePortion).getTime();
}

// Mark past due goals
function markPastDueGoals() {
  const now = Date.now();
  document.querySelectorAll('.goal').forEach(goal => {
    const dueDate = getDueDateTimestamp(goal);
    if (dueDate < now) {
      goal.classList.add('past-due');
    }
  });
}

// Update goals
function updateGoals() {
  // Sort goals by date
  sortGoalsByDate();

  // Mark past due goals
  markPastDueGoals();
}

// Initialize Sortable for drag-and-drop functionality
const sortable = new Sortable(goalsEl, {
  animation: 150,
  handle: '.drag-handle', // Class for the handle to initiate dragging
  onStart: (evt) => {
    evt.from.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    evt.from.style.cursor = 'grabbing'; // Change cursor style
  },
  onEnd: (evt) => {
    evt.from.style.boxShadow = 'none';
    evt.from.style.cursor = 'grab';
    // Update order based on the new positions
    updateGoals();
  },
});

// Sort goals by date
function sortGoalsByDate() {
  const goals = Array.from(goalsEl.children);

  goals.sort((a, b) => {
    const aDueDate = getDueDateTimestamp(a);
    const bDueDate = getDueDateTimestamp(b);

    if (!aDueDate && !bDueDate) return 0;
    if (!aDueDate) return 1;
    if (!bDueDate) return -1;

    return aDueDate - bDueDate;
  });

  goals.forEach(goal => goalsEl.appendChild(goal));
}

// Initial call
updateGoals(); 