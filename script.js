/* =========================================
   BURGER 301 POEMA
   SISTEMA DE PEDIDOS - VERSÃO 2
========================================= */

let carrinho = [];
let produtoAtual = null;
let quantidadeAtual = 1;


/* =========================================
   ELEMENTOS
========================================= */

const modal = document.getElementById("modal-produto");
const fecharModal = document.getElementById("fechar-modal");

const modalNomeProduto =
    document.getElementById("modal-nome-produto");

const modalDescricaoProduto =
    document.getElementById("modal-descricao-produto");

const modalPrecoProduto =
    document.getElementById("modal-preco-produto");

const modalTotal =
    document.getElementById("modal-total");

const quantidadeProduto =
    document.getElementById("quantidade-produto");

const diminuirQuantidade =
    document.getElementById("diminuir-quantidade");

const aumentarQuantidade =
    document.getElementById("aumentar-quantidade");

const adicionarCarrinhoModal =
    document.getElementById("adicionar-carrinho-modal");

const itensCarrinho =
    document.getElementById("itens-carrinho");

const quantidadeCarrinho =
    document.getElementById("quantidade-carrinho");

const valorTotal =
    document.getElementById("valor-total");

const finalizarPedido =
    document.getElementById("finalizar-pedido");

const continuarComprando =
    document.getElementById("continuar-comprando");

const carrinhoFlutuante =
    document.getElementById("carrinho-flutuante");

const abrirCarrinho =
    document.getElementById("abrir-carrinho");

const fecharCarrinho =
    document.getElementById("fechar-carrinho");

const resumoCarrinho =
    document.getElementById("resumo-carrinho");

const formularioPedido =
    document.getElementById("formulario-pedido");

const painelCarrinho = document.getElementById("carrinho");


/* =========================================
   FORMATA MOEDA
========================================= */

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


/* =========================================
   DESCRIÇÕES
========================================= */

const descricoes = {

    "Poema Kids":
        "Uma opção especial para quem prefere um hambúrguer menor.",

    "Smash 301":
        "Hambúrguer no estilo smash, preparado com carne bovina e ingredientes selecionados.",

    "Clássico da Casa":
        "Uma combinação clássica da Burger 301 para quem gosta de um hambúrguer tradicional.",

    "Du'Chef":
        "Pão brioche selado na manteiga, blend bovino de 150g, queijo cheddar, cebola caramelizada, bacon e maionese da casa.",

    "Poema Tropical":
        "Uma opção especial da casa com uma combinação de sabores tropicais.",

    "Porção de Fritas":
        "Porção de batatas fritas.",

    "Porção de Onion Rings":
        "Anéis de cebola empanados e crocantes.",

    "Fritas Feliz":
        "Porção especial de fritas."

};


/* =========================================
   ABRIR MODAL
========================================= */

const botoesAdicionar =
    document.querySelectorAll(".botao-adicionar");


botoesAdicionar.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const nome =
            botao.dataset.produto;

        const preco =
            parseFloat(botao.dataset.preco);


        produtoAtual = {
            nome: nome,
            preco: preco
        };


        quantidadeAtual = 1;


        modalNomeProduto.textContent =
            nome;

        modalDescricaoProduto.textContent =
            descricoes[nome] || "";

        modalPrecoProduto.textContent =
            formatarMoeda(preco);

        quantidadeProduto.textContent =
            quantidadeAtual;


        // Limpa adicionais
        document
            .querySelectorAll(
                '#modal-produto input[name="adicional"]'
            )
            .forEach(function (checkbox) {

                checkbox.checked = false;

            });


        atualizarTotalModal();


        modal.classList.add("ativo");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

    });

});


/* =========================================
   FECHAR MODAL
========================================= */

fecharModal.addEventListener(
    "click",
    fecharModalProduto
);


function fecharModalProduto() {

    modal.classList.remove("ativo");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    produtoAtual = null;

}


/* =========================================
   CLICAR FORA DO MODAL
========================================= */

modal.addEventListener("click", function (evento) {

    if (evento.target === modal) {

        fecharModalProduto();

    }

});


/* =========================================
   QUANTIDADE +
========================================= */

aumentarQuantidade.addEventListener(
    "click",
    function () {

        quantidadeAtual++;

        quantidadeProduto.textContent =
            quantidadeAtual;

        atualizarTotalModal();

    }
);


/* =========================================
   QUANTIDADE -
========================================= */

diminuirQuantidade.addEventListener(
    "click",
    function () {

        if (quantidadeAtual > 1) {

            quantidadeAtual--;

            quantidadeProduto.textContent =
                quantidadeAtual;

            atualizarTotalModal();

        }

    }
);


