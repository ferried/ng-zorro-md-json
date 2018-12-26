import cheerio from 'cheerio';
import request from 'superagent';
import { Component } from '../interfaces/component.interface';
import {Title} from '../interfaces/title.interface';
import {Antd} from '../models/antd.model';

export class Reptile {
    public getComponents(titles: Title[]): Promise<Component[]> {
        const componets: Component[] = [];
        const promiseArr: any = [];
        titles.forEach((title: Title) => {
            const promise = new Promise<Component>((resovle, rejects) => {
                request.get(title.cnMd).end((err, res) => {
                    const temps: Component = this.generateComponent(cheerio.load(res.text), title.cnMd);
                    console.log(temps);
                    resovle(temps);
                });
            });
            promiseArr.push(promise);
        });
        return promiseArr;
    }

    public getDocumentList(): Promise<Title[]> {
        return new Promise((resolve, rejects) => {
            request.get(Antd.URI).end((err, res) => {
                resolve(this.generateDocumentList(cheerio.load(res.text)));
            });
        });
    }

    private generateComponent(cheerio: CheerioStatic, url: string): Component {
        const component:any = {};
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
