import express, { Request, Response } from 'express';
import { Service } from '../service/Service';
import { sqlite3_repoBD, repoBD } from '../repositorioBD/Appointment';

const repo = new sqlite3_repoBD(); //para inicialziar as camadas repositorio e service
const service = new Service(repo);

const app = express();
const PORT = 3000;

//configura o express para ler json
app.use(express.json());

//GET para listar compromissos
app.get('/compromissos', (request: Request, response: Response) => {
    try {
        //chama o listarCompromissos do Service
        const compromissos = service.listarCompromissos();
        
        //formata os dados para garantir que a saída não tenha problemas de fuso horário
        const compromissosFormatados = compromissos.map(c => service.exibirCompromisso(c));
        
        //retorna a lista formatada em formato json
        return response.status(200).json(compromissosFormatados);
    } catch (erro) {
        return response.status(500).json({ erro: 'Erro ao listar compromissos.' });
    }
});

//POST para adicionar um novo compromisso
app.post('/compromissos', (request: Request, response: Response) => {
    const { horario_inicio, horario_fim, descricao } = request.body;

    //chama o adicionarCompromisso do Service
    try {
        const novoCompromisso = service.adicionarCompromisso(horario_inicio, horario_fim, descricao);
        return response.status(201).json(service.exibirCompromisso(novoCompromisso));

        //caso encontre erros como: (choque, formato inválido) do service
    } catch (error: any) {
        return response.status(400).json({ erro: error.message });
    }
});

//inicializa o servidor na porta definida
app.listen(PORT, () => {
    console.log(`[REST Adapter] Porta: ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});