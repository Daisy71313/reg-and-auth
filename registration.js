
document.getElementById('regButton').addEventListener('click', () => {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let nickname = document.getElementById('nickname').value

    let body = {
        email,
        password,
        nickname
    }

    fetch('/register', {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        console.log(response)
        return response.json()
    })
    .then(json => {
        localStorage.setItem('token', json.token)
    })
})