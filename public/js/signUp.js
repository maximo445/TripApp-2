const signUp = async (name, email, password, passwordConfirm, role) => {
    
    console.log(name, email, password, passwordConfirm, role);
    
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm,
                role
            }
        });

        if (res.data.status === 'success') {
            alert('Sign Up Successful!');
            window.setTimeout(() => {
                location.assign('/userPage');
            }, 1500)
        }

        console.log(res);

    } catch (err) {
        alert('Error, try again!');
        console.log(err.response.data.message);
    }

}

const signUpForm = document.querySelector('.signup-form');

if (signUpForm) {
    signUpForm.addEventListener('submit', e => {
        e.preventDefault();
        //name email password password-confirm signup-dropdown
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        const role = document.querySelector('.signup-form-select').value;
        signUp(name, email, password, passwordConfirm, role);
    });
}