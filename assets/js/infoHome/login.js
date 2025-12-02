let btnLogin = document.getElementById('btnLogin')
let btnLogout = document.getElementById('btnLogout')
let res = document.getElementById('res')

btnLogin.addEventListener('click', () => {
    let email = document.getElementById('email').value
    let senha = document.getElementById('senha').value

    valores = {
        email: email,
        senha: senha
    }

    fetch(`https://backecom-production.up.railway.app/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(valores)
    })
    .then(resp => resp.json())
    .then(dados => {
        sessionStorage.setItem('token', dados.token)
        sessionStorage.setItem('nome', dados.usuario.nome)
        sessionStorage.setItem('tipo', dados.usuario.tipo)

        res.innerHTML += `Login realizado com sucesso!`
        res.style.textAlign = 'center'
        res.style.fontWeight = 'bold'

        setTimeout(() => {
            
            // Redirecionar conforme tipo
            if(dados.usuario.tipo === 'ADMIN') {
                location.href = './menuAdm.html'
            }else{
                location.href = './menuProd.html'
            }
        }, 1500)
    })
    .catch(err => {
        console.error('Erro:', err)
        res.innerHTML = 'Erro ao fazer login'
    })
})
