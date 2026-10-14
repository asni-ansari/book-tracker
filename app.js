// ==========================================
// 1. DOM Elements
// ==========================================
const bookForm = document.getElementById('book-form');
const titleInput = document.getElementById('book-title');
const authorInput = document.getElementById('book-author');
const statusSelect = document.getElementById('book-status');

const titleError = document.getElementById('title-error');
const authorError = document.getElementById('author-error');

const bookList = document.getElementById('book-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const noResultsState = document.getElementById('no-results-state');

const countToRead = document.getElementById('count-to-read');
const countReading = document.getElementById('count-reading');
const countFinished = document.getElementById('count-finished');

// ==========================================
// 2. LocalStorage & State Management
// ==========================================
const STORAGE_KEY = 'book_tracker_data';

// Helper to load books safely from localStorage
function loadBooks() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error('Failed to load books from localStorage:', error);
    return [];
  }
}

// Helper to save books to localStorage
function saveBooks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    console.error('Failed to save books to localStorage:', error);
  }
}

// Holds all books (loaded from localStorage, ordered newest first)
const books = loadBooks();

// ==========================================
// 3. Dynamic Statistics Calculation
// ==========================================
function updateStats() {
  let toRead = 0;
  let reading = 0;
  let finished = 0;

  books.forEach((book) => {
    if (book.status === 'To read') {
      toRead++;
    } else if (book.status === 'Reading') {
      reading++;
    } else if (book.status === 'Finished') {
      finished++;
    }
  });

  if (countToRead) countToRead.textContent = toRead;
  if (countReading) countReading.textContent = reading;
  if (countFinished) countFinished.textContent = finished;
}

// ==========================================
// 4. Input Listeners
// ==========================================
// Clear validation error when user types
titleInput.addEventListener('input', () => {
  if (titleInput.value.trim() !== '') {
    titleError.textContent = '';
    titleInput.classList.remove('input-error');
  }
});

authorInput.addEventListener('input', () => {
  if (authorInput.value.trim() !== '') {
    authorError.textContent = '';
    authorInput.classList.remove('input-error');
  }
});

// Real-time search: filters books immediately on typing
searchInput.addEventListener('input', () => {
  renderBooks();
});

// ==========================================
// 5. Form Submission Handler (Add Book)
// ==========================================
bookForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const status = statusSelect.value;

  let isValid = true;

  // Validate Title
  if (title === '') {
    titleError.textContent = 'Please enter a title';
    titleInput.classList.add('input-error');
    isValid = false;
  } else {
    titleError.textContent = '';
    titleInput.classList.remove('input-error');
  }

  // Validate Author
  if (author === '') {
    authorError.textContent = 'Please enter an author';
    authorInput.classList.add('input-error');
    isValid = false;
  } else {
    authorError.textContent = '';
    authorInput.classList.remove('input-error');
  }

  // Stop if invalid
  if (!isValid) {
    return;
  }

  // Create new book object
  const newBook = {
    id: Date.now(),
    title: title,
    author: author,
    status: status,
    createdAt: Date.now()
  };

  // Prepend to array so newest is at the top
  books.unshift(newBook);

  // Save to localStorage
  saveBooks();

  // Reset form and focus title field
  bookForm.reset();
  titleInput.focus();

  // Re-render UI and updated stats
  renderBooks();
});

// ==========================================
// 6. Update Book Status Function
// ==========================================
function updateBookStatus(bookId, newStatus) {
  const targetBook = books.find((b) => b.id === bookId);
  if (targetBook) {
    targetBook.status = newStatus;
    // Save updated array to localStorage
    saveBooks();
    // Re-render book list and statistics cards
    renderBooks();
  }
}

// ==========================================
// 7. Render Books Function
// ==========================================
function renderBooks() {
  // Always update statistics based on current master books list
  updateStats();

  // Clear current list elements
  bookList.innerHTML = '';

  // Show empty state if there are no books in the library
  if (books.length === 0) {
    emptyState.style.display = 'block';
    noResultsState.style.display = 'none';
    return;
  }

  // Hide the general empty state
  emptyState.style.display = 'none';

  // Get search term (case-insensitive)
  const query = searchInput.value.trim().toLowerCase();

  // Filter books matching title or author
  const filteredBooks = books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(query);
    const authorMatch = book.author.toLowerCase().includes(query);
    return titleMatch || authorMatch;
  });

  // If search returned zero results
  if (filteredBooks.length === 0) {
    noResultsState.style.display = 'block';
    return;
  }

  // Hide no-results message when matches exist
  noResultsState.style.display = 'none';

  // Render each filtered book item
  filteredBooks.forEach((book) => {
    const li = document.createElement('li');
    li.className = 'book-item';

    // Book Info (Title and Author)
    const infoDiv = document.createElement('div');
    infoDiv.className = 'book-info';

    const titleEl = document.createElement('h3');
    titleEl.className = 'book-title';
    titleEl.textContent = book.title;

    const authorEl = document.createElement('p');
    authorEl.className = 'book-author';
    authorEl.textContent = `by ${book.author}`;

    infoDiv.appendChild(titleEl);
    infoDiv.appendChild(authorEl);

    // Interactive Status Dropdown
    const statusSelectEl = document.createElement('select');
    statusSelectEl.className = 'status-select';
    statusSelectEl.dataset.status = book.status;
    statusSelectEl.setAttribute('aria-label', `Change status for ${book.title}`);

    const statuses = ['To read', 'Reading', 'Finished'];
    statuses.forEach((statusOption) => {
      const option = document.createElement('option');
      option.value = statusOption;
      option.textContent = statusOption;
      if (statusOption === book.status) {
        option.selected = true;
      }
      statusSelectEl.appendChild(option);
    });

    // Handle status change
    statusSelectEl.addEventListener('change', (e) => {
      updateBookStatus(book.id, e.target.value);
    });

    // Assemble book item
    li.appendChild(infoDiv);
    li.appendChild(statusSelectEl);

    // Append to list
    bookList.appendChild(li);
  });
}

// Initial render to load saved books and display stats
renderBooks();
