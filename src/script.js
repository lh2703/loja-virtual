class Produto {
    constructor(nome, preco) {
        this.nome = nome;
        this.preco = preco;
    }
}

class Carrinho {
    constructor() {
        this.itens = [];
    }

    adicionar(produto) {
        const itemExistente = this.itens.find(p => p.produto.nome === produto.nome);
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            this.itens.push({ produto, quantidade: 1 });
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
                        ${item.produto.nome} - R$ ${item.produto.preco.toFixed(2)} x ${item.quantidade}
                        <button onclick="carrinho.remover(produtosDisponiveis.find(p => p.nome === '${item.produto.nome}'))">Remover</button>
                    </p>
                `;
            });
        }

        document.getElementById('total').innerText = this.calcularTotal().toFixed(2);
    }
}

const produtosDisponiveis = [
    new Produto("Camiseta", 49.90),
    new Produto("Calça Jeans", 89.90),
    new Produto("Jaqueta", 199.90),
    new Produto("Vestido", 149.90),
    new Produto("Boné", 29.90)
];

const carrinho = new Carrinho();

function listarProdutos() {
    const container = document.getElementById('produtos');
    produtosDisponiveis.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <button>Adicionar ao Carrinho</button>
        `;

        const botoes = div.querySelectorAll('button');
        botoes[0].addEventListener('click', () => {
            carrinho.adicionar(produto);
        });

        container.appendChild(div);
    });
}

listarProdutos();
