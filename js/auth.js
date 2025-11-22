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

        // Setup form event listeners
        this.setupAuthFormListeners();
        
        // Setup tab event listeners
        this.setupTabListeners();
    }

    getAuthFormsHTML(activeTab) {
        return `
            <div class="auth-modal-content">
                
                <div class="auth-tabs">
                    <button class="auth-tab ${activeTab === 'login' ? 'active' : ''}" data-tab="login">Login</button>
                    <button class="auth-tab ${activeTab === 'register' ? 'active' : ''}" data-tab="register">Register</button>
                </div>
                
                <div class="auth-forms-container">
                    <div class="auth-form-container ${activeTab === 'login' ? 'active' : ''}" id="loginFormContainer">
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
                    
                    <div class="auth-form-container ${activeTab === 'register' ? 'active' : ''}" id="registerFormContainer">
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
                </div>
            </div>
        `;
    }

    setupAuthFormListeners() {
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
    }

    setupTabListeners() {
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchAuthTab(tabName);
            });
        });
    }

    switchAuthTab(tabName) {
        // Update tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update form containers
        document.querySelectorAll('.auth-form-container').forEach(container => {
            container.classList.toggle('active', container.id === `${tabName}FormContainer`);
        });
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

// Demo modal close events
document.addEventListener('click', (e) => {
    const demoModal = document.getElementById('demoModal');
    if (demoModal && !demoModal.classList.contains('hidden')) {
        if (e.target.classList.contains('close') || e.target.id === 'demoModal') {
            demoModal.classList.add('hidden');
        }
    }
});

const auth = new Auth();