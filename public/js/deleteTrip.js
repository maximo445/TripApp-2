document.addEventListener("click", async function(event) {
    
    if (!event.target.classList.contains("delete-btn")) return

    const url = event.target.getAttribute('data-value');

    console.log('This is the url: ', url);

    try {
    
        const res = await axios({
            method: 'DELETE',
            url: url
        });
    
        console.log(res.status);

        if (res.status == '204') {
            alert('Trip Deleted Successfully');
            window.setTimeout(() => {
                location.reload();
            }, 800)
        }
    
    } catch (err) {        
        alert('Unable To Delete Trip');
    }

});