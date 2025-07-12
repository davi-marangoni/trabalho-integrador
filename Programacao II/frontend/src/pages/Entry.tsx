import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { servicoApi } from '../services/api'

interface Lancamento {
  id: number;
  valor: number;
  data: string;
  arquivo: string;
  idTipoLancamento: number;
  placaVeiculo: string;
  emailUsuarioAdicionou: string;
}

export default function Entry() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  axios.get('/api/lancamentos')
    .then(res => {
      if (res.data && res.data.data) {
        setLancamentos(res.data.data);
      } else {
        setLancamentos([]);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error('Erro ao buscar lançamentos:', err);
      setLoading(false);
    });
}, []);

  const fetchLancamentos = async () => {
      try {
        setLoading(true)
        const result = await servicoApi.get<{ success: boolean; data: Lancamento[]; message: string }>('/veiculos')

        if (result.success) {
          setLancamentos(result.data)
        } else {
          console.error('Erro ao buscar lancamentos:', result.message)
        }
      } catch (error) {
        console.error('Erro na requisição:', error)
      } finally {
        setLoading(false)
      }
    }

  return (
    <div>
      <h2>Lançamentos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Placa Veículo</th>
              <th>Email Usuário</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.valor}</td>
                <td>{new Date(l.data).toLocaleDateString()}</td>
                <td>{l.idTipoLancamento}</td>
                <td>{l.placaVeiculo}</td>
                <td>{l.emailUsuarioAdicionou}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
