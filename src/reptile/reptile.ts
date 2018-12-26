import request from 'superagent';
import { Title } from '../interfaces/title.interface';
import { Antd } from '../models/antd.model';

export class Reptile {
	public getDocumentList(): Promise<Title[]> {
		const titles: Title[] = [];
		return new Promise((resolve, rejects) => {
			request.get(Antd.URI).end((err, res) => {
                titles.push({ name: 'sadf', url: 'asf' });
                resolve(titles);
			});
		});
	}
}
