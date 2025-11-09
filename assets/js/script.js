class Tarefa {
    constructor(nome, tipo, data, horario) {
        this.nome = nome;
        this.tipo = tipo;
        this.data = data;
        this.horario = horario;
        this.concluida = false;
    }

    validarDados() {
        for(let i in this) {
            if(i === 'concluida') continue;
            
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            };
        };
        return true;
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id');

        if(id === null || id === 'NaN') {
            localStorage.setItem('id', '0');
        }
    }

    getProximoId() {
        let idAtualStr = localStorage.getItem('id') || '0'; 
        
        let idAtualNum = parseInt(idAtualStr);

        if (isNaN(idAtualNum)) {
            idAtualNum = 0;
        }

        let proximoId = idAtualNum + 1;
        return proximoId;
    }

    criar(tarefa) {
        let id = this.getProximoId();

        const tarefaJSON = JSON.stringify(tarefa);

        localStorage.setItem(id, tarefaJSON);

        localStorage.setItem('id', id.toString());

        console.log(`Tarefa salva com ID ${id} e dados: ${tarefaJSON}`);
    }

    recuperarTodasTarefas() {
        let tarefas = Array();

        let idMaxStr = localStorage.getItem('id') || '0';
        let idMax = parseInt(idMaxStr);

        if (isNaN(idMax)) {
            idMax = 0;
        }

        for(let i = 1; i <= idMax; i++) {

            let tarefa = JSON.parse(localStorage.getItem(i));

            if(tarefa === null) {
                continue;
            }

            tarefa.id = i;
            tarefas.push(tarefa);
        }

        return tarefas;
    }

    toggleConcluida(id) {
        let tarefaJSON = localStorage.getItem(id);
        if (tarefaJSON === null) return;
        let tarefa = JSON.parse(tarefaJSON);
        tarefa.concluida = !tarefa.concluida; 
        localStorage.setItem(id, JSON.stringify(tarefa));
    }

    pesquisar(tarefa){
        let tarefasFiltradas = Array();
        tarefasFiltradas = this.recuperarTodasTarefas();

        if(tarefa.nome != ''){
            console.log("filtro de nome");
            tarefasFiltradas = tarefasFiltradas.filter(t => 
                t.nome.toLowerCase().includes(tarefa.nome.toLowerCase())
            );
        }

        if(tarefa.data != ''){
            console.log("filtro de data");
            tarefasFiltradas = tarefasFiltradas.filter(t => t.data == tarefa.data);
        }
        if(tarefa.tipo != ''){
            console.log("filtro de tipo");
            tarefasFiltradas = tarefasFiltradas.filter(t => t.tipo == tarefa.tipo);
        }
        if(tarefa.horario != ''){
            console.log("filtro de horario");
            tarefasFiltradas = tarefasFiltradas.filter(t => t.horario == tarefa.horario);
        }
        return tarefasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
    }
}

let bd = new Bd();

function gerarTarefa() {
    let nome = document.getElementById('nome_tarefa').value;
    let tipo = document.getElementById('tipo_tarefa').value;
    let data = document.getElementById('data_tarefa').value;
    let horario = document.getElementById('horario_tarefa').value;

    let tarefa = new Tarefa(nome, tipo, data, horario);

    if (tarefa.validarDados()) {
        bd.criar(tarefa);

        document.getElementById('nome_tarefa').value = "";
        document.getElementById('tipo_tarefa').value = "";
        document.getElementById('data_tarefa').value = "";
        document.getElementById('horario_tarefa').value = "";

        alert("Tarefa gravada com sucesso!");
        
        carregaListaTarefas(); 

    }else {
        alert("Alguma coisa não foi preenchida.");
    }
}


function carregaListaTarefas(tarefas, filtro = false) {

    if(filtro == false){
        tarefas = bd.recuperarTodasTarefas(); 
    } 
    else if (!tarefas) {
        tarefas = [];
    }

    tarefas.sort((a, b) =>{
        let dateTimeA = `${a.data}T${a.horario}`;
        let dateTimeB = `${b.data}T${b.horario}`;
        return dateTimeA.localeCompare(dateTimeB);
    });

    let listaTarefasUI = document.getElementById("lista_tarefas"); 
    listaTarefasUI.innerHTML = ''; 

    tarefas.forEach(function(t){
        let itemLista = document.createElement('li');

        if (t.concluida) {
            itemLista.classList.add('concluida');
        }

        let tipoTexto = '';
        switch(t.tipo){
            case '1': tipoTexto = 'Alimentação'; break;
            case '2': tipoTexto = 'Estudos'; break;
            case '3': tipoTexto = 'Lazer'; break;
            case '4': tipoTexto = 'Saúde'; break;
            case '5': tipoTexto = 'Trabalho'; break;
            default: tipoTexto = 'Outro';
        }

        let dataFormatada = new Date(t.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

        itemLista.innerHTML = `
            <h3>${t.nome}</h3>
            <span class="tipo-tarefa">${tipoTexto}</span>
            <p>Concluir até: ${dataFormatada} às ${t.horario}</p>
        `;

        let btnComplete = document.createElement('button');
        btnComplete.className = 'btn-complete';
        if (t.concluida) {
            btnComplete.innerHTML = '<i class="fas fa-undo"></i>';
            btnComplete.title = 'Marcar como não concluída';
        } else {
            btnComplete.innerHTML = '<i class="fas fa-check"></i>';
            btnComplete.title = 'Marcar como concluída';
        }
        btnComplete.onclick = function() {
            bd.toggleConcluida(t.id);

            carregaListaTarefas(); 
        }

        let btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete'; 
        btnDelete.innerHTML = '<i class="fas fa-times"></i>';
        btnDelete.id = `id_tarefa_${t.id}`; 
        btnDelete.onclick = function() {
            if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
                let id = this.id.replace('id_tarefa_', '');

                bd.remover(id);

                carregaListaTarefas();
            }
        }
        
        itemLista.appendChild(btnComplete);
        itemLista.appendChild(btnDelete);
        listaTarefasUI.appendChild(itemLista);
    })
 }

 
 function pesquisarTarefa(){
    let nome  = document.getElementById("nome_tarefa").value;
    let tipo = document.getElementById("tipo_tarefa").value;
    let data = document.getElementById("data_tarefa").value;
    let horario = document.getElementById("horario_tarefa").value;

    let tarefa = new Tarefa(nome, tipo, data, horario);
    let tarefas = bd.pesquisar(tarefa);
     
    carregaListaTarefas(tarefas, true);
 }