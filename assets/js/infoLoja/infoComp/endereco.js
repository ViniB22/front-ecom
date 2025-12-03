let cadastrarEndereco = document.getElementById("cadastrarEndereco");
let atualizarEndereco = document.getElementById("atualizarEndereco");
let atualizarStatusEndereco = document.getElementById("atualizarStatusEndereco");
let excluirEndereco = document.getElementById("excluirEndereco");

let resCad = document.getElementById("resCad");
let enderecosList = document.getElementById("enderecosList");
let modalEditar = document.getElementById("modalEditar");
let resEdit = document.getElementById("resEdit");

let tipo = sessionStorage.getItem('tipo');
let idUsuario = sessionStorage.getItem('idUsuario');
let token = sessionStorage.getItem('token');

if (tipo !== 'CLIENTE') {
    alert('Acesso negado');
    location.href = '../index.html';
}

let cepInput = document.getElementById("cep");
cepInput.addEventListener('blur', () => {
    let cep = cepInput.value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(resp => resp.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById("logradouro").value = data.logradouro;
                document.getElementById("complemento").value = data.complemento;
                document.getElementById("bairro").value = data.bairro;
                document.getElementById("localidade").value = data.localidade;
                document.getElementById("uf").value = data.uf;
            }
        });
    }
});

cadastrarEndereco.addEventListener("click", () => {
    let cep = document.getElementById("cep").value;
    let logradouro = document.getElementById("logradouro").value;
    let complemento = document.getElementById("complemento").value;
    let bairro = document.getElementById("bairro").value;
    let localidade = document.getElementById("localidade").value;
    let uf = document.getElementById("uf").value;
    let numero = document.getElementById("numero").value;
    let apelido = document.getElementById("apelido").value;
    let is_principal = document.getElementById("is_principal").checked;

    let endereco = {
        idUsuario: parseInt(idUsuario),
        cep,
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
        numero,
        apelido,
        is_principal
    };

    fetch("https://backecom-production.up.railway.app/endereco", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(endereco)
    })
    .then(resp => resp.json())
    .then(dados => {
        resCad.innerHTML = dados.message || dados.erro;
        listarEnderecos();
    })
    .catch(err => {
        console.error(err);
        resCad.innerHTML = 'Erro de rede';
    });
});

atualizarEndereco.addEventListener("click", () => {
    let id = document.getElementById("editId").value;
    let cep = document.getElementById("editCep").value;
    let logradouro = document.getElementById("editLogradouro").value;
    let complemento = document.getElementById("editComplemento").value;
    let bairro = document.getElementById("editBairro").value;
    let localidade = document.getElementById("editLocalidade").value;
    let uf = document.getElementById("editUf").value;
    let numero = document.getElementById("editNumero").value;
    let apelido = document.getElementById("editApelido").value;
    let is_principal = document.getElementById("editIsPrincipal").checked;

    let endereco = {
        cep,
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
        numero,
        apelido,
        is_principal
    };

    fetch(`https://backecom-production.up.railway.app/endereco/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(endereco)
    })
    .then(resp => resp.json())
    .then(dados => {
        resEdit.innerHTML = dados.message || dados.erro;
        listarEnderecos();
        fecharModal();
    })
    .catch(err => {
        console.error(err);
        resEdit.innerHTML = 'Erro de rede';
    });
});

atualizarStatusEndereco.addEventListener("click", () => {
    let id = document.getElementById("editId").value;
    let is_principal = document.getElementById("editIsPrincipal").checked;

    let endereco = {
        is_principal
    };

    fetch(`https://backecom-production.up.railway.app/endereco/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(endereco)
    })
    .then(resp => resp.json())
    .then(dados => {
        resEdit.innerHTML = dados.message || dados.erro;
        listarEnderecos();
        fecharModal();
    })
    .catch(err => {
        console.error(err);
        resEdit.innerHTML = 'Erro de rede';
    });
});

excluirEndereco.addEventListener("click", () => {
    let id = document.getElementById("editId").value;

    fetch(`https://backecom-production.up.railway.app/endereco/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        resEdit.innerHTML = dados.message || dados.erro;
        listarEnderecos();
        fecharModal();
    })
    .catch(err => {
        console.error(err);
        resEdit.innerHTML = 'Erro de rede';
    });
});

function listarEnderecos() {
    fetch("https://backecom-production.up.railway.app/endereco", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        if (Array.isArray(dados)) {
            enderecosList.innerHTML = criarTabelaEnderecos(dados);
        } else {
            enderecosList.innerHTML = dados.erro || 'Erro';
        }
    })
    .catch(err => {
        console.error(err);
        enderecosList.innerHTML = 'Erro de rede';
    });
}

function criarTabelaEnderecos(dados) {
    let tab = `<table><thead><th>Apelido</th><th>CEP</th><th>Logradouro</th><th>Número</th><th>Cidade</th><th>UF</th><th>Principal</th><th>Ações</th></thead><tbody>`;
    dados.forEach(dad => {
        tab += `<tr>
            <td>${dad.apelido || ''}</td>
            <td>${dad.cep}</td>
            <td>${dad.logradouro}</td>
            <td>${dad.numero}</td>
            <td>${dad.localidade}</td>
            <td>${dad.uf}</td>
            <td>${dad.is_principal ? 'Sim' : 'Não'}</td>
            <td>
                <button onclick="selecionarEndereco(${dad.codEndereco}, '${dad.apelido || dad.logradouro}')">Selecionar</button>
                <button onclick="editarEndereco(${dad.codEndereco})">Editar</button>
            </td>
        </tr>`;
    });
    tab += `</tbody></table>`;
    return tab;
}

function selecionarEndereco(id, nome) {
    sessionStorage.setItem('selectedEndereco', id);
    alert(`Endereço ${nome} selecionado`);
    location.href = './compra.html';
}

function editarEndereco(id) {
    fetch(`https://backecom-production.up.railway.app/endereco/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        document.getElementById("editId").value = dados.codEndereco;
        document.getElementById("editCep").value = dados.cep;
        document.getElementById("editLogradouro").value = dados.logradouro;
        document.getElementById("editComplemento").value = dados.complemento;
        document.getElementById("editBairro").value = dados.bairro;
        document.getElementById("editLocalidade").value = dados.localidade;
        document.getElementById("editUf").value = dados.uf;
        document.getElementById("editNumero").value = dados.numero;
        document.getElementById("editApelido").value = dados.apelido;
        document.getElementById("editIsPrincipal").checked = dados.is_principal;
        modalEditar.style.display = 'block';
    });
}

function fecharModal() {
    modalEditar.style.display = 'none';
}

onload = listarEnderecos;