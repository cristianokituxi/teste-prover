# 🏫 Gestão Escolar — Desafio Prover

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.83-61dafb?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2055-000020?logo=expo)](https://expo.dev/)
[![Tests](https://img.shields.io/badge/tests-41%20passed-brightgreen)](.)
[![CI](https://img.shields.io/badge/CI-passing-brightgreen)](.)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

Aplicativo mobile multiplataforma para **gestão de escolas públicas e turmas**, desenvolvido com Expo + React Native + TypeScript, seguindo padrões de arquitetura corporativa.

<br>

> ⚡ **Tempo médio para testar:** menos de 2 minutos  
> 🔑 **Login:** qualquer usuário e senha não vazios são aceitos

---

## 📋 Objetivo

Permitir que gestores escolares cadastrem, consultem, editem e excluam **escolas** e suas **turmas**, com busca em tempo real, filtros, dashboard de métricas e interface moderna construída exclusivamente com Gluestack UI.

---

## 🛠️ Stack

| Categoria | Tecnologia |
|---|---|
| Framework | React Native `0.83` via Expo SDK `55` |
| Linguagem | TypeScript `5.9` (strict mode) |
| Roteamento | Expo Router (file-based routing) |
| UI | Gluestack UI (exclusivo) |
| Estado | Zustand `5.x` |
| Persistência | AsyncStorage (apenas auth) |
| Formulários | React Hook Form `7.x` + Zod `3.x` |
| HTTP | Axios `1.x` com interceptors |
| Mock API | Mock Service Worker (MSW) `2.x` |
| Testes | Jest `29.x` + React Native Testing Library `14.x` |
| Qualidade | ESLint `8.x` + Prettier `3.x` + Husky `9.x` + lint-staged |
| CI/CD | GitHub Actions |
| Build | EAS Build (Expo Application Services) |

---

## 🏗️ Arquitetura

### Diagrama da Arquitetura

```
┌─────────────────────────────────────────────┐
│                   Expo Router                │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Login   │  │ Schools  │  │  Profile   │  │
│  │  (auth)  │  │  (tabs)  │  │  (tabs)   │  │
│  └──────────┘  └──────────┘  └───────────┘  │
├─────────────────────────────────────────────┤
│              Shared Components               │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │FormField │ │ScreenCont│ │ToastContainer│ │
│  └──────────┘ └──────────┘ └──────────────┘ │
├─────────────────────────────────────────────┤
│          Features (Clean Architecture)       │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │    Schools        │ │    Classes       │  │
│  │  ┌──────┐┌──────┐ │ │ ┌──────┐┌──────┐│  │
│  │  │Hooks ││Store │ │ │ │Hooks ││Store ││  │
│  │  ├──────┤├──────┤ │ │ ├──────┤├──────┤│  │
│  │  │ Repo ││Types │ │ │ │ Repo ││Types ││  │
│  │  └──────┘└──────┘ │ │ └──────┘└──────┘│  │
│  └──────────────────┘ └──────────────────┘  │
├─────────────────────────────────────────────┤
│           Shared Services                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐   │
│  │Axios │ │  MSW │ │  DB  │ │AppError  │   │
│  └──────┘ └──────┘ └──────┘ └──────────┘   │
└─────────────────────────────────────────────┘
```

### Estrutura de Pastas

```
src/
├── features/
│   ├── schools/              # Domínio Escolas
│   │   ├── components/       # SchoolCard
│   │   ├── hooks/            # useSchools, useCreateSchool...
│   │   ├── repository/       # SchoolRepository (Axios)
│   │   ├── store/            # useSchoolStore (Zustand)
│   │   ├── types/            # School, SchoolInput, Shift
│   │   └── validation/       # schoolSchema (Zod)
│   └── classes/              # Domínio Turmas
│       ├── components/       # ClassCard
│       ├── hooks/            # useClasses, useCreateClass...
│       ├── repository/       # ClassRepository
│       ├── store/            # useClassStore
│       ├── types/            # SchoolClass, SchoolClassInput
│       └── validation/       # classSchema (Zod)
└── shared/
    ├── components/           # 10 componentes reutilizáveis
    ├── services/             # apiClient, db, mockHandlers (MSW)
    ├── store/                # useAuthStore, useToastStore
    ├── theme/                # Design tokens centralizados
    └── utils/                # AppError, getFriendlyErrorMessage
```

### Princípios

- **SOLID** — inversão de dependência via Repository Pattern
- **Separation of Concerns** — regras de negócio isoladas das telas
- **DRY / KISS** — componentes reutilizáveis, sem duplicação
- **Feature First** — código agrupado por domínio, não por camada

---

## 💡 Decisões Técnicas

| Decisão | Justificativa |
|---|---|
| **Zustand** sobre Redux | API minimalista, menos boilerplate, persistência nativa com AsyncStorage |
| **Feature First** | Agrupa código relacionado, facilita navegação e extração de pacotes |
| **MSW** para mock | Padrão da indústria, intercepta no nível de rede, funciona com Axios |
| **React Hook Form + Zod** | Performance (sem re-renders), validação type-safe em português |
| **Axios** sobre fetch | Interceptors, timeout, melhor DX para tratamento de erros |
| **Gluestack UI** | Design system consistente, tokens unificados, suporte a temas |
| **Toast system** (Zustand) | Feedback visual não-invasivo com animações |

---

## ✨ Funcionalidades

### Escolas
- ✅ Listagem com **Pull to Refresh**
- ✅ **Busca em tempo real** (nome/endereço)
- ✅ **Filtros rápidos**: Todas / Com turmas / Sem turmas
- ✅ Cadastro com **preview em tempo real**
- ✅ Edição com formulário dedicado
- ✅ Exclusão com modal de confirmação
- ✅ Métricas: total de escolas e turmas

### Turmas
- ✅ Listagem vinculada à escola com banner visual
- ✅ Busca por nome ou turno
- ✅ Cadastro com **seleção cíclica de turno** (Manhã/Tarde/Noite)
- ✅ Edição **inline** com formulário expansível
- ✅ Exclusão com modal de confirmação
- ✅ Métricas: total de turmas, diversidade de turnos
- ✅ **Ações da escola**: editar/excluir no header da tela de turmas

### UX/UI
- ✅ **Dashboard** com métricas na tela inicial
- ✅ **Skeleton Loading** durante carregamento
- ✅ **Pull to Refresh** em todas as listagens
- ✅ **Empty State** ilustrado com CTA
- ✅ **Toast notifications** animados (success/error/info)
- ✅ **Modal de confirmação** para exclusões
- ✅ Estados de **Loading, Error e Empty** em todas as telas
- ✅ **Preview em tempo real** nos formulários
- ✅ Design System com **tokens centralizados**

---

## 🚀 Começando

### Pré-requisitos

- Node.js `>= 20`
- npm `>= 10`

### Instalação

```bash
git clone https://github.com/<user>/desafio-prover.git
cd desafio-prover
npm install --legacy-peer-deps
```

### Executar Localmente

```bash
npx expo start        # Expo Go
npm run android       # Android
npm run ios           # iOS
npm run web           # Web (http://localhost:8081)
```

### Iniciar o MSW

O Mock Service Worker **inicia automaticamente** no bootstrap da aplicação.  
Nenhuma configuração adicional é necessária.

---

## 🧪 Testes

```bash
npm test              # 41 testes em 6 suítes
npm run test:watch    # Modo watch
npm run test:coverage # Com cobertura
```

---

## ✅ Qualidade

```bash
npm run typecheck     # TypeScript
npm run lint          # ESLint
npm run lint:fix      # Corrigir lint
npm run format        # Prettier
npm run format:check  # Verificar formatação
```

---

## 📜 Scripts

| Script | Ação |
|---|---|
| `npm start` | Inicia Expo |
| `npm run android` | Android |
| `npm run ios` | iOS |
| `npm run web` | Web |
| `npm run typecheck` | Verifica TypeScript |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier format |
| `npm test` | Testes |
| `npm run test:coverage` | Cobertura |

---

## 📱 Builds EAS

```bash
# Desenvolvimento (APK debug)
npx eas build --profile development --platform android

# Preview (APK para teste)
npx eas build --profile preview --platform android

# Produção (AAB para Play Store)
npx eas build --profile production --platform android
```

Perfis configurados em [`eas.json`](./eas.json).

---

## 🌐 GitHub Pages

A versão web é publicada automaticamente via GitHub Actions em cada push para `main`.

**Workflow:** [`.github/workflows/deploy-web.yml`](.github/workflows/deploy-web.yml)  
**Configuração:** Expo Web export (`expo export --platform web`)

---

## 🤖 CI/CD

### Pipeline de Qualidade ([ci.yml](.github/workflows/ci.yml))

Executa em todo push e pull request:
- TypeScript typecheck
- ESLint
- Prettier format check
- Jest tests

### Pipeline de Deploy Web ([deploy-web.yml](.github/workflows/deploy-web.yml))

Executa em push na `main`:
- Build web com `expo export --platform web`
- Deploy automático para GitHub Pages

---

## 🖼️ Capturas de Tela

| Login | Dashboard | Turmas |
|---|---|---|
| ![Login](assets/screenshots/login.png) | ![Dashboard](assets/screenshots/dashboard.png) | ![Turmas](assets/screenshots/classes.png) |

| Cadastro Escola | Editar Escola | Perfil |
|---|---|---|
| ![Cadastro](assets/screenshots/schools.png) | ![Editar](assets/screenshots/edit.png) | ![Perfil](assets/screenshots/profile.png) |

> 💡 *Substitua os placeholders por screenshots reais do app em execução.*

---

## 🗺️ Roadmap & Melhorias Futuras

- [ ] Testes de integração com React Native Testing Library
- [ ] Animações avançadas com Reanimated (transições de tela)
- [ ] Temas dark/light mode
- [ ] Internacionalização (i18n)
- [ ] Offline-first com sincronização
- [ ] Integração com API real (substituindo MSW)
- [ ] Publicação na Play Store e App Store

---

## 📊 Trade-offs

| Escolha | Trade-off |
|---|---|
| **MSW em memória** | Dados voláteis, reiniciam ao recarregar o app. Aceitável para demo/POC. |
| **Formulários manuais** (sem RHF em formulários simples) | Simplicidade para forms de 2-3 campos. RHF seria overkill. |
| **Zustand sem devtools** | Menos dependências. Adicionar é trivial se necessário. |
| **Sem i18n inicial** | Código em português hardcoded. Estrutura pronta para extração. |

---

## 👥 Para Avaliadores

| Informação | Detalhe |
|---|---|
| 🔑 **Login** | Qualquer usuário e senha não vazios |
| ⚡ **Tempo para testar** | Menos de 2 minutos |
| 🌐 **Versão Web** | [GitHub Pages](https://<user>.github.io/desafio-prover) |
| 📱 **APK Preview** | [Download na Release](https://github.com/<user>/desafio-prover/releases) |
| 📂 **Código fonte** | `src/features/` e `src/shared/` |

### Fluxo Sugerido para Teste

1. Faça login com qualquer credencial
2. Visualize o dashboard com as escolas cadastradas
3. Cadastre uma nova escola
4. Entre na escola e visualize suas turmas
5. Cadastre uma nova turma
6. Edite uma turma existente
7. Exclua uma turma
8. Edite os dados da escola
9. Volte e use a busca/filtros

---

## 📄 Licença

MIT © 2026 — [LICENSE](./LICENSE)

---

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para diretrizes de contribuição.
