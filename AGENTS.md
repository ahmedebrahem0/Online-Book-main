# AGENTS.md - Online Book Store

## Project Overview

**Fully static frontend project** using HTML, CSS, JavaScript, Bootstrap, and jQuery. No backend or server required.

## Running the Project

**Requirements:** None - just open `index.html` in a browser

**Local Development:**
```bash
# Open directly in browser or use a simple HTTP server
python -m http.server 8000
# or
npx serve .
```

**Testing:** Manual browser testing only

## File Structure

```
├── index.html              # Main page (public)
├── login.html              # User login
├── Signup.html             # User registration
├── login_admin.html        # Admin login
├── home.html               # Admin dashboard
├── form.html               # Order/contact form
├── invoice.html            # Order confirmation
├── logout.html             # Logout handler
├── add_*.html              # Add book forms (science, physics, history, sports)
├── update_*.html           # Update book forms
├── data/
│   └── data.json           # Book data, users, orders (localStorage backup)
├── Js/
│   ├── main.js             # Original animations
│   └── static-main.js      # Data management & auth logic
├── css/                    # Stylesheets
├── imgs/                   # Images
└── sql/                    # Original SQL schema (for reference)
```

## Code Style

### HTML
- Semantic HTML5 structure
- Bootstrap for layout and components
- Links use `.html` extension

### JavaScript (static-main.js)

**Pattern:**
```javascript
const App = {
    data: null,
    
    async init() {
        await this.loadData();
    },
    
    async loadData() {
        // Load from localStorage or fetch JSON
    },
    
    saveData() {
        localStorage.setItem('bookStoreData', JSON.stringify(this.data));
    }
};
```

### Data Management
- Data stored in `data/data.json` and `localStorage`
- All CRUD operations handled by `App` object
- Authentication uses `sessionStorage`

### Authentication
- **Users:** `App.signup()`, `App.login()` - stored in localStorage
- **Admins:** `App.loginAdmin()` - stored in sessionStorage
- **Logout:** Clears sessionStorage, redirects to index

### CRUD Operations
```javascript
App.getBooks('science_book')      // Get all books
App.addBook('science_book', {image, price})  // Add book
App.updateBook('science_book', id, {image, price})  // Update
App.deleteBook('science_book', id)  // Delete
```

### Forms
- Use `event.preventDefault()` to stop submission
- Validate with HTML5 attributes (`required`, `type`)
- Show success/error messages dynamically

## Security Notes

- Data is client-side only (no real security)
- For production, implement proper backend authentication
- Do not store sensitive data in localStorage

## Book Categories

Tables: `science_book`, `physics_book`, `history_book`, `sports_book`

## Test Credentials

**Users:**
- aya@1 / 321
- ahmed@2 / 951
- rahma@3 / 753
- manar@4 / 369
- mustafa@5 / 741

**Admin:**
- admin@one / 123
- admin@two / 456
