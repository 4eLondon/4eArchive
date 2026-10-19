document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const identifier = document.getElementById('identifier').value.trim();
    const password   = document.getElementById('password').value;
    const errorBox   = document.getElementById('form-error');

    errorBox.style.display = 'none';
    errorBox.textContent   = '';

    if (!identifier || !password) {
        errorBox.textContent   = 'Please fill in all fields.';
        errorBox.style.display = 'block';
        return;
    }

    try {
        const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ username: identifier, password })
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = '/WD3_Project_Sem2_MangaWebsite/Project/index.php';
        } else {
            errorBox.textContent   = data.error || 'Something went wrong.';
            errorBox.style.display = 'block';
        }
    } catch (err) {
        errorBox.textContent   = 'Could not connect to the server. Please try again later.';
        errorBox.style.display = 'block';
    }
});

function togglePassword(id, btn) {
    const input = document.getElementById(id);
    const show  = input.type === 'password';
    input.type       = show ? 'text' : 'password';
    btn.textContent  = show ? 'Hide' : 'Show';
}