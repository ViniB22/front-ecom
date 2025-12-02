let cadastrarProdutoFornecedor = document.getElementById("cadastrarProdutoFornecedor")
let atualizarProdutoFornecedor = document.getElementById("atualizarProdutoFornecedor");

let resCad = document.getElementById("resCad")
let resList = document.getElementById("resList")
let resAtul = document.getElementById("resAtul")

const token = sessionStorage.getItem('token')

cadastrarProdutoFornecedor.addEventListener("click", () => {
    console.log("Cadastrar ProdutoFornecedor")
    let idProduto = document.getElementById("produto").value
    let idFornecedor = document.getElementById("fornecedor").value
    let custoUnitarioAtual = document.getElementById("custoUnitarioAtual").value
    let codigoReferencia = document.getElementById("codigoReferencia").value

    let produtoFornecedor = {
        idProduto: parseInt(idProduto),
        idFornecedor: parseInt(idFornecedor),
        custoUnitarioAtual: custoUnitarioAtual ? parseFloat(custoUnitarioAtual) : null,
        codigoReferencia: codigoReferencia
    }

    fetch("https://backecom-production.up.railway.app/produtoFornecedor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produtoFornecedor)
    })
    .then(resp => resp.json())
    .then(dados => {
        if (dados.message) {
            resCad.innerHTML = dados.message
        } else if (dados.erro) {
            resCad.innerHTML = dados.erro
        } else {
            resCad.innerHTML = 'Erro desconhecido'
        }
    })
    .catch(err => {
        console.error(err)
        resCad.innerHTML = 'Erro de rede'
    })

})


atualizarProdutoFornecedor.addEventListener("click", () => {
    console.log("Atualizar ProdutoFornecedor")
    let id = document.getElementById("codProdutoFornecedor").value
    let idProduto = document.getElementById("produtos").value
    let idFornecedor = document.getElementById("fornecedors").value
    let custoUnitarioAtual = document.getElementById("custoUnitarioAtuals").value
    let codigoReferencia = document.getElementById("codigoReferencias").value

    let produtoFornecedor = {
        idProduto: parseInt(idProduto),
        idFornecedor: parseInt(idFornecedor),
        custoUnitarioAtual: custoUnitarioAtual ? parseFloat(custoUnitarioAtual) : null,
        codigoReferencia: codigoReferencia
    }

    fetch(`https://backecom-production.up.railway.app/produtoFornecedor/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produtoFornecedor)
    })
    .then(resp => resp.json())
    .then(dados => {
        if (dados.message) {
            resAtul.innerHTML = dados.message
        } else if (dados.erro) {
            resAtul.innerHTML = dados.erro
        } else {
            resAtul.innerHTML = 'Erro desconhecido'
        }
    })
    .catch(err => {
        console.error(err)
        resAtul.innerHTML = 'Erro de rede'
    })
})


onload = () => {
    console.log("Listar ProdutoFornecedor")
    const token = sessionStorage.getItem('token')
    fetch("https://backecom-production.up.railway.app/produtoFornecedor", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        if (Array.isArray(dados)) {
            resList.innerHTML = `<table>${criarTabela(dados)}</table>`
        } else if (dados.erro) {
            resList.innerHTML = dados.erro
        } else {
            resList.innerHTML = 'Erro desconhecido'
        }
    })
    .catch(err => {
        console.error(err)
        resList.innerHTML = 'Erro de rede'
    })

    // Carregar produtos
    fetch("https://backecom-production.up.railway.app/produto", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(produtos => {
        if (Array.isArray(produtos)) {
            const selects = ['produto', 'produtos']
            selects.forEach(selectId => {
                const select = document.getElementById(selectId)
                select.innerHTML = '<option value="">Selecione um produto</option>'
                produtos.forEach(prod => {
                    const option = document.createElement('option')
                    option.value = prod.codProduto
                    option.textContent = prod.nome
                    select.appendChild(option)
                })
            })
        }
    })
    .catch(err => console.error('Erro ao carregar produtos', err))

    // Carregar fornecedores
    fetch("https://backecom-production.up.railway.app/fornecedor", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(fornecedores => {
        if (Array.isArray(fornecedores)) {
            const selects = ['fornecedor', 'fornecedors']
            selects.forEach(selectId => {
                const select = document.getElementById(selectId)
                select.innerHTML = '<option value="">Selecione um fornecedor</option>'
                fornecedores.forEach(forn => {
                    const option = document.createElement('option')
                    option.value = forn.codFornecedor
                    option.textContent = forn.nomeEmpresa
                    select.appendChild(option)
                })
            })
        }
    })
    .catch(err => console.error('Erro ao carregar fornecedores', err))
}
function criarTabela(dados) {
    console.log(dados)
    let tab = `<thead>
                    <th>Código</th>
                    <th>ID Produto</th>
                    <th>ID Fornecedor</th>
                    <th>Custo Unitário</th>
                    <th>Código Referência</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codProdutoFornecedor}</td>
                    <td>${dad.idProduto}</td>
                    <td>${dad.idFornecedor}</td>
                    <td>${dad.custoUnitarioAtual || ''}</td>
                    <td>${dad.codigoReferencia || ''}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}