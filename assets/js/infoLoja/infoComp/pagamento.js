let cadastrarPagamento = document.getElementById("cadastrarPagamento");
let atualizarPagamento = document.getElementById("atualizarPagamento");
let atualizarStatusPagamento = document.getElementById("atualizarStatusPagamento");
let excluirPagamento = document.getElementById("excluirPagamento");

let resCad = document.getElementById("resCad");
let pagamentosList = document.getElementById("pagamentosList");
let modalEditar = document.getElementById("modalEditar");
let resEdit = document.getElementById("resEdit");

let tipo = sessionStorage.getItem('tipo');
let idUsuario = sessionStorage.getItem('idUsuario');
let token = sessionStorage.getItem('token');

if (tipo !== 'CLIENTE') {
    alert('Acesso negado');
    location.href = '../index.html';
}

let metodoSelect = document.getElementById("metodo");
metodoSelect.addEventListener('change', () => {
    let metodo = metodoSelect.value;
    let cardFields = document.querySelectorAll('#numero_cartao, #validade, #cvv, #nome_titular');
    if (metodo === 'CARTAO_CREDITO' || metodo === 'DEBITO') {
        cardFields.forEach(field => field.style.display = 'block');
    } else {
        cardFields.forEach(field => field.style.display = 'none');
    }
});

cadastrarPagamento.addEventListener("click", () => {
    let metodo = document.getElementById("metodo").value;
    let numero_cartao = document.getElementById("numero_cartao").value;
    let validade = document.getElementById("validade").value;
    let cvv = document.getElementById("cvv").value;
    let nome_titular = document.getElementById("nome_titular").value;

    let pagamento = {
        metodo,
        valor: 0, // For method registration
        status: 'PENDENTE'
        // idPedido null for method
    };

    fetch("https://backecom-production.up.railway.app/pagamento", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pagamento)
    })
    .then(resp => resp.json())
    .then(dados => {
        resCad.innerHTML = dados.message || dados.erro;
        listarPagamentos();
    })
    .catch(err => {
        console.error(err);
        resCad.innerHTML = 'Erro de rede';
    });
});

atualizarPagamento.addEventListener("click", () => {
    let id = document.getElementById("editId").value;
    let metodo = document.getElementById("editMetodo").value;

    let pagamento = {
        metodo
    };

    fetch(`https://backecom-production.up.railway.app/pagamento/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pagamento)
    })
    .then(resp => resp.json())
    .then(dados => {
        resEdit.innerHTML = dados.message || dados.erro;
        listarPagamentos();
        fecharModal();
    })
    .catch(err => {
        console.error(err);
        resEdit.innerHTML = 'Erro de rede';
    });
});

atualizarStatusPagamento.addEventListener("click", () => {
    let id = document.getElementById("editId").value;
    let status = 'APROVADO'; // Or something

    let pagamento = {
        status
    };

    fetch(`https://backecom-production.up.railway.app/pagamento/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pagamento)
    })
    .then(resp => resp.json())
    .then(dados => {
        resEdit.innerHTML = dados.message || dados.erro;
        listarPagamentos();
        fecharModal();
    })
    .catch(err => {
        console.error(err);
        resEdit.innerHTML = 'Erro de rede';
    });
});

excluirPagamento.addEventListener("click", () => {
    let id = document.getElementById("editId").value;

    fetch(`https://backecom-production.up.railway.app/pagamento/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        resEdit.innerHTML = dados.message || dados.erro;
        listarPagamentos();
        fecharModal();
    })
    .catch(err => {
        console.error(err);
        resEdit.innerHTML = 'Erro de rede';
    });
});

function listarPagamentos() {
    fetch("https://backecom-production.up.railway.app/pagamento", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        if (Array.isArray(dados)) {
            pagamentosList.innerHTML = criarTabelaPagamentos(dados);
        } else {
            pagamentosList.innerHTML = dados.erro || 'Erro';
        }
    })
    .catch(err => {
        console.error(err);
        pagamentosList.innerHTML = 'Erro de rede';
    });
}

function criarTabelaPagamentos(dados) {
    let tab = `<table><thead><th>Método</th><th>Status</th><th>Ações</th></thead><tbody>`;
    dados.forEach(dad => {
        tab += `<tr>
            <td>${dad.metodo}</td>
            <td>${dad.status}</td>
            <td>
                <button onclick="selecionarPagamento('${dad.metodo}', ${dad.codPagamento})">Selecionar</button>
                <button onclick="editarPagamento(${dad.codPagamento})">Editar</button>
            </td>
        </tr>`;
    });
    tab += `</tbody></table>`;
    return tab;
}

function selecionarPagamento(metodo, id) {
    sessionStorage.setItem('selectedPagamento', metodo);
    alert(`Pagamento ${metodo} selecionado`);
    location.href = './compra.html';
}

function editarPagamento(id) {
    fetch(`https://backecom-production.up.railway.app/pagamento/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        document.getElementById("editId").value = dados.codPagamento;
        document.getElementById("editMetodo").value = dados.metodo;
        modalEditar.style.display = 'block';
    });
}

function fecharModal() {
    modalEditar.style.display = 'none';
}

onload = listarPagamentos;