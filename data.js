const GRAD = "2030-07-31";
const PHASES = [
 {n:"Fase 0",t:"Mapa e alicerce",p:"nov/2026 – fev/2027",end:"2027-02-28",g:"Entender o mapa, montar seu sistema de estudo, lógica e Python bem feitos, micro:bit, Tinkercad, Bambu Lab e o hábito diário de inglês."},
 {n:"Fase 1",t:"Fundamentos",p:"mar – jul/2027",end:"2027-07-31",g:"CS50, terminal, Git e GitHub, HTML e CSS, eletrônica básica, planilhas e Canva de verdade, Scratch e aprendizagem criativa."},
 {n:"Fase 2",t:"Construir",p:"ago – dez/2027",end:"2027-12-31",g:"JavaScript, primeiros back-ends e SQL, Arduino, CAD paramétrico, Office avançado, IA na sala de aula com ética."},
 {n:"Fase 3",t:"Profundidade",p:"jan – dez/2028",end:"2028-12-31",g:"Algoritmos e estruturas de dados, React e TypeScript, APIs e bancos de dados, ESP32, Blender, Machine Learning, inglês B2."},
 {n:"Fase 4",t:"Projetos reais",p:"jan – dez/2029",end:"2029-12-31",g:"Aplicações full stack no ar, apps mobile, construir com APIs de IA, projetos maker integrados, portfólio forte."},
 {n:"Fase 5",t:"Lapidar e transição",p:"jan – jul/2030",end:"2030-07-31",g:"TCC alinhado à carreira, especialização, certificação de inglês se precisar e a transição para a nova área."}
];
const TC = {base:"#2747C7",dev:"#0F766E",ia:"#A21CAF",maker:"#C2410C",prof:"#B45309",vida:"#4D7C0F"};
const YT = q => "yt:"+q;
const TRACKS = [
{id:"aprender",g:"vida",name:"Aprender a aprender",what:"Como o seu cérebro aprende e como organizar estudo, foco e revisão.",why:"É a trilha que multiplica todas as outras. Quem aprende do jeito certo aprende o dobro no mesmo tempo.",steps:[
 ["a1",0,"Entender como a memória funciona","Recuperação ativa (testar a si mesmo), repetição espaçada, intercalar assuntos e dormir bem. Reler e grifar quase não funciona.",[["c","Learning How to Learn (Barbara Oakley)","https://www.coursera.org/learn/learning-how-to-learn","gp","en (legendas pt)"],["l","Fixe o Conhecimento (Brown, Roediger e McDaniel)","","p","pt"]],"Escreva uma página: como você vai estudar a partir de agora."],
 ["a2",0,"Montar seu sistema de estudo","Um lugar para anotações, um para flashcards e um calendário com blocos fixos. Simples e todo dia vence complexo e de vez em quando.",[["f","Anki (flashcards com repetição espaçada)","https://apps.ankiweb.net/","g","pt"],["f","Obsidian (anotações em Markdown)","https://obsidian.md/","g","pt"],["f","Google Agenda com blocos de estudo","https://calendar.google.com/","g","pt"]],"Crie seu baralho do Anki “Computação” e bloqueie os horários da Rotina no calendário."],
 ["a3",0,"Foco profundo e hábitos","Trabalhar sem distração em blocos de 25 a 50 minutos. Celular em outro cômodo. Comece pequeno e não quebre a corrente.",[["l","Trabalho Focado (Cal Newport)","","p","pt"],["l","Hábitos Atômicos (James Clear)","","p","pt"],["l","Ultralearning (Scott Young)","","p","pt"]],""],
 ["a4",1,"Revisão mensal e semestral","No último domingo do mês, 30 minutos: o que concluí, o que travou, o que muda. A cada semestre, reveja a fase no site e ajuste as metas.",[["s","Aba “Metas e diário” deste site","#metas","g","pt"]],"Escreva a primeira revisão mensal no Diário de bordo."]
]},
{id:"base",g:"base",name:"Como o computador funciona",what:"Os fundamentos: hardware, sistemas operacionais, redes, terminal e a matemática por trás.",why:"Foi isso que faltou quando você começou pelo Python: entender o que existe por baixo. Com essa base, os nomes deixam de assustar.",steps:[
 ["b1",0,"O mapa: o que é cada coisa","Leia o Glossário deste site e assista aos primeiros episódios de Crash Course Computer Science. A meta é saber o que é cada peça e como elas se encaixam.",[["s","Glossário deste site","#glossario","g","pt"],["y","Crash Course Computer Science","https://www.youtube.com/@crashcourse","g","en (legendas pt)"],["l","Código: a linguagem oculta do hardware e do software (Charles Petzold)","","p","pt"]],""],
 ["b2",1,"CS50x de Harvard","A melhor introdução à computação do mundo, gratuita. Passa por C, memória, algoritmos, Python, SQL e web. Faça com calma, um problema por semana.",[["c","CS50x — Harvard","https://cs50.harvard.edu/x/","g","en (legendas pt)"]],"Concluir os problem sets e o projeto final. Publique o projeto no GitHub."],
 ["b3",1,"Terminal no seu MacBook","O terminal (zsh no Mac) é onde você conversa com o computador por texto: navegar pastas, rodar programas, usar Git.",[["c","The Missing Semester (MIT)","https://missing.csail.mit.edu/","g","en"],["s","Linux Journey","https://linuxjourney.com/","g","en"]],"Fazer uma semana inteira de tarefas de arquivos só pelo terminal."],
 ["b4",2,"Matemática para computação","Lógica, conjuntos, combinatória, funções e noções de álgebra linear. Ajuda em algoritmos, IA e na própria faculdade.",[["c","Khan Academy","https://pt.khanacademy.org/","g","pt"],["y","3Blue1Brown","https://www.youtube.com/@3blue1brown","g","en (legendas pt)"],["l","Matemática Discreta e suas Aplicações (Kenneth Rosen)","","p","pt"]],""],
 ["b5",3,"Redes e internet","Como dados viajam: IP, DNS, TCP, HTTP, Wi-Fi. Essencial para web e para explicar a internet aos alunos.",[["c","Cisco Networking Academy (cursos introdutórios)","https://www.netacad.com/","g","pt/en"],["l","Redes de Computadores e a Internet (Kurose e Ross)","","p","pt"]],""],
 ["b6",3,"Sistemas operacionais","Processos, memória, arquivos e concorrência. O que o macOS, o Windows e o Android fazem por baixo.",[["l","Operating Systems: Three Easy Pieces","https://pages.cs.wisc.edu/~remzi/OSTEP/","g","en"]],""],
 ["b7",3,"Arquitetura na prática","Do transistor à CPU. Ver um computador sendo montado em protoboard muda sua forma de pensar.",[["y","Ben Eater","https://www.youtube.com/@BenEater","g","en"],["c","Nand2Tetris","https://www.nand2tetris.org/","g","en"]],""],
 ["b8",4,"Segurança básica","Senhas, golpes, vulnerabilidades web comuns e boas práticas. Útil como dev e como professor.",[["s","OWASP Top 10","https://owasp.org/www-project-top-ten/","g","en"],["c","TryHackMe (trilhas iniciantes)","https://tryhackme.com/","gp","en"]],""]
]},
{id:"python",g:"dev",name:"Lógica e Python",what:"Pensar como programador e escrever programas em Python, a linguagem mais usada para começar, para dados e para IA.",why:"Lógica é igual em toda linguagem. Python é a sua primeira ferramenta séria.",steps:[
 ["c1",0,"Lógica de programação antes da linguagem","Variáveis, condições, laços e funções existem em todas as linguagens. Aprenda o conceito primeiro, a sintaxe depois.",[["c","Curso em Vídeo — Algoritmos (Gustavo Guanabara)","https://www.cursoemvideo.com/","g","pt"],["f","Scratch","https://scratch.mit.edu/","g","pt"]],"Resolver 20 problemas pequenos no papel ou no Scratch."],
 ["c2",0,"Python do zero, bem feito","Refaça o básico com calma, mesmo o que você já viu. Digite todo o código, nunca copie e cole.",[["c","Curso em Vídeo — Python 3 (Mundos 1, 2 e 3)","https://www.cursoemvideo.com/","g","pt"],["l","Pense em Python (Allen Downey)","https://penseallen.github.io/PensePython2e/","g","pt"],["s","Tutorial oficial do Python","https://docs.python.org/pt-br/3/tutorial/","g","pt"]],"Terminar os 3 mundos com todos os desafios."],
 ["c3",1,"Exercitar todo dia","Programar é como academia: 1 exercício por dia vale mais que 10 no fim de semana.",[["f","Beecrowd (juiz online brasileiro)","https://judge.beecrowd.com/","g","pt"],["f","Exercism — trilha Python","https://exercism.org/tracks/python","g","en"]],"100 exercícios resolvidos."],
 ["c4",1,"Python para automatizar a vida","Planilhas, PDFs, arquivos e e-mails. É aqui que Python começa a economizar seu tempo como professor.",[["l","Automate the Boring Stuff with Python","https://automatetheboringstuff.com/","g","en"],["l","Automatize Tarefas Maçantes com Python (edição em pt)","","p","pt"]],"Um script que organize as notas ou a chamada de uma turma."],
 ["c5",1,"Ciência da Computação com Python (USP)","Curso da USP que ensina a pensar como cientista da computação usando Python.",[["c","Introdução à Ciência da Computação com Python — Parte 1 (USP)","https://www.coursera.org/learn/ciencia-computacao-python-conceitos","gp","pt"]],""],
 ["c6",2,"Orientação a objetos e código limpo","Classes, módulos, testes simples e nomes claros. A diferença entre código que funciona e código bom.",[["l","Python Fluente (Luciano Ramalho)","https://pythonfluente.com/","g","pt"],["l","Código Limpo (Robert C. Martin)","","p","pt"]],""],
 ["c7",3,"Python para dados","pandas, gráficos e análise. Base para IA e ótimo para analisar desempenho de turmas.",[["c","Kaggle Learn (Python, pandas, visualização)","https://www.kaggle.com/learn","g","en"]],"Analisar um conjunto de dados real e publicar o notebook."]
]},
{id:"devkit",g:"dev",name:"Git, GitHub e o kit do dev",what:"As ferramentas do dia a dia de quem programa: editor de código, controle de versão e portfólio.",why:"Sem Git você não trabalha em equipe e não mostra seu trabalho. GitHub é o seu currículo vivo.",steps:[
 ["d0",0,"GitHub Student Developer Pack","Como estudante você ganha de graça GitHub Copilot, cursos, domínios e créditos em nuvem. Faça isso hoje.",[["f","GitHub Education — Student Pack","https://education.github.com/pack","g","en"]],""],
 ["d1",0,"VS Code","O editor de código mais usado. Instale as extensões de Python e Live Server e aprenda os atalhos principais.",[["f","Visual Studio Code","https://code.visualstudio.com/","g","pt"]],""],
 ["d2",1,"Git e GitHub","Git guarda o histórico do seu código no computador. GitHub é o site que hospeda esse histórico e mostra seus projetos.",[["c","GitHub Skills","https://skills.github.com/","g","en"],["c","Curso em Vídeo — Git e GitHub","https://www.cursoemvideo.com/","g","pt"],["l","Pro Git","https://git-scm.com/book/pt-br/v2","g","pt"]],"Todo exercício a partir de agora vai para um repositório."],
 ["d3",1,"GitHub como portfólio","README de perfil, repositórios organizados e sites publicados com GitHub Pages.",[["s","GitHub Pages","https://pages.github.com/","g","en"]],"Publicar este Projeto Perfeição no seu GitHub Pages."],
 ["d4",2,"Markdown e documentação","Escrever README, anotações e documentação de forma clara.",[["s","Markdown Guide","https://www.markdownguide.org/","g","en"]],""],
 ["d5",3,"Docker","Empacotar um programa com tudo de que ele precisa para rodar em qualquer máquina.",[["s","Docker — Get Started","https://docs.docker.com/get-started/","g","en"]],""],
 ["d6",4,"Testes automatizados e CI","Testes que rodam sozinhos a cada push no GitHub.",[["s","pytest","https://docs.pytest.org/","g","en"],["s","GitHub Actions","https://docs.github.com/actions","g","pt/en"]],""]
]},
{id:"front",g:"dev",name:"Front-end",what:"Tudo o que a pessoa vê e toca num site ou app: HTML (estrutura), CSS (visual) e JavaScript (comportamento).",why:"Você quer criar sites e ferramentas de verdade, não superficiais. Front-end bem feito é acessível, rápido e bonito.",steps:[
 ["e1",1,"HTML e CSS fundamentos","Estrutura semântica, caixas, Flexbox e Grid.",[["c","Curso em Vídeo — HTML5 e CSS3","https://www.cursoemvideo.com/","g","pt"],["s","MDN — Aprenda desenvolvimento web","https://developer.mozilla.org/pt-BR/docs/Learn","g","pt"],["f","Flexbox Froggy","https://flexboxfroggy.com/","g","pt"],["f","Grid Garden","https://cssgridgarden.com/","g","pt"]],"Página pessoal de professor, feita à mão."],
 ["e2",2,"JavaScript de verdade","Variáveis, funções, arrays, objetos, DOM, eventos, fetch e assíncrono.",[["s","javascript.info em português","https://pt.javascript.info/","g","pt"],["l","Eloquent JavaScript","https://eloquentjavascript.net/","g","en"],["c","Curso em Vídeo — JavaScript","https://www.cursoemvideo.com/","g","pt"]],"Um quiz interativo para seus alunos."],
 ["e3",2,"Uma trilha completa e estruturada","Escolha uma e vá até o fim. The Odin Project é a mais completa e baseada em projetos.",[["c","The Odin Project","https://www.theodinproject.com/","g","en"],["c","freeCodeCamp","https://www.freecodecamp.org/learn","g","pt/en"]],""],
 ["e4",2,"CSS profissional e responsivo","Layouts que funcionam no celular, no tablet e no monitor.",[["y","Kevin Powell","https://www.youtube.com/@KevinPowell","g","en"],["f","Frontend Mentor (desafios com design pronto)","https://www.frontendmentor.io/","gp","en"],["c","CSS for JavaScript Developers (Josh Comeau)","https://css-for-js.dev/","p","en"]],"5 desafios do Frontend Mentor."],
 ["e5",3,"Acessibilidade e design de interface","Sites que todos conseguem usar, incluindo pessoas com deficiência. Noções de UX e Figma.",[["c","web.dev — Learn Accessibility","https://web.dev/learn/accessibility","g","en"],["f","Figma","https://www.figma.com/","gp","pt"],["l","Não Me Faça Pensar (Steve Krug)","","p","pt"]],""],
 ["e6",3,"TypeScript","JavaScript com tipos: menos erros e código mais fácil de manter.",[["s","TypeScript Handbook","https://www.typescriptlang.org/docs/handbook/intro.html","g","en"]],""],
 ["e7",3,"React","A biblioteca mais usada para interfaces. Componentes, estado e efeitos.",[["s","react.dev — Learn","https://react.dev/learn","g","pt/en"],["c","Full Stack Open (Univ. de Helsinque)","https://fullstackopen.com/ptbr/","g","pt"],["y","Rocketseat","https://www.youtube.com/@rocketseat","g","pt"]],"Um app de banco de atividades da sua disciplina."],
 ["e8",4,"Next.js e publicação","Framework React com rotas, servidor e deploy simples.",[["c","Next.js Learn","https://nextjs.org/learn","g","en"],["f","Vercel","https://vercel.com/","gp","en"]],""]
]},
{id:"back",g:"dev",name:"Back-end e dados",what:"O que roda no servidor: regras, banco de dados, login, APIs. É o que faz um app guardar e processar informações.",why:"Ferramentas não superficiais precisam de back-end: salvar dados, ter usuários, conversar com outros sistemas.",steps:[
 ["f1",2,"Como a web funciona","Cliente e servidor, requisição e resposta, métodos GET e POST, códigos de status, JSON.",[["s","MDN — HTTP","https://developer.mozilla.org/pt-BR/docs/Web/HTTP","g","pt"]],""],
 ["f2",2,"SQL e bancos de dados","Tabelas, chaves, consultas, junções. SQL é usado em quase toda empresa.",[["f","SQLBolt (exercícios interativos)","https://sqlbolt.com/","g","en"],["c","Curso em Vídeo — Banco de Dados MySQL","https://www.cursoemvideo.com/","g","pt"]],"Modelar o banco de uma biblioteca escolar."],
 ["f3",3,"APIs com Python (FastAPI)","Criar sua própria API, documentada automaticamente.",[["s","FastAPI — tutorial","https://fastapi.tiangolo.com/pt/","g","pt"],["f","Bruno (testar APIs)","https://www.usebruno.com/","g","en"]],"API do banco de questões."],
 ["f4",3,"Node.js e Express","Back-end em JavaScript, a mesma linguagem do front-end.",[["s","Node.js — Learn","https://nodejs.org/en/learn","g","en"],["c","Full Stack Open — partes 3 e 4","https://fullstackopen.com/ptbr/","g","pt"]],""],
 ["f5",3,"PostgreSQL e modelagem","O banco de dados relacional mais respeitado. Normalização e índices.",[["s","Tutorial oficial do PostgreSQL","https://www.postgresql.org/docs/current/tutorial.html","g","en"]],""],
 ["f6",4,"Login e segurança web","Senhas com hash, sessões, tokens, permissões. Nunca guarde senha em texto puro.",[["s","OWASP Cheat Sheets","https://cheatsheetseries.owasp.org/","g","en"]],""],
 ["f7",4,"Back-end pronto (Supabase ou Firebase)","Banco, login e arquivos sem montar servidor. Ótimo para protótipos rápidos.",[["f","Supabase","https://supabase.com/","gp","en"],["f","Firebase","https://firebase.google.com/","gp","pt"]],""],
 ["f8",4,"Nuvem e deploy","Colocar seu sistema no ar: hospedagem, domínios, variáveis de ambiente.",[["f","Render","https://render.com/","gp","en"],["c","AWS Skill Builder","https://skillbuilder.aws/","gp","pt/en"],["c","Google Cloud Skills Boost","https://www.cloudskillsboost.google/","gp","pt/en"]],"Projeto full stack no ar com endereço próprio."],
 ["f9",4,"Arquitetura de sistemas","Como sistemas grandes são desenhados: filas, cache, escalabilidade.",[["y","ByteByteGo","https://www.youtube.com/@ByteByteGo","g","en"],["l","Designing Data-Intensive Applications (Martin Kleppmann)","","p","en/pt"]],""]
]},
{id:"algo",g:"base",name:"Algoritmos e estruturas de dados",what:"Formas eficientes de organizar dados e resolver problemas. É o coração da Ciência da Computação.",why:"Cai na faculdade, em entrevistas de emprego e separa quem programa de quem copia código.",steps:[
 ["g1",2,"Algoritmos ilustrados","Busca binária, ordenação, recursão, grafos, explicados com desenhos.",[["l","Entendendo Algoritmos (Aditya Bhargava)","","p","pt"]],""],
 ["g2",3,"Estruturas de dados","Listas, pilhas, filas, árvores, grafos e tabelas hash. Implemente cada uma em Python.",[["f","VisuAlgo (visualizações)","https://visualgo.net/","g","pt/en"],["s","NeetCode Roadmap","https://neetcode.io/roadmap","g","en"]],""],
 ["g3",3,"Complexidade (Big O)","Medir quanto um algoritmo cresce em tempo e memória.",[["y","Abdul Bari","https://www.youtube.com/@abdul_bari","g","en"]],""],
 ["g4",4,"Problemas de entrevista","Treino regular para processos seletivos.",[["f","LeetCode","https://leetcode.com/","gp","en"],["l","Cracking the Coding Interview (Gayle McDowell)","","p","en"]],"150 problemas resolvidos."]
]},
{id:"apps",g:"dev",name:"Apps e ferramentas próprias",what:"Criar aplicativos e automações que resolvem problemas reais, do bloco ao código.",why:"Para fazer ferramentas para sua escola e mostrar no portfólio que você constrói coisas úteis.",steps:[
 ["h1",1,"MIT App Inventor","Apps Android com blocos. Ótimo para suas aulas e para entender eventos. Teste no seu Galaxy Tab.",[["f","MIT App Inventor","https://appinventor.mit.edu/","g","pt"]],"Um app de sorteio de grupos para a sala."],
 ["h2",2,"Google Apps Script","JavaScript que automatiza Planilhas, Formulários, Gmail e Drive. Para professor, é um superpoder.",[["s","Apps Script — guias","https://developers.google.com/apps-script","g","pt"]],"Correção automática de um formulário com envio de feedback."],
 ["h3",3,"PWA: site que vira app","Um site que instala no celular e funciona offline.",[["c","web.dev — Learn PWA","https://web.dev/learn/pwa","g","en"]],""],
 ["h4",4,"React Native com Expo","Apps nativos para Android e iPhone usando React.",[["s","Expo — docs","https://docs.expo.dev/","g","en"]],""],
 ["h5",4,"Flutter (alternativa)","Outra forma popular de criar apps. Escolha um caminho, Expo ou Flutter, e vá até o fim.",[["s","Flutter — docs","https://docs.flutter.dev/","g","en"]],""],
 ["h6",4,"Ferramenta real para sua escola","Escolha um problema real: empréstimo de kits, banco de questões, chamada. Faça do início ao fim, com usuários reais.",[],"Projeto de portfólio número 1."]
]},
{id:"ia",g:"ia",name:"Inteligência Artificial",what:"Usar IA com consciência hoje, entender como ela funciona por dentro e, depois, construir com ela.",why:"Você tem Claude, Gemini e Copilot. A meta é a IA multiplicar o seu cérebro, não substituí-lo.",steps:[
 ["i1",0,"Entender o que é IA, sem exagero","IA, Machine Learning, redes neurais e modelos de linguagem: o que são, o que fazem bem e onde erram.",[["c","Elements of AI","https://www.elementsofai.com/","g","pt"],["c","AI for Everyone (Andrew Ng)","https://www.coursera.org/learn/ai-for-everyone","gp","en (legendas pt)"]],""],
 ["i2",0,"Usar IA como tutor, não como cola","Leia as Regras de ouro na aba Início. Crie um Projeto no Claude para cada disciplina com o material do professor.",[["c","Anthropic Academy","https://www.anthropic.com/learn","g","en"],["s","Guia de prompts da Anthropic","https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview","g","en"],["f","NotebookLM (Google)","https://notebooklm.google.com/","g","pt"]],"Um Projeto no Claude por disciplina da faculdade."],
 ["i3",1,"Qual IA para quê","Claude: textos longos, código, análise de documentos e criação de páginas. Gemini: integrado ao Google Workspace e ao NotebookLM. Copilot: dentro do Word, Excel e PowerPoint, e o GitHub Copilot no VS Code. Teste a mesma tarefa nas três e anote os resultados.",[["s","GitHub Copilot — docs","https://docs.github.com/copilot","g","pt/en"]],"Tabela comparativa sua, com 10 tarefas reais."],
 ["i4",2,"IA na sala de aula com ética","Nunca coloque dados de alunos em IA. Ensine checagem de fatos, autoria e uso transparente. Siga a LGPD e a política da escola.",[["s","Orientações da UNESCO sobre IA generativa na educação","https://www.unesco.org/pt","g","pt"]],"Um plano de aula sobre uso crítico de IA."],
 ["i5",3,"Fundamentos de Machine Learning","Regressão, classificação, treino e teste, overfitting.",[["c","Machine Learning Specialization (Andrew Ng)","https://www.coursera.org/specializations/machine-learning-introduction","gp","en (legendas pt)"],["c","Kaggle — Intro to Machine Learning","https://www.kaggle.com/learn","g","en"],["l","Mãos à Obra: Aprendizado de Máquina com Scikit-Learn, Keras e TensorFlow (Aurélien Géron)","","p","pt"]],""],
 ["i6",3,"Redes neurais por dentro","Como uma rede aprende, do zero, com código.",[["y","3Blue1Brown — série Redes Neurais","https://www.youtube.com/@3blue1brown","g","en (legendas pt)"],["y","Andrej Karpathy — Neural Networks: Zero to Hero","https://www.youtube.com/@AndrejKarpathy","g","en"],["c","fast.ai — Practical Deep Learning","https://course.fast.ai/","g","en"]],""],
 ["i7",4,"Construir com APIs de modelos de linguagem","Chatbots, resumo de documentos e busca nos seus próprios materiais (RAG).",[["s","Documentação da API do Claude","https://docs.claude.com/","g","en"],["c","DeepLearning.AI — Short Courses","https://www.deeplearning.ai/short-courses/","g","en"]],"Um assistente da sua disciplina que responde com base no seu material."],
 ["i8",4,"Agentes e automação com IA","IA que usa ferramentas, lê arquivos e executa tarefas. Entenda o Model Context Protocol.",[["s","Model Context Protocol","https://modelcontextprotocol.io/","g","en"],["s","Claude Code — docs","https://docs.claude.com/en/docs/claude-code/overview","g","en"]],""],
 ["i9",5,"Aprofundar em IA","Escolha um foco: engenharia de ML, IA aplicada à educação, dados. Pode virar seu TCC.",[["l","Inteligência Artificial (Russell e Norvig)","","p","pt"]],""]
]},
{id:"maker",g:"maker",name:"Eletrônica, micro:bit e Arduino",what:"Programar coisas físicas: luzes, sensores, motores. Do micro:bit em blocos ao ESP32 conectado à internet.",why:"É o coração da sua aula de Educação Digital e une programação com o mundo real.",steps:[
 ["j1",0,"micro:bit com MakeCode (blocos)","Domine todos os sensores da placa: botões, acelerômetro, bússola, rádio, luz e temperatura.",[["f","MakeCode for micro:bit","https://makecode.microbit.org/","g","pt"],["s","micro:bit — aulas prontas","https://microbit.org/teach/","g","pt/en"]],"Um projeto com rádio entre duas placas."],
 ["j2",1,"micro:bit com Python","A ponte perfeita entre blocos e código de texto, para você e para os alunos.",[["f","Editor Python do micro:bit","https://python.microbit.org/","g","pt/en"]],"Refazer em Python 3 projetos que você fez em blocos."],
 ["j3",1,"Eletrônica básica","Tensão, corrente, resistência, lei de Ohm, LED, resistor, botão e protoboard. Simule antes de montar.",[["f","Tinkercad Circuits","https://www.tinkercad.com/","g","pt"],["y","WR Kits","yt:WR Kits eletrônica","g","pt"],["l","Make: Electronics (Charles Platt)","","p","en"]],""],
 ["j4",2,"Arduino do zero","Entradas e saídas digitais e analógicas, PWM, monitor serial.",[["s","Documentação oficial do Arduino","https://docs.arduino.cc/","g","en"],["f","Wokwi (simulador online)","https://wokwi.com/","g","en"],["y","Brincando com Ideias","yt:Brincando com Ideias arduino","g","pt"],["y","Paul McWhorter — Arduino","yt:Paul McWhorter arduino tutorial","g","en"],["l","Primeiros Passos com o Arduino (Massimo Banzi)","","p","pt"]],""],
 ["j5",2,"Sensores, motores e displays","Ultrassônico, servo, LDR, relé, LCD. Ler a folha de dados (datasheet) de um componente.",[["y","GreatScott!","yt:GreatScott electronics","g","en"]],"Um alarme ou um semáforo inteligente."],
 ["j6",2,"Robótica educacional","Robôs simples para a sala e preparação para olimpíadas.",[["s","Olimpíada Brasileira de Robótica (OBR)","https://www.obr.org.br/","g","pt"]],""],
 ["j7",3,"Multímetro e solda","Medir, encontrar defeitos e soldar com segurança.",[["y","Multímetro e solda para iniciantes","yt:como usar multímetro iniciantes","g","pt"]],""],
 ["j8",3,"ESP32 e Internet das Coisas","Placa com Wi-Fi: sensores que enviam dados para a internet.",[["s","Random Nerd Tutorials","https://randomnerdtutorials.com/","g","en"]],"Estação meteorológica da escola com painel web."],
 ["j9",3,"Raspberry Pi","Um computador completo do tamanho de um cartão, com Linux e Python.",[["s","Raspberry Pi Projects","https://projects.raspberrypi.org/","g","pt/en"]],""],
 ["j10",4,"Projetos integrados","Eletrônica, peças impressas na sua Bambu Lab e código juntos.",[],"Robô seguidor de linha com carcaça impressa, documentado no GitHub."]
]},
{id:"3d",g:"maker",name:"Modelagem 3D e fabricação digital",what:"Desenhar objetos no computador e fabricá-los na impressora 3D ou na máquina de corte.",why:"Você já tem as máquinas. Saber projetar transforma suas aulas e seus projetos maker.",steps:[
 ["k1",0,"Tinkercad 3D","Modelar com formas básicas. Ideal para começar e para ensinar.",[["f","Tinkercad","https://www.tinkercad.com/","g","pt"]],"10 objetos úteis para a sala (porta-cabos, chaveiros com nome)."],
 ["k2",0,"Dominar sua Bambu Lab","Fatiador (slicer), arquivos STL e 3MF, suportes, preenchimento, PLA e PETG, manutenção.",[["f","Bambu Studio e Wiki da Bambu Lab","https://wiki.bambulab.com/","g","pt/en"],["s","MakerWorld (modelos prontos)","https://makerworld.com/","g","pt/en"]],""],
 ["k3",1,"Vetores para a máquina de corte","Desenho vetorial (SVG) para cortar vinil, papel ou outros materiais no software da sua máquina.",[["f","Inkscape","https://inkscape.org/","g","pt"]],""],
 ["k4",1,"CAD paramétrico: Onshape ou Fusion","Projetos com medidas exatas e fáceis de alterar. O Onshape roda no navegador, até no tablet. O Fusion roda no seu Mac M1.",[["f","Onshape Education","https://www.onshape.com/en/education","g","en"],["f","Autodesk Fusion (licença educacional ou pessoal)","https://www.autodesk.com/products/fusion-360/","g","pt"],["y","Product Design Online","yt:Product Design Online Fusion 360 beginner","g","en"]],""],
 ["k5",2,"Peças funcionais","Tolerâncias, encaixes, resistência, orientação da impressão.",[["y","CNC Kitchen","yt:CNC Kitchen","g","en"],["y","Maker's Muse","yt:Makers Muse 3d printing","g","en"]],"Uma caixa sob medida para placas Arduino."],
 ["k6",3,"Blender","Modelagem artística, escultura e renderização.",[["f","Blender","https://www.blender.org/","g","pt"],["y","Blender Guru — tutorial do donut","yt:Blender Guru donut tutorial","g","en"]],""],
 ["k7",3,"Modelagem com código (OpenSCAD)","Criar peças 3D programando. Junta duas paixões suas.",[["f","OpenSCAD","https://openscad.org/","g","en"]],""],
 ["k8",4,"Laboratório maker na escola","Organizar espaço, segurança, fluxo de projetos e avaliação.",[["l","Invent to Learn (Martinez e Stager)","","p","en"]],""]
]},
{id:"office",g:"prof",name:"Google, Office e Canva",what:"Dominar de verdade as ferramentas de produtividade: documentos, planilhas, apresentações, formulários e design.",why:"Você usa isso todo dia como professor. Dominar atalhos, fórmulas e automações devolve horas por semana.",steps:[
 ["l1",0,"Digitação e atalhos","Digitar sem olhar e usar atalhos do macOS e dos apps. Meta: 50 palavras por minuto ou mais.",[["f","Keybr","https://www.keybr.com/","g","en"],["f","Monkeytype","https://monkeytype.com/","g","pt"]],""],
 ["l2",0,"Google Workspace essencial","Drive organizado, Docs com estilos, Agenda, Gmail com filtros e marcadores.",[["s","Central de Aprendizagem do Google Workspace","https://support.google.com/a/users","g","pt"],["s","Google for Education","https://edu.google.com/","g","pt"]],""],
 ["l3",1,"Planilhas de verdade (Sheets e Excel)","Referências, PROCV e PROCX, SE, tabelas dinâmicas, gráficos, formatação condicional e validação.",[["y","Hashtag Treinamentos","yt:Hashtag Treinamentos excel","g","pt"],["s","Treinamento do Excel (Microsoft)","https://support.microsoft.com/pt-br/excel","g","pt"]],"Planilha de notas que calcula médias e destaca quem precisa de recuperação."],
 ["l4",1,"Formulários e Google Sala de Aula","Testes autocorrigidos, seções, lógica de ramificação, organização das turmas.",[["s","Central de Ajuda do Google Sala de Aula","https://support.google.com/edu/classroom","g","pt"]],""],
 ["l5",1,"Canva profissional","Hierarquia, marca, modelos, apresentações, vídeos curtos e materiais impressos.",[["c","Canva Design School","https://www.canva.com/designschool/","g","pt"],["f","Canva para Educação (grátis para professores)","https://www.canva.com/education/","g","pt"]],"Kit visual da sua disciplina: modelo de slide, cartaz e atividade."],
 ["l6",2,"Word, PowerPoint e Excel avançados","Estilos e sumário automático, mala direta, slide mestre, transições com propósito.",[["c","Microsoft Learn — Educator Center","https://learn.microsoft.com/training/educator-center/","g","pt"]],""],
 ["l7",2,"Design visual básico","Contraste, repetição, alinhamento e proximidade. Vale para slides, cartazes e sites.",[["l","Design para Quem Não É Designer (Robin Williams)","","p","pt"]],""],
 ["l8",2,"Vídeo e áudio para aulas","Gravar tela, editar vídeo e tratar áudio.",[["f","OBS Studio","https://obsproject.com/","g","pt"],["f","DaVinci Resolve","https://www.blackmagicdesign.com/products/davinciresolve","g","pt"],["f","Audacity","https://www.audacityteam.org/","g","pt"]],""],
 ["l9",3,"Certificações de professor","Comprovam domínio e ajudam no currículo.",[["c","Google Certified Educator (níveis 1 e 2)","https://edu.google.com/","p","pt"],["c","Microsoft Innovative Educator","https://learn.microsoft.com/training/educator-center/","g","pt"]],""]
]},
{id:"prof",g:"prof",name:"Professor de Educação Digital",what:"Didática, currículo e práticas para ensinar computação com qualidade.",why:"Ser um professor top é saber ensinar, não só saber o conteúdo.",steps:[
 ["m1",0,"BNCC Computação","Os três eixos: Pensamento Computacional, Mundo Digital e Cultura Digital. Conheça as habilidades da sua etapa.",[["s","Normas sobre Computação na Educação Básica — Complemento à BNCC (MEC)","https://basenacionalcomum.mec.gov.br/","g","pt"],["s","Currículo de Referência em Tecnologia e Computação (CIEB)","https://curriculo.cieb.net.br/","g","pt"]],"Mapear suas aulas atuais nas habilidades da BNCC."],
 ["m2",0,"Computação desplugada","Ensinar conceitos sem computador: binário, algoritmos, redes. Funciona em qualquer escola.",[["s","CS Unplugged","https://www.csunplugged.org/pt-br/","g","pt"]],""],
 ["m3",1,"Scratch e Code.org","Ferramentas de programação em blocos para todas as idades.",[["f","Scratch","https://scratch.mit.edu/","g","pt"],["c","Code.org","https://code.org/","g","pt"]],""],
 ["m4",1,"Aprendizagem criativa","Projetos, paixão, pares e pensar brincando.",[["l","Jardim de Infância para a Vida Toda (Mitchel Resnick)","","p","pt"],["s","Rede Brasileira de Aprendizagem Criativa","https://aprendizagemcriativa.org/","g","pt"]],""],
 ["m5",2,"Os clássicos da educação","As ideias que fundaram a computação na educação e a pedagogia brasileira.",[["l","LOGO: Computadores e Educação (Seymour Papert)","","p","pt"],["l","Pedagogia da Autonomia (Paulo Freire)","","p","pt"]],""],
 ["m6",2,"Projetos e avaliação com rubricas","Planejar por projetos e avaliar processo e produto de forma justa.",[["l","Metodologias Ativas para uma Educação Inovadora (Bacich e Moran)","","p","pt"]],"Uma rubrica para seu próximo projeto maker."],
 ["m7",2,"Cidadania digital","Privacidade, segurança, desinformação e convivência online.",[["s","SaferNet Brasil","https://new.safernet.org.br/","g","pt"],["s","Common Sense Education","https://www.commonsense.org/education","g","en"]],""],
 ["m8",3,"Olimpíadas de informática","Preparar alunos para a OBI desperta talentos.",[["s","Olimpíada Brasileira de Informática (OBI)","https://olimpiada.ic.unicamp.br/","g","pt"]],""],
 ["m9",3,"Material próprio","Site da disciplina, banco de atividades e apostilas, tudo versionado no GitHub.",[],"Site da sua disciplina publicado."],
 ["m10",4,"Compartilhar e publicar","Relatos de experiência em eventos de informática na educação.",[["s","Sociedade Brasileira de Computação (SBC)","https://www.sbc.org.br/","g","pt"]],"Submeter um relato de experiência."]
]},
{id:"ingles",g:"vida",name:"Inglês fluente",what:"Do nível atual até a fluência, com prática diária e conteúdo de tecnologia.",why:"A maior parte da documentação, dos cursos e das vagas boas está em inglês.",steps:[
 ["n1",0,"Medir seu nível","Faça o teste e anote o resultado. Metas sugeridas: B1 no fim de 2027, B2 no fim de 2028, C1 em 2030.",[["s","EF SET (teste gratuito)","https://www.efset.org/pt/","g","pt"]],"Anotar o nível no Diário de bordo."],
 ["n2",0,"Hábito diário de 20 a 30 minutos","Um pouco todo dia: vocabulário no Anki, um vídeo, uma leitura curta.",[["s","BBC Learning English","https://www.bbc.co.uk/learningenglish","g","en"],["f","Duolingo","https://www.duolingo.com/","gp","pt"],["f","Anki","https://apps.ankiweb.net/","g","pt"]],""],
 ["n3",1,"Base gramatical e pronúncia","Tempos verbais, phrasal verbs e os sons que brasileiros mais erram.",[["y","Mairo Vergara","yt:Mairo Vergara","g","pt"],["y","English in Brazil (Carina Fragozo)","yt:English in Brazil Carina Fragozo","g","pt"],["y","Rachel's English (pronúncia)","yt:Rachel's English","g","en"]],""],
 ["n4",1,"Aprender tecnologia em inglês","CS50, documentação e canais técnicos em inglês. Comece com legenda em inglês, não em português.",[["y","Fireship","https://www.youtube.com/@Fireship","g","en"]],""],
 ["n5",2,"Conversação","Fale toda semana. Use o modo de voz do Claude ou do Gemini para treinar, e um professor quando puder.",[["f","Modo de voz do Claude ou do Gemini","","g","en"],["c","Cambly","https://www.cambly.com/","p","en"],["c","italki","https://www.italki.com/","p","en"]],"Shadowing: repetir em voz alta trechos curtos de nativos."],
 ["n6",3,"Leitura extensiva","Livros inteiros em inglês: comece por graded readers e passe para livros técnicos.",[],"Ler 3 livros em inglês no ano."],
 ["n7",4,"Escrever em inglês","README dos seus projetos em inglês, posts e e-mails.",[],""],
 ["n8",5,"Certificação (se precisar)","Só faça se uma vaga, bolsa ou intercâmbio pedir.",[["c","TOEFL, IELTS ou Cambridge","","p","en"]],""]
]},
{id:"carreira",g:"vida",name:"Repertório e carreira",what:"Leitura, cultura geral, presença profissional e a transição de área.",why:"Profissional completo tem repertório e sabe para onde está indo.",steps:[
 ["o1",0,"Mapa de carreiras em tecnologia","Front-end, back-end, dados, IA, DevOps, segurança, UX e edtech. Veja os caminhos e marque os que atraem você.",[["s","roadmap.sh","https://roadmap.sh/","g","en"]],"Escolher 2 áreas candidatas para 2030."],
 ["o2",1,"Repertório: um livro por mês","Alterne técnico e geral. Comece pelo próprio Mito da Caverna.",[["l","A República, livro VII (Platão)","","gp","pt"],["l","O Mundo Assombrado pelos Demônios (Carl Sagan)","","p","pt"],["l","Mindset (Carol Dweck)","","p","pt"],["l","Sapiens (Yuval Harari)","","p","pt"]],""],
 ["o3",1,"Podcasts e canais de tecnologia em português","Para acompanhar o mercado no ônibus ou na academia.",[["y","Hipsters Ponto Tech","yt:Hipsters Ponto Tech","g","pt"],["y","Fabio Akita","yt:Fabio Akita","g","pt"],["y","Filipe Deschamps","yt:Filipe Deschamps","g","pt"],["y","Código Fonte TV","yt:Codigo Fonte TV","g","pt"]],""],
 ["o4",2,"LinkedIn e presença profissional","Perfil completo, posts sobre o que você constrói e aprende.",[],""],
 ["o5",3,"Comunidades e eventos","Python Brasil, meetups, hackathons, comunidades no Discord.",[["s","Python Brasil","https://python.org.br/","g","pt"]],""],
 ["o6",3,"Estágio ou projeto real","Experiência de verdade conta mais que certificado.",[],""],
 ["o7",4,"Portfólio com 3 projetos fortes","Um full stack, um maker ou IoT e um com IA. Cada um com README, demonstração e código limpo.",[],""],
 ["o8",5,"TCC alinhado à carreira","Escolha um tema que já seja vitrine para a área que você quer.",[],""],
 ["o9",5,"Transição de área","Currículo, entrevistas técnicas e rede de contatos.",[],""]
]}
];

