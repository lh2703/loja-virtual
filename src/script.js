class Produto {
    constructor(nome, preco, cores, tamanhos, imagem) {
        this.nome = nome;
        this.preco = preco;
        this.cores = cores;
        this.tamanhos = tamanhos;
        this.imagem = imagem;
    }
}

class ItemCarrinho {
    constructor(produto, cor, tamanho) {
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
            this.itens.push(new ItemCarrinho(produto, cor, tamanho));
        }
        this.exibir();
    }

    remover(produto, cor, tamanho) {
        const item = this.itens.find(p =>
            p.produto.nome === produto.nome && p.cor === cor && p.tamanho === tamanho);
        if (item) {
            if (item.quantidade > 1) {
                item.quantidade--;
            } else {
                const index = this.itens.findIndex(p =>
                    p.produto.nome === produto.nome && p.cor === cor && p.tamanho === tamanho);
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
                const p = document.createElement('p');
                p.textContent = `${item.produto.nome} (${item.cor}, Tam: ${item.tamanho}) - R$ ${item.produto.preco.toFixed(2)} x ${item.quantidade}`;

                const btn = document.createElement('button');
                btn.textContent = 'Remover';
                btn.addEventListener('click', () => {
                    this.remover(item.produto, item.cor, item.tamanho);
                });

                p.appendChild(btn);
                carrinhoDiv.appendChild(p);
            });
        }

        document.getElementById('total').innerText = this.calcularTotal().toFixed(2);
    }
}

const produtosDisponiveis = [
    new Produto(
        "Camiseta",
        49.90,
        ["Preto", "Vermelho", "Branco"],
        ["P", "M", "G", "GG"],
        {
            "Preto": "imagens/camisetas/camisaPreta.png",
            "Vermelho": "imagens/camisetas/camisaVermelha.png",
            "Branco": "imagens/camisetas/camisaBranca.png"
        }
    ),
    new Produto(
        "Calça Alfaiataria",
        89.90,
        ["Preto", "Bege", "Cinza"],
        ["40", "42", "44"],
        {
            "Preto": "imagens/calca/calcaPreta.png",
            "Bege": "imagens/calca/calcaBege.png",
            "Cinza": "imagens/calca/calcaCinza.png"
        }
        
    ),
    new Produto(
        "Jaqueta Jeans",
        199.90,
        ["Jeans Claro"],
        ["P", "M", "G", "GG"],
        {
            "Jeans Claro": "imagens/jaquetas/jaquetaClara.png",
        }
    ),
    new Produto(
        "Vestido",
        149.90,
        ["Preto", "Marrom", "Verde"],
        ["P", "M", "G", "GG"],
        {
            "Verde": "imagens/vestidos/vestidoVerde.png",
            "Marrom": "imagens/vestidos/vestidoMarrom.png",
            "Preto": "imagens/vestidos/vestidoPreto.png"
        }
    ),
    new Produto(
        "Boné",
        29.90,
        ["Preto", "Branco", "Cinza", "Bege"],
        ["Único"],
        "imagens/bone.png"
    )
];

const carrinho = new Carrinho();

function listarProdutos() {
    const container = document.getElementById('produtos');
    container.innerHTML = '';

    produtosDisponiveis.forEach(produto => {
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

        if (typeof produto.imagem === 'object') {
            selectCor.addEventListener('change', () => {
                const corSelecionada = selectCor.value;
                img.src = produto.imagem[corSelecionada];
            });
        }

        const botao = div.querySelector('button');
        botao.addEventListener('click', () => {
            const corSelecionada = selectCor.value;
            const tamanhoSelecionado = div.querySelector('.tamanho').value;
            carrinho.adicionar(produto, corSelecionada, tamanhoSelecionado);
        });

        container.appendChild(div);
    });
}

listarProdutos();
