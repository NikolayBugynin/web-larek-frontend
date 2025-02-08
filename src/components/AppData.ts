import { Model } from './base/Model';
import { FormErrors, IAppState, IProduct, IOrder, IOrderForm } from '../types';
import { Events } from '../utils/constants';

export interface IContactsForm {
	email: string;
	phone: string;
}

export type CatalogChangeEvent = {
	catalog: ProductItem[];
};

export class ProductItem extends Model<IProduct> {
	description: string;
	id: string;
	image: string;
	title: string;
	price: number;
	category: string;
}

// Класс, описывающий состояние приложения
export class AppState extends Model<IAppState> {
	basketList: ProductItem[] = [];
	catalog: ProductItem[];
	loading: boolean;
	// Объект заказа клиента
	order: IOrder = {
		address: '',
		items: [],
		payment: 'online',
		email: '',
		phone: '',
		total: 0,
	};

	preview: string | null;
	formErrors: FormErrors = {};

	addToBasket(value: ProductItem) {
		this.basketList.push(value);
	}

	deleteFromBasket(id: string) {
		this.basketList = this.basketList.filter((item) => item.id !== id);
	}

	getTotal() {
		return this.basketList.reduce((a, c) => a + c.price, 0);
	}

	getBasketAmount() {
		return this.basketList.length;
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges(Events.LOADING_LOTS, { catalog: this.catalog });
	}

	setItems() {
		this.order.items = this.basketList.map((item) => item.id);
	}

	setPreview(item: ProductItem) {
		this.preview = item.id;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		this.validateOrder();
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;
		this.validateContacts();
	}

	clearBasket() {
		this.basketList = [];
	}

	getBasketList(): ProductItem[] {
		return this.basketList;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};

		const email_regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z0-9_-]+)/;

		const phone_regex = /^(\+|)(7|8)( |)\d{3}( |)\d{3}( |)(\d{2}( |)){2}$/;

		if (!email_regex.test(this.order.email)) {
			errors.email = 'Необходимо указать корректный email';
		}

		if (!phone_regex.test(this.order.phone)) {
			errors.phone = 'Необходимо указать корректный телефон';
		}

		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
