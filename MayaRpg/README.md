# Maya RPG Fisioterapia 🏥

Aplicativo Android para agendamento de consultas de fisioterapia, desenvolvido para a clínica Maya RPG Fisioterapia.

## 📱 Sobre o Projeto

O Maya RPG é um aplicativo Android que permite:
- **Autenticação de usuários** com Firebase (email/senha)
- **Verificação de email** obrigatória para segurança
- **Modo visitante** para visualização de planos sem login
- **Agendamento de consultas** com calendário interativo
- **Seleção de horários** por data
- **Interface moderna** seguindo design do Figma

---

## 🛠️ Tecnologias Utilizadas

- **Android Studio** (Iguana | 2023.2.1 ou superior)
- **Java 11**
- **Gradle 9.4.1**
- **Firebase Authentication** (autenticação de usuários)
- **Firebase Analytics** (métricas de uso)
- **Kizitonwose Calendar View 2.5.0** (calendário interativo)
- **Material Design Components**

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Android Studio](https://developer.android.com/studio) (versão Iguana ou superior)
- [JDK 11](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html)
- Conta no [Firebase Console](https://console.firebase.google.com/)
- Emulador Android ou dispositivo físico para testes

---

## 🔥 Configuração do Firebase

### 1. Criar projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `MayaRpg` (ou outro nome de sua preferência)
4. Siga os passos até finalizar a criação

### 2. Adicionar app Android ao projeto

1. No painel do Firebase, clique em **"Adicionar app" > "Android"**
2. Preencha os campos:
   - **Nome do pacote Android**: `com.example.mayarpg`
   - **Apelido do app**: `Maya RPG` (opcional)
   - **Certificado de autenticação SHA-1**: (opcional para desenvolvimento)
3. Clique em **"Registrar app"**

### 3. Baixar arquivo google-services.json

1. O Firebase vai gerar o arquivo `google-services.json`
2. **Baixe esse arquivo**
3. Coloque-o em: `app/google-services.json` (pasta `app` do projeto)

### 4. Ativar Authentication no Firebase

1. No menu lateral do Firebase Console, vá em **"Authentication"**
2. Clique em **"Começar"**
3. Na aba **"Sign-in method"**, ative:
   - ✅ **Email/Password** (clique em "Ativar" e salve)

---

## 📦 Dependências do Projeto

Todas as dependências já estão configuradas no `build.gradle.kts`. O projeto usa:

### Dependências Principais:
```kotlin
// Firebase
implementation(platform("com.google.firebase:firebase-bom:34.12.0"))
implementation("com.google.firebase:firebase-auth")
implementation("com.google.firebase:firebase-analytics")

// Kizitonwose Calendar (calendário interativo)
implementation("com.kizitonwose.calendar:view:2.5.0")

// Core Library Desugaring (suporte a java.time em API < 26)
coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.0.4")

// AndroidX
implementation(libs.activity.ktx)
implementation(libs.appcompat)
implementation(libs.constraintlayout)
implementation(libs.material)
```

### Repositórios necessários:
```kotlin
repositories {
    google()
    mavenCentral()
    maven { url = uri("https://jitpack.io") } // Para Kizitonwose Calendar
}
```

---

## 🚀 Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd MayaRpg
```

### 2. Abrir no Android Studio

1. Abra o **Android Studio**
2. Clique em **"File" > "Open"**
3. Selecione a pasta do projeto `MayaRpg`
4. Aguarde o Gradle sincronizar (pode demorar alguns minutos na primeira vez)

### 3. Adicionar google-services.json

⚠️ **IMPORTANTE**: O arquivo `google-services.json` **NÃO** está no repositório por segurança.

Você precisa:
1. Configurar seu próprio projeto Firebase (veja seção "Configuração do Firebase")
2. Baixar o `google-services.json` do seu projeto Firebase
3. Colocar em: `app/google-services.json`

### 4. Sincronizar Gradle

1. Clique em **"File" > "Sync Project with Gradle Files"**
2. Ou clique no ícone do elefante (🐘) na barra de ferramentas

### 5. Rodar o app

**Opção A: Emulador**
1. Crie um emulador: **"Tools" > "Device Manager" > "Create Device"**
2. Recomendado: **Pixel 5** ou **Pixel 6** com API 33 ou 34
3. **IMPORTANTE para Windows**: Em "Additional settings" > "Graphics", selecione **"Software - GLES 2.0"**
4. Clique em **Run** (▶️)

**Opção B: Dispositivo físico (mais rápido!)**
1. Ative **"Depuração USB"** no celular:
   - Vá em **Configurações > Sobre o telefone**
   - Toque **7 vezes** em "Número da compilação"
   - Vá em **Configurações > Opções do desenvolvedor**
   - Ative **"Depuração USB"**
2. Conecte o celular no PC via USB
3. Autorize a depuração USB no celular
4. Selecione seu dispositivo no Android Studio
5. Clique em **Run** (▶️)

---

## 📁 Estrutura do Projeto

```
MayaRpg/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/mayarpg/
│   │   │   │   ├── MainActivity.java           # Tela de login
│   │   │   │   ├── RegisterActivity.java       # Tela de cadastro
│   │   │   │   ├── GuestActivity.java          # Modo visitante
│   │   │   │   ├── SplashActivity.java         # Splash screen
│   │   │   │   ├── HomeActivity.java           # Container dos fragments
│   │   │   │   ├── HomeFragment.java           # Página inicial (após login)
│   │   │   │   ├── ScheduleFragment.java       # Agendamento de consultas
│   │   │   │   └── ExercisesFragment.java      # Exercícios diários
│   │   │   ├── res/
│   │   │   │   ├── layout/                     # Layouts XML
│   │   │   │   ├── drawable/                   # Imagens e ícones
│   │   │   │   ├── values/
│   │   │   │   │   ├── colors.xml              # Paleta de cores
│   │   │   │   │   ├── strings.xml             # Textos do app
│   │   │   │   │   └── themes.xml              # Temas Material
│   │   │   │   └── menu/
│   │   │   │       └── menu_bottom_nav.xml     # Menu de navegação inferior
│   │   │   └── AndroidManifest.xml             # Configurações do app
│   │   └── google-services.json                # ⚠️ Configuração Firebase (não versionado)
│   └── build.gradle.kts                        # Dependências do módulo app
├── build.gradle.kts                            # Configuração geral do Gradle
├── settings.gradle.kts                         # Repositórios e plugins
└── README.md                                   # Este arquivo
```

---

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Login com email e senha
- ✅ Cadastro de novos usuários
- ✅ Verificação de email obrigatória
- ✅ Reenvio de email de verificação
- ✅ Modo visitante (sem autenticação)

### 📅 Agendamento
- ✅ Calendário interativo mensal
- ✅ Navegação entre meses (← →)
- ✅ Seleção de dia com destaque visual
- ✅ Grade de horários disponíveis
- ✅ Seleção de horário por dia
- ✅ Armazenamento de horários selecionados

### 🎨 Interface
- ✅ Design baseado em mockup Figma
- ✅ Paleta de cores personalizada
- ✅ Bottom Navigation com 3 páginas (Home, Agenda, Exercícios)
- ✅ Ícones personalizados
- ✅ Splash screen com logo

### 📱 Recursos extras
- ✅ Botão direto para WhatsApp (modo visitante)
- ✅ Logout com confirmação
- ✅ Mensagens de erro amigáveis
- ✅ Código totalmente comentado

---

## 🎨 Paleta de Cores

```xml
<!-- Cores principais -->
<color name="screen_background">#39BCD2</color>      <!-- Azul principal -->
<color name="button_green">#00D084</color>           <!-- Verde dos botões -->
<color name="brand_primary">#0693E3</color>          <!-- Azul secundário -->
<color name="text_on_primary">#FFFFFF</color>        <!-- Texto branco -->
```

---

## 🐛 Problemas Conhecidos

### Emulador no Windows
Se o emulador não iniciar com erro de "hypervisor driver", use uma dessas soluções:

1. **Solução recomendada**: Teste em dispositivo físico via USB
2. Configure o emulador com Graphics = "Software - GLES 2.0"
3. Execute o Android Studio como Administrador

---

## 📝 Configurações Importantes

### minSdk e targetSdk
```kotlin
minSdk = 24        // Android 7.0 (Nougat)
targetSdk = 36     // Android 14
```

### Core Library Desugaring
O projeto usa **desugaring** para permitir APIs do `java.time` em dispositivos com API < 26:
```kotlin
compileOptions {
    isCoreLibraryDesugaringEnabled = true
}
```

---

## Integracao com MySQL, API REST (projeto interdisciplinar Backend) e checklist da proxima etapa

Este capitulo descreve **o que e preciso** para o app Android **consumir dados de uma API REST** desenvolvida no backend do projeto interdisciplinar (com **MySQL** por baixo), integrar **autenticacao**, **armazenamento local**, **notificacoes** e o fluxo principal de **check-in de exercicios**.

### Visao geral da arquitetura

```
[ App Android ]  --HTTPS (JSON)-->  [ API REST - Backend ]  -->  [ MySQL ]
       |                                       |
       +-------- persistencia local -----------+  (cache / fila offline / Room)
```

- O **telemovel nunca liga ao MySQL diretamente**. Credenciais da base ficam **so no servidor**.
- O **Backend** (Node, Java Spring, PHP Laravel, etc.) usa **MySQL** + opcionalmente **Prisma** ou outro ORM e expoe endpoints REST.
- O **Android** usa **Retrofit** (ou OkHttp) + modelos JSON (Gson/Moshi).

### O que precisa existir no Backend (MySQL ja pronto)

| Item | Descricao |
|------|-----------|
| Servidor HTTPS | API acessivel pela Internet (ou tunel tipo ngrok em desenvolvimento). |
| MySQL | Base com tabelas acordadas com o backend (ex.: `usuarios`, `exercicios`, `exercicio_execucoes`, `consultas`, mensagens Maya). |
| Contrato REST | Documentacao minima: URLs, metodos GET/POST/PATCH, corpos JSON e codigos de erro. |
| Autenticacao na API | Ex.: login retorna **JWT**; todas as rotas protegidas enviam `Authorization: Bearer <token>`. Alternativa: validar **Firebase ID Token** no servidor (`verifyIdToken`) e cruzar com `firebase_uid` na tabela `usuarios`. |
| CORS / seguranca | HTTPS, limite de taxa, validacao de entrada; MySQL **nao** exposto na porta publica. |

### Endpoints REST sugeridos (alinhar com o grupo de Backend)

| Funcionalidade | Exemplo | Notas |
|----------------|---------|--------|
| Lista de exercicios | `GET /api/exercises` | Retorna catalogo para a **Tela de exercicios**. |
| Check-in / execucao | `POST /api/exercises/{id}/check-in` | Corpo: `{ "completedAt": "ISO-8601" }`; persiste em MySQL. |
| Historico de execucoes | `GET /api/users/me/check-ins` | Para **historico** no app / aba Usuario. |
| Consultas agendadas | `GET/POST /api/appointments` | Sincronizar com ou substituir Firestore, conforme decisao do grupo. |
| Mensagens / novidades | `GET /api/messages` ou `GET /api/exercises?updatedSince=...` | Base para **notificar exercicios novos** (ver abaixo). |

*(Os caminhos exatos ficam a cargo do projeto interdisciplinar.)*

### O que precisa ser feito no Android (este repositorio)

| Item | Descricao |
|------|-----------|
| Dependencias | Adicionar **Retrofit** + conversor **Gson** (ou Moshi); opcional **Room** para cache e historico offline consistente. |
| Configuracao da URL | Base URL da API em `BuildConfig` ou `local.properties` (**sem** commitar secrets); ambientes dev/prod. |
| Camada de rede | Interfaces Retrofit, DTOs iguais ao JSON do backend, tratamento de erro e timeouts. |
| Autenticacao | Apos login Firebase (ou login proprio), obter **JWT** do backend ou enviar **Firebase ID Token** nos pedidos, conforme o Backend definir. |
| Fluxo principal da etapa | **Tela Exercicios** → `GET /exercises` → utilizador regista execucao → **POST check-in** → gravar em **armazenamento local** (Room ou datastore) → **ecra Historico** le da API + local. |
| Sincronizacao | Opcional: fila de pedidos falhados (offline primeiro); reconciliar quando houver rede. |

### Persistencia local (armazenamento local)

- **Room**: recomendado para lista em cache de exercicios, ultimo sync e registos de check-in com flag `synced`.
- **SharedPreferences**: suficiente para prototipo simples; limitado para listas grandes ou consultas complexas.
- Definir politica: **fonte de verdade** na API; local e cache + historico quando offline.

### Notificacoes (exercicios novos, data de consulta, etc.)

| Tipo | O que precisa |
|------|----------------|
| Push (Firebase Cloud Messaging) | Projeto Firebase com **FCM** ativado; Backend ou Firebase Functions envia mensagens quando houver **exercicio novo** ou **consulta proxima**; app registra token em `FirebaseMessaging` e guarda token no servidor (MySQL) para direcionar ao utilizador. |
| Locais (NotificationManager) | Lembretes agendados com **WorkManager** + `AlarmManager`/Workers (ex.: vinte e quatro horas antes da consulta); **nao** substituem push para dados vindos do servidor em tempo real. |

Sem Backend ou FCM a enviar eventos, o app pode apenas **notificar localmente** apos acoes do proprio utilizador (ex.: confirmacao de agendamento), o que nao cobre totalmente "exercicios novos" vindos do servidor.

### Fluxo principal resumido (objetivo da etapa)

1. Utilizador abre **Exercicios**.
2. App pede **GET** ao Backend → dados gravados no MySQL devolvidos em JSON.
3. Opcional: atualiza **cache local** (Room).
4. Utilizador confirma **execucao (check-in)** → **POST** ao Backend → Backend **INSERT** em MySQL.
5. App grava o mesmo evento **localmente** (historico imediato e modo offline).
6. **Historico** mostra dados mesclados (API + local pendente de sync).

### Contrato com o projeto interdisciplinar

Para evitar bloqueios entre equipas, convém fixar por escrito:

1. Formato JSON dos exercicios e do check-in.
2. Esquema de autenticacao (JWT vs Firebase ID Token).
3. URL base de **staging** para testes integrados.
4. Quais dados ficam so no Firebase vs **so no MySQL** (evitar duplicacao sem estrategia).

### Referencia de modelo de dados MySQL (resumo)

Tabelas tipicas: `usuarios` (com `firebase_uid` opcional), `exercicios`, `exercicio_execucoes`, `consultas`, opcional `maya_mensagens` / `maya_respostas`. O Backend pode usar **Prisma** ou SQL direto sobre estas tabelas.

---

## 👨‍💻 Desenvolvido por

Projeto desenvolvido para a clínica **Maya RPG Fisioterapia**.

---

## 📄 Licença

Este projeto é proprietário e destinado exclusivamente ao uso da clínica Maya RPG Fisioterapia.

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se o `google-services.json` está configurado corretamente
2. Certifique-se de que o Firebase Authentication está ativado
3. Sincronize o Gradle novamente: `File > Sync Project with Gradle Files`
4. Limpe o projeto: `Build > Clean Project` e depois `Build > Rebuild Project`

---

**Última atualização**: Maio 2026
