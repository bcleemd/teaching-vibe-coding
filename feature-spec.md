# 프로젝트 기능 명세서 (Feature Specifications)

본 문서는 AI 어시스턴트(Antigravity)와 사용자 간의 협업으로 구축된 **바이브코딩(Vibe Coding) 교육 프로젝트**의 전체 결과물과 기능 구현 명세를 기록합니다.

---

## 1. 교육 세션별 교안 명세

### 📖 [1부: CLI 설치 및 기초 환경 설정 가이드](session1_cli_setup.md)
*   **터미널 개념 안내**: GUI와 CLI의 차이 및 OS별 터미널 실행법 기술.
*   **Windows 터미널 보완**: PowerShell(기본 5.1)의 호환성 문제를 보완하기 위해 `winget`을 통한 **PowerShell 7(pwsh)** 설치 및 실행 명령 추가.
*   **Python/uv 가상환경 및 패키지 관리**: 현대적이고 빠른 파이썬 관리 도구인 `uv` 패키지 매니저 소개 및 `uv python install`을 통한 독립적 파이썬 설치 가이드 구축.
*   **설치 확인 & 기본 명령어**: `node`, `npm`, `git`, `uv` 등의 버전 확인 명령 및 `pwd`/`ls`/`cd` 핵심 3대 터미널 탐색 명령어 정리.

### 📖 [2부: 바이브코딩 입문 및 첫 AI 협업 가이드](session2_vibe_coding_intro.md)
*   **바이브코딩 핵심 정리**: 설계는 개발자가 쥐고 타이핑은 AI가 처리하는 패러다임 설명.
*   **프롬프트 3대 법칙**: 역할 부여(Role), 제약 조건(Constraint), 점진적 개발(Step-by-step) 설명.
*   **실습 프로젝트**: 하나의 HTML 파일로 구동되는 무작위 동기부여 명언 및 자기소개 카드 페이지 제작 흐름 안내.

### 📖 [3부: AI 에이전트 CLI(agy) 설치 및 세팅 가이드](session3_cli_setting.md)
*   **agy CLI (Antigravity CLI) 세팅**: 구글 계정 로그인(인증)을 통해 무료로 사용 가능한 에이전트 CLI 툴 소개 및 설치 명령어 정리.
*   **대화형 인터페이스(TUI) 가이드**: `agy` 최초 실행 시의 테마 선택 및 브라우저 연동 인증 프로세스 명시.
*   **대체 AI 에이전트 안내**: 유료 API 키 또는 요금제가 필요한 **Claude Code** 및 **Codex CLI**의 공식 설치 주소와 명령어를 참고 박스로 연동.

### 📖 [4부: AI 에이전트 실전 실습 - 영어 회화 1000문장 학습 앱](session4_vibe_coding_practice.md)
*   **학습 앱 기획 및 완성**: [유튜브 생활영어 1000문장 영상](https://www.youtube.com/watch?v=_50HS70urTw)을 모티브로 한 영어 퀴즈 웹 애플리케이션 구축.
*   **Python 로컬 HTTP 서버 활용**: 웹 브라우저의 로컬 파일 비동기 fetch 시 발생하는 CORS 보안 에러 해결을 위해 파이썬을 이용한 로컬 서버(`uv run python -m http.server 8000`) 띄우기 실습 연결.
*   **에이전트와의 실전 Vibe Coding 실습**: `agy CLI`를 통해 JSON 데이터를 직접 조작하고 CSS 컬러를 변경하는 3가지 실전 수정 명령어 예시 수록.

### 📖 [5부: CLI를 활용한 크로스 플랫폼(윈도우/맥) 자동화 작업 구축 가이드](session5_automation.md)
*   **Python 기반 자동화**: OS별 셸(Shell) 명령어 파편화를 방지하기 위해 파이썬 표준 라이브러리(`os`, `shutil`)로 만든 크로스 플랫폼 `backup.py` 백업 스크립트 작성.
*   **OS별 정기 백그라운드 스케줄러**:
    *   macOS: `crontab -e` 명령을 활용한 백그라운드 정기 실행 등록.
    *   Windows: PowerShell 관리자 권한을 통한 `schtasks` 작업 스케줄러 자동 예약 및 삭제 명령 구축.

### 📖 [6부: 텔레그램 챗봇 연동 영어 학습 비서 가이드](session6_telegram_bot.md)
*   **스마트폰 메신저 제어**: 텔레그램 `@BotFather`를 경유해 나만의 챗봇 API 토큰을 안전하게 발급받는 절차 정리.
*   **AI 에이전트 챗봇 구현용 프롬프트**: 4부의 JSON 데이터베이스를 기반으로 `/start`, `/test`, `/review`, `/status` 명령어와 진행 상황 저장(`progress.json`)을 완벽하게 수행하는 파이썬 챗봇(`telegram_bot.py`) 코드 자동 생성 프롬프트 수록.
*   **챗봇 개발 언어 선택 가이드**: 백엔드 서버 구축에 쓰이는 **Python**과 **Node.js (JavaScript)**로 구현할 때의 장단점을 상세하게 표와 항목으로 비교 수록.

---

## 2. 실무 가이드 문서 명세

### 📝 [agy CLI vs Antigravity IDE 프롬프팅 차이 가이드](agy-cli-vs-ide-prompting.md)
*   **자동 맥락(Context) 차이**: CLI가 단순 경로와 직접 명시한 파일 위주라면, IDE는 활성 탭, 마우스 커서 라인, 드래그 선택 영역 등을 실시간 메타데이터로 연동함을 규명.
*   **효과적인 프롬프팅 전략**: 지시대명사(`여기`, `이 부분`)를 적극 사용할 수 있는 IDE 환경과, 절대 경로 및 파일명을 명확히 해야 하는 CLI 환경에서의 프롬프트 작성 팁 전수.
*   **도구의 대체 불가능성(Irreplaceability) 기술**: 그럼에도 불구하고 서버 및 Docker 제어, 쉘 스크립트 연동, CI/CD 자동화, Claude Code와 같은 터미널 전용 최신 AI 에이전트의 활용을 위해 왜 CLI가 꼭 필요한지 정리.

---

## 3. 구현물 명세 (`session4_english_app` 폴더)

*   **[sentences.json](session4_english_app/sentences.json)**: 유튜브 1000문장 영상에서 추출한 50개의 실무 필수 회화 데이터베이스.
*   **[index.html](session4_english_app/index.html)**: 글래스모피즘 기반 다크 UI 뼈대 구조.
*   **[style.css](session4_english_app/style.css)**: 네온 글로우 스타일링, 3D 카드 뒤집기 애니메이션을 지원하는 현대적 디자인 시스템.
*   **[app.js](session4_english_app/app.js)**: Web Speech API 음성 재생, 구두점 무시 정답 검증 로직, `localStorage` 기반 학습 진도 관리.
