let cadastrarEstoque = document.getElementById("cadastrarEstoque")
let atualizarEstoque = document.getElementById("atualizarEstoque");
let atualizarParcialEstoque = document.getElementById("atualizarParcialEstoque");
let deletarEstoque = document.getElementById("deletarEstoque");

let resCad = document.getElementById("resCad")
let resList = document.getElementById("resList")
let resAtul = document.getElementById("resAtul")
let resAtulParcial = document.getElementById("resAtulParcial")
let resDelete = document.getElementById("resDelete")

const token = sessionStorage.getItem('token')

cadastrarEstoque.addEventListener("click", () => {
    console.log("Cadastrar Estoque")
    let idProduto = document.getElementById("produto").value
    let quantidade_atual = document.getElementById("quantidade_atual").value
    let quantidade_minima = document.getElementById("quantidade_minima").value

    let estoque = {
        idProduto: parseInt(idProduto),
        quantidade_atual: quantidade_atual ? parseInt(quantidade_atual) : 0,
        quantidade_minima: quantidade_minima ? parseInt(quantidade_minima) : 0
    }

    fetch("https://backecom-production.up.railway.app/estoque", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(estoque)
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


atualizarEstoque.addEventListener("click", () => {
    console.log("Atualizar Estoque")
    let id = document.getElementById("codEstoque").value
    let idProduto = document.getElementById("produtos").value
    let quantidade_atual = document.getElementById("quantidade_atuals").value
    let quantidade_minima = document.getElementById("quantidade_minimas").value

    let estoque = {
        idProduto: parseInt(idProduto),
        quantidade_atual: quantidade_atual ? parseInt(quantidade_atual) : 0,
        quantidade_minima: quantidade_minima ? parseInt(quantidade_minima) : 0
    }

    fetch(`https://backecom-production.up.railway.app/estoque/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(estoque)
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


atualizarParcialEstoque.addEventListener("click", () => {
    console.log("Atualizar Parcial Estoque")
    let id = document.getElementById("codEstoqueParcial").value
    let idProduto = document.getElementById("produtosParcial").value
    let quantidade_atual = document.getElementById("quantidade_atualParcial").value
    let quantidade_minima = document.getElementById("quantidade_minimaParcial").value

    let estoque = {}

    if (idProduto) estoque.idProduto = parseInt(idProduto)
    if (quantidade_atual) estoque.quantidade_atual = parseInt(quantidade_atual)
    if (quantidade_minima) estoque.quantidade_minima = parseInt(quantidade_minima)

    fetch(`https://backecom-production.up.railway.app/estoque/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(estoque)
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

deletarEstoque.addEventListener("click", () => {
    console.log("Deletar Estoque")
    let id = document.getElementById("codEstoqueDelete").value

    if (!confirm('Tem certeza que deseja deletar este estoque?')) {
        return
    }

    fetch(`https://backecom-production.up.railway.app/estoque/${id}`, {
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
    console.log("Listar Estoques")
    const token = sessionStorage.getItem('token')
    fetch("https://backecom-production.up.railway.app/estoque", {
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
            const selects = ['produto', 'produtos', 'produtosParcial']
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
}
function criarTabela(dados) {
    console.log(dados)
    let tab = `<thead>
                    <th>Código</th>
                    <th>ID Produto</th>
                    <th>Quantidade Atual</th>
                    <th>Quantidade Mínima</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codEstoque}</td>
                    <td>${dad.idProduto}</td>
                    <td>${dad.quantidade_atual || 0}</td>
                    <td>${dad.quantidade_minima || 0}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}