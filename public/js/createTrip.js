const createTrip = async (name, pickUpAddress, dropOffAddress, day) => {

    console.log(name, pickUpAddress, dropOffAddress);

    try {

        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/tours/',
            data: {
                children: name, 
                pickUp: pickUpAddress, 
                dropOff: dropOffAddress,
                day: day
            }
        });

        if (res.data.status === 'success') {
            alert('Trip Created!');
            window.setTimeout(() => {
                location.assign('/userPage');
            }, 1000)
        }

        console.log(res);

    } catch (err) {
        alert('Unable to Create Trip');
        console.log(err.response.data.message);
    }
}

const loginForm = document.querySelector('.create-trip');

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const pickUpAddress = document.querySelector('.pickUpAddress').value;
        // const pickUpAddress = document.querySelector('pickUpAddress').value;
        const dropOffAddress = document.querySelector('.dropOffAddress').value;
        // const dropOffAddress = document.querySelector('dropOffAddress').value;
        const day = document.querySelector(".day-form-select").value;
        createTrip(name, pickUpAddress, dropOffAddress, day);
        console.log('Event trigered');
    });
}
