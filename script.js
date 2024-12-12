// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

// Formatação de valores monetários
const formatMoney = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Cálculo do INSS 2024
function calcularINSS(salarioBruto) {
    const faixasINSS = [
        { limite: 1412.00, aliquota: 0.075 },
        { limite: 2666.68, aliquota: 0.09 },
        { limite: 4000.03, aliquota: 0.12 },
        { limite: 7786.02, aliquota: 0.14 }
    ];

    let descontoINSS = 0;
    let salarioRestante = salarioBruto;
    let faixaAnterior = 0;

    for (let faixa of faixasINSS) {
        if (salarioBruto > faixaAnterior) {
            const baseCalculo = Math.min(salarioBruto, faixa.limite) - faixaAnterior;
            descontoINSS += baseCalculo * faixa.aliquota;
            faixaAnterior = faixa.limite;
        }
    }

    // Limite máximo de contribuição
    return Math.min(descontoINSS, 908.75);
}

// Cálculo do IRRF 2024
function calcularIRRF(baseCalculo) {
    const faixasIRRF = [
        { limite: 2259.20, aliquota: 0, deducao: 0 },
        { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
        { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
        { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
        { limite: Infinity, aliquota: 0.275, deducao: 896.00 }
    ];

    let faixaIRRF = faixasIRRF.find(faixa => baseCalculo <= faixa.limite);
    return Math.max((baseCalculo * faixaIRRF.aliquota) - faixaIRRF.deducao, 0);
}

function calcular() {
    // Obter valores dos inputs
    const salarioBruto = parseFloat(document.getElementById('salarioBruto').value) || 0;
    const dependentes = parseInt(document.getElementById('dependentes').value) || 0;
    const pensao = parseFloat(document.getElementById('pensao').value) || 0;

    // Valor por dependente em 2024
    const valorPorDependente = 189.59;

    // Cálculo do INSS
    const descontoINSS = calcularINSS(salarioBruto);

    // Base de cálculo do IRRF
    const baseCalculoIRRF = salarioBruto - descontoINSS - (dependentes * valorPorDependente) - pensao;

    // Cálculo do IRRF
    const descontoIRRF = calcularIRRF(baseCalculoIRRF);

    // Cálculo do salário líquido
    const salarioLiquido = salarioBruto - descontoINSS - descontoIRRF - pensao;

    // Atualizar resultados na tela
    document.getElementById('inssResult').textContent = formatMoney(descontoINSS);
    document.getElementById('baseIrrf').textContent = formatMoney(baseCalculoIRRF);
    document.getElementById('irrfResult').textContent = formatMoney(descontoIRRF);
    document.getElementById('salarioLiquido').textContent = formatMoney(salarioLiquido);
}

// Adicionar eventos de input para cálculo automático
const inputs = ['salarioBruto', 'dependentes', 'pensao'];
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', calcular);
});
