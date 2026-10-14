# Book Tracker

## About
A simple web application to manage a personal reading list.

## Features
- **Add Books**: Add books with required title and author inputs, validated before submission.
- **Track Reading Status**: Categorize books as *To read*, *Reading*, or *Finished*, with the ability to change each book's status directly from its card.
- **Dynamic Reading Statistics**: Automatically updates counts for *To read*, *Reading*, and *Finished* books as your collection changes.
- **Case-Insensitive Search**: Filter books in real time by title or author, ignoring uppercase and lowercase differences.
- **Newest Books First**: Display newly added books at the top of your reading list.
- **LocalStorage Persistence**: Save books and their statuses in browser `localStorage` using the key `book_tracker_data` so records persist across page refreshes.
- **Responsive User Interface**: Clean, accessible layout styled with a warm ivory and forest-green theme that works smoothly on mobile and desktop screens.

## Technologies Used
- HTML
- CSS
- JavaScript
- Browser `localStorage`

## How to Run Locally

### Option 1: Open Directly in a Browser
1. Navigate to the project directory in your file manager.
2. Double-click `index.html` (or right-click and select **Open with** your preferred browser).

### Option 2: Run with a Local Development Server
Using Python:
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

## Project Structure
```text
book-tracker/
├── index.html     # Semantic page structure, forms, search bar, and list containers
├── styles.css     # Design tokens, ivory/forest-green theme, and responsive styles
├── app.js         # Core application logic, event listeners, search filter, and localStorage sync
├── PROMPTS.md     # Log of development prompts, actual outcomes, and error resolutions
└── README.md      # Project overview and local execution guide
```
