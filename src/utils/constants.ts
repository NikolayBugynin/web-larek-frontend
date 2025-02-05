export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {};

export const colorCategory: { [key: string]: string } = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
};

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
