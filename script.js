// =======================================================
// 1. MODO NOTURNO (Alterna cores e ícone lua/sol)
// =======================================================
const botaoTema = document.getElementById("botao-tema");
const iconeTema = document.getElementById("icone-tema");

// Alterna a classe .modo-noturno no <body> e atualiza o ícone exibido no botão
if (botaoTema && iconeTema) {
  botaoTema.addEventListener("click", () => {
    document.body.classList.toggle("modo-noturno");

    if (document.body.classList.contains("modo-noturno")) {
      iconeTema.src = "imagens/diurno.png"; // Ícone para indicar retorno ao modo claro
    } else {
      iconeTema.src = "imagens/noturno.png"; // Ícone para indicar ativação do modo noturno
    }
  });
}


// =======================================================
// 2. POP-UPS DAS FLORES (Abrir, Fechar e Arrastar com o Mouse)
// =======================================================
const botoesFlor = document.querySelectorAll(".botao-deflor");
const botoesFechar = document.querySelectorAll(".fechar-modal");
const todosModais = document.querySelectorAll("dialog");

// Abre o <dialog> correspondente ao atributo data-modal da flor clicada
botoesFlor.forEach((botao) => {
  botao.addEventListener("click", () => {
    // Fecha qualquer modal aberto anteriormente para não sobrepor janelas
    todosModais.forEach((m) => m.close());

    const idModal = botao.getAttribute("data-modal");
    const modal = document.getElementById(idModal);

    if (modal) {
      modal.style.left = "0px";
      modal.style.top = "0px";
      modal.show();
    }
  });
});

// Fecha o modal ao clicar no botão de fechar e pausa o áudio se for o pop-up 3
botoesFechar.forEach((botao) => {
  botao.addEventListener("click", () => {
    const modal = botao.closest("dialog");
    if (!modal) return;

    modal.close();

    if (modal.id === "data-popup3" && audioPlayer && iconePlay) {
      audioPlayer.pause();
      iconePlay.src = "imagens/play.png";
    }
  });
});

// Permite arrastar cada janela modal livremente pela tela com o mouse
todosModais.forEach((modal) => {
  let arrastando = false;
  let inicioX = 0;
  let inicioY = 0;
  let atualX = 0;
  let atualY = 0;

  modal.style.cursor = "grab";

  modal.addEventListener("mousedown", (e) => {
    // Ignora o arraste quando o clique ocorre sobre um botão interno
    if (e.target.closest("button")) return;

    arrastando = true;
    modal.style.cursor = "grabbing";
    inicioX = e.clientX - atualX;
    inicioY = e.clientY - atualY;
  });

  document.addEventListener("mousemove", (e) => {
    if (!arrastando) return;
    e.preventDefault();
    atualX = e.clientX - inicioX;
    atualY = e.clientY - inicioY;
    modal.style.transform = `translate(${atualX}px, ${atualY}px)`;
  });

  document.addEventListener("mouseup", () => {
    if (arrastando) {
      arrastando = false;
      modal.style.cursor = "grab";
    }
  });
});


// =======================================================
// 3. PLAYER DE MÚSICA DO POP-UP 3 (PLAYLIST COM 7 MÚSICAS)
// =======================================================
const audioPlayer = document.getElementById("audio-popup3");
const capaMusica = document.getElementById("capa-musica");
const nomeMusica = document.getElementById("nome-musica");
const botaoPlay = document.getElementById("botao-play");
const iconePlay = document.getElementById("icone-play");
const botaoVoltar = document.getElementById("botao-voltar");
const botaoAvancar = document.getElementById("botao-avancar");

// Lista de faixas com título, caminho do áudio e imagem de capa
const playlist = [
  {
    titulo: "Pocket Full of Sunshine - Natasha Bedingfield",
    arquivo: "Audios/PocketfulofSunshine.mp3",
    capa: "imagens/PFS.jpg"
  },
  {
    titulo: "Carolina, Carol Bela - Toquinho",
    arquivo: "Audios/CarolinaCarolBela.mp3",
    capa: "imagens/CCB.jpeg"
  },
  {
    titulo: "Filho - Tângela Vieira",
    arquivo: "Audios/Filho.mp3",
    capa: "imagens/FI.jpeg"
  },
  {
    titulo: "Tian Mi Mi - Teresa Tang",
    arquivo: "Audios/TianMiMi.mp3",
    capa: "imagens/TMM.jpg"
  },
  {
    titulo: "Dreams Come True - S.E.S",
    arquivo: "Audios/DreamsComeTrue.mp3",
    capa: "imagens/DCT.jpeg"
  },
  {
    titulo: "Kalam Eineh - Sherine",
    arquivo: "Audios/KalamEineh.mp3",
    capa: "imagens/KE.jpeg"
  },
  {
    titulo: "Stay With Me - Miki Matsubara",
    arquivo: "Audios/Staywithme.mp3",
    capa: "imagens/SWM.jpeg"
  }
];

let indiceAtual = 0;

// Atualiza o player com os dados da música no índice informado
function carregarMusica(indice) {
  const musica = playlist[indice];
  if (!musica || !audioPlayer || !capaMusica || !nomeMusica) return;

  audioPlayer.src = musica.arquivo;
  capaMusica.src = musica.capa;
  nomeMusica.textContent = musica.titulo;
}

// Alterna entre reproduzir e pausar a faixa atual
if (botaoPlay && audioPlayer && iconePlay) {
  botaoPlay.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      iconePlay.src = "imagens/pause.png";
    } else {
      audioPlayer.pause();
      iconePlay.src = "imagens/play.png";
    }
  });
}

