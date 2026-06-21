# 3부: AI 에이전트 CLI(agy) 설치 및 세팅 가이드

원래 이 세션은 **Claude Code**나 **Codex CLI**와 같은 에이전트 도구의 설치법을 다루려고 했습니다. 하지만 이러한 도구들은 유료 플랜 결제나 별도의 유료 API 키 세팅이 선행되어야 하므로 초보자가 시작하기에 문턱이 높습니다.

> 📌 **참고: Claude Code 및 Codex CLI 공식 설치 경로**
> 만약 유료 요금제를 사용 중이거나 API 크레딧을 연동하여 직접 설치해보고 싶으시다면 아래 가이드를 활용해 보세요.
> 
> * **Claude Code (Anthropic)**
>   - 공식 사이트 및 문서: [claude.ai](https://claude.ai) / [Anthropic Docs](https://docs.anthropic.com/en/docs/about-claude/claude-code)
>   - 설치 명령어 (macOS / Linux): `curl -fsSL https://claude.ai/install.sh | bash`
>   - 설치 명령어 (Windows): `irm https://claude.ai/install.ps1 | iex`
>   - *비고: Claude Pro/Team 구독 계정 또는 API 결제 계정 필요*
> 
> * **Codex CLI (OpenAI)**
>   - 공식 사이트 및 Github: [chatgpt.com/codex](https://chatgpt.com/codex) / [OpenAI Github](https://github.com/openai/codex)
>   - 설치 명령어 (Node.js 설치 필요): `npm install -g @openai/codex`
>   - *비고: OpenAI API Key 발급 및 사용 크레딧 충전 필요*

따라서 이번 세션에서는 **무료 사용자도 손쉽게 설치하고 바로 체험해볼 수 있는 구글의 AI 에이전트 도구인 `agy CLI` (Antigravity CLI)**를 기준으로 검색부터 설치, 초기 로그인 세팅까지의 과정을 차근차근 진행합니다.

---

## 1. agy CLI가 무엇인가요?

`agy CLI`(Antigravity CLI)는 터미널 화면에서 작동하는 구글의 AI 에이전트 도구입니다. 
- 터미널 창 안에서 대화형 인터페이스(TUI)를 통해 코드를 작성, 수정, 분석해 줍니다.
- 복잡한 API 키 발급 절차가 필요 없으며, 평소 사용하는 **Google 계정 로그인**만으로 즉시 시작할 수 있어 입문용으로 가장 추천됩니다.

---

## 2. agy CLI 공식 홈페이지 검색 및 접속

1. 구글(Google) 검색창에 **`Antigravity CLI`** 또는 **`agy-cli`**를 검색합니다.
2. 공식 홈페이지인 **[antigravity.google](https://antigravity.google)**에 접속합니다.
3. 홈페이지 메인 화면에서 내 컴퓨터 OS(Windows, macOS)에 맞는 설치 스크립트 명령어를 확인할 수 있습니다.

---

## 3. OS별 설치 명령어 실행하기

설치 작업을 위해 **이전 세션에서 설정한 터미널**을 켭니다. 
*(윈도우 사용자는 PowerShell을 관리자 권한으로 실행하고, 맥 사용자는 기본 터미널을 실행합니다.)*

### 🍏 macOS / Linux 사용자
터미널을 열고 아래 명령어를 입력한 뒤 엔터를 누릅니다.
```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

### 💙 Windows 사용자 (PowerShell - 권장)
PowerShell 창을 **관리자 권한**으로 실행하고 아래 명령어를 입력한 뒤 엔터를 누릅니다.
```powershell
irm https://antigravity.google/cli/install.ps1 | iex
```

### 💙 Windows 사용자 (일반 cmd 명령 프롬프트)
일반 명령 프롬프트를 사용할 경우 아래 명령어를 입력하고 엔터를 누릅니다.
```cmd
curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd
```

---

## 4. 첫 실행 및 초기 세팅하기 (로그인 및 설정)

설치 명령어가 성공적으로 끝났다면, **실행 중이던 터미널 창을 완전히 닫고 새로 열어줍니다.**

### ① agy 실행하기
새 터미널 창에 다음 명령어를 입력하고 엔터를 칩니다.
```bash
agy
```

### ② 대화형 인터페이스(TUI) 초기 설정
명령어를 치면 터미널 창이 에이전트 전용 대화 화면으로 전환되며 다음과 같은 초기 설정을 안내합니다. (키보드 방향키와 엔터로 조작합니다.)
1. **렌더링 모드 및 테마 선택**: 터미널에 표시될 테마(Dark/Light)와 컬러 스키마를 고릅니다. (기본값 엔터 권장)
2. **구글 계정 로그인 (Authentication)**: 
   - 화면에 브라우저를 열어 로그인을 진행할지 묻는 메시지가 뜹니다.
   - 엔터를 누르면 자동으로 웹 브라우저가 열리고 Google 로그인 창이 뜹니다.
   - 평소 사용하시는 Google 계정으로 로그인을 완료하면 터미널 창에 로그인 성공 메시지가 표시됩니다.

---

## 5. 설치 확인 및 첫 프롬프트 날려보기

로그인 세팅까지 무사히 마쳤다면 대화가 잘 통하는지 확인해 봅시다.
터미널에 아래와 같이 간단한 프롬프트를 입력하고 엔터를 눌러봅니다.

```bash
agy "안녕! 오늘 날씨 어때? 그리고 네 소개를 간단히 해줘."
```

AI 에이전트가 터미널 화면에 정상적으로 한글 답변을 출력한다면, 나만의 AI 코딩 비서 설치가 완벽하게 마무리된 것입니다!

---

## 🚨 자주 묻는 질문 (FAQ) & 트러블슈팅

- **Q. `agy: command not found` 또는 `'agy'은(는) 내부 또는 외부 명령...` 에러가 납니다.**
  - **원인**: 설치 경로가 컴퓨터 환경 변수(`PATH`)에 바로 등록되지 않은 경우입니다.
  - **해결법**: 
    1. 터미널 창을 완전히 껐다가 다시 켜서 재시도해 보세요.
    2. 계속 실행이 되지 않는다면 설치 완료 문구에 나오는 경로(예: macOS/Linux의 경우 `~/.local/bin`)를 환경 변수에 수동으로 등록해 주거나, 컴퓨터를 재부팅해 보세요.
- **Q. 로그인창 브라우저가 자동으로 안 열려요.**
  - **해결법**: 터미널 화면에 출력된 로그인용 URL 주소(예: `https://accounts.google.com/o/oauth2/...`)를 마우스로 복사하여 인터넷 브라우저 주소창에 직접 붙여넣고 로그인해 주세요.
