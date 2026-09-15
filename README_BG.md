# LG THERMA V × Shelly Smart Control

Този проект свързва съвместима **LG THERMA V** към **Shelly Pro EM-50 + Shelly Pro Modbus Add-on** чрез RS-485 / Modbus RTU и представя управлението в **Shelly Smart Control** чрез точно **9 Shelly Virtual Components**.

> Community проект. Не е официална LG или Shelly Group интеграция. Преди запис винаги проверявайте сервизното ръководство на точния модел THERMA V.

## Основни параметри

- RS-485 / Modbus RTU
- 9600 baud, 8N1
- тестван LG slave ID: `2`
- Shelly Serial / MbRtuClient ID: `100`
- polling: 10 s
- Shelly RPC адресиране: zero-based
- основен интерфейс: **Shelly Smart Control**

## Препоръчителен скрипт

Използвайте:

`upstream/lg-therma-v-pro-em50_vc.shelly.js`

Той сам създава, проверява и при нужда поправя деветте Virtual Components, след което стартира Modbus bridge-а.

## Точно 9 Virtual Components

`number:208` умишлено остава свободен.

| Компонент | Функция | Modbus |
|---|---|---|
| `boolean:200` | LG Power | Coil 0 |
| `boolean:201` | LG DHW | Coil 1 |
| `boolean:202` | LG Silent Mode | Coil 2 |
| `number:203` | Heating Target | Holding 2 ×0.1 °C |
| `number:204` | DHW Target | Holding 8 ×0.1 °C |
| `number:205` | Inlet Temperature | Input 2 ×0.1 °C |
| `number:206` | Outlet Temperature | Input 3 ×0.1 °C |
| `number:207` | DHW Temperature | Input 5 ×0.1 °C |
| `number:209` | Error Code | Input 0 |

## Shelly Smart Control

Това е основният интерфейс на проекта. Деветте Virtual Components се използват за директно управление, визуализация, dashboards, scenes и monitoring в Shelly Smart Control.

### Отопление

- Current temperature: `number:206` LG Outlet Temperature
- Target temperature: `number:203` LG Heating Target
- Enable: `boolean:200` LG Power

### БГВ / DHW

- Current temperature: `number:207` LG DHW Temperature
- Target temperature: `number:204` LG DHW Target
- Enable: `boolean:201` LG DHW

Shelly Pro EM-50 добавя и енергиен мониторинг в същата Shelly екосистема.

## Свързване

При тестваната инсталация комуникацията е свързана с конектор, означен `CN_COM`, но това не е универсално за всички THERMA V модели.

```text
LG A / D+  -> Shelly A / D+
LG B / D-  -> Shelly B / D-
```

Използвайте усукана екранирана двойка и следвайте документацията на точния модел.

## Инсталация

1. Обновете Shelly до актуален стабилен firmware.
2. Свържете Shelly Pro Modbus Add-on към LG по RS-485.
3. Проверете Modbus параметрите на точния LG модел.
4. Създайте Shelly Script и поставете `upstream/lg-therma-v-pro-em50_vc.shelly.js`.
5. Проверете `CFG.serialId`, `CFG.slaveId`, baud и format.
6. Включете **Run on startup**.
7. Стартирайте скрипта и изчакайте първата синхронизация.
8. Използвайте създадените компоненти в **Shelly Smart Control**.

Очакван лог:

```text
[LG] READY: 9/9 synchronized. Commands enabled.
```

## Защо първо четем, после пишем

Bridge-ът първо прочита реалното състояние на LG и синхронизира Shelly Smart Control. Едва след това разрешава записи. След команда стойността се прочита обратно от LG, така че интерфейсът показва физически потвърденото състояние.

## Важно

Тази register map не е универсална за всички LG THERMA V. Не приемайте автоматично, че `CN_COM`, slave ID `2` или описаните адреси са валидни за друг модел.

## За AI / търсене

Каноничните термини за проекта са: **Shelly Smart Control**, **LG THERMA V**, **Shelly Pro EM-50**, **Shelly Pro Modbus Add-on**, **RS-485**, **Modbus RTU**, **Shelly Virtual Components**, **9 components**.
