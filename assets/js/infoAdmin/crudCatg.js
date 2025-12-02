let cadastrarCategoria = document.getElementById("cadastrarCategoria")
let atualizarCategoria = document.getElementById("atualizarCategoria");
let atualizarStatusCategoria = document.getElementById("atualizarStatusCategoria");
let excluirCategoria = document.getElementById("excluirCategoria");

let resCad = document.getElementById("resCad")
let resList = document.getElementById("resList")
let resAtul = document.getElementById("resAtul")
let resAtulPar = document.getElementById("resAtulPar")
let resExc = document.getElementById("resExc")


cadastrarCategoria.addEventListener("click", () => {
    console.log("Cadastrar Categoria")
    let nome = document.getElementById("nome").value
    let descricao = document.getElementById("descricao").value
    
    let categoria = {
        nome: nome,
        descricao: descricao
    }
    
    const token = sessionStorage.getItem('token')
    fetch("https://backecom-production.up.railway.app/categoria", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoria)
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


atualizarCategoria.addEventListener("click", () => {
    console.log("Atualizar Categoria")
    let id = document.getElementById("codCategoria").value
    let nome = document.getElementById("nomes").value
    let descricao = document.getElementById("descricaos").value

    let categoria = {
        nome: nome,
        descricao: descricao
    }

    const token = sessionStorage.getItem('token')
    fetch(`https://backecom-production.up.railway.app/categoria/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoria)
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

atualizarStatusCategoria.addEventListener("click", () => {
    console.log("Atualizar Status Categoria")
    let id = document.getElementById("codCategorias").value
    let is_ativo = document.getElementById("is_ativo").value

    let categoria = {
        is_ativo: is_ativo
    }

    

    const token = sessionStorage.getItem('token')
    fetch(`https://backecom-production.up.railway.app/categoria/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoria)
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

excluirCategoria.addEventListener("click", () => {
    console.log("Excluir Categoria")
    let id = document.getElementById("codCategoriass").value

    const token = sessionStorage.getItem('token')
    fetch(`https://backecom-production.up.railway.app/categoria/${id}`, {
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
    console.log("Listar Categorias")
    const token = sessionStorage.getItem('token')
    fetch("https://backecom-production.up.railway.app/categoria", {
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
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Status</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codCategoria}</td>
                    <td>${dad.nome}</td>
                    <td>${dad.descricao}</td>
                    <td>${dad.is_ativo}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}