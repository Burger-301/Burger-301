/* =========================================
   BURGER 301 - SISTEMA DE PEDIDOS
========================================= */

let carrinho = [];
let produtoAtual = null;
let quantidadeAtual = 1;

/* =========================================
   CONTROLE RÁPIDO DE ESTOQUE / ESGOTADOS
   
   COMO USAR:
   - Para MARCAR como esgotado: remova as // do início do nome.
   - Para MARCAR como disponível: coloque as // no início do nome.
========================================= */

// 1. LISTA DE PRODUTOS (Hambúrgueres e Porções)
const produtosEsgotados = [
    // "Poema Kids",
     "Smash 301",
    // "Clássico da Casa",
    // "Du'Chef",
    // "Poema Tropical",
    // "Porção de Fritas",
    // "Porção de Onion Rings",
     "Fritas Feliz"
];

// 2. LISTA DE ADICIONAIS
const adicionaisEsgotados = [
    // "Bacon",
    // "Cebola caramelizada",
    // "Abacaxi grelhado",
    // "Blend bovino 150g",
     "Smash bovino 75g",
    // "Queijo cheddar",
    // "Queijo mussarela",
     "Anéis de cebola",
    // "Pote de maionese extra"
];


/* =========================================
   FUNÇÃO AUTOMÁTICA DE ATUALIZAÇÃO
========================================= */
function atualizarEstoqueGeral() {
    
    /* --- A. BLOQUEIO DE PRODUTOS --- */
    document.querySelectorAll(".produto").forEach(produto => {
        const botao = produto.querySelector(".botao-adicionar");
        if (!botao) return;

        const nomeProduto = botao.dataset.produto;

        if (produtosEsgotados.includes(nomeProduto)) {
            botao.disabled = true;
            botao.textContent = "ESGOTADO";
            botao.style.backgroundColor = "#555555";
            botao.style.cursor = "not-allowed";

            const conteinerImagem = produto.querySelector(".produto-imagem");
            if (conteinerImagem && !conteinerImagem.querySelector(".selo-esgotado")) {
                conteinerImagem.style.position = "relative";
                conteinerImagem.style.filter = "grayscale(100%) opacity(0.5)";

                const selo = document.createElement("span");
                selo.className = "selo-esgotado";
                selo.textContent = "ESGOTADO";
                selo.style.position = "absolute";
                selo.style.top = "50%";
                selo.style.left = "50%";
                selo.style.transform = "translate(-50%, -50%)";
                selo.style.backgroundColor = "rgba(0,0,0,0.85)";
                selo.style.color = "#fff";
                selo.style.padding = "6px 14px";
                selo.style.borderRadius = "5px";
                selo.style.fontWeight = "bold";
                selo.style.fontSize = "14px";
                selo.style.letterSpacing = "1px";
                selo.style.zIndex = "2";

                conteinerImagem.appendChild(selo);
            }
        }
    });

    /* --- B. BLOQUEIO DE ADICIONAIS --- */
    document.querySelectorAll('#modal-produto input[name="adicional"]').forEach(checkbox => {
        const nomeAdicional = checkbox.value;
        const labelAdicional = checkbox.closest(".adicional");

        if (adicionaisEsgotados.includes(nomeAdicional)) {
            checkbox.disabled = true;
            checkbox.checked = false;

            if (labelAdicional) {
                labelAdicional.style.opacity = "0.5";
                labelAdicional.style.cursor = "not-allowed";

                const spanNome = labelAdicional.querySelector("span");
                if (spanNome && !spanNome.textContent.includes("(ESGOTADO)")) {
                    spanNome.textContent += " (ESGOTADO)";
                    spanNome.style.textDecoration = "line-through";
                }
            }
        }
    });
}

// Executa ao carregar e ao abrir qualquer modal
document.addEventListener("DOMContentLoaded", atualizarEstoqueGeral);
document.addEventListener("click", function (e) {
    if (e.target.closest(".botao-adicionar")) {
        setTimeout(atualizarEstoqueGeral, 50);
    }
});



/* =========================================
   CONTROLE AUTOMÁTICO DE HORÁRIO
========================================= */

function pedidosEstaoAbertos() {
    // Se o bloqueio estiver desativado no topo do código, permite os pedidos a qualquer momento
    if (!bloqueioHorarioAtivo) {
        return true;
    }

    const agora = new Date();
    const dia = agora.getDay(); // 5 = Sexta, 6 = Sábado
    const hora = agora.getHours();
    const minutos = agora.getMinutes();

    const horarioAtual = hora * 60 + minutos;

    const inicio = 19 * 60 + 30; // 19h30 (1170 minutos)
    const fim = 22 * 60;        // 22h00 (1320 minutos)

    const diaValido = (dia === 5 || dia === 6);
    const horarioValido = (horarioAtual >= inicio && horarioAtual < fim);

    return diaValido && horarioValido;
}

