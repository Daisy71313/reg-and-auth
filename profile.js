let emailInput = document.getElementById('email')
let nicknameInput = document.getElementById('nickname')


document.addEventListener('DOMContentLoaded', () => {
    let token = localStorage.getItem('token')
    if(token == null)
    {
        return alert('Токена нет')
    }

    fetch('/profile', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(json => {
        emailInput.value = json.email
        nicknameInput.value = json.nickname
    })

})