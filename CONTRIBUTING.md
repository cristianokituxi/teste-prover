# Contribuindo

Obrigado pelo interesse em contribuir com o projeto!

## Como contribuir

1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Faça suas alterações seguindo os padrões do projeto
4. Execute os testes: `npm test`
5. Execute o lint: `npm run lint`
6. Commit usando mensagens descritivas
7. Push e abra um Pull Request

## Padrões de código

- TypeScript strict mode
- ESLint + Prettier configurados
- Testes para novas funcionalidades
- Componentes usando exclusivamente Gluestack UI
- Arquitetura Feature First

## Scripts úteis

```bash
npm run typecheck   # Verificar tipos
npm run lint        # Verificar lint
npm run lint:fix    # Corrigir lint
npm run format      # Formatar código
npm test            # Rodar testes
```

## Estrutura

```
src/features/   # Features (schools, classes)
src/shared/     # Componentes, serviços, stores compartilhados
app/            # Rotas Expo Router
__tests__/      # Testes
```
