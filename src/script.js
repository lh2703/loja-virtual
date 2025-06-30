class Produto {
    constructor(nome, preco, cores, tamanhos) {
        this.nome = nome;
        this.preco = preco;
        this.cores = cores;
        this.tamanhos = tamanhos;
    }
}

class ItemCarrinho{
    constructor(produto, cor, tamanho){
        this.produto = produto;
        this.cor = cor;
        this.tamanho = tamanho;
        this.quantidade = 1;
    }
}


class Carrinho {
    constructor() {
        this.itens = [];
    }

    adicionar(produto, cor, tamanho) {
        const itemExistente = this.itens.find(p => 
            p.produto.nome === produto.nome && p.cor === cor && p.tamanho === tamanho);
        
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            this.itens.push(new ItemCarrinho (produto, cor, tamanho));
        }
        this.exibir();
    }

    remover(produto) {
        const item = this.itens.find(p => p.produto.nome === produto.nome);
        if (item) {
            if (item.quantidade > 1) {
                item.quantidade--;
            } else {
                const index = this.itens.findIndex(p => p.produto.nome === produto.nome);
                this.itens.splice(index, 1);
            }
            this.exibir();
        }
    }

    calcularTotal() {
        return this.itens.reduce((total, item) => {
            return total + (item.produto.preco * item.quantidade);
        }, 0);
    }

    exibir() {
    const carrinhoDiv = document.getElementById('carrinho');
    carrinhoDiv.innerHTML = '';

    if (this.itens.length === 0) {
        carrinhoDiv.innerHTML = '<p>Carrinho vazio.</p>';
    } else {
        this.itens.forEach(item => {
            carrinhoDiv.innerHTML += `
                <p>
                    ${item.produto.nome} (${item.produto.cor}, Tam: ${item.produto.tamanho}) 
                    - R$ ${item.produto.preco.toFixed(2)} x ${item.quantidade}
                    <button onclick="carrinho.remover(produtosDisponiveis.find(p => p.nome === '${item.produto.nome}'))">Remover</button>
                </p>
            `;
        });
    }

    document.getElementById('total').innerText = this.calcularTotal().toFixed(2);
}

}

const produtosDisponiveis = [
    new Produto("Camiseta", 49.90, ["Azul", "Preto", "Rosa", "Branco"], ["P", "M", "G", "GG"]),
    new Produto("Calça Jeans", 89.90, ["Azul", "Preto", "Cinza"], ["40", "42", "44"]),
    new Produto("Jaqueta", 199.90, ["Preto", "Marrom", "Vermelho"], ["P", "M", "G", "GG"]),
    new Produto("Vestido", 149.90, ["Verde", "Branco", "Azul", "Roxo"], ["P", "M", "G", "GG"]),
    new Produto("Boné", 29.90, ["Preto", "Branco", "Cinza", "Bege"], ["Único"])
];

const carrinho = new Carrinho();

function listarProdutos() {
    const container = document.getElementById('produtos');
    container.innerHTML = '';

    produtosDisponiveis.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto';

        let opcoesCores = '';
        produto.cores.forEach(cor =>{
            opcoesCores += `<option value="${cor}">${cor}</option>`;
        });

        let opcoesTamanhos = '';
        produto.tamanhos.forEach(tam =>{
            opcoesTamanhos += `<option value="${tam}">${tam}</option>`;
        });

        div.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <label>Cor:
                <select class="cor">${opcoesCores}</select>
            </label>
            <label>Tamanho:
                <select class="tamanho">${opcoesTamanhos}</select>
            </label>
            <button>Adicionar ao Carrinho</button>
        `;

        const botao = div.querySelector('button');
        botao.addEventListener('click', () => {
            const corSelecionada = div.querySelector('.cor').value;
            const tamanhoSelecionado = div.querySelector('.tamanho').value;
            carrinho.adicionar(produto, corSelecionada, tamanhoSelecionado);
        });


        container.appendChild(div);
    });
}

listarProdutos();
