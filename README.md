# Aquarium

Аквариум на [PixiJS](https://pixijs.com/): игра match-3 (в разработке).

**Демо:** https://shurygina-jul.github.io/aquarium/

## Экраны

| Экран   | Описание                                                           |
| ------- | ------------------------------------------------------------------ |
| Главный | Фон, каустика, рыбы, пузырьки. Кнопка **«Играть»** открывает игру. |
| Match-3 | Сетка 8×8 под будущую механику, счётчик очков, кнопка **«Назад»**. |

Переключение экранов — `sceneManager`, фабрики `screens/*/show*.ts`.

**Ticker:** одна подписка в `sceneManager` → `current.tick` активной сцены. В `main.ts` и новых `app.ticker.add` не добавляем.

**Новый экран:** папка `src/screens/<имя>/` с `show*.ts` (образец: `cover/`, `matchThree/`). Собрать всё в `root`, вернуть `Scene`. Переходы — колбэки + `main.ts`. Общий фон/каустика — `shared/`. Кнопки — HTML в `#ui-layer`, фабрики `ui/htmlButtons.ts`.

**Стили:** `src/styles/` — цвета в `tokens.css`, вёрстка в `layout.css`, кнопки в `styles/buttons/`. Подключение через `import "@/styles/index.css"` в `main.ts`.

**Анимация:** только в `tick` этой сцены — вызов `animate*` или `water.tick` из `addWaterOverlay`. Тяжёлую логику — в отдельный модуль, вызывать из `tick`. На другой экран не попадает: при `scenes.show` старая сцена `destroy`, её `tick` больше не вызывается.

## Установка и запуск

```bash
yarn install
yarn dev
```

## Скрипты

| Команда        | Назначение           |
| -------------- | -------------------- |
| `yarn dev`     | локальная разработка |
| `yarn build`   | production-сборка    |
| `yarn preview` | просмотр `dist/`     |
| `yarn lint`    | проверка ESLint      |

## Структура `src/`

| Путь | Назначение |
| ---- | ---------- |
| `main.ts` | Точка входа, маршруты между экранами |
| `sceneManager.ts` | Переключение сцен и ticker |
| `screens/cover/` | Главный экран: рыбы, пузырьки, `showCover.ts` |
| `screens/matchThree/` | Игра: сетка, счёт, `showMatchThree.ts` |
| `shared/` | Фон и каустика для нескольких экранов |
| `ui/htmlButtons.ts` | HTML-кнопки поверх canvas |
| `styles/tokens.css` | Цвета проекта (CSS-переменные) |
| `styles/pixiText.ts` | Текст на canvas (значения из `--text-*` в tokens.css) |
| `styles/pixiBubbles.ts` | Пузырьки на обложке (`--bubble-*` в tokens.css) |
| `styles/buttons/` | Стили `game-btn--primary` / `--secondary` |
| `types/scene.ts` | Контракт экрана (`tick`, `destroy`) |

## Деплой

Пуш в ветку `main` автоматически публикует сайт через [GitHub Actions](.github/workflows/deploy.yml).
