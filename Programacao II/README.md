# Trabalho Integrador

Este projeto depende de um banco de dados PostgreSQL. Foi utilizada a imagem `postgres:latest` (PostgreSQL 17.5) do DockerHub, com o seguinte `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:latest
    container_name: postgres-db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: posrgres
      POSTGRES_DB: teste
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

O arquivo SQL necessário para criar a base de dados, tabelas, role de usuário para a API e um usuário padrão para acesso ao sistema está disponível em:

[https://github.com/davi-marangoni/trabalho-integrador/blob/main/BancoDeDados%20I/bancoDeDadosTemp.sql](https://github.com/davi-marangoni/trabalho-integrador/blob/main/BancoDeDados%20I/bancoDeDadosTemp.sql)

Demais instruções sobre instalação e execução de cada projeto podem ser encontradas nos respectivos READMEs das pastas `backend` e `frontend`.