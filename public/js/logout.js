const logout = async () => {
    try {

        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/v1/users/logout'
        });

        if (res.data.status === 'success') {
            alert('You are logged out!');
            window.setTimeout(() => {
                location.assign('/login');
            }, 1500)
        }

        console.log(res);

    } catch (err) {
        alert('error', 'Cant logout');
    }
}

const logoutButton = document.querySelector('.logout');

if (logoutButton) {
    
    logoutButton.addEventListener('click', e => {
        logout();
        console.log('Event trigered');
    });
}
