let produtosCompra = document.getElementById('produtosCompra');
let totalCompra = document.getElementById('totalCompra');
let btnPagamento = document.getElementById('btnPagamento');
let btnEndereco = document.getElementById('btnEndereco');
let pagamentoSelecionado = document.getElementById('pagamentoSelecionado');
let enderecoSelecionado = document.getElementById('enderecoSelecionado');
let finalizarPedidoBtn = document.getElementById('finalizarPedido');

let tipo = sessionStorage.getItem('tipo');
let idUsuario = sessionStorage.getItem('idUsuario');
let token = sessionStorage.getItem('token');

if (tipo !== 'CLIENTE') {
    alert('Faça o Cadastro primeiro');
    location.href = '../index.html';
}

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
if (carrinho.length === 0) {
    alert('Carrinho vazio');
    location.href = './carrinho.html';
}

let selectedPagamento = sessionStorage.getItem('selectedPagamento');
let selectedEndereco = sessionStorage.getItem('selectedEndereco');

onload = () => {
    if (selectedPagamento) {
        pagamentoSelecionado.textContent = `Pagamento: ${selectedPagamento}`;
    }
    if (selectedEndereco) {
        enderecoSelecionado.textContent = `Endereço: ${selectedEndereco}`;
    }

    loadProdutos();
}

function loadProdutos() {
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
        let html = '<table class="fade-in"><thead><tr><th>Imagem</th><th>Produto</th><th>Preço</th><th>Quantidade</th><th>Subtotal</th></tr></thead><tbody>';
        let total = 0;
        ids.forEach(id => {
            let prod = produtos.find(p => p.codProduto == id);
            if (prod) {
                let qty = counts[id];
                let subtotal = prod.preco * qty;
                total += subtotal;
                html += `
                 <tr>
                     <td><img src="${prod.imagem_url}" alt="${prod.nome}" style="width: 80px; height: 80px; object-fit: cover;"></td>
                     <td>${prod.nome}</td>
                     <td>R$ ${prod.preco}</td>
                     <td><input type="number" value="${qty}" min="1" onchange="atualizarQty(${id}, this.value)" style="width: 60px;"></td>
                     <td>R$ ${subtotal.toFixed(2)}</td>
                 </tr>`;
            }
        });
        html += '</tbody></table>';
        produtosCompra.innerHTML = html;
        totalCompra.innerHTML = `<div class="box"><h3>Total da Compra: R$ ${total.toFixed(2)}</h3></div>`;
    })
    .catch(err => console.error(err));
}

function atualizarQty(id, novaQty) {
    let counts = {};
    carrinho.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
    });
    // Remove all id
    carrinho = carrinho.filter(item => item != id);
    // Add novaQty
    for (let i = 0; i < novaQty; i++) {
        carrinho.push(id);
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    loadProdutos();
}

btnPagamento.addEventListener('click', () => {
    location.href = './pagamento.html';
});

btnEndereco.addEventListener('click', () => {
    location.href = './endereco.html';
});

finalizarPedidoBtn.addEventListener('click', () => {
    if (!selectedPagamento || !selectedEndereco) {
        alert('Selecione pagamento e endereço');
        return;
    }

    // Calculate totals
    let counts = {};
    carrinho.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
    });
    let ids = Object.keys(counts);
    let valorSubtotal = 0;
    let valorFrete = 10; // Assume fixed freight

    fetch(`https://backecom-production.up.railway.app/produto`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(produtos => {
        ids.forEach(id => {
            let prod = produtos.find(p => p.codProduto == id);
            if (prod) {
                valorSubtotal += prod.preco * counts[id];
            }
        });
        let valorTotal = valorSubtotal + valorFrete;

        let pedido = {
            idUsuario: parseInt(idUsuario),
            idEndereco: parseInt(selectedEndereco),
            valorSubtotal,
            valorFrete,
            valorTotal,
            metodoPagamento: selectedPagamento
        };

        fetch('https://backecom-production.up.railway.app/pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(pedido)
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.pedido) {
                let idPedido = data.pedido.codPedido;
                // Create itensPedido
                let promises = ids.map(id => {
                    let prod = produtos.find(p => p.codProduto == id);
                    let qty = counts[id];
                    let item = {
                        idPedido,
                        idProduto: parseInt(id),
                        quantidade: qty,
                        precoUnitario: prod.preco,
                        valorTotalItem: prod.preco * qty
                    };
                    return fetch('https://backecom-production.up.railway.app/itemPedido', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(item)
                    });
                });
                Promise.all(promises).then(() => {
                    localStorage.removeItem('carrinho');
                    sessionStorage.removeItem('selectedPagamento');
                    sessionStorage.removeItem('selectedEndereco');
                    location.href = `./pedido.html?order=${idPedido}`;
                });
            } else {
                alert('Erro ao criar pedido');
            }
        })
        .catch(err => console.error(err));
    });
});