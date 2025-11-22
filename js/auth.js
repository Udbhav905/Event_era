// Authentication Management
class Auth {
    constructor() {
        this.currentUser = storage.getCurrentUser();
        this.init();
    }

    init() {
        this.updateUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        
        document.getElementById('loginBtn').addEventListener('click', () => this.showAuthModal('login'));
        document.getElementById('registerBtn').addEventListener('click', () => this.showAuthModal('register'));
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

   
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });

        
        document.getElementById('authModal').addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                e.target.classList.add('hidden');
            }
        });
    }

    showAuthModal(activeTab = 'login') {
        const modal = document.getElementById('authModal');
        const authForms = document.getElementById('authForms');
        
        authForms.innerHTML = this.getAuthFormsHTML(activeTab);
        modal.classList.remove('hidden');

        
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchAuthTab(tabName);
            });
        });
    }

    getAuthFormsHTML(activeTab) {
        return `
            <div class="auth-tabs">
                <div class="auth-tab ${activeTab === 'login' ? 'active' : ''}" data-tab="login">Login</div>
                <div class="auth-tab ${activeTab === 'register' ? 'active' : ''}" data-tab="register">Register</div>
            </div>
            <div class="auth-content ${activeTab === 'login' ? 'active' : ''}" id="loginContent">
                <form id="loginForm" class="auth-form">
                    <h3>Welcome Back</h3>
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" id="loginEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Login</button>
                </form>
            </div>
            <div class="auth-content ${activeTab === 'register' ? 'active' : ''}" id="registerContent">
                <form id="registerForm" class="auth-form">
                    <h3>Create Account</h3>
                    <div class="form-group">
                        <label for="registerName">Full Name</label>
                        <input type="text" id="registerName" required>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">Email</label>
                        <input type="email" id="registerEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input type="password" id="registerPassword" required minlength="6">
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Register</button>
                </form>
            </div>
        `;
    }

    switchAuthTab(tabName) {
        document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.auth-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Content`).classList.add('active');
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = storage.findUserByEmail(email);
        
        if (user && user.password === password) {
            this.login(user);
            Utils.showNotification('Login successful!', 'success');
        } else {
            Utils.showNotification('Invalid email or password', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (storage.findUserByEmail(email)) {
            Utils.showNotification('Email already registered', 'error');
            return;
        }

        const user = { name, email, password };
        storage.addUser(user);
        this.login(user);
        Utils.showNotification('Registration successful!', 'success');
    }

    login(user) {
        this.currentUser = user;
        storage.setCurrentUser(user);
        this.updateUI();
        document.getElementById('authModal').classList.add('hidden');
    }

    logout() {
        this.currentUser = null;
        storage.setCurrentUser(null);
        this.updateUI();
        Utils.showNotification('Logged out successfully', 'info');
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            loginBtn.classList.add('hidden');
            registerBtn.classList.add('hidden');
            userMenu.classList.remove('hidden');
            userName.textContent = this.currentUser.name;
        } else {
            loginBtn.classList.remove('hidden');
            registerBtn.classList.remove('hidden');
            userMenu.classList.add('hidden');
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
    
}


const auth = new Auth();