/* =========================================
   ADICIONAIS SELECIONADOS
========================================= */

function obterAdicionaisSelecionados() {

    const adicionais = [];


    document
        .querySelectorAll(
            '#modal-produto input[name="adicional"]:checked'
        )
        .forEach(function (checkbox) {

            adicionais.push({

                nome: checkbox.value,

                preco:
                    parseFloat(
                        checkbox.dataset.preco
                    )

            });

        });


    return adicionais;

}


/* =========================================
   TOTAL DO PRODUTO
========================================= */

function calcularTotalProduto() {

    if (!produtoAtual) {

        return 0;

    }


    let adicionaisTotal = 0;


    obterAdicionaisSelecionados()
        .forEach(function (adicional) {

            adicionaisTotal +=
                adicional.preco;

        });


    return (
        produtoAtual.preco +
        adicionaisTotal
    ) * quantidadeAtual;

}


/* =========================================
   ATUALIZA TOTAL DO MODAL
========================================= */

function atualizarTotalModal() {

    modalTotal.textContent =
        formatarMoeda(
            calcularTotalProduto()
        );

}


/* =========================================
   ALTERAÇÃO DOS ADICIONAIS
========================================= */

document
    .querySelectorAll(
        '#modal-produto input[name="adicional"]'
    )
    .forEach(function (checkbox) {

        checkbox.addEventListener(
            "change",
            atualizarTotalModal
        );

    });


/* =========================================
   ADICIONAR AO CARRINHO
========================================= */

adicionarCarrinhoModal.addEventListener(
    "click",
    function () {

        if (!produtoAtual) {

            return;

        }


        const adicionais =
            obterAdicionaisSelecionados();


        let adicionaisTotal = 0;


        adicionais.forEach(
            function (adicional) {

                adicionaisTotal +=
                    adicional.preco;

            }
        );


        const valorUnitario =
            produtoAtual.preco +
            adicionaisTotal;


        const novoItem = {

            id: Date.now(),

            nome:
                produtoAtual.nome,

            precoBase:
                produtoAtual.preco,

            quantidade:
                quantidadeAtual,

            adicionais:
                adicionais,

            valorUnitario:
                valorUnitario

        };


        carrinho.push(novoItem);


        atualizarCarrinho();


        fecharModalProduto();


        mostrarMensagem(
            `${quantidadeAtual}x ${produtoAtual?.nome || "Produto"} adicionado ao pedido!`
        );


        // Mantém o usuário no mesmo ponto da página.

    }
);


/* =========================================
   ATUALIZA CARRINHO
========================================= */

function atualizarCarrinho() {

    itensCarrinho.innerHTML = "";


    if (carrinho.length === 0) {

        itensCarrinho.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        quantidadeCarrinho.textContent =
            "0 itens";

        valorTotal.textContent =
            formatarMoeda(0);

        resumoCarrinho.textContent =
            "0 itens • R$ 0,00";

        finalizarPedido.disabled = true;

        carrinhoFlutuante.classList.remove(
            "visivel"
        );

        return;

    }


    let total = 0;
    let quantidadeItens = 0;


    carrinho.forEach(function (item) {

        const subtotal =
            item.valorUnitario *
            item.quantidade;


        total += subtotal;

        quantidadeItens +=
            item.quantidade;


        const divItem =
            document.createElement("div");


        divItem.className =
            "item-carrinho";


        let adicionaisHTML = "";


        if (item.adicionais.length > 0) {

            adicionaisHTML = `
                <div class="item-adicionais">

                    ${item.adicionais
                        .map(function (adicional) {

                            return `
                                <span>
                                    + ${adicional.nome}
                                </span>
                            `;

                        })
                        .join("")}

                </div>
            `;

        }


        divItem.innerHTML = `

            <div class="item-carrinho-info">

                <h3>
                    ${item.quantidade}x ${item.nome}
                </h3>

                ${adicionaisHTML}

                <p>
                    ${formatarMoeda(item.valorUnitario)}
                    cada
                </p>

            </div>


            <div class="item-carrinho-acoes">

                <strong>
                    ${formatarMoeda(subtotal)}
                </strong>

                <button
                    type="button"
                    class="botao-remover"
                    data-id="${item.id}">

                    Remover

                </button>

            </div>

        `;


        itensCarrinho.appendChild(
            divItem
        );

    });


    quantidadeCarrinho.textContent =
        quantidadeItens +
        (
            quantidadeItens === 1
                ? " item"
                : " itens"
        );


    valorTotal.textContent =
        formatarMoeda(total);


    resumoCarrinho.textContent =
        `${quantidadeItens} ${
            quantidadeItens === 1
                ? "item"
                : "itens"
        } • ${formatarMoeda(total)}`;


    finalizarPedido.disabled = false;


    // Mostra a barra flutuante
    carrinhoFlutuante.classList.add(
        "visivel"
    );


    configurarBotoesRemover();

}


