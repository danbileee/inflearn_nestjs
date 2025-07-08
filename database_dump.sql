--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: user_model_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_model_role_enum AS ENUM (
    'User',
    'Admin'
);


ALTER TYPE public.user_model_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chat_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_model (
    id integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.chat_model OWNER TO postgres;

--
-- Name: chat_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chat_model_id_seq OWNER TO postgres;

--
-- Name: chat_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_model_id_seq OWNED BY public.chat_model.id;


--
-- Name: image_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image_model (
    id integer NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    type character varying NOT NULL,
    "targetId" integer NOT NULL,
    path character varying NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.image_model OWNER TO postgres;

--
-- Name: image_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.image_model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.image_model_id_seq OWNER TO postgres;

--
-- Name: image_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.image_model_id_seq OWNED BY public.image_model.id;


--
-- Name: message_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message_model (
    id integer NOT NULL,
    message character varying NOT NULL,
    "chatId" integer,
    "authorId" integer,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.message_model OWNER TO postgres;

--
-- Name: message_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.message_model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.message_model_id_seq OWNER TO postgres;

--
-- Name: message_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.message_model_id_seq OWNED BY public.message_model.id;


--
-- Name: post_comment_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_comment_model (
    id integer NOT NULL,
    content character varying NOT NULL,
    "likeCount" integer NOT NULL,
    "authorId" integer NOT NULL,
    "postId" integer,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.post_comment_model OWNER TO postgres;

--
-- Name: post_comment_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_comment_model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_comment_model_id_seq OWNER TO postgres;

--
-- Name: post_comment_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_comment_model_id_seq OWNED BY public.post_comment_model.id;


--
-- Name: post_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_model (
    id integer NOT NULL,
    title character varying NOT NULL,
    content character varying NOT NULL,
    "likeCount" integer NOT NULL,
    "authorId" integer NOT NULL,
    "commentsCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.post_model OWNER TO postgres;

--
-- Name: post_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_model_id_seq OWNER TO postgres;

--
-- Name: post_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_model_id_seq OWNED BY public.post_model.id;


--
-- Name: relationship_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relationship_model (
    id integer NOT NULL,
    "followerId" integer,
    "followeeId" integer,
    "confirmedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.relationship_model OWNER TO postgres;

--
-- Name: relationship_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.relationship_model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.relationship_model_id_seq OWNER TO postgres;

--
-- Name: relationship_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.relationship_model_id_seq OWNED BY public.relationship_model.id;


--
-- Name: user_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_model (
    id integer NOT NULL,
    nickname character varying(20) NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role public.user_model_role_enum DEFAULT 'User'::public.user_model_role_enum NOT NULL,
    "followersCount" integer DEFAULT 0 NOT NULL,
    "followeesCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_model OWNER TO postgres;

--
-- Name: user_model_chats_chat_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_model_chats_chat_model (
    "userModelId" integer NOT NULL,
    "chatModelId" integer NOT NULL
);


ALTER TABLE public.user_model_chats_chat_model OWNER TO postgres;

--
-- Name: user_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_model_id_seq OWNER TO postgres;

--
-- Name: user_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_model_id_seq OWNED BY public.user_model.id;


--
-- Name: chat_model id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_model ALTER COLUMN id SET DEFAULT nextval('public.chat_model_id_seq'::regclass);


--
-- Name: image_model id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image_model ALTER COLUMN id SET DEFAULT nextval('public.image_model_id_seq'::regclass);


--
-- Name: message_model id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_model ALTER COLUMN id SET DEFAULT nextval('public.message_model_id_seq'::regclass);


--
-- Name: post_comment_model id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_comment_model ALTER COLUMN id SET DEFAULT nextval('public.post_comment_model_id_seq'::regclass);


--
-- Name: post_model id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_model ALTER COLUMN id SET DEFAULT nextval('public.post_model_id_seq'::regclass);


--
-- Name: relationship_model id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_model ALTER COLUMN id SET DEFAULT nextval('public.relationship_model_id_seq'::regclass);


--
-- Name: user_model id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_model ALTER COLUMN id SET DEFAULT nextval('public.user_model_id_seq'::regclass);


--
-- Data for Name: post_model; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.post_model (id, title, content, "likeCount", "authorId", "commentsCount", "createdAt", "updatedAt")
VALUES (1,	'Awesome Post',	'hahahhohohohoho',	0,	1,	0,	'2025-07-07 11:36:22.466825+00',	'2025-07-07 11:36:30.545253+00');


--
-- Data for Name: relationship_model; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.relationship_model (id, "followerId", "followeeId", "confirmedAt", "createdAt", "updatedAt")
VALUES (8,	2,	1,	\N,	'2025-07-07 11:36:22.466825+00',	'2025-07-07 11:36:30.545253+00'),
(9,	3,	1,	'2025-07-07 11:35:37.159+00',	'2025-07-07 11:36:22.466825+00',	'2025-07-07 11:36:30.545253+00');


--
-- Data for Name: user_model; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_model (id, nickname, email, password, role, "followersCount", "followeesCount", "createdAt", "updatedAt")
VALUES (2,	'Faith Lee',	'maga2@us.org',	'$2b$10$EF8On7z9RNaYpYXrv.GJiuLxGVd5aOwL51gjCgtpPRSgGzIZfHpY.',	'User',	0,	1,	'2025-07-07 11:36:22.466825+00',	'2025-07-07 11:36:30.545253+00'),
(1,	'Uncle Sam',	'maga@us.org',	'$2b$10$NAOGPR0myGcTSgYziZ2vQeJk2I60TY0ALFAvTY0.QrYhO.8oxcUim',	'User',	2,	0,	'2025-07-07 11:36:22.466825+00',	'2025-07-07 11:36:30.545253+00'),
(3,	'Dummy User',	'maga3@us.org',	'$2b$10$Hhj086hk3vIPQz8tEMn//.Et2ULvMsfEWmI1IFb3E09RBF6eC5P8.',	'Admin',	0,	1,	'2025-07-07 11:36:22.466825+00',	'2025-07-07 11:36:30.545253+00');



--
-- Name: chat_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_model_id_seq', 1, false);


--
-- Name: image_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.image_model_id_seq', 1, false);


--
-- Name: message_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.message_model_id_seq', 1, false);


--
-- Name: post_comment_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_comment_model_id_seq', 1, true);


--
-- Name: post_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_model_id_seq', 1, true);


--
-- Name: relationship_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.relationship_model_id_seq', 9, true);


--
-- Name: user_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_model_id_seq', 3, true);


--
-- Name: image_model PK_05aa8703890985ec0bb38428699; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image_model
    ADD CONSTRAINT "PK_05aa8703890985ec0bb38428699" PRIMARY KEY (id);


--
-- Name: user_model PK_7d6bfa71f4d6a1fa0af1f688327; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_model
    ADD CONSTRAINT "PK_7d6bfa71f4d6a1fa0af1f688327" PRIMARY KEY (id);


--
-- Name: post_model PK_9d352db580aaf4e810bf9bb9302; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_model
    ADD CONSTRAINT "PK_9d352db580aaf4e810bf9bb9302" PRIMARY KEY (id);


--
-- Name: chat_model PK_aa10e398bab76d17ec7aca4d03a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_model
    ADD CONSTRAINT "PK_aa10e398bab76d17ec7aca4d03a" PRIMARY KEY (id);


--
-- Name: message_model PK_c142fe554aa566b73529b1c47cc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_model
    ADD CONSTRAINT "PK_c142fe554aa566b73529b1c47cc" PRIMARY KEY (id);


--
-- Name: user_model_chats_chat_model PK_c1dc13b41bb0d0da33bd44e22d9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_model_chats_chat_model
    ADD CONSTRAINT "PK_c1dc13b41bb0d0da33bd44e22d9" PRIMARY KEY ("userModelId", "chatModelId");


--
-- Name: relationship_model PK_d63e8fc031efbd8d6e7a901e578; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_model
    ADD CONSTRAINT "PK_d63e8fc031efbd8d6e7a901e578" PRIMARY KEY (id);


--
-- Name: post_comment_model PK_da7a7b29e960b7abcaa0e4fa289; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_comment_model
    ADD CONSTRAINT "PK_da7a7b29e960b7abcaa0e4fa289" PRIMARY KEY (id);


--
-- Name: user_model UQ_4c620076a03d13dd4a8e8657eee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_model
    ADD CONSTRAINT "UQ_4c620076a03d13dd4a8e8657eee" UNIQUE (nickname);


--
-- Name: user_model UQ_864bd044bba869304084843358e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_model
    ADD CONSTRAINT "UQ_864bd044bba869304084843358e" UNIQUE (email);


--
-- Name: IDX_6f6a90e59b3b5137a2d3086a5b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6f6a90e59b3b5137a2d3086a5b" ON public.user_model_chats_chat_model USING btree ("chatModelId");


--
-- Name: IDX_e07e58a2d177ecb596931ca6ac; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e07e58a2d177ecb596931ca6ac" ON public.user_model_chats_chat_model USING btree ("userModelId");


--
-- Name: post_comment_model FK_171ac96d6436c43f74d0cb00813; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_comment_model
    ADD CONSTRAINT "FK_171ac96d6436c43f74d0cb00813" FOREIGN KEY ("postId") REFERENCES public.post_model(id);


--
-- Name: relationship_model FK_301d121b996136fd49fbfefe791; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_model
    ADD CONSTRAINT "FK_301d121b996136fd49fbfefe791" FOREIGN KEY ("followerId") REFERENCES public.user_model(id);


--
-- Name: post_model FK_590213e588a9d26684d9d5e3329; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_model
    ADD CONSTRAINT "FK_590213e588a9d26684d9d5e3329" FOREIGN KEY ("authorId") REFERENCES public.user_model(id);


--
-- Name: post_comment_model FK_615159752a0f60dc8c82f7ce397; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_comment_model
    ADD CONSTRAINT "FK_615159752a0f60dc8c82f7ce397" FOREIGN KEY ("authorId") REFERENCES public.user_model(id);


--
-- Name: user_model_chats_chat_model FK_6f6a90e59b3b5137a2d3086a5bd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_model_chats_chat_model
    ADD CONSTRAINT "FK_6f6a90e59b3b5137a2d3086a5bd" FOREIGN KEY ("chatModelId") REFERENCES public.chat_model(id);


--
-- Name: relationship_model FK_ddf6634ab516e62d46b586c4e95; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_model
    ADD CONSTRAINT "FK_ddf6634ab516e62d46b586c4e95" FOREIGN KEY ("followeeId") REFERENCES public.user_model(id);


--
-- Name: user_model_chats_chat_model FK_e07e58a2d177ecb596931ca6acc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_model_chats_chat_model
    ADD CONSTRAINT "FK_e07e58a2d177ecb596931ca6acc" FOREIGN KEY ("userModelId") REFERENCES public.user_model(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message_model FK_e9b5bd9caa7143a0eaebd54aa17; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_model
    ADD CONSTRAINT "FK_e9b5bd9caa7143a0eaebd54aa17" FOREIGN KEY ("authorId") REFERENCES public.user_model(id);


--
-- Name: message_model FK_f4ad5be6de0ac971e249b38521f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_model
    ADD CONSTRAINT "FK_f4ad5be6de0ac971e249b38521f" FOREIGN KEY ("chatId") REFERENCES public.chat_model(id);


--
-- PostgreSQL database dump complete
--

