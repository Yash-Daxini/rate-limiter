setInterval(() => {
    fetch("http://localhost:3000/",
        {
            headers: {
                'content-type': 'application/json',
                'x-user-id': 'ddfdd4'
            }
        }
    )
        .then(res => res.json())
        .then(res => console.warn(res))
}, 100);