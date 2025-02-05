import { Form } from './common/Form';
import { IEvents } from './base/events';

export interface IOrder {
	address: string;
	payment: string;
}

/*
 * Класс, описывающий окошко заказа товара
 * */
export class Order extends Form<IOrder> {
	// Сссылки на внутренние элементы
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	// Конструктор принимает имя блока, родительский элемент и обработчик событий
	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents
	) {
		super(container, events);

		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
		this._address = container.elements.namedItem('address') as HTMLInputElement;

		this._cash.addEventListener('click', () => {
			this.toggleCash(true);
			this.toggleCard(false);
			this.onInputChange('payment', 'cash');
		});

		this._card.addEventListener('click', () => {
			this.toggleCard(true);
			this.toggleCash(false);
			this.onInputChange('payment', 'card');
		});
	}

	toggleCard(state = true) {
		this.toggleClass(this._card, 'button_alt-active', state);
	}

	toggleCash(state = true) {
		this.toggleClass(this._cash, 'button_alt-active', state);
	}

	// Метод, отключающий подсвечивание кнопок
	disableButtons() {
		this.toggleClass(this._cash, 'button_alt-active', false);
		this.toggleClass(this._card, 'button_alt-active', false);
	}
	clear() {
		this.disableButtons();
		this._address.value = '';
	}
}