const GLOSS = [
["Programação",[
 ["Algoritmo","Uma sequência de passos para resolver um problema. Uma receita de bolo é um algoritmo."],
 ["Linguagem de programação","Um idioma com regras rígidas para dar instruções ao computador. Exemplos: Python, JavaScript, C."],
 ["Lógica de programação","O raciocínio por trás do código: condições, repetições, variáveis. Vale para todas as linguagens."],
 ["Variável","Um nome que guarda um valor, como uma caixa com etiqueta."],
 ["Função","Um bloco de código com nome que você pode reutilizar."],
 ["Sintaxe","As regras de escrita de uma linguagem, como a gramática de um idioma."],
 ["Bug e depuração (debug)","Bug é um erro no programa. Depurar é encontrar e corrigir esse erro."],
 ["Biblioteca","Código pronto que você importa para não reinventar a roda. Exemplo: pandas."],
 ["Framework","Uma estrutura pronta que dita como organizar o seu projeto. Exemplos: React, Django, Next.js."],
 ["Compilador e interpretador","Programas que traduzem o seu código para o computador executar. C é compilado; Python é interpretado."],
 ["Orientação a objetos","Organizar o código em objetos com dados e comportamentos, como “Aluno” com nome e notas."]
]],
["Ferramentas",[
 ["Editor de código e IDE","Programa onde você escreve código. VS Code é um editor; IDEs como PyCharm trazem mais recursos."],
 ["Terminal (linha de comando)","Uma janela onde você dá ordens ao computador por texto. No Mac, o app Terminal usa zsh."],
 ["Git","Programa que guarda o histórico do seu código, como um “salvar versões” poderoso."],
 ["GitHub","Site que hospeda repositórios Git, permite colaborar e funciona como portfólio."],
 ["Repositório (repo)","A pasta de um projeto com todo o seu histórico no Git."],
 ["Commit e push","Commit é salvar uma versão. Push é enviar essas versões para o GitHub."],
 ["Markdown","Um jeito simples de formatar texto com símbolos. # vira título, **texto** vira negrito."],
 ["Docker","Empacota um programa e tudo de que ele precisa para rodar igual em qualquer máquina."]
]],
["Web",[
 ["Front-end","A parte que a pessoa vê e usa: telas, botões, layout. Feito com HTML, CSS e JavaScript."],
 ["Back-end","A parte que roda no servidor: regras, banco de dados, login."],
 ["Full stack","Quem trabalha nas duas partes, front-end e back-end."],
 ["HTML","A estrutura da página: títulos, parágrafos, imagens, links."],
 ["CSS","O visual da página: cores, fontes, espaçamento, layout."],
 ["JavaScript","A linguagem que dá comportamento à página: cliques, animações, buscar dados."],
 ["TypeScript","JavaScript com tipos, que avisa erros antes de rodar."],
 ["React","Biblioteca JavaScript para construir interfaces em componentes reutilizáveis."],
 ["Node.js","Permite rodar JavaScript fora do navegador, no servidor."],
 ["API","Um “cardápio” de pedidos que um sistema aceita de outro. O app do tempo pede dados a uma API de meteorologia."],
 ["HTTP","O protocolo de conversa entre navegador e servidor."],
 ["JSON","Formato de texto para trocar dados entre sistemas, com chaves e valores."],
 ["Deploy e hospedagem","Deploy é colocar o sistema no ar. Hospedagem é onde ele fica: Vercel, Render, GitHub Pages."],
 ["Domínio","O endereço do site, como seunome.com.br."],
 ["Responsivo","Site que se adapta ao celular, ao tablet e ao computador."],
 ["PWA","Site que pode ser instalado como app e funcionar offline."]
]],
["Dados",[
 ["Banco de dados","Lugar organizado para guardar informações de um sistema."],
 ["SQL","Linguagem para consultar e alterar bancos de dados relacionais (em tabelas)."],
 ["PostgreSQL e MySQL","Dois dos bancos de dados relacionais mais usados."],
 ["Nuvem (cloud)","Usar computadores de empresas como AWS, Google Cloud e Azure pela internet."],
 ["Estrutura de dados","Forma de organizar dados na memória: listas, filas, pilhas, árvores, grafos."],
 ["Big O","Notação que mede como o tempo de um algoritmo cresce quando os dados aumentam."]
]],
["Inteligência Artificial",[
 ["IA (Inteligência Artificial)","Área que faz computadores realizarem tarefas que parecem exigir inteligência."],
 ["Machine Learning","Parte da IA em que o computador aprende padrões a partir de exemplos, em vez de regras escritas à mão."],
 ["Rede neural","Modelo de Machine Learning inspirado de forma livre no cérebro, com camadas de “neurônios” matemáticos."],
 ["LLM (modelo de linguagem)","Modelo treinado com muito texto que gera respostas. Claude, Gemini e o GPT são LLMs."],
 ["Prompt","A instrução que você escreve para a IA. Prompt bom: contexto, tarefa, formato e exemplos."],
 ["Alucinação","Quando a IA afirma algo falso com confiança. Por isso sempre verifique."],
 ["RAG","Técnica em que a IA busca nos seus documentos antes de responder."],
 ["Agente","IA que usa ferramentas e executa várias etapas sozinha para cumprir uma tarefa."],
 ["MCP","Model Context Protocol: padrão que conecta IAs a ferramentas e dados."]
]],
["Maker e hardware",[
 ["Hardware e software","Hardware é a parte física; software são os programas."],
 ["CPU e memória RAM","CPU é o processador, que executa instruções. RAM é a memória de trabalho, rápida e temporária."],
 ["Sistema operacional","O programa base que gerencia o computador: macOS, Windows, Linux, Android."],
 ["Microcontrolador","Um computador minúsculo num chip, feito para controlar coisas. Está no Arduino e no micro:bit."],
 ["micro:bit","Placa educacional com LEDs, botões e sensores, programável em blocos (MakeCode) ou Python."],
 ["Arduino","Plataforma de placas com microcontrolador para ligar sensores, LEDs e motores, programada em C/C++."],
 ["ESP32","Microcontrolador barato com Wi-Fi e Bluetooth, ideal para Internet das Coisas."],
 ["Raspberry Pi","Computador completo do tamanho de um cartão que roda Linux."],
 ["Protoboard","Placa com furos para montar circuitos sem solda."],
 ["Sensor e atuador","Sensor lê o mundo (luz, distância). Atuador age no mundo (motor, LED, buzzer)."],
 ["IoT","Internet das Coisas: objetos conectados que enviam e recebem dados."],
 ["CAD","Desenho assistido por computador. Tinkercad, Onshape e Fusion são ferramentas de CAD."],
 ["Paramétrico","Modelo 3D baseado em medidas e regras que você pode alterar depois."],
 ["STL e 3MF","Formatos de arquivo de modelos 3D. O 3MF guarda também cores e configurações."],
 ["Fatiador (slicer)","Programa que transforma o modelo 3D em instruções para a impressora. O seu é o Bambu Studio."],
 ["Vetor (SVG)","Imagem feita de linhas e curvas matemáticas, sem perder qualidade. É o que a máquina de corte usa."]
]]
];

