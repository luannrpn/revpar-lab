# RevPAR Lab

Simulador de gestão de receita para hotéis independentes. Mexa em ocupação e diária média e veja RevPAR, TRevPAR, GOPPAR, receita e GOP mensais, a ocupação de equilíbrio e um mapa de sensibilidade.

**Demo:** https://luannrpn.github.io/revpar-lab/

## Fórmulas

- `RevPAR = ADR × ocupação`
- `TRevPAR = (ADR + receita extra) × ocupação`
- `GOP = noites vendidas × (ADR + extra) − noites vendidas × CPOR − custos fixos`
- `GOPPAR = GOP ÷ noites disponíveis`
- `ocupação de equilíbrio = custos fixos ÷ (noites disponíveis × (ADR + extra − CPOR))`

Simplificações: mês de 30 dias e custos fixos mensais. É uma ferramenta de estudo.

## Rodar localmente

```bash
npm install
npm run dev
npm test
npm run build
```

## Tecnologias

Vite, TypeScript, GSAP + ScrollTrigger, Lenis e [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) (`@fontsource-variable/instrument-sans`, licença OFL).

## Autoria

Autor: **Luann Neves** ([@luannrpn](https://github.com/luannrpn)). Veja [AUTHORS.md](AUTHORS.md), [LICENSE](LICENSE) (MIT) e [CITATION.cff](CITATION.cff).
