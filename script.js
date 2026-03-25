// Form switching
function switchForm(type) {
    document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(type + 'Form').classList.add('active');
    event.target.classList.add('active');
    document.querySelector('.form-box').scrollIntoView({ behavior: 'smooth' });
}

// Login form
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginError = document.createElement('div');
    loginError.id = 'loginError';
    loginError.style.cssText = 'color: #ff4444; font-size: 14px; margin-top: 10px; text-align: center;';
    const submitBtn = document.querySelector('#loginForm .submit-btn');
    const existingError = document.getElementById('loginError');
    if (existingError) existingError.remove();
    
    if (!email || !password) {
        submitBtn.parentNode.appendChild(loginError);
        loginError.textContent = 'Preencha todos os campos.';
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('userSession', JSON.stringify({ name: user.name, email: user.email, loggedIn: true }));
        window.location.href = 'dashboard.html';
    } else {
        const foundUser = users.find(u => u.email === email);
        submitBtn.parentNode.appendChild(loginError);
        loginError.textContent = foundUser ? 'Senha incorreta.' : 'Email não cadastrado.';
    }
});

// Register form
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = '';
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        errorMsg.textContent = 'As senhas não coincidem.';
        return;
    }
    
    if (name && email && password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            errorMsg.textContent = 'Já existe uma conta com este email.';
            return;
        }
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert(`Conta criada, ${name}! Faça login.`);
        switchForm('login');
    } else {
        errorMsg.textContent = 'Preencha todos os campos.';
    }
});

// Auto redirect if logged in
window.addEventListener('load', function() {
    if (localStorage.getItem('userSession')) {
        window.location.href = 'dashboard.html';
    }
});

// Input focus
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() { this.parentNode.style.transform = 'scale(1.02)'; });
    input.addEventListener('blur', function() { this.parentNode.style.transform = 'scale(1)'; });
});

// Forgot password - Fancy modal
document.getElementById('forgotPassword').addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    if (!email) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;';
        modal.innerHTML = `
            <div style="position:relative;background:#1a1a1a;border:2px solid #ff6b6b;border-radius:20px;padding:40px;max-width:400px;text-align:center;">

                <h3 style="color:#ff6b6b;margin-bottom:20px;">⚠️ Campo Email Vazio</h3>
                <p style="color:#f0f0f0;">Digite o email que usou para criar a conta primeiro.</p>
                <div style="height:30px;"></div>
                
                <button onclick="closeModal(this.parentElement.parentElement); event.stopPropagation(); event.preventDefault();" 
                        style="position:absolute;top:15px;right:15px;width:30px;height:30px;border-radius:50%;background:#ff6b6b;color:#fff;border:none;font-size:18px;font-weight:bold;cursor:pointer;transition:transform 0.2s;box-shadow:0 2px 10px rgba(255,107,107,0.4);">×</button>
            </div>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', function(ev) { if (ev.target === modal) modal.remove(); });
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    if (user) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;';
        modal.innerHTML = `
            <div style="position:relative;background:linear-gradient(135deg,#1a1a1a,#000);border:2px solid #D4AF37;border-radius:20px;padding:40px;max-width:400px;text-align:center;box-shadow:0 20px 40px rgba(212,175,55,0.3);">
                <h3 style="color:#F2D492;margin-bottom:20px;font-size:24px;">📧 Email Enviado com Sucesso!</h3>
                <p style="color:#f0f0f0;line-height:1.5;margin-bottom:30px;">Link de recuperação enviado para <strong style="color:#D4AF37;">${email}</strong><br><small>Verifique inbox e spam.</small></p>
                
                <button onclick="closeModal(this.parentElement.parentElement); event.stopPropagation(); event.preventDefault();" 
                        style="position:absolute;top:15px;right:15px;width:30px;height:30px;border-radius:50%;background:linear-gradient(45deg,#D4AF37,#F2D492);color:#000;border:none;font-size:18px;font-weight:bold;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 2px 10px rgba(212,175,55,0.4);">×</button>
            </div>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', function(ev) { if (ev.target === modal) modal.remove(); });
    } else {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;';
        modal.innerHTML = `
            <div style="position:relative;background:#1a1a1a;border:2px solid #ff6b6b;border-radius:20px;padding:40px;max-width:400px;text-align:center;">

                <h3 style="color:#ff6b6b;margin-bottom:20px;">❌ Email Não Encontrado</h3>
                <p style="color:#f0f0f0;">${email} não está cadastrado.<br>Faça registro primeiro.</p>
                
                <button onclick="closeModal(this.parentElement.parentElement); event.stopPropagation(); event.preventDefault();" 
                        style="position:absolute;top:15px;right:15px;width:30px;height:30px;border-radius:50%;background:#ff6b6b;color:#fff;border:none;font-size:18px;font-weight:bold;cursor:pointer;transition:transform 0.2s;box-shadow:0 2px 10px rgba(255,107,107,0.4);">×</button>
            </div>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', function(ev) { if (ev.target === modal) modal.remove(); });
    }
});

// Close modal function - robust fix for forgot password modals
function closeModal(modal) {
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
}

// Smooth animations
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

