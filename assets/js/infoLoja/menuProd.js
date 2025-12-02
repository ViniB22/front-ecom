let produtosList = document.getElementById('produtosList')

let tipo = sessionStorage.getItem('tipo')

if (tipo === 'CLIENTE'){
    alert('Bem vindo Cliente!')
} else {
    alert('Faça o Cadastro primeiro')
    location.href = '../index.html'
}

const token = sessionStorage.getItem('token')

onload = () =>{
    fetch(`https://backecom-production.up.railway.app/produto`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        produtosList.innerHTML = `${mostrarProdutos(dados)}`
    })
    .catch(err => {
        console.error(err)
    })
}

function mostrarProdutos(dados){
    produtosList.innerHTML = ''
    dados.forEach(dad => {
        produtosList.innerHTML += `
        <div class="box">
            <div class="box-body">
                <img src="${dad.imagem_url}" width="200px"><br>
                <h5 class="box-title">${dad.nome}</h5><br>
                <p class="box-text">${dad.modelo}</p><br>
                <p class="box-text">${dad.descricao}</p><br>
                <p class="box-text">${dad.preco}</p><br>
                <button class="btn btn-primary" onclick="adicionarAoCarrinho(${dad.codProduto})">Adicionar ao Carrinho</button>
            </div>
        </div>`
    })
}
function adicionarAoCarrinho(codProduto){
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
    carrinho.push(codProduto)
    localStorage.setItem('carrinho', JSON.stringify(carrinho))
    alert('Produto adicionado ao carrinho!')
}