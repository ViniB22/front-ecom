let res = document.getElementById('res')
let cadastrar = document.getElementById('cadastrar')

cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

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
        .then(resp => {
            console.log('Response status:', resp.status);
            console.log('Response ok:', resp.ok);
            return resp.json();
        })
        .then(dados => {
            console.log('Parsed dados:', dados);

            if (dados.message) {
                alert(`${dados.message}, agora realize o login <3`);
            } else if (dados.mensage) {
                alert(`${dados.mensage}, agora realize o login <3`);
            } else {
                alert('Resposta inesperada do servidor');
            }
        })
        .catch((err) => {
            console.error('Erro ao cadastrar', err);
        })
})