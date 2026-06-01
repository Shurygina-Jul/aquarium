# Fish Pool

Aквариум на [PixiJS](https://pixijs.com/) — вид сбоку: фон, каустика у дна, рыбы и пузырьки. Код разбит на простые модули без лишней абстракции.

## Запуск

```bash
yarn install
yarn dev
```

Сборка для продакшена (линт, TypeScript, Vite):

```bash
yarn build
```

Артефакты попадают в `dist/`. Проверка прод-сборки (с `base: /aquarium/`):

```bash
yarn build
yarn preview
```

Зависимости фиксируются в `yarn.lock` — в CI используется `yarn install --frozen-lockfile`.

Откройте URL из терминала (обычно с путём `/aquarium/`).

## Деплой на GitHub Pages

После пуша в `main` срабатывает [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. **Settings** → **Pages** → Source: **GitHub Actions**
2. Дождаться зелёного workflow в **Actions**
3. Сайт: **https://shurygina-jul.github.io/aquarium/**

`vite.config.ts`: `base: "/aquarium/"` (имя репозитория). Пути к ассетам — через `import.meta.env.BASE_URL` в `src/assets.ts`.

## Что на сцене

| Слой     | Модуль                             | Описание                                               |
| -------- | ---------------------------------- | ------------------------------------------------------ |
| Фон      | `addBackground.ts`                 | JPG на весь экран (`scaleToCover`)                     |
| Каустика | `addOverlay.ts`                    | Тайлинг-текстура в нижних 40% экрана, blend `screen`   |
| Рыбы     | `addFishes.ts`, `animateFishes.ts` | Горизонтальное движение, покачивание, разворот у краёв |
| Пузырьки | `addBubbles.ts`                    | Векторная графика, всплытие вверх, wrap по краям       |

Точка входа — `src/main.ts`: инициализация приложения, загрузка ассетов, один `ticker` для всей анимации.

## Импорты

В `tsconfig.json` и `vite.config.ts` настроен алиас `@` → `src/`:

```ts
import { fishCount } from "@/config/fish";
import type { FishSprite } from "@/types/fish";
```

## Структура `src/`

```
src/
├── main.ts              # оркестрация сцены
├── setupApp.ts          # Pixi Application, монтирование в #pixi-container
├── assets.ts            # список текстур и preload
├── addBackground.ts
├── addOverlay.ts
├── addFishes.ts
├── animateFishes.ts
├── addBubbles.ts
├── config/
│   ├── fish.ts          # количество, скорость, покачивание, развороты
│   └── bubbles.ts       # размер, скорость, цвета пузырьков
├── types/
│   └── fish.ts
└── utils/
    └── scaleToCover.ts
```

Ассеты лежат в `public/assets/` (фон, три вида рыб, `aquarium_overlay.png` для каустики).

## Настройка

Поведение рыб — `src/config/fish.ts`: число рыб, скорость, амплитуда и скорость покачивания (у каждой рыбы свои случайные значения в заданных диапазонах), вероятность разворота, отступы от краёв, ориентация спрайтов (`fishFacing` для фиолетовой рыбы).

Пузырьки — `src/config/bubbles.ts`: количество, радиус, дрейф, скорость всплытия, цвета заливки и контура.

После правок конфига достаточно перезапустить dev-сервер.

## Стек

- PixiJS 8
- TypeScript
- Vite 6
- Yarn 1
- ESLint + Prettier
