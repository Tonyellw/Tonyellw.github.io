# SISTEMA - App de Evolução Pessoal

Sistema minimalista de progressão pessoal inspirado em RPG, com foco em disciplina e execução mensurável.
https://sistenby-my-g13a-mz26hn6sd-tonyellws-projects.vercel.app/

## Características

- ✅ Missões diárias fixas (4)
- 🔄 Missões rotativas em ciclos de 3 dias (A, B, C)
- 📊 Sistema de atributos (Força, Stamina, Disciplina, Autocontrole)
- 📈 Progressão semanal com taxa de conclusão
- ❄️ Sistema de congelamento por falhas consecutivas
- 💾 Armazenamento local persistente
- 🌙 Design minimalista escuro

## Estrutura de Arquivos

```
sistema-app/
├── index.html          # Estrutura principal
├── styles.css          # Estilos minimalistas escuros
├── script.js           # Lógica do sistema
└── README.md           # Este arquivo
```

## Como Usar

1. Abra o arquivo `index.html` em um navegador moderno
2. Marque missões como concluídas (✔) ou falhadas (✘)
3. Acompanhe sua progressão nas barras de atributos
4. Mantenha consistência para evitar congelamento

## Regras do Sistema

### Missões Diárias Fixas
- Movimento físico (min 20min)
- Evolução mental (min 10min)
- Autocontrole digital (sem impulsividade)
- Registro alimentar consciente

### Ciclos Rotativos (3 dias cada)

**CICLO A:**
- Dormir mínimo configurável
- 2L água

**CICLO B:**
- Zero açúcar industrial
- Resolver 1 pendência

**CICLO C:**
- Fazer algo desconfortável
- Organizar ambiente

### Atributos

**FORÇA**
- Sobe com treino de força registrado
- Progressão de carga/repetição
- Mínimo 3x por semana

**STAMINA**
- Sobe com cardio 2x por semana
- Sem 2 dias consecutivos sem estímulo

**DISCIPLINA**
- Baseada na taxa semanal
- 80%+ → sobe
- 90%+ → sobe + bônus
- <60% → regressão

**AUTOCONTROLE**
- Sobe com 7 dias sem falha digital
- Reset imediato ao falhar

### Penalidades

- **2 dias de falha consecutivos**: Sistema congela por 48h
- **Taxa semanal <60%**: Regressão de disciplina
- **Falha digital**: Reset do contador de autocontrole

## Tecnologias

- HTML5
- CSS3 (Design system minimalista)
- JavaScript Vanilla (ES6+)
- LocalStorage (Persistência)

## Filosofia

> Disciplina antes de motivação.
> Identidade antes de resultado.
> Execução antes de emoção.

## Desenvolvimento Futuro

Para converter em app mobile nativo:
- React Native
- Flutter
- Capacitor/Ionic

## Licença

Projeto pessoal de evolução.
