import cheerio from 'cheerio';
import request from 'superagent';
import {Doc} from '../interfaces/doc';
import {NgAntDesign} from '../models/ng.ant.design';

export class DesignReptile {

    public async componentList(): Promise<Doc[]> {
        try {
            let docs: Doc[] = [];
            console.log(`request to:${NgAntDesign.MD_ADDRESS}`);
            const response = await request.get(NgAntDesign.MD_ADDRESS);
            console.log(`response from:${NgAntDesign.MD_ADDRESS}`);
            console.log('parsing component list.');
            await cheerio.load(response.text)('a[class=js-navigation-open]').map(
                (index: number, element: CheerioElement) => {
                    console.log(`found:${element.attribs.title}.`);
                    docs.push({
                        title: element.attribs.title,
                        category: '',
                        subtitle: '',
                        type: '',
                        hasPageDemo: false,
                        desc: '',
                        whenUse: '',
                        apis: [],
                        cnAddress: `${NgAntDesign.MD_ADDRESS}${element.attribs.title}/doc/index.zh-CN.md`,
                        enAddress: `${NgAntDesign.MD_ADDRESS}${element.attribs.title}/doc/index.en-US.md`
                    });
                }
            );
            // 过滤所有带后缀名的文件
            docs = docs.filter((doc: Doc) => {
                return doc.title.indexOf('.') === -1;
            }).filter((doc: Doc) => {
                return !NgAntDesign.IGNORE_PARENT_HOME.includes(doc.title);
            });
            console.log('over parsing.');
            return docs;
        } catch (e) {
            console.error(e);
            return e;
        }
    }

    public async completeDoc(doc: Doc): Promise<Doc> {
        try {
            console.log(`request to:${doc.cnAddress}`);
            const response = await request.get(doc.cnAddress);
            console.log(`response from:${doc.cnAddress}`);
            console.log(`parsing component info:${doc.title}`);
            doc = await this.compileHead(doc, cheerio.load(response.text));
            doc = await this.compileDesc(doc, cheerio.load(response.text));
            doc = await this.compileWhenUse(doc, cheerio.load(response.text));
            doc = await this.compileApis(doc, cheerio.load(response.text));
            return doc;
        } catch (e) {
            console.error(e);
            return e;
        }
    }

    /**
     * TODO:解析head
     * @param doc
     * @param response
     */
    private async compileHead(doc: Doc, cheerio: CheerioStatic): Promise<Doc> {
        try {
            cheerio('table[data-table-type=yaml-metadata]')
                .find('tbody')
                .find('tr')
                .find('td')
                .map((index: number, element: CheerioElement) => {
                    console.log(element);
                });
            return doc;
        } catch (e) {
            console.error(e);
            return e;
        }

    }

    /**
     * TODO:解析描述
     * @param doc
     * @param response
     */
    private async compileDesc(doc: Doc, cheerio: CheerioStatic): Promise<Doc> {
        return doc;
    }


    /**
     * TODO:解析何时使用
     * @param doc
     * @param response
     */
    private async compileWhenUse(doc: Doc, cheerio: CheerioStatic): Promise<Doc> {
        return doc;
    }

    /**
     * TODO:解析api列表
     * @param doc
     * @param response
     */
    private async compileApis(doc: Doc, cheerio: CheerioStatic): Promise<Doc> {
        return doc;
    }


}