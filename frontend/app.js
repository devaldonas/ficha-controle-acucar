document.addEventListener('DOMContentLoaded', () => {
    const checkboxesSinais = document.querySelectorAll('.card:nth-child(2) input[type="checkbox"]');
    const contadorSinais = document.getElementById('contadorSinais');
    const checkboxesPartida = document.querySelectorAll('.card:nth-child(3) input[type="checkbox"]');
    const contadorPartida = document.getElementById('contadorPartida');
    const btnSalvar = document.getElementById('btnSalvar');
    const statusSalvo = document.getElementById('statusSalvo');
    const nomeInput = document.getElementById('nome');
    const dataInput = document.getElementById('data');

    const hoje = new Date().toISOString().split('T')[0];
    dataInput.value = hoje;

    function atualizarContadores() {
        let countSinais = 0;
        checkboxesSinais.forEach(cb => { if(cb.checked) countSinais++; });
        contadorSinais.textContent = countSinais;

        let countPartida = 0;
        checkboxesPartida.forEach(cb => { if(cb.checked) countPartida++; });
        contadorPartida.textContent = countPartida;
    }

    checkboxesSinais.forEach(cb => cb.addEventListener('change', atualizarContadores));
    checkboxesPartida.forEach(cb => cb.addEventListener('change', atualizarContadores));

    btnSalvar.addEventListener('click', async () => {
        const dados = {
            nome: nomeInput.value,
            data: dataInput.value,
            exames: [],
            sinais: [],
            partida: []
        };

        const linhas = document.querySelectorAll('.tabela-exames tbody tr');
        linhas.forEach(linha => {
            const inputs = linha.querySelectorAll('input, select');
            dados.exames.push({
                exame: linha.cells[0].textContent,
                valor: inputs[0].value,
                ideal: inputs[1].value,
                dentro: inputs[2].value
            });
        });

        checkboxesSinais.forEach(cb => { if(cb.checked) dados.sinais.push(cb.value); });
        checkboxesPartida.forEach(cb => { if(cb.checked) dados.partida.push(cb.value); });

        try {
            const response = await fetch('http://localhost:3000/api/fichas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (response.ok) {
                statusSalvo.textContent = '✅ Ficha salva no banco de dados!';
            } else {
                throw new Error('Erro ao salvar');
            }
        } catch (error) {
            statusSalvo.textContent = '⚠️ Salvo localmente (offline).';
            localStorage.setItem('fichaControleAcucar', JSON.stringify(dados));
        }
        
        setTimeout(() => { statusSalvo.textContent = ''; }, 3000);
    });

    // Carregar dados locais se existirem
    const dadosSalvos = localStorage.getItem('fichaControleAcucar');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        nomeInput.value = dados.nome || '';
        dataInput.value = dados.data || hoje;
        // (Restaurar exames, sinais e partida pode ser adicionado aqui se desejar)
        atualizarContadores();
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW não registrado:', err));
    }
});