const ROUTINE = [
 ["Seg","25 min","1h · Lógica e Python, depois algoritmos","—"],
 ["Ter","25 min","1h · Web (front-end, depois back-end)","—"],
 ["Qua","25 min","1h · Maker: micro:bit, Arduino ou 3D","—"],
 ["Qui","25 min","1h · Disciplinas da faculdade ou revisão","—"],
 ["Sex","25 min","1h · Professor: Google, Office, Canva ou didática aplicada à próxima aula","—"],
 ["Sáb","25 min","—","2 a 3h · Projeto prático (o que estiver na fase atual)"],
 ["Dom","—","—","30 min · Revisão da semana e planejamento. O resto é descanso."]
];

const HOURS = {
 a1:15,a2:4,a3:10,a4:2,
 b1:10,b2:120,b3:15,b4:60,b5:40,b6:40,b7:30,b8:20,
 c1:20,c2:60,c3:80,c4:30,c5:40,c6:40,c7:30,
 d0:1,d1:3,d2:15,d3:6,d4:3,d5:15,d6:15,
 e1:40,e2:70,e3:200,e4:40,e5:20,e6:20,e7:60,e8:30,
 f1:8,f2:30,f3:30,f4:30,f5:20,f6:15,f7:15,f8:20,f9:30,
 g1:25,g2:60,g3:15,g4:100,
 h1:15,h2:20,h3:15,h4:40,h5:40,h6:60,
 i1:15,i2:8,i3:10,i4:6,i5:60,i6:50,i7:40,i8:30,i9:80,
 j1:15,j2:15,j3:25,j4:40,j5:30,j6:20,j7:8,j8:30,j9:20,j10:40,
 k1:15,k2:10,k3:12,k4:40,k5:25,k6:50,k7:15,k8:20,
 l1:20,l2:10,l3:25,l4:6,l5:15,l6:20,l7:10,l8:15,l9:20,
 m1:8,m2:6,m3:10,m4:12,m5:15,m6:10,m7:6,m8:10,m9:30,m10:20,
 n1:1,n2:300,n3:60,n4:100,n5:120,n6:60,n7:20,n8:40,
 o1:4,o2:120,o3:30,o4:6,o5:20,o6:200,o7:120,o8:300,o9:40
};
const STEP_LABS = {
 b1:["pc","bits"],b2:["bits","trace"],b5:["http"],b7:["pc","bits"],
 c1:["trace"],c2:["trace"],c3:["trace"],
 d2:["git"],d3:["git"],
 e1:["play"],e2:["play"],e3:["play"],e4:["play"],
 f1:["http"],f2:["sql"],f3:["http"],f4:["http"],f5:["sql"],
 g1:["sort"],g2:["sort"],g3:["sort"],
 i1:["neuron","llm"],i2:["llm"],i5:["neuron"],i6:["neuron"],i7:["llm"],
 j1:["microbit"],j2:["microbit"],j3:["ohm"],j4:["arduino"],j5:["arduino"],j7:["ohm"],
 k1:["slicer"],k2:["slicer"],k5:["slicer"],
 m2:["bits"],m3:["trace"]
};
const PLANNED = {
 a1:[2,"Curva do esquecimento: veja a memória cair e subir com revisões"],a2:[2,"Flashcards com repetição espaçada funcionando"],a3:[2,"Timer de foco com registro de sessões"],a4:[2,"Painel de revisão mensal gerado pelo seu progresso"],
 b3:[2,"Terminal simulado: ls, cd, mkdir e mais"],b4:[2,"Lógica e tabelas-verdade interativas"],b6:[2,"Sistema operacional: escalonador de processos e memória"],b8:[2,"Força de senha e simulador de golpe de phishing"],
 c4:[3,"Automação: script Python que organiza as notas de uma turma"],c5:[3,"Python real no navegador com exercícios corrigidos"],c6:[3,"Classes e objetos visuais: crie um Aluno e veja a memória"],c7:[3,"Mini pandas: filtrar e fazer gráfico de notas"],
 d0:[6,"Tour guiado pelo GitHub Student Pack"],d1:[4,"VS Code simulado: atalhos, extensões e terminal"],d4:[4,"Editor Markdown com pré-visualização ao vivo"],d5:[4,"Docker: contêineres isolados lado a lado"],d6:[4,"Testes automatizados: o CI fica verde ou vermelho"],
 e5:[4,"Verificador de contraste e leitor de tela simulado"],e6:[4,"TypeScript: o tipo errado aparece antes de rodar"],e7:[4,"React: componentes e estado mudando a tela"],e8:[4,"Pipeline de deploy: do git push ao site no ar"],
 f6:[4,"Senha com hash e login com token, passo a passo"],f7:[4,"Back-end pronto: tabela e login sem servidor"],f8:[4,"Nuvem: servidores escalando conforme o acesso"],f9:[4,"Arquitetura: cache e fila sob carga"],
 g4:[3,"Problemas de entrevista com Python real e testes"],
 h1:[5,"App Inventor: blocos montando um app de sorteio"],h2:[6,"Apps Script: planilha que corrige um formulário"],h3:[4,"PWA: modo offline ligado e desligado"],h4:[5,"Celular simulado com um app em React Native"],h5:[5,"Widgets do Flutter montando uma tela"],h6:[5,"Planejador do seu projeto real: requisitos e telas"],
 i3:[6,"Comparador: a mesma tarefa em Claude, Gemini e Copilot"],i4:[6,"Dilemas de ética com IA na sala de aula"],i8:[4,"Agente usando ferramentas, passo a passo"],i9:[6,"Mapa de especializações em IA"],
 j6:[5,"Robô seguidor de linha em pista virtual"],j8:[5,"ESP32 enviando dados para um painel online"],j9:[5,"Raspberry Pi: terminal Linux e GPIO"],j10:[5,"Robô completo: eletrônica, peça 3D e código"],
 k3:[5,"Curvas vetoriais (Bézier) para a máquina de corte"],k4:[5,"CAD paramétrico: mude uma medida e o modelo se ajusta"],k6:[5,"Visualizador 3D: vértices, faces e malha"],k7:[5,"OpenSCAD: código gerando uma peça"],k8:[6,"Planejador do laboratório maker da escola"],
 l1:[6,"Treino de digitação e atalhos"],l2:[6,"Drive organizado: arraste arquivos para as pastas certas"],l3:[6,"Planilha simulada com PROCV, SE e formatação condicional"],l4:[6,"Formulário com autocorreção e ramificação"],l5:[6,"Canva: hierarquia e alinhamento num cartaz"],l6:[6,"Word: estilos gerando sumário automático"],l7:[6,"Os 4 princípios de design, antes e depois"],l8:[6,"Linha do tempo de edição de vídeo"],l9:[6,"Simulado da certificação Google Educator"],
 m1:[6,"Mapeador de aulas na BNCC Computação"],m4:[6,"Espiral da aprendizagem criativa"],m5:[6,"Tartaruga do LOGO desenhando com comandos"],m6:[6,"Construtor de rubricas"],m7:[6,"Situações de cidadania digital: o que fazer?"],m8:[3,"Problemas no estilo da OBI com correção"],m9:[6,"Gerador do site da sua disciplina"],m10:[6,"Estrutura de um relato de experiência"],
 n1:[6,"Teste rápido de nível por habilidade"],n2:[6,"Flashcards de vocabulário de tecnologia com áudio"],n3:[6,"Pronúncia: sons difíceis com áudio lento"],n4:[6,"Vocabulário de documentação técnica em contexto"],n5:[6,"Conversa guiada em inglês"],n6:[6,"Leitura com glossário ao toque"],n7:[6,"Corretor de README em inglês"],n8:[6,"Comparador de certificações de inglês"],
 o1:[6,"Quiz: que carreira de tecnologia combina com você"],o2:[6,"Mito da Caverna interativo e estante de leitura"],o3:[6,"Mapa do mercado de tecnologia no Brasil"],o4:[6,"Montador de perfil do LinkedIn"],o5:[6,"Mapa de comunidades e eventos"],o6:[6,"Simulador de entrevista de estágio"],o7:[6,"Checklist do portfólio forte"],o8:[6,"Planejador de TCC"],o9:[6,"Simulador de entrevista técnica"]
};

