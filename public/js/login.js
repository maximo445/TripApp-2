const login = async (email, password) => {
    
    try {

        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            alert('You are logged in!');
            window.setTimeout(() => {
                location.assign('/userPage');
            }, 1500)
        }

        console.log(res);

    } catch (err) {
        console.log(err.response.data.message);
    }
}

const loginForm = document.querySelector('.login-form');

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
        console.log('Event trigered');
    });
}
