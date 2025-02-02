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

## Данные и типы данных, используемые в приложении

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
export interface IProductItem {
	id: string;
	title: string;
	about: string;
	description?: string;
	image: string;
}
```

Интерфейс описывающий корзину

```
export interface IBasketView {
	items: HTMLElement[];
	total: number | string;
	selected: string[];
}

```

```

Интерфейс описывающий внутренне состояние приложения

export interface IAppState {
	catalog: IProduct[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

```

```
Интерфейс описывающий страницу
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

```

### Модели данных

```
Базовая модель, чтобы можно было отличить ее от простых объектов с данными

- abstract class Model

класс, описывающий состояние приложения

- class AppState

```

### Классы представления

```
класс, описывающий базовый компонент

- abstract class Component

класс, описывающий главную страницу

- class Page

класс, описывающий карточку товара

- class Card

класс, описывающий корзину товаров

- class Basket

класс, описывающий попап заказа товара

- class Order

класс, описывающий окошко контакты

- class Contacts

```

### Дополнительные классы

```
- class Api

- class EventEmitter
```

- [Ссылка на макет в Figma](https://www.figma.com/design/50YEgxY8IYDYj7UQu7yChb/%D0%92%D0%B5%D0%B1-%D0%BB%D0%B0%D1%80%D1%91%D0%BA?node-id=0-1&p=f&t=8MfF29PYRnV9zMt2-0)

- [Проект](https://github.com/NikolayBugynin/web-larek-frontend.git)
