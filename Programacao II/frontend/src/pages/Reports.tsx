import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { servicoApi } from '../services/api';

interface RelatorioData {
    lancamentos: any[];
    totais: {
        total_lancamentos: number;
        total_entradas: number;
        total_saidas: number;
    };
}

 const Reports: React.FC = () => {
    const [filtros, setFiltros] = useState({
        dataInicio: '',
        dataFim: '',
        tipo: '',
        placaVeiculo: '',
        idTipoLancamento: ''
    });
    const [relatorio, setRelatorio] = useState<RelatorioData | null>(null);

   const gerarRelatorio = async () => {
    try {
        const params = new URLSearchParams(filtros);
        const response = await servicoApi.get<{ data: RelatorioData }>(`/relatorios/lancamentos?${params}`);
        setRelatorio(response.data);
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
    }
};


    return (
        <Container>
            <h1>Relatórios</h1>

            <Card className="mb-4">
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Data Início</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filtros.dataInicio}
                                        onChange={e => setFiltros({...filtros, dataInicio: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Data Fim</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filtros.dataFim}
                                        onChange={e => setFiltros({...filtros, dataFim: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button onClick={gerarRelatorio}>Gerar Relatório</Button>
                    </Form>
                </Card.Body>
            </Card>

            {relatorio && (
                <Card>
                    <Card.Body>
                        {/* Renderize os dados do relatório aqui */}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};
export default Reports;