const LABS = [], LAB_BY_ID = {};
let labTimers = [], labStops = [];
function lab(def){ if (LAB_BY_ID[def.id]) return; LABS.push(def); LAB_BY_ID[def.id] = def; }
function labEvery(fn, ms){ const t = setInterval(fn, ms); labTimers.push(t); return t; }
function labLater(fn, ms){ const t = setTimeout(fn, ms); labTimers.push(t); return t; }
function labOnStop(fn){ labStops.push(fn); }
function stopLabs(){ labTimers.forEach(t=>{ clearInterval(t); clearTimeout(t); }); labTimers = []; labStops.forEach(f=>{ try { f(); } catch(e){} }); labStops = []; }
const wait = ms => new Promise(r => labLater(r, ms));
function labCard(L){
  return `<a class="labcard" href="#lab-${L.id}"><span class="labtag ${L.area}">${L.area==="hw"?"Hardware":"Software"}</span><b>${esc(L.title)}</b><span class="small muted">${esc(L.blurb)}</span></a>`;
}
let labFilter = "all";
function viewLabs(){
  const list = LABS.filter(L => labFilter==="all" || L.area===labFilter);
  const groups = TRACKS.map(t=>({t, items:list.filter(L=>L.tr===t.id)})).filter(g=>g.items.length);
  const lotes = {}; Object.values(PLANNED).forEach(([n]) => { lotes[n] = (lotes[n]||0) + 1; });
  const ready = new Set(LABS.map(L=>L.id));
  const covered = ALL.filter(s => s.labs.some(id=>ready.has(id))).length;
  return `<section class="pagehead"><h1>Laboratório</h1>
  <p class="lead">Simulações para ver cada conceito funcionando antes de estudar a fundo. Mexa, quebre, teste. Toda etapa das trilhas vai ganhar a sua.</p></section>
  <section class="stats sec"><div class="stat"><div class="n">${LABS.length}</div><div class="l">simulações prontas</div></div><div class="stat"><div class="n">${covered}<span class="of"> / ${ALL.length}</span></div><div class="l">etapas com simulação</div><div class="bar" style="margin-top:8px"><span style="width:${100*covered/ALL.length}%"></span></div></div><div class="stat"><div class="n">${Object.keys(lotes).length}</div><div class="l">lotes a caminho</div></div></section>
  <div class="filters" role="group" aria-label="Filtrar simulações">
    ${[["all","Todas"],["sw","Software"],["hw","Hardware"]].map(([k,l])=>`<button data-labfilter="${k}" aria-pressed="${labFilter===k}">${l}</button>`).join("")}
  </div>
  ${groups.map(g=>`<section class="sec"><div class="tlabel" style="--tc:${TC[g.t.g]}"><i></i>${esc(g.t.name)}</div><div class="labgrid">${g.items.map(labCard).join("")}</div></section>`).join("")}
  <section class="card sec"><h2>Próximos lotes</h2><p class="muted small">Cada lote traz as simulações das etapas que ainda não têm a sua.</p>
  <div class="lotes">${Object.keys(lotes).sort().map(n=>`<div class="lote"><b>Lote ${n}</b><span class="small muted">${lotes[n]} simulações</span><ul class="plain small">${Object.entries(PLANNED).filter(([,v])=>String(v[0])===n).slice(0,6).map(([,v])=>`<li>${esc(v[1])}</li>`).join("")}${lotes[n]>6?`<li class="muted">e mais ${lotes[n]-6}…</li>`:""}</ul></div>`).join("")}</div></section>`;
}
function viewLab(id){
  const L = LAB_BY_ID[id], i = LABS.indexOf(L), nxt = LABS[(i+1)%LABS.length], prv = LABS[(i-1+LABS.length)%LABS.length];
  const tr = TRACKS.find(t=>t.id===L.tr);
  const steps = ALL.filter(s=>s.labs.includes(id));
  return `<nav class="crumbs"><a href="#laboratorio">Laboratório</a> / <span>${esc(tr?tr.name:"")}</span></nav>
  <section class="labhead"><span class="labtag ${L.area}">${L.area==="hw"?"Hardware":"Software"}</span><h1 class="h1s">${esc(L.title)}</h1><p class="lead">${esc(L.blurb)}</p>
  ${L.learn?`<ul class="learn">${L.learn.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}</section>
  <section class="labstage card" id="labstage">${L.html()}</section>
  ${steps.length?`<section class="card sec linked"><h2>Etapas ligadas a esta simulação</h2>${steps.map(s=>chk(s.id, `${esc(s.t)} <span class="small muted">· ${esc(s.track.name)}</span>`, "l-")).join("")}</section>`:""}
  <nav class="labnav sec"><a class="btn ghost" href="#lab-${prv.id}">← ${esc(prv.title)}</a><a class="btn ghost" href="#lab-${nxt.id}">${esc(nxt.title)} →</a></nav>`;
}
function mountLab(id){
  const L = LAB_BY_ID[id], root = document.getElementById("labstage");
  if (!L || !root) return;
  try { L.mount(root); } catch(e){ root.insertAdjacentHTML("beforeend", `<p class="warntext">Erro ao iniciar a simulação: ${esc(e.message)}</p>`); }
}
document.addEventListener("click", e => { const b = e.target.closest("[data-labfilter]"); if (b){ labFilter = b.dataset.labfilter; render(); } });
