# Prize Draw

เกมจับรางวัลแบบสุ่มเลข: กำหนดช่วงตัวเลข เรียงรางวัล แล้วกดสุ่ม (จับจากรางวัลสุดท้ายไปหารางวัลที่ 1)
ถ้าไม่ใส่รางวัลจะเป็น Free draw mode (สุ่มเลขไม่ซ้ำไปเรื่อย ๆ)

Frontend ล้วน: **React 18 + TypeScript + Vite** ทดสอบด้วย **Vitest** และ deploy ไป **GitHub Pages** ผ่าน GitHub Actions
หน้าตาใช้ design system "Modernist" จาก Claude Design (Prize Draw v4) มีธีมให้เลือก 9 แบบ

## เริ่มใช้งาน

```bash
npm install
npm run dev        # dev server
npm test           # unit tests (domain + application)
npm run build      # typecheck + build ลง dist/
npm run preview    # เปิดดูผลลัพธ์จาก build
```

## โครงสร้าง (Clean Architecture)

dependency ชี้เข้าด้านในอย่างเดียว: `presentation → application → domain` ส่วน `infrastructure` implement port ที่ชั้นในกำหนดไว้

```
src/
├─ domain/            กฎของเกม (pure TS, ไม่ผูกกับ framework)
│  ├─ entities/       Prize, DrawSession (immutable: record / undo / end)
│  ├─ valueObjects/   NumberRange
│  ├─ services/       pickAvailableNumber (สุ่มเลขที่ยังไม่ถูกจับ)
│  └─ ports/          RandomSource
├─ application/       use cases
│  ├─ setup/          validateSetup, stepDuration
│  ├─ draw/           startGame, pickNextNumber, commitDraw, retryLastDraw,
│  │                  finishGame, getDrawProgress, getLedger, getSummary
│  └─ ports/          FullscreenPort, PreferencesPort
├─ infrastructure/    adapter ของ browser
│  ├─ random/         CryptoRandomSource (crypto.getRandomValues, ไม่มี modulo bias)
│  ├─ browser/        BrowserFullscreen
│  └─ storage/        LocalStoragePreferences (จำธีมที่เลือก)
├─ presentation/      React UI
│  ├─ pages/          SetupPage, DrawPage
│  ├─ components/     ThemePicker, PrizeListEditor, NumberTile, Ledger, ResultDialog, SummaryDialog …
│  ├─ hooks/          useRollingNumber, useFullscreen, useTheme
│  ├─ viewModels/     ข้อความสถานะบนหน้า Draw
│  ├─ theme/          ธีมสี 9 แบบ
│  ├─ styles/         modernist.css (design tokens) + app.css (layout)
│  └─ di/             Dependencies context
└─ main.tsx           composition root: ประกอบ infrastructure เข้ากับ UI
```

## Deploy ไป GitHub Pages

Workflow อยู่ที่ [.github/workflows/deploy.yml](.github/workflows/deploy.yml): ทุกครั้งที่ push เข้า `main` จะรัน typecheck → test → build แล้ว deploy โฟลเดอร์ `dist/`
(ถ้าเป็น pull request จะ build กับ test อย่างเดียว ไม่ deploy)

ตั้งค่าครั้งแรกครั้งเดียว: ไปที่ repo **Settings → Pages → Build and deployment → Source** แล้วเลือก **GitHub Actions**

Vite ตั้ง `base: './'` ไว้แล้ว จึงใช้ได้ทั้งที่ `https://<user>.github.io/prize-draw-game/` และ static host อื่น ๆ