function mostrarAvisoForaDoExpediente() {
    mostrarMensagem("🍔 Pedidos fechados no momento! Nosso atendimento funciona às sextas e sábados, das 19h30 às 23h. Burger 301 agradece pela compreensão! ❤️");
}

/* =========================================
   ELEMENTOS DO DOM
========================================= */

const modal = document.getElementById("modal-produto");
const observacaoProduto = document.getElementById("observacao-produto");
const fecharModal = document.getElementById("fechar-modal");
const modalNomeProduto = document.getElementById("modal-nome-produto");
const modalDescricaoProduto = document.getElementById("modal-descricao-produto");
const modalPrecoProduto = document.getElementById("modal-preco-produto");
const modalTotal = document.getElementById("modal-total");
const quantidadeProduto = document.getElementById("quantidade-produto");
const diminuirQuantidade = document.getElementById("diminuir-quantidade");
const aumentarQuantidade = document.getElementById("aumentar-quantidade");
const adicionarCarrinhoModal = document.getElementById("adicionar-carrinho-modal");

const itensCarrinho = document.getElementById("itens-carrinho");
const quantidadeCarrinho = document.getElementById("quantidade-carrinho");
const valorTotal = document.getElementById("valor-total");
const finalizarPedido = document.getElementById("finalizar-pedido");
const continuarComprando = document.getElementById("continuar-comprando");
const carrinhoFlutuante = document.getElementById("carrinho-flutuante");
const abrirCarrinho = document.getElementById("abrir-carrinho");
const resumoCarrinho = document.getElementById("resumo-carrinho");
const formularioPedido = document.getElementById("formulario-pedido");
const painelCarrinho = document.getElementById("carrinho");

/* =========================================
   AUXILIARES
========================================= */

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

const descricoes = {
    "Poema Kids": "Uma opção especial para quem prefere um hambúrguer menor.",
    "Smash 301": "Hambúrguer no estilo smash, preparado com carne bovina e ingredientes selecionados.",
    "Clássico da Casa": "Uma combinação clássica da Burger 301 para quem gosta de um hambúrguer tradicional.",
    "Du'Chef": "Pão brioche selado na manteiga, blend bovino de 150g, queijo cheddar, cebola caramelizada, bacon e maionese da casa.",
    "Poema Tropical": "Uma opção especial da casa com uma combinação de sabores tropicais.",
    "Porção de Fritas": "Porção de batatas fritas.",
    "Porção de Onion Rings": "Anéis de cebola empanados e crocantes.",
    "Fritas Feliz": "Porção especial de fritas."
};

/* =========================================
   MODAL DE PRODUTO
========================================= */

const botoesAdicionar = document.querySelectorAll(".botao-adicionar");

botoesAdicionar.forEach(function (botao) {
    botao.addEventListener("click", function () {
        if (!pedidosEstaoAbertos()) {
            mostrarAvisoForaDoExpediente();
            return;
        }

        const nome = botao.dataset.produto;
        const preco = parseFloat(botao.dataset.preco);

        produtoAtual = { nome, preco };
        quantidadeAtual = 1;
        observacaoProduto.value = "";

        modalNomeProduto.textContent = nome;
        modalDescricaoProduto.textContent = descricoes[nome] || "";
        modalPrecoProduto.textContent = formatarMoeda(preco);
        quantidadeProduto.textContent = quantidadeAtual;

        document.querySelectorAll('#modal-produto input[name="adicional"]').forEach(checkbox => checkbox.checked = false);

        ajustarAdicionaisPorPorcao(nome);
        atualizarTotalModal();

        modal.classList.add("ativo");
        modal.setAttribute("aria-hidden", "false");
    });
});

fecharModal.addEventListener("click", fecharModalProduto);

function fecharModalProduto() {
    modal.classList.remove("ativo");
    modal.setAttribute("aria-hidden", "true");
    produtoAtual = null;
}

modal.addEventListener("click", function (evento) {
    if (evento.target === modal) fecharModalProduto();
});

aumentarQuantidade.addEventListener("click", function () {
    quantidadeAtual++;
    quantidadeProduto.textContent = quantidadeAtual;
    atualizarTotalModal();
});

diminuirQuantidade.addEventListener("click", function () {
    if (quantidadeAtual > 1) {
        quantidadeAtual--;
        quantidadeProduto.textContent = quantidadeAtual;
        atualizarTotalModal();
    }
});

function obterAdicionaisSelecionados() {
    const adicionais = [];
    document.querySelectorAll('#modal-produto input[name="adicional"]:checked').forEach(function (checkbox) {
        adicionais.push({
            nome: checkbox.value,
            preco: parseFloat(checkbox.dataset.preco)
        });
    });
    return adicionais;
}

