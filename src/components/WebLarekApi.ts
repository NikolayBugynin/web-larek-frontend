import { Api, ApiListResponse } from './base/api';
import { ICard, IOrder, ISuccess } from '../types';

export interface IWebLArekAPI {
	getProductItem: (id: string) => Promise<ICard>;
	getProductList: () => Promise<ICard[]>;
	orderResult: (order: IOrder) => Promise<ISuccess>;
}

export class WebLArekAPI extends Api implements IWebLArekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProductList(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderResult(order: IOrder): Promise<ISuccess> {
		return this.post(`/order`, order).then((data: ISuccess) => data);
	}
}
