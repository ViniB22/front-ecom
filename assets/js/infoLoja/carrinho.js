let carrinhoItems = document.getElementById('carrinhoItems');
let totalDiv = document.getElementById('total');
let finalizarCompraBtn = document.getElementById('finalizarCompra');

let tipo = sessionStorage.getItem('tipo');

if (tipo !== 'CLIENTE') {
    alert('Faça o Cadastro primeiro');
    location.href = '../index.html';
}

const token = sessionStorage.getItem('token');

onload = () => {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        carrinhoItems.innerHTML = '<p>Carrinho vazio</p>';
        totalDiv.innerHTML = '';
        return;
    }

    // Get unique product ids and counts
    let counts = {};
    carrinho.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
    });

    let ids = Object.keys(counts);

    fetch(`https://backecom-production.up.railway.app/produto`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(produtos => {
        let itemsHtml = '';
        let total = 0;
        ids.forEach(id => {
            let prod = produtos.find(p => p.codProduto == id);
            if (prod) {
                let qty = counts[id];
                let subtotal = prod.preco * qty;
                total += subtotal;
                itemsHtml += `
                <div class="item">
                    <img src="${prod.imagem_url}" width="100">
                    <h5>${prod.nome}</h5>
                    <p>Preço: R$ ${prod.preco}</p>
                    <input type="number" value="${qty}" min="1" onchange="atualizarQuantidade(${id}, this.value)">
                    <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
                    <button onclick="removerItem(${id})">Remover</button>
                </div>`;
            }
        });
        carrinhoItems.innerHTML = itemsHtml;
        totalDiv.innerHTML = `<h3>Total: R$ ${total.toFixed(2)}</h3>`;
    })
    .catch(err => console.error(err));
}

function atualizarQuantidade(id, novaQty) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    // Remove all instances of id
    carrinho = carrinho.filter(item => item != id);
    // Add novaQty instances
    for (let i = 0; i < novaQty; i++) {
        carrinho.push(id);
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    location.reload(); // Reload to update display
}

function removerItem(id) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho = carrinho.filter(item => item != id);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    location.reload();
}

finalizarCompraBtn.addEventListener('click', () => {
    location.href = './compra.html';
});