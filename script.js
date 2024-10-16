// Obtém os elementos
const overlay = document.getElementById('overlay');
const highlight = document.getElementById('highlight');
const overlayButton = document.getElementById('overlayButton');
const nextStepButton = document.getElementById('nextStepButton');
const tutorialText = document.getElementById('tutorial-text');
const arrow = document.getElementById('arrow');

// Variável para controlar o estado do tutorial
let currentStep = parseInt(localStorage.getItem('tutorialStep')) || 0; // Obtém o passo do tutorial ou 0 se não houver
let tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true'; // Verifica se o tutorial já foi concluído

// Função para ativar o overlay manualmente (pelo botão)
overlayButton.addEventListener('click', () => {
    overlay.style.display = 'flex';
    currentStep = 0; // Reiniciar o tutorial ao clicar no botão de ativação
    localStorage.setItem('tutorialStep', currentStep); // Salva o passo no localStorage
    localStorage.setItem('tutorialCompleted', 'false'); // Marca como não concluído ao reiniciar
    showStep(currentStep);
});

// Função para avançar o tutorial
nextStepButton.addEventListener('click', () => {
    currentStep++;
    const totalSteps = 3; // Número total de passos (0 a 3)

    if (currentStep < totalSteps) {
        showStep(currentStep);
        localStorage.setItem('tutorialStep', currentStep); // Atualiza o passo no localStorage
    } else {
        // Fechar o tutorial ao fim
        overlay.style.display = 'none';
        localStorage.setItem('tutorialCompleted', 'true'); // Marca o tutorial como concluído
        localStorage.removeItem('tutorialStep'); // Remove o estado do tutorial quando termina
    }
});

// Função para exibir o passo atual do tutorial
function showStep(step) {
    let rect;

    if (step === 0) {
        const teste1 = document.querySelector('.teste1');
        rect = teste1.getBoundingClientRect();
        tutorialText.innerText = "Aqui fica o texto do tutorial";
    } else if (step === 1) {
        const filterContainer = document.querySelector('.teste2');
        rect = filterContainer.getBoundingClientRect();
        tutorialText.innerText = "Veja que não importa o elemento em si,\n ele vai atrás da classe";
    } else if (step === 2) {
        const filterContainer = document.querySelector('.teste3');
        rect = filterContainer.getBoundingClientRect();
        tutorialText.innerText = "Não importa nem a posição nem o formato";
    }

    const padding = 10;
    const left = rect.left - padding;
    const top = rect.top - padding;
    const right = rect.right + padding;
    const bottom = rect.bottom + padding;

    overlay.style.clipPath = `
        polygon(
            0 0, 100% 0, 100% 100%, 0 100%,
            0 ${top}px,
            ${left}px ${top}px,
            ${left}px ${bottom}px,
            ${right}px ${bottom}px,
            ${right}px ${top}px,
            0 ${top}px
        )`;

    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.top = `${rect.top}px`;
    highlight.style.left = `${rect.left}px`;
    highlight.style.borderRadius = '20px';

    // Posicionar a seta
    arrow.style.top = `${rect.top + rect.height / 2 - 20}px`; // Centraliza verticalmente
    arrow.style.left = `${rect.left - 60}px`; // Posição da seta à esquerda do elemento destacado

    // Ajustar o conteúdo do overlay
    const overlayContent = document.querySelector('.overlay-content');
    const arrowRect = arrow.getBoundingClientRect();

    // Definir a posição do conteúdo à esquerda da seta
    let overlayContentTop = arrowRect.top + (arrowRect.height / 2) - (overlayContent.offsetHeight / 2);
    let overlayContentLeft = arrowRect.left - overlayContent.offsetWidth - 10; // 10px de espaçamento à esquerda da seta

    // Ajustar limites da tela
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Se o conteúdo sair pela esquerda, ajustar para manter na tela
    if (overlayContentLeft < 0) {
        overlayContentLeft = arrowRect.left + arrowRect.width + 10; // Mover para a direita se estiver fora da tela
    }

    // Ajustar o limite superior
    if (overlayContentTop < 0) {
        overlayContentTop = 10; // Margem superior
    }

    // Ajustar o limite inferior
    if (overlayContentTop + overlayContent.offsetHeight > windowHeight) {
        overlayContentTop = windowHeight - overlayContent.offsetHeight - 10; // Margem inferior
    }

    // Aplicar as posições calculadas
    overlayContent.style.position = 'absolute'; // Certifique-se de que o conteúdo seja absoluto
    overlayContent.style.top = `${overlayContentTop}px`;
    overlayContent.style.left = `${overlayContentLeft}px`;
}

// Verifica o estado do tutorial sempre que a página carrega
window.addEventListener('load', () => {
    if (!tutorialCompleted && currentStep >= 0 && currentStep < 3) {
        overlay.style.display = 'flex';
        showStep(currentStep);
    }
});
