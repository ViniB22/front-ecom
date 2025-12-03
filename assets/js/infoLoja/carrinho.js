let carrinhoItems = document.getElementById('carrinhoItems');
let totalDiv = document.getElementById('total');

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
                <div class="carrinho-item fade-in">
                    <img src="${prod.imagem_url}" alt="${prod.nome}">
                    <div class="carrinho-item-info">
                        <h3 class="carrinho-item-nome">${prod.nome}</h3>
                        <p class="carrinho-item-preco">Preço: R$ ${prod.preco}</p>
                        <div class="quantidade-controle">
                            <button class="quantidade-btn" onclick="atualizarQuantidade(${id}, ${qty-1})">-</button>
                            <input type="number" value="${qty}" min="1" onchange="atualizarQuantidade(${id}, this.value)" class="quantidade-input">
                            <button class="quantidade-btn" onclick="atualizarQuantidade(${id}, ${qty+1})">+</button>
                        </div>
                        <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
                    </div>
                    <div class="carrinho-item-controles">
                        <button class="remover-item" onclick="removerItem(${id})">Remover</button>
                    </div>
                </div>`;
            }
        });
        carrinhoItems.innerHTML = itemsHtml;
        totalDiv.innerHTML = `
        <div class="carrinho-resumo">
            <h3 class="carrinho-total">Total: R$ ${total.toFixed(2)}</h3>
            <div class="carrinho-acoes">
                <button id="finalizarCompra" class="btn-success">Finalizar Compra</button>
            </div>
        </div>`;
        // Add event listener after adding the button
        document.getElementById('finalizarCompra').addEventListener('click', () => {
            location.href = './compra.html';
        });
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
