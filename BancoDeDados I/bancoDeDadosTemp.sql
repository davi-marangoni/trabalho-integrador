CREATE DATABASE integrador;

-- public.tipl_tipo_lancamento definição

-- Drop table

-- DROP TABLE public.tipl_tipo_lancamento;

CREATE TABLE public.tipl_tipo_lancamento (
	tipl_codigo serial4 NOT NULL,
	tipl_descricao text NOT NULL,
	tipl_tipo int4 NOT NULL,
	CONSTRAINT tipl_tipo_lancamento_pkey PRIMARY KEY (tipl_codigo)
);


-- public.usua_usuario definição

-- Drop table

-- DROP TABLE public.usua_usuario;

CREATE TABLE public.usua_usuario (
	usua_email varchar(255) NOT NULL,
	usua_senha varchar(100) NULL,
	usua_tipo_usuario int4 NULL,
	CONSTRAINT usua_usuario_pkey PRIMARY KEY (usua_email)
);


-- public.frot_frota definição

-- Drop table

-- DROP TABLE public.frot_frota;

CREATE TABLE public.frot_frota (
	frot_codigo serial4 NOT NULL,
	frot_usua_email varchar(255) NOT NULL,
	CONSTRAINT frot_frota_pkey PRIMARY KEY (frot_codigo),
	CONSTRAINT fk_frot_usua FOREIGN KEY (frot_usua_email) REFERENCES public.usua_usuario(usua_email)
);


-- public.veic_veiculo definição

-- Drop table

-- DROP TABLE public.veic_veiculo;

CREATE TABLE public.veic_veiculo (
	veic_placa varchar(20) NOT NULL,
	veic_modelo varchar(100) NULL,
	veic_renavam varchar(50) NULL,
	veic_situacao varchar(1) NOT NULL,
	veic_tipo int4 NOT NULL,
	veic_ano int4 NULL,
	veic_usua_email varchar(255) NOT NULL,
	CONSTRAINT veic_veiculo_pkey PRIMARY KEY (veic_placa),
	CONSTRAINT fk_veic_usua FOREIGN KEY (veic_usua_email) REFERENCES public.usua_usuario(usua_email)
);


-- public.carf_carreta_frigorifica definição

-- Drop table

-- DROP TABLE public.carf_carreta_frigorifica;

CREATE TABLE public.carf_carreta_frigorifica (
	carf_veic_placa varchar(20) NOT NULL,
	carf_marca_equip_frio varchar(100) NULL,
	carf_ano_equipamento int4 NULL,
	carf_qtd_paletes int4 NULL,
	carf_frot_codigo int4 NULL,
	CONSTRAINT carf_carreta_frigorifica_pkey PRIMARY KEY (carf_veic_placa),
	CONSTRAINT fk_carf_frot FOREIGN KEY (carf_frot_codigo) REFERENCES public.frot_frota(frot_codigo),
	CONSTRAINT fk_carf_veic FOREIGN KEY (carf_veic_placa) REFERENCES public.veic_veiculo(veic_placa)
);


-- public.cava_cavalo definição

-- Drop table

-- DROP TABLE public.cava_cavalo;

CREATE TABLE public.cava_cavalo (
	cava_veic_placa varchar(20) NOT NULL,
	cava_trucado varchar(1) NULL,
	cava_frot_codigo int4 NULL,
	CONSTRAINT cava_cavalo_pkey PRIMARY KEY (cava_veic_placa),
	CONSTRAINT fk_cava_frot FOREIGN KEY (cava_frot_codigo) REFERENCES public.frot_frota(frot_codigo),
	CONSTRAINT fk_cava_veic FOREIGN KEY (cava_veic_placa) REFERENCES public.veic_veiculo(veic_placa)
);


-- public.lanc_lancamento definição

-- Drop table

-- DROP TABLE public.lanc_lancamento;

CREATE TABLE public.lanc_lancamento (
	lanc_codigo serial4 NOT NULL,
	lanc_valor numeric(12, 2) NOT NULL,
	lanc_data date NOT NULL,
	lanc_arquivo text NULL,
	lanc_tipl_codigo int4 NOT NULL,
	lanc_veic_placa varchar(20) NOT NULL,
	CONSTRAINT lanc_lancamento_pkey PRIMARY KEY (lanc_codigo),
	CONSTRAINT fk_lanc_tipl FOREIGN KEY (lanc_tipl_codigo) REFERENCES public.tipl_tipo_lancamento(tipl_codigo),
	CONSTRAINT fk_lanc_veic FOREIGN KEY (lanc_veic_placa) REFERENCES public.veic_veiculo(veic_placa)
);


-- public.abas_abastecimento definição

-- Drop table

-- DROP TABLE public.abas_abastecimento;

CREATE TABLE public.abas_abastecimento (
	abas_lanc_codigo int4 NOT NULL,
	abas_posto_gasolina varchar(200) NULL,
	abas_tipo_combustivel varchar(50) NULL,
	abas_valor_unitario numeric(12, 4) NULL,
	abas_quantidade numeric(12, 3) NULL,
	abas_valor_total numeric(12, 2) NULL,
	abas_km_rodados int4 NULL,
	CONSTRAINT abas_abastecimento_pkey PRIMARY KEY (abas_lanc_codigo),
	CONSTRAINT fk_abas_lanc FOREIGN KEY (abas_lanc_codigo) REFERENCES public.lanc_lancamento(lanc_codigo)
);


-- public.ctre_conhecimento_transporte definição

-- Drop table

-- DROP TABLE public.ctre_conhecimento_transporte;

CREATE TABLE public.ctre_conhecimento_transporte (
	ctre_lanc_codigo int4 NOT NULL,
	ctre_numero varchar(100) NULL,
	ctre_serie varchar(50) NULL,
	CONSTRAINT ctre_conhecimento_transporte_pkey PRIMARY KEY (ctre_lanc_codigo),
	CONSTRAINT fk_ctre_lanc FOREIGN KEY (ctre_lanc_codigo) REFERENCES public.lanc_lancamento(lanc_codigo)
);



-- DROP ROLE usuario_api;

CREATE ROLE usuario_api WITH 
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	NOINHERIT
	LOGIN
	NOREPLICATION
	NOBYPASSRLS
	CONNECTION LIMIT -1;

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



-- Usuario padrao
-- email: suporte@integrador.com, senha: 123456
INSERT INTO public.usua_usuario (usua_email, usua_senha, usua_tipo_usuario) VALUES('suporte@integrador.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1);