function calcularTotalProduto() {
    if (!produtoAtual) return 0;
    let adicionaisTotal = 0;
    obterAdicionaisSelecionados().forEach(adicional => adicionaisTotal += adicional.preco);
    return (produtoAtual.preco + adicionaisTotal) * quantidadeAtual;
}

function atualizarTotalModal() {
    modalTotal.textContent = formatarMoeda(calcularTotalProduto());
}

document.querySelectorAll('#modal-produto input[name="adicional"]').forEach(checkbox => {
    checkbox.addEventListener("change", atualizarTotalModal);
});

/* FILTRO DE ADICIONAIS DE PORÇÕES */
function ajustarAdicionaisPorPorcao(nomeProduto) {
    const nomesPorcoes = new Set(["Porção de Fritas", "Porção de Onion Rings", "Fritas Feliz"]);
    const ehPorcao = nomesPorcoes.has(nomeProduto);

    document.querySelectorAll('#modal-produto .adicional').forEach(adicional => {
        const input = adicional.querySelector('input[type="checkbox"]');
        if (!input) return;

        const somentePorcao = input.dataset.apenasPorcao === "true";

        if (ehPorcao) {
            if (somentePorcao) {
                adicional.style.display = "";
                input.disabled = false;
            } else {
                adicional.style.display = "none";
                input.checked = false;
                input.disabled = true;
            }
        } else {
            adicional.style.display = "";
            input.disabled = false;
        }
    });
}

/* =========================================
   INSERIR NO CARRINHO
========================================= */

adicionarCarrinhoModal.addEventListener("click", function () {
    if (!produtoAtual) return;

    const adicionais = obterAdicionaisSelecionados();
    const observacao = observacaoProduto.value.trim();
    let adicionaisTotal = 0;
    adicionais.forEach(adicional => adicionaisTotal += adicional.preco);

    const valorUnitario = produtoAtual.preco + adicionaisTotal;

    const novoItem = {
        id: Date.now(),
        nome: produtoAtual.nome,
        precoBase: produtoAtual.preco,
        quantidade: quantidadeAtual,
        adicionais: adicionais,
        observacao: observacao,
        valorUnitario: valorUnitario
    };

    carrinho.push(novoItem);
    atualizarCarrinho();
    fecharModalProduto();
    mostrarMensagem(`${quantidadeAtual}x ${novoItem.nome} adicionado ao pedido!`);
});

/* =========================================
   GESTÃO DO CARRINHO
========================================= */

function atualizarCarrinho() {
    itensCarrinho.innerHTML = "";

    if (carrinho.length === 0) {
        itensCarrinho.innerHTML = `<p class="carrinho-vazio">Seu carrinho está vazio.</p>`;
        quantidadeCarrinho.textContent = "0 itens";
        valorTotal.textContent = formatarMoeda(0);
        resumoCarrinho.textContent = "0 itens • R$ 0,00";
        finalizarPedido.disabled = true;
        carrinhoFlutuante.classList.remove("visivel");
        return;
    }

    let total = 0;
    let quantidadeItens = 0;

    carrinho.forEach(function (item) {
        const subtotal = item.valorUnitario * item.quantidade;
        total += subtotal;
        quantidadeItens += item.quantidade;

        const divItem = document.createElement("div");
        divItem.className = "item-carrinho";

        let adicionaisHTML = "";
        if (item.adicionais.length > 0) {
            adicionaisHTML = `
                <div class="item-adicionais">
                    ${item.adicionais.map(adicional => `<span>+ ${adicional.nome} —${formatarMoeda(adicional.preco)}</span>`).join("")}
                </div>
            `;
        }

        divItem.innerHTML = `
            <div class="item-carrinho-info">
                <h3>${item.nome}</h3>
                <p class="controle-quantidade">
                    <span>Qtd:</span>
                    <button type="button" class="botao-diminuir" data-id="${item.id}">−</button>
                    <strong>${item.quantidade}</strong>
                    <button type="button" class="botao-aumentar" data-id="${item.id}">+</button>
                </p>
                ${adicionaisHTML}
                ${item.observacao ? `<div class="item-observacao">📝 ${item.observacao}</div>` : ""}
            </div>
            <div class="item-carrinho-acoes">
                <strong>${formatarMoeda(subtotal)}</strong>
                <button type="button" class="botao-remover" data-id="${item.id}">Remover</button>
            </div>
        `;

        itensCarrinho.appendChild(divItem);
    });

    quantidadeCarrinho.textContent = `${quantidadeItens} ${quantidadeItens === 1 ? "item" : "itens"}`;
    valorTotal.textContent = formatarMoeda(total);
    resumoCarrinho.textContent = `${quantidadeItens} ${quantidadeItens === 1 ? "item" : "itens"} • ${formatarMoeda(total)}`;
    finalizarPedido.disabled = false;
    carrinhoFlutuante.classList.add("visivel");

    configurarBotoesCarrinho();
}

