CREATE DATABASE integrador;

CREATE ROLE usuario_api WITH 
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	NOINHERIT
	LOGIN
	NOREPLICATION
	NOBYPASSRLS
	CONNECTION LIMIT -1;



CREATE TABLE public.usua_usuario ( usua_email varchar(255) NOT NULL,
usua_senha varchar(100) NULL,
usua_tipo_usuario int4 NULL,
CONSTRAINT usua_usuario_pkey PRIMARY KEY (usua_email));

ALTER TABLE public.usua_usuario OWNER TO postgres;
GRANT ALL ON TABLE public.usua_usuario TO postgres;
GRANT INSERT, SELECT, DELETE, UPDATE ON TABLE public.usua_usuario TO usuario_api;


--------------

CREATE TABLE public.tipl_tipo_lancamento ( tipl_codigo serial4 NOT NULL,
tipl_descricao text NOT NULL,
tipl_tipo int4 NOT NULL,
tipl_usua_email varchar(255) NOT NULL,
CONSTRAINT tipl_tipo_lancamento_pkey PRIMARY KEY (tipl_codigo));

ALTER TABLE public.tipl_tipo_lancamento OWNER TO postgres;
GRANT ALL ON TABLE public.tipl_tipo_lancamento TO postgres;
GRANT INSERT, SELECT, DELETE, UPDATE ON TABLE public.tipl_tipo_lancamento TO usuario_api;

ALTER TABLE public.tipl_tipo_lancamento ADD CONSTRAINT fk_tipl_usua FOREIGN KEY (tipl_usua_email) REFERENCES public.usua_usuario(usua_email);


-------------

CREATE TABLE public.veic_veiculo ( veic_placa varchar(20) NOT NULL,
veic_modelo varchar(100) NULL,
veic_renavam varchar(50) NULL,
veic_situacao varchar(1) NOT NULL,
veic_tipo int4 NOT NULL,
veic_ano int4 NULL,
veic_usua_email varchar(255) NOT NULL,
CONSTRAINT veic_veiculo_pkey PRIMARY KEY (veic_placa));

ALTER TABLE public.veic_veiculo OWNER TO postgres;
GRANT ALL ON TABLE public.veic_veiculo TO postgres;
GRANT INSERT, SELECT, DELETE, UPDATE ON TABLE public.veic_veiculo TO usuario_api;

ALTER TABLE public.veic_veiculo ADD CONSTRAINT fk_veic_usua FOREIGN KEY (veic_usua_email) REFERENCES public.usua_usuario(usua_email);

-------------

CREATE TABLE public.cava_cavalo ( cava_veic_placa varchar(20) NOT NULL,
cava_trucado varchar(1) NULL,
cava_frot_codigo int4 NULL,
CONSTRAINT cava_cavalo_pkey PRIMARY KEY (cava_veic_placa));

ALTER TABLE public.cava_cavalo OWNER TO postgres;
GRANT ALL ON TABLE public.cava_cavalo TO postgres;
GRANT INSERT, SELECT, DELETE, UPDATE ON TABLE public.cava_cavalo TO usuario_api;

ALTER TABLE public.cava_cavalo ADD CONSTRAINT fk_cava_frot FOREIGN KEY (cava_frot_codigo) REFERENCES public.frot_frota(frot_codigo);
ALTER TABLE public.cava_cavalo ADD CONSTRAINT fk_cava_veic FOREIGN KEY (cava_veic_placa) REFERENCES public.veic_veiculo(veic_placa);

-------------

CREATE TABLE public.carf_carreta_frigorifica ( carf_veic_placa varchar(20) NOT NULL,
carf_marca_equip_frio varchar(100) NULL,
carf_ano_equipamento int4 NULL,
carf_qtd_paletes int4 NULL,
carf_frot_codigo int4 NULL,
CONSTRAINT carf_carreta_frigorifica_pkey PRIMARY KEY (carf_veic_placa));


ALTER TABLE public.carf_carreta_frigorifica OWNER TO postgres;
GRANT ALL ON TABLE public.carf_carreta_frigorifica TO postgres;
GRANT INSERT, SELECT, DELETE, UPDATE ON TABLE public.carf_carreta_frigorifica TO usuario_api;


ALTER TABLE public.carf_carreta_frigorifica ADD CONSTRAINT fk_carf_frot FOREIGN KEY (carf_frot_codigo) REFERENCES public.frot_frota(frot_codigo);
ALTER TABLE public.carf_carreta_frigorifica ADD CONSTRAINT fk_carf_veic FOREIGN KEY (carf_veic_placa) REFERENCES public.veic_veiculo(veic_placa);


-------

create table public.frot_frota ( frot_codigo serial4 not null,
frot_usua_email varchar(255) not null,
constraint frot_frota_pkey primary key (frot_codigo));

ALTER TABLE public.frot_frota OWNER TO postgres;
GRANT ALL ON TABLE public.frot_frota TO postgres;
GRANT INSERT, SELECT, DELETE, UPDATE ON TABLE public.frot_frota TO usuario_api;

