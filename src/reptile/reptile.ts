import cheerio from 'cheerio';
import request from 'superagent';
import { Title } from '../interfaces/title.interface';
import { Antd } from '../models/antd.model';
export class Reptile {
    
    public getDocumentList(): Promise<Title[]> {
		return new Promise((resolve, rejects) => {
			request.get(Antd.URI).end((err, res) => {
				resolve(this.generateDocumentList(cheerio.load(res.text)));
			});
		});
	}

	private generateDocumentList(cheerio: CheerioStatic): Title[] {
		let titles: Title[] = [];
		cheerio('a[class=js-navigation-open]').map((index: number, element: CheerioElement) => {
			titles.push({
				name: element.attribs.title,
				partUrl: `${Antd.PREFIX}${element.attribs.href}`,
				docUrl: `${Antd.PREFIX}${element.attribs.href}/doc`,
				cnMd: `${Antd.PREFIX}${element.attribs.href}/doc/index.zh-CN.md`,
				enMd: `${Antd.PREFIX}${element.attribs.href}/doc/index.en-US.md`
			});
		});
		titles = titles.filter((title: Title) => {
			return title.name.indexOf('.') === -1;
		});
		return titles;
	}
}
