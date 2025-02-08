# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Об архитектуре

Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.

- MVP делит приложение на три части, но ответственность между компонентами распределяется так, чтобы изменения в одном не влияли на другие:

1. Model — модель. Отвечает за получение, хранение и обработку данных в соответствии с бизнес-логикой приложения.

2. View — представление, вид. Отвечает за отображение данных, которые получает от презентера, и передачу ему действий пользователя. Представителя также можно сравнить с менеджером магазина, который получает информацию и реагирует на неё, при этом сам в магазин и на фабрику не ходит. Например, если товары закончились, он отправляет на производство сообщение, что нужна новая партия. Фабрика выпускает нужное количество товара и сама отправляет его в магазин, где товары расставляют — снова без помощи менеджера.

3. Presenter — презентер. Анализирует действия пользователя, принимает решения по изменению представления и передачи ему данных, которые получает из модели .

# Описание классов базового кода

### 1. Класс Api

Класс `Api` представляет собой основной инструмент доступа к веб-серверу. Он обеспечивает два основных типа операций: безопасные операции, которые используют метод GET для получения данных, и небезопасные операции, которые включают методы POST и DELETE для изменения данных на сервере.

### 2. Класс Component

Класс `Component<T>`
Абстрактный базовый класс, предназначенным для создания компонентов пользовательского интерфейса. Класс обеспечивает инструментарий для управления DOM элементами и поведением компонента. Наследуется всеми классами представления(View)

`constructor(container: HTMLElement)` - принимает элемент контейнера, в который будет помещен компонент.

Методы:

- `toggleClass` - переключается класс для переданного элемента.
- `setText` - устанавливает текстовое содержимое для переданного элемента.
- `setDisabled` - изменяет статус блокировки для переданного элемента.
- `setHidden`, `setVisible` - скрывает, отображает переданный элемент.
- `setImage` - устанавливает изображения и альтернативный текст для изображения (опционально) для переданного элемента типа HTMLImageElement
- `render` - рендерит компонент, используя переданные данные. Метод должен быть переназначен в дочерних классах.

### 3. Класс EventEmitter

Класс `EventEmitter`
реализует интерфейс IEvents для управления событиями. Он предоставляет методы для подписки на события, инициирования событий, создания триггеров событий, а также отписки от событий.

`constructor() { this._events = new Map<EventName, Set<Subscriber>>(); }` - инициализация хранилища событий и подписчиков.

Методы:

- `on<T extends object>(eventName: EventName, callback: (data: T) => void): void` - Этот метод используется для подписки на событие. Принимает имя события eventName и функцию обратного вызова callback, которая будет вызываться при наступлении события.
- `off(eventName: EventName, callback: Subscriber): void` - Метод для отписки от события. Принимает имя события eventName и функцию обратного вызова callback, которая была использована при подписке на событие.
- `emit<T extends object>(eventName: string, data?: T): void` - Метод для инициирования события. Принимает имя события eventName и опциональные данные data, связанные с этим событием.
- `onAll(callback: (event: EmitterEvent) => void): void` - Метод для подписки на все события. Принимает функцию обратного вызова callback, которая будет вызываться при любом событии.
- `offAll(): void` - Метод для отписки от всех событий. Удаляет все подписки на события и очищает хранилище событий и подписчиков.
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void` - Метод для создания триггера события. Принимает имя события eventName и опциональный контекст context, который будет добавлен к данным события при инициировании. Возвращает функцию, которая инициирует событие с переданными данными.

### 4. Класс Model

Класс `Model<T>`
является абстрактным базовым классом, предназначенным для создания моделей данных в приложении. Он предоставляет базовый функционал для работы с данными и уведомлений о изменениях в данных. Класс наследуется другими классами, которые представляют конкретные модели данных.

`constructor(data: Partial<T>, protected events: IEvents)` - Принимает частичные данные типа и объект брокера событий events, который используется для уведомления об изменениях в данных.

Метод:

- `emitChanges` - используется для сообщения о изменениях в модели. Принимает идентификатор события (event) и данные (payload), связанные с этим событием. Затем метод эмитирует событие с переданными данными через объект брокера событий.

## Классы модели данных

### 1. Класс AppState

Класс `AppState` представляет данные всего приложения и позволяет отслеживать его состояние. Внутри себя он содержит следующие свойства:

- `catalog`: для отслеживания списка доступных лотов. Установка данного свойства вызывает событие `catalog:changed`.
- `basket`: для отслеживания лотов, находящихся в корзине.
- `order`: отслеживает состояние заказа.
- `preview`: отслеживает лот, который используется для подробного изучения в модальном окне.

Класс `AppState` также реализует дополнительные методы для доступа к методам перечисленных выше свойств.

### 2. Класс ProductItem

Класс `ProductItem` представляет данные отдельной карточки товара. Его структура определяется ответом от API-сервера с добавлением свойств и методов, реализующих логику взаимодействия с корзиной через вызовы `card:toBasket` и `basket:delete`.

### 3. Класс Order

Класс `Order` представляет данные процесса оформления заказа. Он содержит свойства, соответствующие полям формы оформления заказа, а также реализует простейшую логику валидации этих свойств на наличие значений. Изменения в любом из свойств вызывают проверку всех полей и генерацию события `orderFormErrors:change`.

## Компоненты представления

### 1. Класс Basket

Класс `Basket` представляет собой представление корзины. Он позволяет задать следующие элементы:

- `list`: список отображаемых элементов в корзине.
- `total`: общую ценность корзины.
- `button`: кнопку открытия формы оформления заказа. Вызов этой кнопки вызывает событие `order_payment:open`.

### 2. Класс BasketItem

Класс `BasketItem` представляет элементы корзины. Он позволяет задать следующие свойства:

- `index`: порядковый номер элемента в корзине.
- `title`: название элемента в корзине.
- `price`: стоимость элемента в корзине.
- `buttonDelete`: кнопку удаления элемента из корзины.

### 3. Класс Card

Класс `Card` представляет отдельную карточку лота.

### 4. Класс Contacts

Класс `Contacts ` также наследуется от класса `Form` и представляет форму оформления заказа с контактной информацией.

Он позволяет задать следующие свойства:

- `email`: почта для связи.
- `phone`: телефон для связи.

### 5. Класс Order

Класс `Order` наследуется от класса `Form` и представляет форму оформления заказа с информацией об способе оплаты и адресом доставки.

Он позволяет задать следующие свойства:

- `address`: адрес доставки.
- `payment`: способ оплаты.

### 6. Класс Form

Класс `Form` представляет базовую форму. Он позволяет задать следующие элементы:

- `submit`: кнопку отправки формы.
- `errors`: блок отображения ошибок в форме.

В данном классе на весь контейнер отображения привязывается событие отслеживания input для вызова событий вида `container.field:change` и событие `container:submit`.

### 7. Класс Modal

Класс `Modal` представляет собой представление модального окна. Он позволяет задать следующие элементы:

- `content`: для отображения внутреннего содержания модального окна.
- `closeButton`: для отображения кнопки закрытия модального окна.

Класс также привязывает событие закрытия модального окна `modal:close` к кликам по кнопке закрытия формы, по родительскому контейнеру модального окна и клавишу `Escape`

### 8. Класс Page

Класс `Page` представляет собой представление всей страницы. Он позволяет задать следующие элементы:

- `counter`: элемент отображения количества товаров в корзине.
- `gallery`: элемент отображения всех доступных карточек.
- `wrapper`: обёртка, позволяющая блокировать прокрутку страницы при открытии модального окна.
- `basket`: кнопка для отображения корзины. Клик по кнопке вызывает событие `basket:open`.

### 9. Класс Success

Класс `Success` определяет отображение основной информации об оформленном заказе, такой как общая сумма заказа (забираем из ответа сервера).

## Внешние связи

### WebLarekApi

Взаимодействие с конкретным API-сервером.

**Методы:**

- `getProductItem`: Получение информации по конкретному лоту.
- `getProductList`: Получение информации по всем доступным лотам.
- `orderResult`: Оформление заказа через запрос на сервер.

## Ключевые типы данных

Интерфейс описывающий карточку товара

```

