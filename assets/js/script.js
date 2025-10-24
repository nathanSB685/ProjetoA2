class Tarefa {
    constructor(nome, tipo, dia, horario) {
        this.nome = nome;
        this.tipo = tipo;
        this.dia = dia;
        this.horario = horario;
    }

    validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false;
			};
		};
		return true;
    }
}

class Bd {
    constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

    getProximoId() {
        let proximoId = parseInt(localStorage.getItem('id')) + 1;
        return proximoId;
    }

    gravar(tarefa) {
        let id = this.getProximoId();

        const tarefaJSON = JSON.stringify(tarefa);

        localStorage.setItem(id, tarefaJSON);

        localStorage.setItem('id', id);

        console.log(`Tarefa salva com ID ${id} e dados: ${tarefaEmJSON}`);
    }
}

function gerarTarefa() {
    let nome = document.getElementById('nome_tarefa').value;
    let tipo = document.getElementById('tipo_tarefa').value;
    let dia = document.getElementById('dia_tarefa').value;
    let horario = document.getElementById('horario_tarefa').value;

    // log para ver o que o usuário digitou e ver se os let pegaram o valor certo
    console.log(nome, tipo, dia, horario);

    let tarefa = new Tarefa(nome, tipo, dia, horario);
}