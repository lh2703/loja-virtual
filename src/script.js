let categoriaAtual = null;

class ProdutoBase {
  constructor(nome, categoria, preco) {
    this._nome = nome;
    this._categoria = categoria;
    this._preco = preco;
  }
  get nome() { return this._nome; }
  get categoria() { return this._categoria; }
  get preco() { return this._preco; }
}

class Produto extends ProdutoBase {
  constructor(nome, categoria, preco, cores, tamanhos, imagem) {
    super(nome, categoria, preco);
    this._cores = cores;
    this._tamanhos = tamanhos;
    this._imagem = imagem;
  }
  get cores() { return this._cores; }
  get tamanhos() { return this._tamanhos; }
  get imagem() { return this._imagem; }
}

class ItemCarrinho {
  constructor(produto, cor, tamanho) {
    this._produto = produto;
    this._cor = cor;
    this._tamanho = tamanho;
    this._quantidade = 1;
  }
  get produto() { return this._produto; }
  get cor() { return this._cor; }
  get tamanho() { return this._tamanho; }
  get quantidade() { return this._quantidade; }
  incrementar() { this._quantidade++; }
  decrementar() { if (this._quantidade > 0) this._quantidade--; }
}

class Carrinho {
  constructor() {
    this._itens = [];
  }
  get itens() { return this._itens; }

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
    return this._itens.reduce((total, item) =>
      total + (item.produto.preco * item.quantidade), 0);
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
          estoque.adicionarProduto(item.produto, item.cor, item.tamanho, 1);
          this.carrinho.remover(item.produto, item.cor, item.tamanho);
          this.atualizar();

          if (categoriaAtual) {
            filtrarPorCategoria(categoriaAtual);
          } else {
            listarProdutos();
          }
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
    this._estoque = new Map();
  }

  _getKey(produto, cor, tamanho) {
    return `${produto.nome}_${cor}_${tamanho}`;
  }

  adicionarProduto(produto, cor, tamanho, quantidade) {
    const key = this._getKey(produto, cor, tamanho);
    const atual = this._estoque.get(key) || 0;
    this._estoque.set(key, atual + quantidade);
  }

  getQuantidade(produto, cor, tamanho) {
    const key = this._getKey(produto, cor, tamanho);
    return this._estoque.get(key) || 0;
  }

  reduzirEstoque(produto, cor, tamanho, quantidade) {
    const key = this._getKey(produto, cor, tamanho);
    const atual = this.getQuantidade(produto, cor, tamanho);
    if (quantidade > atual) return false;
    this._estoque.set(key, atual - quantidade);
    return true;
  }

  estaEsgotado(produto, cor, tamanho) {
    return this.getQuantidade(produto, cor, tamanho) <= 0;
  }
}

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
    produtosDisponiveis.forEach(prod => {
      prod.cores.forEach(cor => {
        prod.tamanhos.forEach(tam => {
          estoque.adicionarProduto(prod, cor, tam, 5); // inicial
        });
      });
    });
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

    let imagemInicial = typeof produto.imagem === 'object'
      ? produto.imagem[produto.cores[0]]
      : produto.imagem;

    div.innerHTML = `
      <h3>${produto.nome}</h3>
      <img src="${imagemInicial}" class="imagem-produto" />
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <label>Cor:<select class="cor">${opcoesCores}</select></label>
      <label>Tamanho:<select class="tamanho">${opcoesTamanhos}</select></label>
      <button>Adicionar ao Carrinho</button>
    `;

    const selectCor = div.querySelector('.cor');
    const selectTam = div.querySelector('.tamanho');
    const img = div.querySelector('.imagem-produto');
    const botao = div.querySelector('button');

    const atualizarEstadoBotao = () => {
      const cor = selectCor.value;
      const tam = selectTam.value;

      if (estoque.estaEsgotado(produto, cor, tam)) {
        botao.disabled = true;
        botao.textContent = 'Esgotado';
        div.classList.add('esgotado');
      } else {
        botao.disabled = false;
        botao.textContent = 'Adicionar ao Carrinho';
        div.classList.remove('esgotado');
      }

      if (typeof produto.imagem === 'object') {
        img.src = produto.imagem[cor];
      }
    };

    selectCor.addEventListener('change', atualizarEstadoBotao);
    selectTam.addEventListener('change', atualizarEstadoBotao);
    atualizarEstadoBotao();

    botao.addEventListener('click', () => {
      const cor = selectCor.value;
      const tam = selectTam.value;

      if (estoque.getQuantidade(produto, cor, tam) > 0) {
        carrinho.adicionar(produto, cor, tam);
        estoque.reduzirEstoque(produto, cor, tam, 1);
        carrinhoView.atualizar();
        atualizarEstadoBotao();
      } else {
        alert("Produto esgotado!");
        atualizarEstadoBotao();
      }
    });

    container.appendChild(div);
  });
}

document.getElementById('finalizar').addEventListener('click', () => {
  if (carrinho.itens.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  carrinho._itens = [];
  carrinhoView.atualizar();
  categoriaAtual ? filtrarPorCategoria(categoriaAtual) : listarProdutos();
  alert('Compra finalizada com sucesso! 🎉');
});

function mostrarTodos() {
  categoriaAtual = null;
  listarProdutos();
}

function filtrarPorCategoria(categoria) {
  categoriaAtual = categoria;
  listarProdutos(produtosDisponiveis.filter(p => p.categoria === categoria));
}

listarProdutos();
