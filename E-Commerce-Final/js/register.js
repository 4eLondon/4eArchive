document.getElementById('register-form').reset();

// -------------------- username validation --------------------
document.getElementById('username').addEventListener('input', async function() {
    const status = document.getElementById('username-status');
    const username = this.value.trim();

    if (username === '') {
        status.textContent = '';
        return;
    }

    const formData = new FormData();
    formData.append('username', username);

    const response = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/check-username.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (result.taken) {
        status.style.color = 'red';
        status.textContent = 'Username is already taken.';
    } else {
        status.style.color = 'green';
        status.textContent = 'Username is available!';
    }
});

// -------------------- email validation --------------------
document.getElementById('email-address').addEventListener('input', async function() {
    const status = document.getElementById('email-status');
    const email = this.value.trim();

    if (email === '') {
        status.textContent = '';
        return;
    }

    const formData = new FormData();
    formData.append('email', email);

    const response = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/check-email.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (result.taken) {
        status.style.color = 'red';
        status.textContent = 'Email is already registered.';
    } else {
        status.style.color = 'green';
        status.textContent = 'Email is available!';
    }
});

// -------------------- password validation --------------------
document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    const status = document.getElementById('password-status');
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (password === '') {
        status.textContent = '';
        return;
    }

    if (!regex.test(password)) {
        status.style.color = 'red';
        status.textContent = 'Min. 8 characters with uppercase, lowercase, number and symbol.';
    } else {
        status.style.color = 'green';
        status.textContent = 'Password looks good!';
    }
});

// -------------------- confirm password validation --------------------
document.getElementById('confirm-password').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirm = this.value;
    const status = document.getElementById('confirm-status');

    if (confirm === '') {
        status.textContent = '';
        return;
    }

    if (confirm !== password) {
        status.style.color = 'red';
        status.textContent = 'Passwords do not match.';
    } else {
        status.style.color = 'green';
        status.textContent = 'Passwords match!';
    }
});

// -------------------- dob validation --------------------
document.getElementById('date-of-birth').addEventListener('change', function() {
    const dob = this.value;
    const dobStatus = document.getElementById('dob-status');

    if (dob === '') {
        dobStatus.textContent = '';
        return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 12) {
        dobStatus.style.color = 'red';
        dobStatus.textContent = 'You must be at least 12 years old to sign up.';
    } else {
        dobStatus.style.color = 'green';
        dobStatus.textContent = 'Age verified!';
    }
});

// -------------------- create account (exception handling) --------------------
document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    e.stopPropagation(); // stops browser from treating it as a native form submit

    // -------------------- age validation --------------------
    const dob = document.getElementById('date-of-birth').value;
    const dobStatus = document.getElementById('dob-status');

    if (dob === '' || dobStatus.style.color !== 'green') {
        dobStatus.style.color = 'red';
        dobStatus.textContent = dob === '' ? 'Please enter your date of birth.' : 'You must be at least 12 years old to sign up.';
        return;
    }

    const errorBox = document.getElementById('form-error');
    errorBox.style.display = 'none';
    errorBox.textContent = '';

    const formData = new FormData(this);

    try {
        const response = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/register.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        // -------------------- inserting data in database --------------------
        if (result.success) {
            this.reset(); // clears all fields on success
            window.location.href = '/WD3_Project_Sem2_MangaWebsite/Project/pages/welcome.php';
        } else {
            errorBox.textContent = result.error;
            errorBox.style.display = 'block';
        }

    } catch (err) {
        errorBox.textContent = 'Something went wrong. Please try again.';
        errorBox.style.display = 'block';
    }
});

// -------------------- password visibility --------------------
function togglePassword(fieldId, btn) {
    const input = document.getElementById(fieldId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Hide';
    } else {
        input.type = 'password';
        btn.textContent = 'Show';
    }
}