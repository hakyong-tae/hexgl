# HexGL — 구조 분석 노트

> 미래형 WebGL 레이싱 게임 (WipEout류). 원작: Thibaut Despoulain (BKcore).
> 원본 저장소: https://github.com/BKcore/HexGL — **MIT 라이선스 (코드 + 리소스)**

---

## 1. 라이선스 (상업적 사용 ✅)

| 대상 | 라이선스 | 비고 |
|---|---|---|
| 코드 + 3D 모델 + 텍스처 | **MIT** | README: "code and resources are now licensed under the MIT License" |
| 오디오 (`public/audio/`) | **Public Domain + CC-BY 3.0** | `public/audio/LICENSE` 참조. boost/wind/destroyed = CC-BY 3.0(출처 표기), crash/bg = PD |

→ Freedoom(GPL copyleft)과 달리 **소스 공개 의무 없음**. 상업적 사용·수정·재배포 자유. 바이너리/에셋 commit 가능.
→ 크레딧 표기 대상: BKcore(코드/컨셉), Charnel(HexMKI 함선 모델), Nobiax(트랙 텍스처), 오디오 제작자들(audio/LICENSE).

---

## 2. 파일 구조 (Vite 기준)

```
hexgl/
├── index.html          ← Vite 진입점 (루트). 클래식 <script> 태그로 엔진 로드
├── vite.config.js      ← publicDir='public', port 3017
├── package.json        ← type:module, dev/build/preview
├── .gitignore          ← node_modules/, dist/, .DS_Store
├── launch.coffee       ← launch.js의 CoffeeScript 원본 (참고용)
├── LICENSE / README.md
└── public/             ← Vite가 '/'에서 서빙 → 상대경로 XHR 그대로 맞음
    ├── launch.js               ← 부트스트랩 (WebGL 감지 → HexGL 인스턴스 생성)
    ├── libs/                   ← Three.js(Three.dev.js) + 후처리 + Detector/Stats/DAT.GUI/Leap
    │   └── postprocessing/     ← EffectComposer, RenderPass, BloomPass, ShaderPass, MaskPass
    ├── bkcore.coffee/          ← 컴파일된 JS (controllers/, Timer, ImageData, Utils)
    │   └── controllers/        ← TouchController, OrientationController, GamepadController
    ├── bkcore/
    │   ├── threejs/            ← RenderManager, Shaders, Particles, Loader
    │   ├── Audio.js
    │   └── hexgl/              ← 게임 코어 (아래 §4)
    │       └── tracks/Cityscape.js
    ├── geometries/             ← 3D 모델: ships/, tracks/, booster/, bonus/
    ├── textures/               ← 표준 화질 텍스처
    ├── textures.full/          ← VERY HIGH 화질 (기본값이 이것 → 필수)
    ├── audio/                  ← bg/boost/crash/destroyed/wind .ogg (+ LICENSE)
    ├── replays/                ← 고스트/리플레이 데이터
    └── favicon.png, icon_*.png
```

**핵심:** 모듈 번들 게임이 아니라 전역(window) 네임스페이스 + 런타임 상대경로 XHR 로드 방식.
그래서 index.html은 루트, 나머지는 전부 `public/`에 두면 Vite가 `/`에서 서빙 → 경로 무수정.

---

## 3. 실행 방법

```bash
export PATH="$HOME/.nvm/versions/node/v23.11.0/bin:$PATH"
cd /Users/hytae/Downloads/hexgl
npm install
npm run dev        # → http://localhost:3017
npm run build      # → dist/
npm run preview    # → dist/ 정적 서빙
```

⚠️ **프리뷰 MCP 서버 샌드박스 주의:** python `http.server`는 샌드박스로 `~/Downloads` 읽기가 막혀 전 파일 404가 난다(권한 거부 → 404). **node(Vite) 기반 서버는 정상.** launch.json의 hexgl 항목은 Vite(node)로 설정됨.

---

## 4. 게임 엔진 & 아키텍처

- **엔진:** Three.js (구버전 `Three.dev.js`) + 자체 `bkcore` 프레임워크
- **렌더링:** WebGL + 후처리 파이프라인(EffectComposer → Bloom 등). 추가 런타임/플러그인 없음
- **부트:** `launch.js` → WebGL 감지(미지원 시 get.webgl.org 폴백) → `bkcore.hexgl.HexGL` 인스턴스 생성

