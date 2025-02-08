//Интерфейс описывающий поля приходящие с сервера.
export interface IProductItem {
	id: string;
	title: string;
	description?: string;
	image: string;
}

//Интерфейс описывающий карточку товара
export interface ICard {
	title: string;
	category: string;
	description: string | string[];
	image: string;
	price: number;
	index: number;
}

// Интерфейс описывающий страницу
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// Интерфейс описывающий внутренне состояние приложения
export interface IAppState {
	catalog: IProduct[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

//Интерфейс описывающий формы заказа
export interface IOrder extends IOrderForm {
	items: string[];
}

export type IProduct = IProductItem;

export type FormErrors = Partial<Record<keyof IOrder, string>>;

//Интерфейс описывающий корзину
export interface IBasketView {
	items: HTMLElement[];
	total: number | string;
	selected: string[];
}

//Интерфейс описывающий формы заказа
export interface IOrder {
	items: string[];
	payment: string;
	total: number;
	address: string;
	email: string;
	phone: string;
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface ISuccess {
	id: string;
	total: number;
}
