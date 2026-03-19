const App = {
    data: null,

    init() {
        this.loadData();
        this.setupNavigation();
        this.initPageSpecific();
    },

    loadData() {
        const stored = localStorage.getItem('bookStoreData');
        if (stored) {
            try {
                this.data = JSON.parse(stored);
            } catch (e) {
                this.data = this.getDefaultData();
            }
        } else {
            this.data = this.getDefaultData();
            this.saveData();
        }
    },

    getDefaultData() {
        return {
            science_book: [
                {"id": 1, "image": "./imgs/book(2).png", "price": 99},
                {"id": 2, "image": "./imgs/book(5).png", "price": 95},
                {"id": 3, "image": "./imgs/book(1).png", "price": 150}
            ],
            physics_book: [
                {"id": 1, "image": "./imgs/book(7).png", "price": 100},
                {"id": 2, "image": "./imgs/book(4).png", "price": 99},
                {"id": 3, "image": "./imgs/book(3).png", "price": 99}
            ],
            history_book: [
                {"id": 1, "image": "./imgs/book(9).png", "price": 99},
                {"id": 2, "image": "./imgs/book(8).png", "price": 99},
                {"id": 3, "image": "./imgs/book(10).png", "price": 200}
            ],
            sports_book: [
                {"id": 1, "image": "./imgs/book(11).png", "price": 99},
                {"id": 2, "image": "./imgs/book(12).png", "price": 99},
                {"id": 3, "image": "./imgs/book(13).png", "price": 100}
            ],
            users: [
                {"id": 1, "name": "Aya Yousry", "email": "aya@1", "password": "321", "phone": "79511"},
                {"id": 2, "name": "Ahmed Ebrahem", "email": "ahmed@2", "password": "951", "phone": "79956"},
                {"id": 3, "name": "Rahma Ahmed", "email": "rahma@3", "password": "753", "phone": "15826"},
                {"id": 4, "name": "Manar Wageh", "email": "manar@4", "password": "369", "phone": "12012"},
                {"id": 5, "name": "Mustafa Ahmed", "email": "mustafa@5", "password": "741", "phone": "123456"}
            ],
            admins: [
                {"id": 1, "email": "admin@one", "password": "123"},
                {"id": 2, "email": "admin@two", "password": "456"}
            ],
            orders: [],
            nextId: {
                science_book: 4,
                physics_book: 4,
                history_book: 4,
                sports_book: 4
            }
        };
    },

    saveData() {
        localStorage.setItem('bookStoreData', JSON.stringify(this.data));
    },

    getBooks(table) {
        return this.data ? (this.data[table] || []) : [];
    },

    getBookById(table, id) {
        return this.data[table].find(b => b.id === parseInt(id));
    },

    addBook(table, book) {
        const id = this.data.nextId[table] || Date.now();
        this.data[table].push({ id, ...book });
        this.data.nextId[table] = id + 1;
        this.saveData();
        return id;
    },

    updateBook(table, id, book) {
        const index = this.data[table].findIndex(b => b.id === parseInt(id));
        if (index !== -1) {
            this.data[table][index] = { ...this.data[table][index], ...book };
            this.saveData();
            return true;
        }
        return false;
    },

    deleteBook(table, id) {
        this.data[table] = this.data[table].filter(b => b.id !== parseInt(id));
        this.saveData();
    },

    signup(name, email, password, phone) {
        if (this.data.users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }
        const id = this.data.users.length + 1;
        this.data.users.push({ id, name, email, password, phone });
        this.saveData();
        return { success: true, message: 'Registration successful!' };
    },

    login(email, password) {
        const user = this.data.users.find(u => u.email === email && u.password === password);
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid email or password' };
    },

    loginAdmin(email, password) {
        const admin = this.data.admins.find(a => a.email === email && a.password === password);
        if (admin) {
            sessionStorage.setItem('admin', JSON.stringify(admin));
            return { success: true, admin };
        }
        return { success: false, message: 'Invalid admin credentials' };
    },

    logout() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('admin');
    },

    getCurrentUser() {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getCurrentAdmin() {
        const admin = sessionStorage.getItem('admin');
        return admin ? JSON.parse(admin) : null;
    },

    isLoggedIn() {
        return !!sessionStorage.getItem('user') || !!sessionStorage.getItem('admin');
    },

    isAdmin() {
        return !!sessionStorage.getItem('admin');
    },

    submitOrder(name, phone, book_name, quantity) {
        const order = { id: Date.now(), name, phone, book_name, quantity, date: new Date().toISOString() };
        this.data.orders.push(order);
        this.saveData();
        sessionStorage.setItem('lastOrder', JSON.stringify(order));
        return order;
    },

    getLastOrder() {
        const order = sessionStorage.getItem('lastOrder');
        return order ? JSON.parse(order) : null;
    },

    setupNavigation() {
        const user = this.getCurrentUser();
        const userLinks = document.getElementById('userLinks');
        if (userLinks) {
            userLinks.style.display = user ? 'block' : 'none';
        }
    },

    initPageSpecific() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';

        if (page === 'home.html') this.initAdminDashboard();
        else if (page.startsWith('add_')) this.initAddPage();
        else if (page.startsWith('update_')) this.initUpdatePage();
    },

    initAdminDashboard() {
        const admin = this.getCurrentAdmin();
        if (!admin) {
            window.location.href = 'login_admin.html';
            return;
        }
        const categories = ['science_book', 'physics_book', 'history_book', 'sports_book'];
        
        categories.forEach(cat => {
            const tableId = `${cat}_table`;
            const table = document.getElementById(tableId);
            const addLink = document.getElementById(`${cat}_add_link`);
            if (addLink) addLink.href = `add_${cat.replace('_book', '')}.html`;
            
            if (table) {
                const books = this.getBooks(cat);
                const tbody = table.querySelector('tbody');
                tbody.innerHTML = '';
                books.forEach(book => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${book.id}</td>
                        <td><img src="${book.image}" style="width:50px;height:50px;object-fit:cover;"></td>
                        <td>$${book.price}</td>
                        <td><a class="btn btn-success" href="update_${cat.replace('_book', '')}.html?book_id=${book.id}">Update</a></td>
                        <td><a class="btn btn-danger" href="#" onclick="App.confirmDelete('${cat}', ${book.id}); return false;">Delete</a></td>
                    `;
                    tbody.appendChild(row);
                });
            }
        });
    },

    confirmDelete(table, id) {
        if (confirm('Are you sure you want to delete this book?')) {
            this.deleteBook(table, id);
            window.location.reload();
        }
    },

    initAddPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        const match = page.match(/add_(.+)\.html/);
        if (!match) return;
        const category = match[1] + '_book';
        
        const form = document.getElementById('addForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const image = document.getElementById('image').value;
                const price = document.getElementById('price').value;
                
                if (!image || !price) {
                    alert('Please fill all fields');
                    return;
                }
                
                this.addBook(category, { image, price: parseInt(price) });
                alert('Book added successfully!');
                window.location.href = 'home.html';
            });
        }
    },

    initUpdatePage() {
        const params = new URLSearchParams(window.location.search);
        const bookId = params.get('book_id');
        if (!bookId) return;
        
        const path = window.location.pathname;
        const page = path.split('/').pop();
        const match = page.match(/update_(.+)\.html/);
        if (!match) return;
        const category = match[1] + '_book';
        
        const book = this.getBookById(category, bookId);
        if (!book) {
            alert('Book not found');
            window.location.href = 'home.html';
            return;
        }
        
        document.getElementById('image').value = book.image;
        document.getElementById('price').value = book.price;
        
        const form = document.getElementById('updateForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const image = document.getElementById('image').value;
                const price = document.getElementById('price').value;
                
                this.updateBook(category, bookId, { image, price: parseInt(price) });
                alert('Book updated successfully!');
                window.location.href = 'home.html';
            });
        }
    },

    renderBooksTable(category, tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const books = this.getBooks(category);
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.id}</td>
                <td><img src="${book.image}" style="width:50px;height:50px;object-fit:cover;"></td>
                <td>$${book.price}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="App.editBook('${category}', ${book.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="App.deleteBook('${category}', ${book.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
};

$(document).ready(function () {
    $("#loading").fadeOut(3500);
    let y = $('#about').offset().top;
    $(window).scroll(function () {
        let x = $(window).scrollTop();
        if (x > y - 500) {
            $('#main-nav').css('cssText', 'background-image: linear-gradient(rgba(var(--bd-violet-rgb), 1), rgba(var(--bd-violet-rgb), 0.95)); !important');
            $("#btnUp").fadeIn(500);
        } else {
            $('#main-nav').css('cssText', 'background-color: transparent !important')
            $("#btnUp").fadeOut(500);
        }
    });
});

$("#btnUp").on("click", function () {
    $(window).scrollTop(0);
});

var Books = (function () {
    var $books = $('#bk-list > li > div.bk-book'),
        booksCount = $books.length;
    function init() {
        $books.each(function () {
            var $book = $(this),
                $other = $books.not($book),
                $parent = $book.parent(),
                $page = $book.children('div.bk-page'),
                $bookview = $parent.find('button.bk-bookview'),
                $content = $page.children('div.bk-content'),
                current = 0;

            $parent.find('button.bk-bookback').on('click', function () {
                $bookview.removeClass('bk-active');
                if ($book.data('flip')) {
                    $book.data({ opened: false, flip: false }).removeClass('bk-viewback').addClass('bk-bookdefault');
                } else {
                    $book.data({ opened: false, flip: true }).removeClass('bk-viewinside bk-bookdefault').addClass('bk-viewback');
                }
            });

            $bookview.on('click', function () {
                var $this = $(this);
                $other.data('opened', false).removeClass('bk-viewinside').parent().css('z-index', 0).find('button.bk-bookview').removeClass('bk-active');
                if (!$other.hasClass('bk-viewback')) {
                    $other.addClass('bk-bookdefault');
                }
                if ($book.data('opened')) {
                    $this.removeClass('bk-active');
                    $book.data({ opened: false, flip: false }).removeClass('bk-viewinside').addClass('bk-bookdefault');
                } else {
                    $this.addClass('bk-active');
                    $book.data({ opened: true, flip: false }).removeClass('bk-viewback bk-bookdefault').addClass('bk-viewinside');
                    $parent.css('z-index', booksCount);
                    current = 0;
                    $content.removeClass('bk-content-current').eq(current).addClass('bk-content-current');
                }
            });

            if ($content.length > 1) {
                var $navPrev = $('<span class="bk-page-prev">&lt;</span>'),
                    $navNext = $('<span class="bk-page-next">&gt;</span>');
                $page.append($('<nav></nav>').append($navPrev, $navNext));
                $navPrev.on('click', function () {
                    if (current > 0) {
                        --current;
                        $content.removeClass('bk-content-current').eq(current).addClass('bk-content-current');
                    }
                    return false;
                });
                $navNext.on('click', function () {
                    if (current < $content.length - 1) {
                        ++current;
                        $content.removeClass('bk-content-current').eq(current).addClass('bk-content-current');
                    }
                    return false;
                });
            }
        });
    }
    return { init: init };
})();

$(function () {
    Books.init();
});

$(function () {
    function randomNum(m, n) {
        m = parseInt(m);
        n = parseInt(n);
        return Math.floor(Math.random() * (n - m + 1)) + m;
    }
    var clap = $('.clap');
    var confetti = $('.confetti-effect');
    clap.on('click', function () {
        confetti.css('transform', 'rotate(' + randomNum(0, 180) + 'deg)')
        confetti.children('.confetti-wrap').stop().addClass('expand');
        setTimeout(function () {
            confetti.children('.confetti-wrap').removeClass('expand');
        }, 700)
    });
});
