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
        const rows = this.bd
        .prepare(
            `SELECT id, horario_inicio, horario_fim, descricao
                FROM Compromissos
                ORDER BY horario_inicio`
        )
        .all();

    // Converte as linhas do bd em objetos Compromisso
        return rows.map((row: any) => {
            return new Compromisso(
                row.id,
                new Date(row.horario_inicio),
                new Date(row.horario_fim),
                row.descricao
            );
        });
    }

    adicionarCompromisso(compromisso: Compromisso): Compromisso {
        const id = compromisso.getId(); 
        const inicio_iso = compromisso.getHorario_inicio().toISOString(); // converte Date para armazernar no BD
        const fim_iso = compromisso.getHorario_fim().toISOString(); // converte Date para armazernar no BD
        const descricao = compromisso.getDescricao();

        if (id == 0) {
      // INSERT (cria um novo compromisso)
            const stmt = this.bd.prepare(
                `INSERT INTO Compromissos (horario_inicio, horario_fim, descricao)
                    VALUES (?, ?, ?)`
                );

            const result = stmt.run(inicio_iso, fim_iso, descricao);

      // atualiza o id dentro do objeto com um id gerado pelo banco
            compromisso.setId(Number(result.lastInsertRowid));
            return compromisso;
        } 
        else {
      // UPDATE (para edição de compromisso existente)
            const stmt = this.bd.prepare(
                `UPDATE Compromissos
                    SET horario_inicio = ?, horario_fim = ?, descricao = ?
                    WHERE id = ?`
            );

            stmt.run(inicio_iso, fim_iso, descricao, id);

            return compromisso;
        }
    }
}