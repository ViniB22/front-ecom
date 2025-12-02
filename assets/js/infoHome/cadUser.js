let res = document.getElementById('res')
let cadastrar = document.getElementById('cadastrar')

cadastrar.addEventListener('click', () => {

    const nome = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const cpf = document.getElementById('cpf').value
    const telefone = document.getElementById('telefone').value
    const identidade = document.getElementById('identidade').value
    const senha = document.getElementById('senha').value

    const valores = {
        nome,
        email,
        cpf,
        telefone,
        identidade,
        senha
    }

    console.log(valores);


    fetch(`https://backecom-production.up.railway.app/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores)
    })
        .then(resp => resp.json())
        .then(dados => {
            console.log(dados);
            
            alert(`${dados.message}, agora realize o login <3`)
        })
        .catch((err) => {
            console.error('Erro ao cadastrar', err)
        })
})