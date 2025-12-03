let cadastrarProdutoFornecedor = document.getElementById("cadastrarProdutoFornecedor")
let atualizarProdutoFornecedor = document.getElementById("atualizarProdutoFornecedor");
let atualizarParcialProdutoFornecedor = document.getElementById("atualizarParcialProdutoFornecedor");
let deletarProdutoFornecedor = document.getElementById("deletarProdutoFornecedor");

let resCad = document.getElementById("resCad")
let resList = document.getElementById("resList")
let resAtul = document.getElementById("resAtul")
let resAtulParcial = document.getElementById("resAtulParcial")
let resDelete = document.getElementById("resDelete")

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

    fetch("https://backecom-production.up.railway.app/produto-fornecedor", {
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

    fetch(`https://backecom-production.up.railway.app/produto-fornecedor/${id}`, {
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


atualizarParcialProdutoFornecedor.addEventListener("click", () => {
    console.log("Atualizar Parcial ProdutoFornecedor")
    let id = document.getElementById("codProdutoFornecedorParcial").value
    let idProduto = document.getElementById("produtosParcial").value
    let idFornecedor = document.getElementById("fornecedorsParcial").value
    let custoUnitarioAtual = document.getElementById("custoUnitarioAtualsParcial").value
    let codigoReferencia = document.getElementById("codigoReferenciasParcial").value

    let produtoFornecedor = {}

    if (idProduto) produtoFornecedor.idProduto = parseInt(idProduto)
    if (idFornecedor) produtoFornecedor.idFornecedor = parseInt(idFornecedor)
    if (custoUnitarioAtual) produtoFornecedor.custoUnitarioAtual = parseFloat(custoUnitarioAtual)
    if (codigoReferencia) produtoFornecedor.codigoReferencia = codigoReferencia

    fetch(`https://backecom-production.up.railway.app/produto-fornecedor/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produtoFornecedor)
    })
    .then(resp => resp.json())
    .then(dados => {
        if (dados.message) {
            resAtulParcial.innerHTML = dados.message
        } else if (dados.erro) {
            resAtulParcial.innerHTML = dados.erro
        } else {
            resAtulParcial.innerHTML = 'Erro desconhecido'
        }
    })
    .catch(err => {
        console.error(err)
        resAtulParcial.innerHTML = 'Erro de rede'
    })
})

deletarProdutoFornecedor.addEventListener("click", () => {
    console.log("Deletar ProdutoFornecedor")
    let id = document.getElementById("codProdutoFornecedorDelete").value

    if (!confirm('Tem certeza que deseja deletar esta relação produto-fornecedor?')) {
        return
    }

    fetch(`https://backecom-production.up.railway.app/produto-fornecedor/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        if (dados.message) {
            resDelete.innerHTML = dados.message
            // Recarregar a lista após deletar
            location.reload()
        } else if (dados.erro) {
            resDelete.innerHTML = dados.erro
        } else {
            resDelete.innerHTML = 'Erro desconhecido'
        }
    })
    .catch(err => {
        console.error(err)
        resDelete.innerHTML = 'Erro de rede'
    })
})


onload = () => {
    console.log("Listar ProdutoFornecedor")
    const token = sessionStorage.getItem('token')
    fetch("https://backecom-production.up.railway.app/produto-fornecedor", {
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

    // Carregar produtos para atualização parcial
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
            const select = document.getElementById('produtosParcial')
            select.innerHTML = '<option value="">Selecione um produto</option>'
            produtos.forEach(prod => {
                const option = document.createElement('option')
                option.value = prod.codProduto
                option.textContent = prod.nome
                select.appendChild(option)
            })
        }
    })
    .catch(err => console.error('Erro ao carregar produtos para atualização parcial', err))

    // Carregar fornecedores para atualização parcial
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
            const select = document.getElementById('fornecedorsParcial')
            select.innerHTML = '<option value="">Selecione um fornecedor</option>'
            fornecedores.forEach(forn => {
                const option = document.createElement('option')
                option.value = forn.codFornecedor
                option.textContent = forn.nomeEmpresa
                select.appendChild(option)
            })
        }
    })
    .catch(err => console.error('Erro ao carregar fornecedores para atualização parcial', err))
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