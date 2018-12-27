import cheerio from 'cheerio';
import request from 'superagent';
import { Component } from '../interfaces/component.interface';
import { Title } from '../interfaces/title.interface';
import { Antd } from '../models/antd.model';
import { Properties } from './../interfaces/properties.interface';

export class Reptile {
	public async getComponents(titles: Title[]): Promise<Component[]> {
		const components: any = [];
		titles.forEach((title: Title) => {
			const component = new Promise((resolve, rejects) => {
				request.get(title.cnMd).end((err, res) => {
					const temp: Component = this.generateComponent(cheerio.load(res.text), title.cnMd);
					resolve(temp);
				});
			});
			components.push(component);
		});
		return components;
	}

	public getDocumentList(): Promise<Title[]> {
		return new Promise((resolve, rejects) => {
			request.get(Antd.URI).end((err, res) => {
				resolve(this.generateDocumentList(cheerio.load(res.text)));
			});
		});
	}

	public setProp(component: Component[]): void {
		component.forEach((com: Component) => {
			if (com.url) {
				request.get(com.url).end((err, res) => {
					const properties: any = {};
					cheerio.load(res.text)('table').prev('h3').map((index: number, element: CheerioElement) => {
						element.children.forEach((cheerio: CheerioElement) => {
							properties.name = cheerio.data;
						});
					});
					com.properties.push(properties as Properties);
					console.log(com);
				});
			}
		});
	}

	private generateComponent(cheerio: CheerioStatic, url: string): Component {
		const component: any = {};
		cheerio('table[data-table-type=yaml-metadata]')
			.find('tbody')
			.find('tr')
			.find('td')
			.find('div')
			.map((index: number, element: CheerioElement) => {
				component.url = url;
				const value = element.children[0].data as string;
				switch (index) {
					case 0:
						component.category = value;
						break;
					case 1:
						component.subtitle = value;
						break;
					case 2:
						component.type = value;
						break;
					case 3:
						component.title = value;
						break;
				}
			});
		component.properties = [];
		return component as Component;
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
