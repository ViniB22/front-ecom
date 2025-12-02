let cadastrarProduto = document.getElementById("cadastrarProduto")
let atualizarProduto = document.getElementById("atualizarProduto");
let atualizarStatusProduto = document.getElementById("atualizarStatusProduto");
let excluirProduto = document.getElementById("excluirProduto");

let resCad = document.getElementById("resCad")
let resList = document.getElementById("resList")
let resAtul = document.getElementById("resAtul")
let resAtulPar = document.getElementById("resAtulPar")
let resExc = document.getElementById("resExc")

cadastrarProduto.addEventListener("click", () => {
    console.log("Cadastrar Produto")
    let nome = document.getElementById("nome").value
    let descricao = document.getElementById("descricao").value
    let preco = document.getElementById("preco").value
    let modelo = document.getElementById("modelo").value
    let idCategoria = document.getElementById("categoria").value
    let imagem_url = document.getElementById("imagem_url").value

    let produto = {
        nome: nome,
        descricao: descricao,
        preco: parseFloat(preco),
        modelo: modelo,
        idCategoria: parseInt(idCategoria),
        imagem_url: imagem_url
    }
    const token = sessionStorage.getItem('token')
    fetch("https://backecom-production.up.railway.app/produto", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produto)
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


atualizarProduto.addEventListener("click", () => {
    console.log("Atualizar Produto")
    let id = document.getElementById("codProduto").value
    let nome = document.getElementById("nomes").value
    let descricao = document.getElementById("descricaos").value
    let preco = document.getElementById("precos").value
    let modelo = document.getElementById("modelos").value
    let idCategoria = document.getElementById("categorias").value
    let imagem_url = document.getElementById("imagem_urls").value

    let produto = {
        nome: nome,
        descricao: descricao,
        preco: parseFloat(preco),
        modelo: modelo,
        idCategoria: parseInt(idCategoria),
        imagem_url: imagem_url
    }
    const token = sessionStorage.getItem('token')
    fetch(`https://backecom-production.up.railway.app/produto/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produto)
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

atualizarStatusProduto.addEventListener("click", () => {
    console.log("Atualizar Status Produto")
    let id = document.getElementById("codProdutos").value
    let ativo = document.getElementById("ativo").value

    let produto = {
        ativo: ativo === 'true'
    }
    const token = sessionStorage.getItem('token')
    fetch(`https://backecom-production.up.railway.app/produto/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produto)
    })
    .then(resp => resp.json())
    .then(dados => {
        if (dados.message) {
            resAtulPar.innerHTML = dados.message
        } else if (dados.erro) {
            resAtulPar.innerHTML = dados.erro
        } else {
            resAtulPar.innerHTML = 'Erro desconhecido'
        }
    })
    .catch(err => {
        console.error(err)
        resAtulPar.innerHTML = 'Erro de rede'
    })
})

excluirProduto.addEventListener("click", () => {
    console.log("Excluir Produto")
    let id = document.getElementById("codProdutoss").value
    const token = sessionStorage.getItem('token')
    fetch(`https://backecom-production.up.railway.app/produto/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        if (dados.message) {
            resExc.innerHTML = dados.message
        } else if (dados.erro) {
            resExc.innerHTML = dados.erro
        } else {
            resExc.innerHTML = 'Erro desconhecido'
        }
    })
    .catch(err => {
        console.error(err)
        resExc.innerHTML = 'Erro de rede'
    })
})


onload = () => {
    console.log("Listar Produtos")
    const token = sessionStorage.getItem('token')
    fetch("https://backecom-production.up.railway.app/produto", {
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
}
function criarTabela(dados) {
    console.log(dados)
    let tab = `<thead>
                    <th>Código</th>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Modelo</th>
                    <th>Preço</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Status</th>
               </thead>`
    tab += `<tbody>`
    dados.filter(dad => dad).forEach(dad => {
        tab += `<tr>
                    <td>${dad.codProduto}</td>
                    <td><img src="${dad.imagem_url}" width="100"></td>
                    <td>${dad.nome}</td>
                    <td>${dad.modelo}</td>
                    <td>${dad.preco}</td>
                    <td>${dad.descricao || ''}</td>
                    <td>${dad.idCategoria}</td>
                    <td>${dad.ativo ? 'Ativo' : 'Inativo'}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}
