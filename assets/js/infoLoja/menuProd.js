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
    console.log('Token:', token);
    console.log('Tipo:', tipo);
    fetch(`https://backecom-production.up.railway.app/produto`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => {
        console.log('Response status:', resp.status);
        return resp.json();
    })
    .then(dados => {
        console.log('Dados recebidos:', dados);
        produtosList.innerHTML = `${mostrarProdutos(dados)}`
    })
    .catch(err => {
        console.error('Erro no fetch:', err)
    })
}

function mostrarProdutos(dados){
    let html = '';
    dados.forEach(dad => {
        html += `
        <div class="box">
            <div class="box-body">
                <img src="${dad.imagem_url}" width="200px" onclick="ampliarImagem('${dad.imagem_url}', '${dad.nome}')"><br>
                <h5 class="box-title">${dad.nome}</h5><br>
                <p class="box-text">${dad.modelo}</p><br>
                <p class="box-text">${dad.descricao}</p><br>
                <p class="box-text">${dad.preco}</p><br>
                <button class="btn btn-primary" onclick="adicionarAoCarrinho(${dad.codProduto})">Adicionar ao Carrinho</button>
            </div>
        </div>`;
    });
    return html;
}

function ampliarImagem(src, alt) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '30px';
    closeBtn.style.color = '#fff';
    closeBtn.style.fontSize = '40px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => document.body.removeChild(modal);

    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
}
function adicionarAoCarrinho(codProduto){
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
    carrinho.push(codProduto)
    localStorage.setItem('carrinho', JSON.stringify(carrinho))
    alert('Produto adicionado ao carrinho!')
}