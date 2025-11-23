import promptSync from "prompt-sync";
import {sqlite3_repoBD} from "../repositorioBD/Appointment";
import {Service} from "../service/Service";
import { Compromisso } from '../classe/Compromisso';


const input = promptSync(); //input recebe os dados do usuário
const repo = new sqlite3_repoBD();
const service = new Service(repo);

function main() {
    while (true) {
        console.log("Escolha uma das opções abaixo (1 ou 2):");
        console.log("1 - Listar compromissos");
        console.log("2 - Adicionar compromisso");
        console.log("0 - Sair");

        const opcao = input("");

        //chama o listarCompromissos
        if (opcao === "1") {
            const compromissos = service.listarCompromissos();
            if (compromissos.length === 0) {
                console.log("Nenhum compromisso agendado.");
            } else {
                console.log("Compromissos agendados:");
                for (const c of compromissos) {
                    //chama o método exibirCompromisso do service para formatar a exibição
                    const exibicao = service.exibirCompromisso(c);
                    console.log(`ID: ${exibicao.id}`);
                    // Usa as strings formatadas (DD/MM/AAAA, HH:MM:00)
                    console.log(`Início: ${exibicao.inicio}`);
                    console.log(`Fim: ${exibicao.fim}`);
                    console.log(`Descrição: ${exibicao.descricao}`);
                }
            }
        }

        //chama o adicionarCompromisso
        if (opcao === "2") {
            const horario_inicio = input("Digite a data e horário de início (DD/MM/AAAA HH:MM):");
            const horario_fim = input("Digite a data e horário de fim (DD/MM/AAAA HH:MM):");
            const descricao = input("Digite a descrição do compromisso:");

            try{
                const novoCompromisso = service.adicionarCompromisso(horario_inicio, horario_fim, descricao);
                console.log("\nCompromisso adicionado com sucesso:");         
            }
            catch (erro: any) {
                console.log("\nNão foi possível adicionar o compromisso, tente novamente digitando no formato correto.");
                console.log(erro.message);
            }
        }

        //sai do programa
        if (opcao === "0") {
            console.log("Saindo...");
            break;
        }
    }
}

main();