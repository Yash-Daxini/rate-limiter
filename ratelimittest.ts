let testLimit = (endPoint: string) => {
    fetch(`http://localhost:3000/${endPoint}`,
        {
            headers: {
                'content-type': 'application/json',
                'x-user-id': 'ddfdd4'
            }
        }
    )
        .then(res => res.text())
        .then(res => console.warn(res))
}


setTimeout(() => {
    let count = 1;
    let i = setInterval(() => {
        testLimit("burst");
        count++;
        if (count > 5)
            clearInterval(i);
    }, 200);
}, 4000);

setTimeout(() => {
    let count = 1;
    console.time();
    let i = setInterval(() => {
        testLimit("burst");
        count++;
        if (count > 20)
            clearInterval(i);
    }, 50);
    console.timeEnd();
}, 11000);
