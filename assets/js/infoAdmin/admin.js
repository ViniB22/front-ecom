let tipo = sessionStorage.getItem('tipo')

if (tipo === 'ADMIN'){
    alert('Bem vindo Administrador!')
} else {
    alert('Você não tem esse acesso')
    location.href = '../index.html'
}