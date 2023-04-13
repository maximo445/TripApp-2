const createTrip = async (name, pickUpAddress, dropOffAddress) => {

    console.log(name, pickUpAddress, dropOffAddress);

    try {

        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/tours/',
            data: {
                children: name, 
                pickUp: pickUpAddress, 
                dropOff: dropOffAddress
            }
        });

        if (res.data.status === 'success') {
            // alert('You are logged in!');
            window.setTimeout(() => {
                location.assign('/userPage');
            }, 1000)
        }

        console.log(res);

    } catch (err) {
        console.log(err.response.data.message);
    }
}

const loginForm = document.querySelector('.create-trip');

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const pickUpAddress = document.getElementById('pickUpAddress').value;
        const dropOffAddress = document.getElementById('dropOffAddress').value;
        createTrip(name, pickUpAddress, dropOffAddress);
        console.log('Event trigered');
    });
}
