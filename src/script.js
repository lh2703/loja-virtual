// Classe base com propriedades comuns a todos os tipos de produtos
class ProdutoBase {
    constructor(nome, categoria, preco) {
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
    }
}

// Subclasse específica para produtos com variação de cor, tamanho e imagem
class Produto extends ProdutoBase {
    constructor(nome, categoria, preco, cores, tamanhos, imagem) {
        super(nome, categoria, preco);
        this.cores = cores;
        this.tamanhos = tamanhos;
        this.imagem = imagem;
    }
}

// Representa um item dentro do carrinho
class ItemCarrinho {
    constructor(produto, cor, tamanho) {
        this.produto = produto;
        this.cor = cor;
        this.tamanho = tamanho;
        this.quantidade = 1;
    }
}

// Carrinho de compras com funcionalidades básicas
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
    const carrinhoDiv = document.getElementById('itens-carrinho');
    carrinhoDiv.innerHTML = '';

    if (this.itens.length === 0) {
        carrinhoDiv.innerHTML = '<p>Carrinho vazio.</p>';
    } else {
        this.itens.forEach(item => {
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
            btn.onclick = () => this.remover(item.produto, item.cor, item.tamanho);

            div.appendChild(img);
            div.appendChild(details);
            div.appendChild(btn);

            carrinhoDiv.appendChild(div);
        });
    }

    document.getElementById('total').innerText = this.calcularTotal().toFixed(2);
}

}

// Lista de produtos instanciados usando a classe Produto (herda de ProdutoBase)
const produtosDisponiveis = [
    new Produto("Camiseta Mas", "Camisetas", 49.90,
        ["Preto", "Vermelho", "Branco"],
        ["P", "M", "G", "GG"],
        {
            "Preto": "imagens/camisetas/camiseta masculina/camisaPreta.png",
            "Vermelho": "imagens/camisetas/camiseta masculina/camisaVermelha.png",
            "Branco": "imagens/camisetas/camiseta masculina/camisaBranca.png"
        }
    ),
    new Produto("Camiseta Fem", "Camisetas", 49.90,
        ["Bege", "Azul", "Branco"],
        ["P", "M", "G", "GG"],
        {
            "Bege": "imagens/camisetas/camiseta feminina/camisaBege.png",
            "Azul": "imagens/camisetas/camiseta feminina/camisaAzul.png",
            "Branco": "imagens/camisetas/camiseta feminina/camisaBranca.png"
        }
    ),
    new Produto("Regata Fem", "Camisetas", 49.90,
        ["Preto", "Marrom", "Branco"],
        ["P", "M", "G", "GG"],
        {
            "Preto": "imagens/camisetas/regata feminina/regataPreta.png",
            "Marrom": "imagens/camisetas/regata feminina/regataMarrom.png",
            "Branco": "imagens/camisetas/regata feminina/regataBranca.png"
        }
    ),
    new Produto("Calça Alfaiataria", "Calças", 89.90,
        ["Preto", "Bege", "Cinza"],
        ["40", "42", "44"],
        {
            "Preto": "imagens/calca/calcaPreta.png",
            "Bege": "imagens/calca/calcaBege.png",
            "Cinza": "imagens/calca/calcaCinza.png"
        }
    ),
    new Produto("Jaqueta Jeans", "Jaquetas", 199.90,
        ["Jeans Claro"],
        ["P", "M", "G", "GG"],
        {
            "Jeans Claro": "imagens/jaquetas/jaquetaClara.png"
        }
    ),
    new Produto("Vestido Curto", "Vestidos", 149.90,
        ["Preto", "Marrom", "Verde"],
        ["P", "M", "G", "GG"],
        {
            "Verde": "imagens/vestidos/vestidoVerde.png",
            "Marrom": "imagens/vestidos/vestidoMarrom.png",
            "Preto": "imagens/vestidos/vestidoPreto.png"
        }
    ),
    new Produto("Vestido Listrado", "Vestidos", 99.90,
        ["Branco", "Preto e Branco"],
        ["P", "M", "G", "GG"],
        {
            "Branco": "imagens/vestidos/listadoBranco.png",
            "Preto e Branco": "imagens/vestidos/listradoBranco.png"
        }
    ),
    new Produto("Vestido Longo", "Vestidos", 99.90,
        ["Bege", "Marrom", "Cinza"],
        ["P", "M", "G", "GG"],
        {
            "Bege": "imagens/vestidos/longoBege.png",
            "Marrom": "imagens/vestidos/longoPreto.png",
            "Cinza": "imagens/vestidos/longoCinza.png"
        }
    ),
    new Produto("Boné", "Bonés", 29.90,
        ["Preto", "Branco", "Cinza", "Bege"],
        ["Único"],
        "imagens/bone.png"
    )
];

const carrinho = new Carrinho();

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

function filtrarPorCategoria(categoria) {
    const filtrados = produtosDisponiveis.filter(p => p.categoria === categoria);
    listarProdutos(filtrados);
}

listarProdutos();