ALTER TABLE public.frot_frota ADD CONSTRAINT fk_frot_usua FOREIGN KEY (frot_usua_email) REFERENCES public.usua_usuario(usua_email);

-------------

create table public.lanc_lancamento ( lanc_codigo serial4 not null,
lanc_valor numeric(12, 2) not null,
lanc_data date not null,
lanc_arquivo text null,
lanc_tipl_codigo int4 not null,
lanc_veic_placa varchar(20) not null,
lanc_usua_email varchar(255) not null,
constraint lanc_lancamento_pkey primary key (lanc_codigo));

ALTER TABLE public.lanc_lancamento OWNER TO postgres;
GRANT ALL ON TABLE public.lanc_lancamento TO postgres;
GRANT INSERT, SELECT, DELETE, UPDATE ON TABLE public.lanc_lancamento TO usuario_api;


ALTER TABLE public.lanc_lancamento ADD CONSTRAINT fk_lanc_tipl FOREIGN KEY (lanc_tipl_codigo) REFERENCES public.tipl_tipo_lancamento(tipl_codigo);
ALTER TABLE public.lanc_lancamento ADD CONSTRAINT fk_lanc_veic FOREIGN KEY (lanc_veic_placa) REFERENCES public.veic_veiculo(veic_placa);
ALTER TABLE public.lanc_lancamento ADD CONSTRAINT fk_lanc_usua FOREIGN KEY (lanc_usua_email) REFERENCES public.usua_usuario(usua_email);


---------

create table public.ctre_conhecimento_transporte ( ctre_lanc_codigo int4 not null,
ctre_numero varchar(100) null,
ctre_serie varchar(50) null,
constraint ctre_conhecimento_transporte_pkey primary key (ctre_lanc_codigo));

ALTER TABLE public.ctre_conhecimento_transporte OWNER TO postgres;
GRANT ALL ON TABLE public.ctre_conhecimento_transporte TO postgres;
GRANT INSERT, SELECT, DELETE, UPDATE ON TABLE public.ctre_conhecimento_transporte TO usuario_api;


ALTER TABLE public.ctre_conhecimento_transporte ADD CONSTRAINT fk_ctre_lanc FOREIGN KEY (ctre_lanc_codigo) REFERENCES public.lanc_lancamento(lanc_codigo);


-----------

create table public.abas_abastecimento ( abas_lanc_codigo int4 not null,
abas_posto_gasolina varchar(200) null,
abas_tipo_combustivel varchar(50) null,
abas_valor_unitario numeric(12, 4) null,
abas_quantidade numeric(12, 3) null,
abas_valor_total numeric(12, 2) null,
abas_km_rodados int4 null,
constraint abas_abastecimento_pkey primary key (abas_lanc_codigo));

ALTER TABLE public.abas_abastecimento OWNER TO postgres;
GRANT ALL ON TABLE public.abas_abastecimento TO postgres;
GRANT INSERT, SELECT, DELETE, UPDATE ON TABLE public.abas_abastecimento TO usuario_api;


ALTER TABLE public.abas_abastecimento ADD CONSTRAINT fk_abas_lanc FOREIGN KEY (abas_lanc_codigo) REFERENCES public.lanc_lancamento(lanc_codigo);







-- Permissions

GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.abas_abastecimento TO usuario_api;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.carf_carreta_frigorifica TO usuario_api;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.cava_cavalo TO usuario_api;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.ctre_conhecimento_transporte TO usuario_api;
GRANT INSERT, UPDATE, SELECT ON TABLE public.frot_frota TO usuario_api;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.lanc_lancamento TO usuario_api;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.tipl_tipo_lancamento TO usuario_api;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.usua_usuario TO usuario_api;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.veic_veiculo TO usuario_api;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.abas_abastecimento TO usuario_api;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.carf_carreta_frigorifica TO usuario_api;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.cava_cavalo TO usuario_api;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.ctre_conhecimento_transporte TO usuario_api;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.frot_frota TO usuario_api;
GRANT SELECT, UPDATE, USAGE ON SEQUENCE public.frot_frota_frot_codigo_seq TO usuario_api;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.lanc_lancamento TO usuario_api;
GRANT SELECT, UPDATE, USAGE ON SEQUENCE public.lanc_lancamento_lanc_codigo_seq TO usuario_api;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.tipl_tipo_lancamento TO usuario_api;
GRANT SELECT, UPDATE, USAGE ON SEQUENCE public.tipl_tipo_lancamento_tipl_codigo_seq TO usuario_api;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.usua_usuario TO usuario_api;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.veic_veiculo TO usuario_api;


-- Usuario padrao
-- email: suporte@integrador.com, senha: 123456
INSERT INTO public.usua_usuario (usua_email, usua_senha, usua_tipo_usuario) VALUES('suporte@integrador.com', '$2b$12$foAQKk3tpFA1E7kMeHhvVuxB0L1buSz5m5HPVp6AbfQpJKQBmDbbe', 1);
