# LG THERMA V ↔ Shelly — ръководство на български

Този проект свързва съвместима термопомпа **LG THERMA V** към **Shelly Pro EM-50 + Shelly Pro Modbus Add-on** чрез RS-485 / Modbus RTU.

Shelly работи като Modbus клиент, чете реалните стойности от термопомпата, изпраща ограничен набор проверени команди и показва данните чрез точно **9 Virtual Components**.

> Това е community проект, а не официална LG/Shelly/Home Assistant интеграция. Различните поколения THERMA V имат различни платки, настройки и register maps. Преди управление винаги проверявайте сервизното ръководство на точния модел.

## Основни параметри

- RS-485 / Modbus RTU
- 9600 baud
- 8N1
- LG slave ID: `2`
- Shelly Serial / MbRtuClient ID: `100`
- polling: 10 s
- адресите в RPC са zero-based

## Свързване

При тестваната инсталация комуникацията е през конектор, означен `CN_COM`, но това не е универсално за всички модели.

```text
LG A / D+  -> Shelly A / D+
LG B / D-  -> Shelly B / D-
```

Използвайте усукана екранирана двойка, избягвайте star topology и дълги отклонения. Дръжте RS-485 далеч от силови и моторни кабели. При дълга линия терминатор около 120 Ω се поставя в двата физически края на шината, не на всяко устройство.

## 9 Virtual Components

Проектът умишлено използва **9**, а не 10 компонента. `number:208` остава свободен.

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

## Инсталация

1. Обновете Shelly до актуален стабилен firmware.
2. Изберете RS-485 / Modbus Add-on и рестартирайте при нужда.
3. Настройте Serial като Modbus Client, 9600, 8N1.
4. Създайте Shelly script и поставете `scripts/01-create-virtual-components.js`.
5. Стартирайте го само веднъж. Очакван лог:

```text
DONE: 9/9 LG components ready. Stop installer; start bridge.
```

6. Спрете installer скрипта.
7. Създайте втори script с `scripts/02-lg-therma-v-modbus-bridge.js`.
8. Включете **Run on startup** само за bridge скрипта.

Bridge-ът първо чете реалното състояние от LG и едва след успешна синхронизация позволява записи. Това предпазва от изпращане на стари/default стойности след рестарт.

След write командата стойността се прочита обратно от LG. Така интерфейсът показва реално потвърденото състояние, а не само желаната команда.

## Shelly термостати

### Отопление

- Current temperature: `LG Outlet Temperature (number:206)`
- Target temperature: `LG Heating Target (number:203)`
- Enable: `LG Power (boolean:200)`

Това е визуализация на температурата на отоплителната вода, не стаен термостат.

### БГВ / DHW

- Current temperature: `LG DHW Temperature (number:207)`
- Target temperature: `LG DHW Target (number:204)`
- Enable: `LG DHW (boolean:201)`

## Home Assistant

Home Assistant **не е необходим** за работата на интеграцията. Modbus bridge-ът работи локално в Shelly.

Добавете Shelly устройството в Home Assistant чрез стандартната **Shelly integration**. Поддържаните Virtual Components могат да се появят като HA entities и да се използват в dashboards и automations.

Shelly Thermostat template не означава автоматично native Home Assistant `climate` entity. Ако такъв entity е нужен, той може да се изгради в Home Assistant върху exposed Shelly entities, докато Modbus комуникацията остава локално в Shelly.

## Важно за AI и документацията

За машинно четене използвайте:

- `docs/AI_CONTEXT.md` — кратък semantic context;
- `project.yaml` — structured hardware/protocol/register map;
- `llms.txt` — входна точка за automated readers;
- `README.md` — канонично подробно английско ръководство.

Параметрите от този проект не трябва автоматично да се пренасят към друг LG THERMA V модел без проверка.
