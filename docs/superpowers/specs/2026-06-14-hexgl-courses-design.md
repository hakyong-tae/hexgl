# HexGL 코스 추가 — 설계 (2026-06-14)

## 목표
HexGL(비상업/NC, Unlisted)에 코스를 추가해 더 재밌는 게임으로 만들어 Verse8에 올린다.
3D 모델링 없이 **기존 Cityscape 에셋을 재활용한 변형 코스**로 v1을 구성한다.

## v1 코스 (4종)
1. **Cityscape** — 원본 (변경 없음)
2. **Reverse** — 같은 트랙 역주행
3. **Mirror** — 좌우 반전 트랙
4. **Hyper** — 동일 트랙, 고난이도(고속) 물리

범위 밖(나중): 절차적 트랙 생성, 테마(야간/석양) 변형.

## 아키텍처
- `HexGL.js:30`이 이미 `this.track = bkcore.hexgl.tracks[opts.track || 'Cityscape']`로
  **이름 기반 트랙 선택**을 지원한다. 새 트랙 객체만 등록하면 된다.
- **새 파일 `public/bkcore/hexgl/tracks/variants.js`** (index.html에서 Cityscape.js 다음에 로드):
  - `Cityscape`를 얕은 복제하고 필드를 오버라이드하는 변형 객체 3개를 `bkcore.hexgl.tracks`에 등록.
  - 복제 시 `load`/`buildMaterials`/`buildScenes` 함수는 base 것을 재사용하되, 변형 플래그
    (`mirror`, `reverse`, `physics` 등)를 읽어 동작을 분기.
- **코스 선택 UI**: `launch.js`의 메뉴 옵션 배열 `s`에 순환 옵션 추가
  `['track', ['CITYSCAPE','REVERSE','MIRROR','HYPER'], 0, 0, 'Course: ']`
  → 선택된 이름을 `init()`에서 `new bkcore.hexgl.HexGL({ track: <name>, ... })`로 전달.

## 체크포인트/랩 메커니즘 (확인됨)
- 체크포인트는 `collision.png`의 **파란 채널**에 id로 인코딩 (`r=255,g=255,b<250` → b=cp id).
- 랩 카운트: `cp == checkpoints.start && previousCheckPoint == checkpoints.last` (Gameplay.js:63).
- `checkpoints: { list:[0,1,2], start:0, last:2 }`, spawn/spawnRotation는 트랙 객체 필드.

## 코스별 구현
### Hyper (가장 쉬움 — 1단계)
- Cityscape 복제. 충돌/맵/지오메트리 변경 없음.
- `buildScenes`에서 shipControls 생성 후 물리 상향: `maxSpeed`, `thrust`, `boosterSpeed`
  (예: ×1.3~1.5). 변형 객체의 `physics` 배수로 제어.

### Reverse (config 중심 — 2단계)
- Cityscape 복제. 에셋 동일.
- `checkpoints.start ↔ last` 스왑 (start:2, last:0).
- `spawnRotation.y += π` (180° 회전). spawn 위치는 출발선 유지하되 역방향.
- 실제 주행으로 체크포인트 통과 순서/랩 카운트 검증 (튜닝 가능).

### Mirror (가장 까다로움 — 3단계)
- collision/height PNG를 좌우 반전한 사본 생성:
  `textures(.full)/tracks/cityscape_mirror/{collision,height}.png` (ffmpeg hflip).
  변형 객체 `load()`가 이 경로의 analyser를 사용.
- 지오메트리: 동일 메시 재사용 + `scale.x = -1`, winding 뒤집힘 대응 위해 `doubleSided`.
- `spawn.x` 부호 반전, `collisionPixelRatio` 동일.
- 체크포인트 방향 반전 가능 → 실제 주행 검증. 시각적으로 깨지면 이 코스만 제외하고 3종 출시.

## 구축 순서 (각 단계 프리뷰 검증 후 진행)
1. **Hyper + 코스 선택 메뉴** — 변형+선택 파이프라인을 최소 케이스로 검증
2. **Reverse** — config만, 체크포인트 방향 실주행 테스트
3. **Mirror** — PNG 반전 + 지오메트리 미러, 실주행 테스트

## 검증
- 각 코스: 메뉴에서 선택 → 로딩 → 카운트다운 → 주행 → 랩 카운트 정상 → 결과 화면.
- 프리뷰(localhost:3017)에서 콘솔 에러 0, 충돌맵 정상, 함선 주행 확인.

## 배포
- GitHub(hakyong-tae/hexgl) + Verse8 GitLab(hy.tae90/hexgl-game-upload, develop).
- Verse8는 단방향 동기화 → 변경 파일을 GitHub raw에서 curl 덮어쓰기로 에이전트 배포.
- 상태 Unlisted 유지 (NC 라이선스 — 비수익).

## 라이선스 주의
게임 코드는 CC BY-NC. 변형 추가물도 NC 유지. Verse8 수익화 금지, Unlisted/포트폴리오용.
