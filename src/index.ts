import './scss/styles.scss';

import { WebLArekAPI } from './components/WebLarekApi';
import { API_URL, CDN_URL, Events } from './utils/constants';
import { EventEmitter } from './components/base/events';
import {
	AppState,
	CatalogChangeEvent,
	IContactsForm,
	ProductItem,
} from './components/AppData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { IOrderForm } from './types';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new WebLArekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
// events.onAll(({ eventName, data }) => {
// 	console.log(eventName, data);
// });

// Блокируем прокрутку страницы если открыта модалка
events.on(Events.OPEN_MODAL, () => {
	// console.log('hello');
	page.locked = true;
});

// ... и разблокируем
events.on(Events.CLOSE_MODAL, () => {
	page.locked = false;
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Выводим элементы каталога
events.on<CatalogChangeEvent>(Events.LOADING_LOTS, () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit(Events.OPEN_LOT, item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		});
	});
});

// Открыть лот
events.on(Events.OPEN_LOT, (item: ProductItem) => {
	appData.setPreview(item);
	const isItemInBasket = appData.basketList.some(
		(basketItem) => basketItem.id === item.id
	);
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
		// Удалить или добавить товар в корзину
		onClick: () => {
			events.emit(Events.CARD_TO_BASKET, item);
			page.counter = appData.getBasketList().length;
		},
	});
	if (isItemInBasket) {
		card.buttonDisabled = true;
		card.button = 'Уже в корзине';
	}
	return modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
		}),
	});
});

// Открыть корзину
events.on(Events.OPEN_BASKET, () => {
	basket.items = appData.getBasketList().map((item, index) => {
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit(Events.CARD_FROM_BASKET, item),
		});
		card.index = (index + 1).toString();
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	page.counter = appData.getBasketList().length;
	basket.selected = appData.getBasketList();
	basket.total = appData.getTotal();
	return modal.render({
		content: basket.render(),
	});
});

//Добавление товара в корзину
events.on(Events.CARD_TO_BASKET, (item: ProductItem) => {
	// item.selected = true;
	appData.addToBasket(item);
	page.counter = appData.getBasketAmount();
	modal.close();
	basket.total = appData.getTotal();
});

// Удалить товар из корзины
events.on(Events.CARD_FROM_BASKET, (item: ProductItem) => {
	appData.deleteFromBasket(item.id);
	page.counter = appData.getBasketAmount();
	basket.total = appData.getTotal();
	basket.items = appData.getBasketList().map((item, index) => {
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit(Events.CARD_FROM_BASKET, item),
		});
		card.index = (index + 1).toString();
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	return modal.render({
		content: basket.render(),
	});
});

// Открыть форму заказа
events.on(Events.ORDER_OPEN, () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации заказа
events.on(Events.VALIDATE_ORDER, (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации контактов
events.on(Events.VALIDATE_CONTACTS, (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменились введенные данные
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\.[^:]*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Заполнить телефон и почту
events.on(Events.ORDER_SUBMIT, () => {
	appData.order.total = appData.getTotal();
	appData.setItems();
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

// Завершения оплаты
events.on(Events.CONTACTS_SUBMIT, () => {
	api
		.orderResult(appData.order)
		.then((result) => {
			appData.clearBasket();
			page.counter = appData.getBasketList().length;
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			console.log(result);
			success.total = result.total;
			modal.render({
				content: success.render({}),
			});
			order.clear();
			contacts.clear();
		})
		.catch((err) => {
			console.error(err);
		});
});

// Получаем лоты с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch(console.error);


