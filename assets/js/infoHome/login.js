let btnLogin = document.getElementById('btnLogin')
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
        .then(resp => {
            console.log('Response status:', resp.status)
            console.log('Response ok:', resp.ok)
            return resp.json()
        })
    .then(dados => {
        console.log(dados)
        if (dados.mensagem) {
            // Erro de login
            sessionStorage.setItem('token', dados.token)
            sessionStorage.setItem('nome', dados.usuario.nome)
            sessionStorage.setItem('tipo', dados.usuario.tipo)
            sessionStorage.setItem('idUsuario', dados.usuario.id)
            
            res.innerHTML = dados.mensagem
            res.style.textAlign = 'center'
            res.style.fontWeight = 'bold'
            res.style.color = 'green'
            
            setTimeout(() => {
                // Redirecionar conforme tipo
                if (dados.usuario.tipo === 'ADMIN') {
                    location.href = './menuAdm.html'
                } else {
                    location.href = './menuProd.html'
                }
            }, 1500)
        } else {
            // Login bem-sucedido
            sessionStorage.setItem('token', dados.token)
            sessionStorage.setItem('nome', dados.usuario.nome)
            sessionStorage.setItem('tipo', dados.usuario.tipo)
            sessionStorage.setItem('idUsuario', dados.usuario.id)

            res.innerHTML = `Login realizado com sucesso!`
            res.style.textAlign = 'center'
            res.style.fontWeight = 'bold'
            res.style.color = 'green'

        }
    })
    .catch(err => {
        console.error('Erro:', err)
        res.innerHTML = 'Erro ao fazer login'
    })
})
