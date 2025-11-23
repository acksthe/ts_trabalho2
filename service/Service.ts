import { Compromisso } from '../classe/Compromisso';
import {repoBD} from "../repositorioBD/Appointment";

export class Service {
    private repo: repoBD

    constructor(repo: repoBD) {
        this.repo = repo;
    }

    listarCompromissos(): Compromisso[] {
        
        return this.repo.listarCompromissos();
    }

    formatarExibicao(dataObj: Date): string {
        // Usa getUTC para ignorar o fuso horário local e mostrar o horário que o usuário digitou
        const dia = dataObj.getUTCDate().toString().padStart(2, '0'); //padStart para gararntir que horarios e datas com 1 digito fique com 0 na frente
        const mes = (dataObj.getUTCMonth() + 1).toString().padStart(2, '0'); // +1 pois em TS os meses começam do 0
        const ano = dataObj.getUTCFullYear();
        const horas = dataObj.getUTCHours().toString().padStart(2, '0');
        const minutos = dataObj.getUTCMinutes().toString().padStart(2, '0');
        return `${dia}/${mes}/${ano}, ${horas}:${minutos}:00`;
    }

    exibirCompromisso(compromisso: Compromisso): { id: number, inicio: string, fim: string, descricao: string } {
        return {
            id: compromisso.getId(),
            inicio: this.formatarExibicao(compromisso.getHorario_inicio()),
            fim: this.formatarExibicao(compromisso.getHorario_fim()),
            descricao: compromisso.getDescricao()
        };
    }

    adicionarCompromisso(
        horario_inicio: string,
        horario_fim: string,
        descricao: string
    ): Compromisso {
        //Conversão da data e hora em string para Date 
        function ConverterDate(datahora: string): Date {
            //separa data da hora
            const [data, hora] = datahora.split(' ') as [string, string];

            //separa os dias
            const [dia, mes, ano] = data.split('/');

            //separa a hora
            const [horas, minutos] = hora.split(':');

            //junta tudo e manda no formato correto para armazenar no BD
            const DataHora = Date.UTC(
                Number(ano),
                Number(mes) - 1, //-1 pois em TS o mes sempre inicia em 0
                Number(dia),
                Number(horas),
                Number(minutos),
                0 //segundos
            );
            return new Date(DataHora);
        }
        const horarioInicioUTC = ConverterDate(horario_inicio);
        const horarioFimUTC = ConverterDate(horario_fim);

        //cria um novo copromisso
        const compromisso = new Compromisso(0, horarioInicioUTC, horarioFimUTC, descricao);

        const marcados = this.repo.listarCompromissos() 
        
        for (const c of marcados) {
            const sem_choque = compromisso.choqueHorario(c);

            if (!sem_choque) {
                throw new Error('Erro. Já existe outro compromisso nesse horário');}     
            }
    //Caso não haja choque, adiciona o compromisso
    return this.repo.adicionarCompromisso(compromisso);
    }
}