interface ICard {
title: string;
category: string;
description: string | string[];
image: string;
price: number;
index: number;
}

```

Интерфейс описывающий формы заказа

```

interface IOrder {
items: string[];
payment: string;
total: number;
address: string;
email: string;
phone: string;
}

interface IOrderForm {
payment: string;
address: string;
email: string;
phone: string;
}

interface ISuccess {
id: string;
total: number;
}

```

Интерфейс описывающий поля приходящие с сервера.

```

interface IProductItem {
id: string;
title: string;
description?: string;
image: string;
}

```

Интерфейс описывающий корзину

```

interface IBasketView {
items: HTMLElement[];
total: number | string;
selected: string[];
}

```


Интерфейс описывающий внутренне состояние приложения

```

interface IAppState {
catalog: IProduct[];
basket: string[];
preview: string | null;
order: IOrder | null;
loading: boolean;
}

```

Интерфейс описывающий страницу

```
interface IPage {
counter: number;
catalog: HTMLElement[];
locked: boolean;
}

```

События приложения (Events)

export enum Events {
	LOADING_LOTS = 'items:changed', // подгружаем доступные лоты
	OPEN_LOT = 'card:open', // открываем карточку лота для просмотра
	OPEN_MODAL = 'modal:open', // блокировка при открытии модального окна
	CLOSE_MODAL = 'modal:close', // снятие блокировки при закрытии модального окна
	CARD_TO_BASKET = 'card:toBasket', // добавляем товар в корзину
	CARD_FROM_BASKET = 'basket:delete', // удаляем товар из корзины
	OPEN_BASKET = 'basket:open', // открываем корзину
	ORDER_OPEN = 'order:open', // Открыть форму заказа
	VALIDATE_ORDER = 'orderFormErrors:change', // Изменилось состояние валидации адреса
	VALIDATE_CONTACTS = 'contactsFormErrors:change', // Изменилось состояние валидации контактов
	ORDER_SUBMIT = 'order:submit', //Заполнить телефон и почту
	CONTACTS_SUBMIT = 'contacts:submit', // Завершения оплаты
}

- [Ссылка на макет в Figma](https://www.figma.com/design/50YEgxY8IYDYj7UQu7yChb/%D0%92%D0%B5%D0%B1-%D0%BB%D0%B0%D1%80%D1%91%D0%BA?node-id=0-1&p=f&t=8MfF29PYRnV9zMt2-0)

- [Проект](https://github.com/NikolayBugynin/web-larek-frontend.git)
```