### 게임 코어 (`public/bkcore/hexgl/`)
| 파일 | 역할 |
|---|---|
| `HexGL.js` | 메인 게임 클래스 (씬 흐름·로딩·루프 총괄) |
| `Gameplay.js` | 레이스 진행 로직 (랩/타임/충돌) |
| `ShipControls.js` | 함선 물리·조작 입력 처리 |
| `ShipEffects.js` | 부스터·파티클·모션블러 효과 |
| `CameraChase.js` | 추격 카메라 |
| `HUD.js` | 속도/실드/랩 HUD (canvas 2D) |
| `RaceData.js` | 트랙별 레이스 데이터 |
| `tracks/Cityscape.js` | Cityscape 트랙 정의 (현재 유일 트랙) |

### 지원 시스템 (`public/bkcore/threejs/`, `bkcore.coffee/`)
- `Loader.js` — 비동기 에셋 로더(모델/텍스처/오디오), 로딩 progressbar
- `RenderManager.js` — 렌더 패스 관리
- `Particles.js`, `Shaders.js` — VFX/셰이더
- `Audio.js` — OGG 사운드 재생
- 컨트롤러: Touch / Orientation(기울기) / Gamepad (+ Leap Motion)

---

## 5. 씬 흐름 (index.html `step-1`~`step-5`)

```
step-1  메인 메뉴 (Start / Controls / Quality / HUD / Godmode / Credits)
  ↓ #start 클릭
step-2  조작 안내 (TURN ←→ / ACCEL ↑ / AIR BRAKES A·D) — "Click/Touch to continue"
  ↓ 클릭
step-3  로딩 (#progressbar — Loader가 모델/텍스처/오디오 비동기 로드)
  ↓ 완료
step-4  게임플레이 (#main 캔버스 + #overlay HUD) — 카운트다운 3·2·1·GO → 레이스
  ↓ 3랩 완주
step-5  결과 (#time 기록) — "Click/Touch to continue" → 메뉴 복귀
```

---

## 6. 조작계

| 입력 | 동작 |
|---|---|
| ← → / Touch / 기울기 | 좌우 회전 |
| ↑ | 가속 |
| A / D | 좌·우 에어브레이크 |
| (Gamepad / Leap Motion) | 대체 입력 지원 |

---

## 7. 밸런스/데이터 파일

- `public/bkcore/hexgl/RaceData.js` — 랩 수, 트랙 메타
- `public/bkcore/hexgl/tracks/Cityscape.js` — 트랙 형상/체크포인트
- `public/textures.full/tracks/cityscape/collision.png` — 충돌 맵 (픽셀 기반 트랙 경계)
- `public/textures.full/tracks/cityscape/height.png` — 높이 맵
- `public/replays/` — 고스트 주행 데이터

---

## 8. Verse8 AI 프롬프트용 구조 요약

> 픽셀 충돌맵 기반 의사물리 레이서. 트랙은 3D 모델 + collision.png(경계)/height.png(고저)로 정의.
> 함선은 `ShipControls`에서 매 프레임 collision맵을 샘플링해 경계 반발·고도 조정. 카메라는 `CameraChase`가
> 함선 뒤를 스프링 추격. 씬은 단일 게임루프(`HexGL.js`)가 step 상태머신으로 메뉴↔로딩↔레이스↔결과 전환.
> HUD는 별도 canvas 2D 오버레이. VFX(부스터/모션블러)는 후처리 패스로 합성.

**직접 구현 시 분리 포인트:** ① 트랙 = 형상 모델 + 충돌/높이 맵 데이터로 분리(데이터 주도) ② 입력은 컨트롤러 추상화(키보드/터치/기울기 동일 인터페이스) ③ 렌더 후처리는 옵션(품질 토글).

---

## 9. 포팅 시 변경 사항 (원본 대비)

- `index.html`: Google Analytics 스크립트 제거, `hexgl.bkcore.com` 절대경로 favicon/og 메타 → 상대경로(`favicon.png`)로 정리
- 게임 파일 전체를 `public/`로 이동 (Vite publicDir 서빙)
- 추가: `vite.config.js`, `package.json`, `.gitignore`
- 제거: `cache.appcache`, `manifest.webapp`, `package.webapp`(Firefox OS 잔재), `package.zip`(중복)
- **PokiSDK mock 불필요** (Poki 게임 아님 — GitHub 원본 직접 clone)