// Avança para a próxima música (volta ao início após a última usando módulo %)
if (botaoAvancar && audioPlayer && iconePlay) {
  botaoAvancar.addEventListener("click", () => {
    indiceAtual = (indiceAtual + 1) % playlist.length;
    carregarMusica(indiceAtual);
    audioPlayer.play();
    iconePlay.src = "imagens/pause.png";
  });
}

// Volta para a música anterior (soma playlist.length antes do % para evitar índice negativo)
if (botaoVoltar && audioPlayer && iconePlay) {
  botaoVoltar.addEventListener("click", () => {
    indiceAtual = (indiceAtual - 1 + playlist.length) % playlist.length;
    carregarMusica(indiceAtual);
    audioPlayer.play();
    iconePlay.src = "imagens/pause.png";
  });
}

// Avança automaticamente quando a música atual termina
if (audioPlayer && botaoAvancar) {
  audioPlayer.addEventListener("ended", () => {
    botaoAvancar.click();
  });
}


// =======================================================
// 4. VALIDAÇÃO OBRIGATÓRIA DO FORMULÁRIO E SIMULAÇÃO DE ENVIO
// =======================================================
const formContato = document.getElementById("form-contato");
const feedbackForm = document.getElementById("feedback-form");

if (formContato && feedbackForm) {
  formContato.addEventListener("submit", (e) => {
    // Impede o recarregamento padrão da página ao enviar o formulário
    e.preventDefault();

    // .trim() remove espaços extras nas extremidades antes da validação
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    // Verifica se algum campo obrigatório está vazio
    if (nome === "" || email === "" || mensagem === "") {
      feedbackForm.textContent = "Por favor, preencha todos os campos antes de enviar.";
      feedbackForm.style.color = "#D9534F";
      return;
    }

    // Validação básica de estrutura de e-mail
    if (!email.includes("@") || !email.includes(".")) {
      feedbackForm.textContent = "Por favor, digite um endereço de e-mail válido.";
      feedbackForm.style.color = "#D9534F";
      return;
    }

    // Simula o envio bem-sucedido, exibe o feedback e limpa os campos
    feedbackForm.textContent = `Obrigada, ${nome}! Sua mensagem foi enviada com sucesso.`;
    feedbackForm.style.color = "var(--cor-texto)";
    formContato.reset();
  });
}


// =======================================================
// 5. BOLHAS INTERATIVAS FLUTUANTES QUE ESTOURAM AO CLICAR
// =======================================================
function criarBolha() {
  const bolha = document.createElement("div");
  const tamanho = Math.floor(Math.random() * 45) + 25;

  // Define posição inicial, tamanho e aparência visual da bolha
  bolha.style.position = "fixed";
  bolha.style.bottom = "-80px";
  bolha.style.left = Math.random() * 92 + "vw";
  bolha.style.width = tamanho + "px";
  bolha.style.height = tamanho + "px";
  bolha.style.borderRadius = "50%";
  bolha.style.background = "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(161, 227, 250, 0.35), rgba(237, 195, 241, 0.4))";
  bolha.style.border = "1.5px solid rgba(255, 255, 255, 0.8)";
  bolha.style.boxShadow = "inset 0 0 8px rgba(255, 255, 255, 0.6)";
  bolha.style.cursor = "pointer";
  bolha.style.zIndex = "50";
  bolha.style.transition = "transform 0.15s ease, opacity 0.15s ease";

  document.body.appendChild(bolha);

  // Anima o estouro da bolha ao ser clicada e remove do DOM após 150ms
  bolha.addEventListener("click", () => {
    bolha.style.transform = "scale(1.5)";
    bolha.style.opacity = "0";
    setTimeout(() => bolha.remove(), 150);
  });

  // Movimenta a bolha de baixo para cima e encerra o intervalo quando sai da tela
  let posicaoY = -80;
  const velocidade = Math.random() * 1.2 + 0.6;

  const subir = setInterval(() => {
    posicaoY += velocidade;
    bolha.style.bottom = posicaoY + "px";

    if (posicaoY > window.innerHeight + 100) {
      clearInterval(subir);
      bolha.remove();
    }
  }, 16);
}

// Gera uma nova bolha a cada 3,5 segundos
setInterval(criarBolha, 3500);


// =======================================================
// 6. ESPALHAR ESTRELAS E BOLHAS DESENHADAS SEM ENCOSTAR
// =======================================================
function decorarSecoesInferiores() {
  const secoes = ["formacao", "portfolio", "contato"];
  const imagensEnfeites = [
    "imagens/estrela.png",
    "imagens/star.png",
    "imagens/bolha.png"
  ];

  // Faixas verticais fixas para distribuir os enfeites sem sobreposição
  const faixasTop = [8, 32, 58, 82];

  secoes.forEach((idSecao) => {
    const secao = document.getElementById(idSecao);
    if (!secao) return;

    // Insere 4 enfeites na margem esquerda e 4 na direita em cada seção
    for (let i = 0; i < 8; i++) {
      const ladoEsquerdo = i < 4;
      const indiceFaixa = i % 4;

      const topPct = faixasTop[indiceFaixa] + Math.floor(Math.random() * 6);
      const leftPct = ladoEsquerdo
        ? Math.floor(Math.random() * 7) + 2
        : Math.floor(Math.random() * 7) + 89;

      const img = document.createElement("img");
      img.src = imagensEnfeites[i % imagensEnfeites.length];
      img.alt = "";
      img.className = "enfeite-fundo";

      const tamanho = Math.floor(Math.random() * 25) + 40;
      img.style.width = tamanho + "px";
      img.style.top = topPct + "%";
      img.style.left = leftPct + "%";

      secao.appendChild(img);
    }
  });
}

// Executa a distribuição dos enfeites ao carregar o script
decorarSecoesInferiores();