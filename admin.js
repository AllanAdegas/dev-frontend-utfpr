// User management functions
const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

// DOM Elements
const userForm = document.getElementById('user-form');
const usersList = document.getElementById('users-list');
const modal = document.getElementById('modal');
const editForm = document.getElementById('edit-form');
const searchInput = document.getElementById('search-input');
const clearAllButton = document.getElementById('clear-all');

// Display users in the list
function displayUsers(users = getUsers()) {
    usersList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${user.name} &lt;${user.email}&gt;
            <button class="btn" data-email="${user.email}">...</button>
        `;
        usersList.appendChild(li);
    });
}

// Handle form submission
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }
    
    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: password
    };
    
    const users = getUsers();
    if (users.some(u => u.email === user.email)) {
        alert('Este e-mail já está cadastrado!');
        return;
    }
    
    users.push(user);
    saveUsers(users);
    displayUsers();
    userForm.reset();
});

// Handle user edit/delete
let currentUserEmail = null;

usersList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        currentUserEmail = e.target.dataset.email;
        const user = getUsers().find(u => u.email === currentUserEmail);
        
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-phone').value = user.phone;
        
        modal.showModal();
    }
});

// Handle edit form submission
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === currentUserEmail);
    
    users[userIndex] = {
        ...users[userIndex],
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value
    };
    
    saveUsers(users);
    displayUsers();
    modal.close();
});

// Handle user deletion
document.getElementById('delete-user').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        const users = getUsers().filter(u => u.email !== currentUserEmail);
        saveUsers(users);
        displayUsers();
        modal.close();
    }
});

// Handle modal close
document.getElementById('close-modal').addEventListener('click', () => {
    modal.close();
});

// Create a reusable search function
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const users = getUsers();
    
    if (searchTerm === '') {
        displayUsers(users); // Show all users when search is empty
    } else {
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm)
        );
        displayUsers(filteredUsers);
    }
}

// Update search handling to be dynamic
searchInput.addEventListener('input', performSearch);

// Add manual search button handler
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', performSearch);

// Handle clear all
clearAllButton.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja excluir todos os usuários?')) {
        localStorage.removeItem('users');
        displayUsers();
    }
});

// Initial display
displayUsers();
