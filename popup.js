document.addEventListener('DOMContentLoaded', () => {
    const compromissoInput = document.getElementById('compromisso');
    const dataInput = document.getElementById('data');
    const addButton = document.getElementById('add');
    const listaCompromissos = document.getElementById('lista-compromissos');
    

    const carregarCompromissos = () => {
        chrome.storage.sync.get('compromissos', (data) => {
            const compromissos = data.compromissos || [];
            listaCompromissos.innerHTML = '';
            compromissos.forEach((item, index) => {
                adicionarCompromissoNaLista(item.compromisso, item.data, index);
            });
        });
    };

    const adicionarCompromissoNaLista = (compromisso, data, index) => {
        const li = document.createElement('li');
        li.textContent = `${compromisso} - ${data}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.addEventListener('click', () => {
            if (confirm('Você realmente deseja deletar este compromisso?')) {
                deletarCompromisso(index);
            }
        });
        li.appendChild(deleteButton);
        listaCompromissos.appendChild(li);
    };

    const deletarCompromisso = (index) => {
        chrome.storage.sync.get('compromissos', (data) => {
            const compromissos = data.compromissos || [];
            compromissos.splice(index, 1);
            chrome.storage.sync.set({ compromissos }, carregarCompromissos);
        });
    };

    addButton.addEventListener('click', () => {
        const compromisso = compromissoInput.value;
        const data = dataInput.value;

        if (compromisso && data) {
            chrome.storage.sync.get('compromissos', (dataStorage) => {
                const compromissos = dataStorage.compromissos || [];
                compromissos.push({ compromisso, data });
                chrome.storage.sync.set({ compromissos }, () => {
                    compromissoInput.value = '';
                    dataInput.value = '';
                    carregarCompromissos();
                });
            });
        } else {
            alert('Por favor, preencha tanto o compromisso quanto a data.');
        }
    });

    carregarCompromissos();
});
