export class Compromisso {
    private id: number;
    private horario_inicio: Date;
    private horario_fim: Date;
    private descricao: string;

    constructor(id: number, horario_inicio: Date, horario_fim: Date, descricao: string) {
        this.id = id;
        this.horario_inicio = horario_inicio;
        this.horario_fim = horario_fim;
        this.descricao = descricao;
    }

    choqueHorario(outro_comp: Compromisso): boolean {
        //NAO HÁ CHOQUE
        if(this.horario_fim < outro_comp.horario_inicio || this.horario_inicio > outro_comp.horario_fim) {
            return true;
        }
        //HÁ CHOQUE
        return false;
    }

    getId(): number {
        return this.id;
    }
    getHorario_inicio(): Date {
        return this.horario_inicio;
    }  
    getHorario_fim(): Date {
        return this.horario_fim;
    }
    getDescricao(): string {
        return this.descricao;
    }
    setId(id: number): void {
        this.id = id;
    }
}