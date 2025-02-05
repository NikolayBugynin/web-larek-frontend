import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { colorCategory } from '../utils/constants';
import { ICard } from '../types';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _index: HTMLElement;
	protected btn?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._category = container.querySelector(`.${blockName}__category`);
		this.btn = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this.btn) {
				this.btn.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set price(value: string) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this.btn, true);
		}
	}

	set buttonDisabled(value: boolean) {
		this.setDisabled(this.btn, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set index(value: string) {
		this.setText(this._index, value);
	}

	get index(): string {
		return this._index.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, colorCategory[value], true);
	}

	set button(value: string) {
		this.setText(this.btn, value);
	}
}
