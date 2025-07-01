let categoriaAtual = null;
class ProdutoBase {
    constructor(nome, categoria, preco) {
        this._nome = nome;
        this._categoria = categoria;
        this._preco = preco;
    }

    get nome() {
        return this._nome;
    }
    get categoria() {
        return this._categoria;
    }
    get preco() {
        return this._preco;
    }
}

class Produto extends ProdutoBase {
    constructor(nome, categoria, preco, cores, tamanhos, imagem) {
        super(nome, categoria, preco);
        this._cores = cores;
        this._tamanhos = tamanhos;
        this._imagem = imagem;
    }

    get cores() {
        return this._cores;
    }
    get tamanhos() {
        return this._tamanhos;
    }
    get imagem() {
        return this._imagem;
    }
}

// itens dentro do carrinho
class ItemCarrinho {
    constructor(produto, cor, tamanho) {
        this._produto = produto;
        this._cor = cor;
        this._tamanho = tamanho;
        this._quantidade = 1;
    }

    get produto() {
        return this._produto;
    }
    get cor() {
        return this._cor;
    }
    get tamanho() {
        return this._tamanho;
    }
    get quantidade() {
        return this._quantidade;
    }

    incrementar() {
        this._quantidade++;
    }

    decrementar() {
        if (this._quantidade > 0) {
            this._quantidade--;
        }
    }
}

// carrinho de compras com suas funcionalidades
class Carrinho {
    constructor() {
        this._itens = [];
    }

    get itens() {
        return this._itens;
    }

    adicionar(produto, cor, tamanho) {
        const itemExiste = this._itens.find(p =>
            p.produto.nome === produto.nome && p.cor === cor && p.tamanho === tamanho
        );

        if (itemExiste) {
            itemExiste.incrementar();
        } else {
            this._itens.push(new ItemCarrinho(produto, cor, tamanho));
        }
    }

    remover(produto, cor, tamanho) {
        const item = this._itens.find(p =>
            p.produto.nome === produto.nome && p.cor === cor && p.tamanho === tamanho
        );

        if (item) {
            item.decrementar();
            if (item.quantidade === 0) {
                const index = this._itens.indexOf(item);
                this._itens.splice(index, 1);
            }
        }
    }

    calcularTotal() {
        return this._itens.reduce((total, item) => {
            return total + (item.produto.preco * item.quantidade);
        }, 0);
    }
}

class CarrinhoView {
    constructor(carrinho, containerId, totalId) {
        this.carrinho = carrinho;
        this.container = document.getElementById(containerId);
        this.total = document.getElementById(totalId);
    }

    atualizar() {
        this.container.innerHTML = '';

        if (this.carrinho.itens.length === 0) {
            this.container.innerHTML = '<p>Carrinho vazio.</p>';
        } else {
            this.carrinho.itens.forEach(item => {
                const div = document.createElement('div');
                div.className = 'item-carrinho';

                const img = document.createElement('img');
                img.src = typeof item.produto.imagem === 'object'
                    ? item.produto.imagem[item.cor]
                    : item.produto.imagem;

                const details = document.createElement('div');
                details.className = 'item-carrinho-details';
                details.innerHTML = `
                    <strong>${item.produto.nome}</strong><br>
                    Cor: ${item.cor}<br>
                    Tam: ${item.tamanho}<br>
                    Qtde: ${item.quantidade}
                `;

                const btn = document.createElement('button');
                btn.textContent = '✖';
                btn.onclick = () => {
                    this.carrinho.remover(item.produto, item.cor, item.tamanho);
                    estoque.adicionarProduto(item.produto, 1);
                    this.atualizar();
                    listarProdutos();
                };

                div.appendChild(img);
                div.appendChild(details);
                div.appendChild(btn);

                this.container.appendChild(div);
            });
        }

        this.total.innerText = this.carrinho.calcularTotal().toFixed(2);
    }
}

