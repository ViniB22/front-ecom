let pedidosList = document.getElementById('pedidosList');
let reciboDiv = document.getElementById('recibo');

let tipo = sessionStorage.getItem('tipo');
let idUsuario = sessionStorage.getItem('idUsuario');
let token = sessionStorage.getItem('token');

if (tipo !== 'CLIENTE') {
    alert('Faça o Cadastro primeiro');
    location.href = '../index.html';
}

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('order');

onload = () => {
    loadPedidos();
}

function loadPedidos() {
    fetch(`https://backecom-production.up.railway.app/pedido/usuario/${idUsuario}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(pedidos => {
        if (pedidos.length === 0) {
            pedidosList.innerHTML = '<p class="no-data">Nenhum pedido encontrado.</p>';
            return;
        }
        let html = '<div class="produtos-grid">';
        pedidos.forEach(pedido => {
            html += `
            <div class="produto-card fade-in">
                <h3>Pedido #${pedido.codPedido}</h3>
                <p>Data: ${new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</p>
                <p>Total: R$ ${pedido.valorTotal}</p>
                <p>Status: ${pedido.status || 'Pendente'}</p>
            </div>`;
        });
        html += '</div>';
        pedidosList.innerHTML = html;
    })
    .catch(err => console.error(err));
}

function showRecibo(codPedido) {
    fetch(`https://backecom-production.up.railway.app/pedido/${codPedido}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error('Pedido não encontrado');
        }
        return resp.json();
    })
    .then(pedido => {
        if (!pedido || typeof pedido !== 'object' || !pedido.codPedido) {
            reciboDiv.innerHTML = '<div class="box"><p>Erro ao carregar pedido</p><button class="btn-primary" onclick="window.history.back()">Voltar</button></div>';
            reciboDiv.style.display = 'block';
            pedidosList.style.display = 'none';
            return;
        }
        fetch(`https://backecom-production.up.railway.app/item-pedido/pedido/${codPedido}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Itens não encontrados');
            }
            return resp.json();
        })
        .then(itens => {
            let html = `
            <div class="box">
                <h2>Recibo do Pedido #${pedido.codPedido || 'N/A'}</h2>
                <p><strong>Data:</strong> ${pedido.dataPedido ? new Date(pedido.dataPedido).toLocaleDateString('pt-BR') : 'N/A'}</p>
                <p><strong>Status:</strong> ${pedido.status || 'Pendente'}</p>
                <table class="fade-in">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Preço Unitário</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>`;
           if (Array.isArray(itens)) {
               itens.forEach(item => {
                   html += `
                   <tr>
                       <td>${item.produtoItem ? item.produtoItem.nome : 'Produto'}</td>
                       <td>${item.quantidade}</td>
                       <td>R$ ${item.precoUnitario}</td>
                       <td>R$ ${item.valorTotalItem}</td>
                   </tr>`;
               });
            } else {
                html += `<tr><td colspan="4">Erro ao carregar itens</td></tr>`;
            }
            html += `
                    </tbody>
                </table>
                <p><strong>Subtotal:</strong> R$ ${pedido.valorSubtotal || 'N/A'}</p>
                <p><strong>Frete:</strong> R$ ${pedido.valorFrete || 'N/A'}</p>
                <p><strong>Total:</strong> R$ ${pedido.valorTotal || 'N/A'}</p>
                <button class="btn-primary" onclick="window.history.back()">Voltar</button>
            </div>`;
            reciboDiv.innerHTML = html;
            reciboDiv.style.display = 'block';
            pedidosList.style.display = 'none';
        })
        .catch(err => {
            console.error('Erro ao carregar itens:', err);
            let html = `
            <div class="box">
                <h2>Recibo do Pedido #${pedido.codPedido || 'N/A'}</h2>
                <p>Erro ao carregar detalhes do pedido.</p>
                <button class="btn-primary" onclick="window.history.back()">Voltar</button>
            </div>`;
            reciboDiv.innerHTML = html;
            reciboDiv.style.display = 'block';
            pedidosList.style.display = 'none';
        });
    })
    .catch(err => {
        console.error('Erro ao carregar pedido:', err);
        let html = `
        <div class="box">
            <h2>Erro</h2>
            <p>Pedido não encontrado.</p>
            <button class="btn-primary" onclick="window.history.back()">Voltar</button>
        </div>`;
        reciboDiv.innerHTML = html;
        reciboDiv.style.display = 'block';
        pedidosList.style.display = 'none';
    });
}