/* =========================================
   REMOVER ITEM
========================================= */

function configurarBotoesRemover() {

    document
        .querySelectorAll(
            ".botao-remover"
        )
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            botao.dataset.id
                        );


                    carrinho =
                        carrinho.filter(
                            function (item) {

                                return (
                                    item.id !== id
                                );

                            }
                        );


                    atualizarCarrinho();

                }
            );

        });

}


/* =========================================
   ABRIR CARRINHO
========================================= */

abrirCarrinho.addEventListener("click", function() {
  painelCarrinho.classList.add("aberto");
});

fecharCarrinho.addEventListener("click", function() {
  painelCarrinho.classList.remove("aberto");
});


/* =========================================
   CONTINUAR COMPRANDO
========================================= */

continuarComprando.addEventListener("click", function() {
  painelCarrinho.classList.remove("aberto");
});


/* =========================================
   FINALIZAR PEDIDO
========================================= */

finalizarPedido.addEventListener("click", function() {
  if (carrinho.length === 0) return;

  painelCarrinho.classList.remove("aberto");

  document.getElementById("dados-pedido").scrollIntoView({
    behavior: "smooth"
  });
});


/* =========================================
   MENSAGEM
========================================= */

function mostrarMensagem(texto) {

    const mensagem =
        document.createElement("div");


    mensagem.className =
        "mensagem-sucesso";


    mensagem.textContent =
        texto;


    document.body.appendChild(
        mensagem
    );


    setTimeout(function () {

        mensagem.remove();

    }, 2200);

}


/* =========================================
   FORMULÁRIO
========================================= */

formularioPedido.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        if (carrinho.length === 0) {

            alert(
                "Adicione pelo menos um produto ao pedido."
            );

            return;

        }


        const nome =
            document
                .getElementById("nome")
                .value
                .trim();


        const torre =
            document
                .getElementById("torre")
                .value
                .trim();


        const apartamento =
            document
                .getElementById("apartamento")
                .value
                .trim();


        const observacao =
            document
                .getElementById("observacao")
                .value
                .trim();


        const pagamentoSelecionado =
            document.querySelector(
                'input[name="pagamento"]:checked'
            );


        if (
            !nome ||
            !torre ||
            !apartamento
        ) {

            alert(
                "Preencha seu nome, torre e apartamento."
            );

            return;

        }


        if (!pagamentoSelecionado) {

            alert(
                "Escolha uma forma de pagamento."
            );

            return;

        }


        const pagamento =
            pagamentoSelecionado.value;


        /* =====================================
           MENSAGEM WHATSAPP
        ===================================== */

        let mensagem =
            "🍔 *NOVO PEDIDO - BURGER 301 POEMA*\n\n";


    
        mensagem +=
            `Nome: ${nome}\n`;

        mensagem +=
            `Torre: ${torre}\n`;

        mensagem +=
            `Apartamento: ${apartamento}\n\n`;


        mensagem +=
            "*PEDIDO*\n\n";


        let totalPedido = 0;


        carrinho.forEach(function (item) {

            const subtotal =
                item.valorUnitario *
                item.quantidade;


            totalPedido +=
                subtotal;


            mensagem +=
                `${item.quantidade}x ${item.nome} - ${formatarMoeda(subtotal)}\n`;


            if (
                item.adicionais.length > 0
            ) {

                item.adicionais.forEach(
                    function (adicional) {

                        mensagem +=
                            `   + ${adicional.nome}\n`;

                    }
                );

            }


            mensagem += "\n";

        });


        mensagem +=
            `*TOTAL: ${formatarMoeda(totalPedido)}*\n\n`;


        mensagem +=
            `*PAGAMENTO:* ${pagamento}\n`;


        if (observacao) {

            mensagem +=
                "\n*OBSERVAÇÃO:*\n";

            mensagem +=
                `${observacao}\n`;

        }




        mensagem +=
            "\n_Pedido realizado pelo site._";


        /*
            SUBSTITUIR PELO WHATSAPP REAL
        */

        const telefone =
            "5551981061618";


        const url =
            `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;


        window.open(
            url,
            "_blank"
        );

    }
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

atualizarCarrinho();