class EstoqueProdutos {
    constructor() {
        this._produtos = new Map();
    }

    adicionarProduto(produto, quantidade) {
        const atual = this.getQuantidade(produto);
        this._produtos.set(produto, atual + quantidade);
    }

    getQuantidade(produto) {
        return this._produtos.get(produto) || 0;
    }

    reduzirEstoque(produto, quantidade) {
        const atual = this.getQuantidade(produto);
        if (quantidade > atual) return false;
        this._produtos.set(produto, atual - quantidade);
        return true;
    }

    estaEsgotado(produto) {
        return this.getQuantidade(produto) <= 0;
    }
}

// lista de produtos instanciados usando a classe Produto, herdada de ProdutoBase
let produtosDisponiveis = [];

const estoque = new EstoqueProdutos();
const carrinho = new Carrinho();
const carrinhoView = new CarrinhoView(carrinho, 'itens-carrinho', 'total');

fetch('produtos.json')
    .then(res => res.json())
    .then(dados => {
        produtosDisponiveis = dados.map(p =>
            new Produto(p.nome, p.categoria, p.preco, p.cores, p.tamanhos, p.imagem)
        );

        produtosDisponiveis.forEach(prod => estoque.adicionarProduto(prod, 10));

        listarProdutos();
    })
    .catch(erro => console.error("Erro ao carregar produtos:", erro));

function listarProdutos(lista = produtosDisponiveis) {
    const container = document.getElementById('produtos');
    container.innerHTML = '';

    lista.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto';

        let opcoesCores = '';
        produto.cores.forEach(cor => {
            opcoesCores += `<option value="${cor}">${cor}</option>`;
        });

        let opcoesTamanhos = '';
        produto.tamanhos.forEach(tam => {
            opcoesTamanhos += `<option value="${tam}">${tam}</option>`;
        });

        let imagemInicial = '';
        if (typeof produto.imagem === 'object') {
            imagemInicial = produto.imagem[produto.cores[0]];
        } else {
            imagemInicial = produto.imagem;
        }

        div.innerHTML = `
            <h3>${produto.nome}</h3>
            <img src="${imagemInicial}" alt="${produto.nome}" style="width:150px;height:auto;" class="imagem-produto" />
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <label>Cor:
                <select class="cor">${opcoesCores}</select>
            </label>
            <label>Tamanho:
                <select class="tamanho">${opcoesTamanhos}</select>
            </label>
            <button>Adicionar ao Carrinho</button>
        `;

        const selectCor = div.querySelector('.cor');
        const img = div.querySelector('.imagem-produto');
        const botao = div.querySelector('button');

        if (typeof produto.imagem === 'object') {
            selectCor.addEventListener('change', () => {
                const corSelecionada = selectCor.value;
                img.src = produto.imagem[corSelecionada];
            });
        }

        if (estoque.estaEsgotado(produto)) {
            div.classList.add('esgotado');
            botao.disabled = true;
            botao.textContent = 'Esgotado';
        } else {
            botao.addEventListener('click', () => {
                const corSelecionada = selectCor.value;
                const tamanhoSelecionado = div.querySelector('.tamanho').value;

                if (estoque.getQuantidade(produto) > 0) {
                    carrinho.adicionar(produto, corSelecionada, tamanhoSelecionado);
                    estoque.reduzirEstoque(produto, 1);
                    carrinhoView.atualizar();

                    if (estoque.estaEsgotado(produto)) {
                        botao.disabled = true;
                        botao.textContent = 'Esgotado';
                        div.classList.add('esgotado');
                    }
                } else {
                    alert("Produto esgotado!");
                    botao.disabled = true;
                    botao.textContent = 'Esgotado';
                    div.classList.add('esgotado');
                }
            });
        }

        container.appendChild(div);
    });
}


function filtrarPorCategoria(categoria) {
    const filtrados = produtosDisponiveis.filter(p => p.categoria === categoria);
    listarProdutos(filtrados);
}

listarProdutos();