function configurarBotoesCarrinho() {
    document.querySelectorAll(".botao-remover").forEach(botao => {
        botao.addEventListener("click", function () {
            const id = Number(botao.dataset.id);
            carrinho = carrinho.filter(item => item.id !== id);
            atualizarCarrinho();
        });
    });

    document.querySelectorAll(".botao-aumentar").forEach(botao => {
        botao.addEventListener("click", function () {
            const id = Number(botao.dataset.id);
            const item = carrinho.find(item => item.id === id);
            if (item) {
                item.quantidade++;
                atualizarCarrinho();
            }
        });
    });

    document.querySelectorAll(".botao-diminuir").forEach(botao => {
        botao.addEventListener("click", function () {
            const id = Number(botao.dataset.id);
            const item = carrinho.find(item => item.id === id);
            if (item) {
                item.quantidade--;
                if (item.quantidade <= 0) {
                    carrinho = carrinho.filter(item => item.id !== id);
                }
                atualizarCarrinho();
            }
        });
    });
}

abrirCarrinho.addEventListener("click", () => painelCarrinho.classList.add("aberto"));
continuarComprando.addEventListener("click", () => painelCarrinho.classList.remove("aberto"));

finalizarPedido.addEventListener("click", function () {
    if (carrinho.length === 0) return;

    if (!pedidosEstaoAbertos()) {
        mostrarAvisoForaDoExpediente();
        return;
    }

    painelCarrinho.classList.remove("aberto");
    const dadosPedido = document.getElementById("dados-pedido");
    dadosPedido.classList.add("visivel");

    setTimeout(() => dadosPedido.scrollIntoView({ behavior: "smooth" }), 100);
});

/* CAMPO DE TROCO DINÂMICO */
document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
    radio.addEventListener("change", function () {
        const campoTroco = document.getElementById("campo-troco");
        if (this.value === "Dinheiro") {
            campoTroco.style.display = "block";
        } else {
            campoTroco.style.display = "none";
        }
    });
});

/* =========================================
   ENVIAR PEDIDO VIA WHATSAPP
========================================= */

formularioPedido.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!pedidosEstaoAbertos()) {
        mostrarAvisoForaDoExpediente();
        return;
    }

    if (carrinho.length === 0) {
        alert("Adicione pelo menos um produto ao pedido.");
        return;
    }

    const nome = document.getElementById("nome").value.trim();
    const torre = document.getElementById("torre").value.trim();
    const apartamento = document.getElementById("apartamento").value.trim();
    const observacao = document.getElementById("observacao").value.trim();
    const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
    const troco = document.getElementById("troco").value.trim();

    if (!nome || !torre || !apartamento || !pagamentoSelecionado) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const pagamento = pagamentoSelecionado.value;

    let mensagem = `🍔 *NOVO PEDIDO - BURGER 301*\n\n`;
    mensagem += `Cliente: ${nome}\n`;
    mensagem += `Torre: ${torre}\n`;
    mensagem += `Apartamento: ${apartamento}\n\n`;
    mensagem += `*PEDIDO*\n\n`;

    let totalPedido = 0;

    carrinho.forEach(function (item) {
        const subtotal = item.valorUnitario * item.quantidade;
        totalPedido += subtotal;

        mensagem += `${item.quantidade}x ${item.nome} - ${formatarMoeda(item.precoBase * item.quantidade)}\n`;

        if (item.adicionais && item.adicionais.length > 0) {
            item.adicionais.forEach(adicional => {
                mensagem += `   + ${adicional.nome} - ${formatarMoeda(adicional.preco)}\n`;
            });
        }

        if (item.observacao) {
            mensagem += `   Obs: ${item.observacao}\n`;
        }
        mensagem += "\n";
    });

    mensagem += `*TOTAL: ${formatarMoeda(totalPedido)}*\n\n`;
    mensagem += `*PAGAMENTO:* ${pagamento}\n`;

    if (pagamento === "Dinheiro" && troco) {
        mensagem += `*TROCO:* ${troco}\n`;
    }

    if (observacao) {
        mensagem += `\n*OBSERVAÇÃO GERAL:*\n${observacao}\n`;
    }

    mensagem += "\n_Pedido realizado pelo site._";

    const telefone = "5551981061618";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    carrinho = [];
    atualizarCarrinho();
    formularioPedido.reset();
});

function mostrarMensagem(texto) {
    const mensagem = document.createElement("div");
    mensagem.className = "mensagem-sucesso";
    mensagem.textContent = texto;
    document.body.appendChild(mensagem);

    setTimeout(() => mensagem.remove(), 2500);
}

/* INITIALIZAÇÃO */
atualizarCarrinho();
