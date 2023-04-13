const assignTrip = async (tripId, driverEmail) => {
   
    try {

        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:8000/api/v1/tours/assignTrip/${tripId}/${driverEmail}`
        });

        if (res.data.status === 'success') {
            alert('Trip Assigned Successfully');
            window.setTimeout(() => {
                location.assign('/userPage');
            }, 1500)
        }

    } catch (err) {
        console.log(err.response.data.message);
    }
}

const form = document.querySelector('.assign-form');

console.log(form);

if (form) {    
    form.addEventListener("submit", function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
      
        // Get the value of the selected option in the "sombrero" dropdown list
        // const tripId = document.querySelector('#trip-id').value;
        const driverEmail = document.querySelector(".form-select").value;
      
        assignTrip('6435451ef9988836c414673e', driverEmail);
      
      });
}

