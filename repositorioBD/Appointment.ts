import Database from "better-sqlite3";
import { Compromisso } from "../classe/Compromisso";

export interface repoBD {
    listarCompromissos(): Compromisso[];
    adicionarCompromisso(compromisso: Compromisso): Compromisso;
}

export class sqlite3_repoBD implements repoBD {
    private bd: Database.Database;
    
    constructor(dbPath: string = "Compromissos.db") {
        this.bd = new Database(dbPath);

        this.bd.exec(
            `CREATE TABLE IF NOT EXISTS Compromissos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                horario_inicio TEXT NOT NULL,
                horario_fim TEXT NOT NULL,
                descricao TEXT NOT NULL
            );`
        );
    }
    
    listarCompromissos(): Compromisso[] {
        const linhas = this.bd
        .prepare(
            `SELECT id, horario_inicio, horario_fim, descricao
                FROM Compromissos
                ORDER BY horario_inicio`
        )
        .all();

    // Converte as linhas do bd em objetos Compromisso
        return linhas.map((linha: any) => {
            return new Compromisso(
                linha.id,
                new Date(linha.horario_inicio),
                new Date(linha.horario_fim),
                linha.descricao
            );
        });
    }

    adicionarCompromisso(compromisso: Compromisso): Compromisso {
    const inicio_iso = compromisso.getHorario_inicio().toISOString();
    const fim_iso = compromisso.getHorario_fim().toISOString();
    const descricao = compromisso.getDescricao();

    // Sempre vai fazer INSERT
    const comando = this.bd.prepare(
        `INSERT INTO Compromissos (horario_inicio, horario_fim, descricao)
            VALUES (?, ?, ?)`
    );

    const result = comando.run(inicio_iso, fim_iso, descricao);

    // Atualiza o id com o número gerado pelo BD
    compromisso.setId(Number(result.lastInsertRowid));
    return compromisso;
    }
}