let btnLogout = document.getElementById('btnLogout')

btnLogout.addEventListener('click', () => {
    sessionStorage.clear()
    alert('Logout realizado com sucesso!')
    location.href = '../index.html'
})
