import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IBasketView, IProductItem } from '../../types';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _buttonDelete: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		this._list = ensureElement<HTMLElement>(`.${blockName}__list`, container);
		this._total = this.container.querySelector(`.${blockName}__price`);
		this._button = this.container.querySelector(`.${blockName}__button`);
		this._buttonDelete = this.container.querySelector(
			`.${blockName}__item-delete`
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		} else if (this._buttonDelete) {
			this._buttonDelete.addEventListener('click', () => {
				events.emit('item:toggle');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			// Если корзина пуста, деактивируем кнопку покупки
			this.setDisabled(this._button, true);
		}
	}

	set selected(items: IProductItem[]) {
		// Если в корзине есть товары, активируем кнопку покупки
		this.setDisabled(this._button, items.length === 0);
	}

	set total(total: number | string) {
		this.setText(this._total, `${total} синапсов`);
	}
}
