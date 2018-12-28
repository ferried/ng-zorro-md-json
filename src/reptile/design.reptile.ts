import cheerio from 'cheerio';
import request from 'superagent';
import {Doc} from '../interfaces/doc';
import {NgAntDesign} from '../models/ng.ant.design';
import defineProperty = Reflect.defineProperty;

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
                        cols: '',
                        noinstant: '',
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
    private async compileHead(doc: Doc, cheerioStatic: CheerioStatic): Promise<Doc> {
        try {
            const headKeys: string [] = [];
            const headValues: string [] = [];
            await cheerioStatic('table[data-table-type=yaml-metadata]')
                .find('thead').find('tr').find('th').each(((index: number, element: CheerioElement) => {
                        if (element.children[0].data) {
                            headKeys.push(element.children[0].data);
                        } else {
                            headKeys.push('undefined');
                        }
                    })
                );
            await cheerioStatic('table[data-table-type=yaml-metadata]')
                .find('tbody').find('tr').find('div').each(((index: number, element: CheerioElement) => {
                        if (element.children[0].data) {
                            headValues.push(element.children[0].data);
                        } else {
                            headValues.push('undefined');
                        }
                    })
                );
            headKeys.forEach(((value: string, index: number, array: string[]) => {
                doc = Object.defineProperty(doc, value, {value: headValues[index]});
            }));
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
    private async compileDesc(doc: Doc, cheerioStatic: CheerioStatic): Promise<Doc> {
        try {
            await cheerioStatic('table[data-table-type=yaml-metadata]').each(((index: number, element: CheerioElement) => {
                if (element.next.next.name === 'p') {
                    doc.desc = element.next.next.children[0].data as string;
                }
            }));
        } catch (e) {
            console.error(e);
            return e;
        }
        return doc;
    }


    /**
     * TODO:解析何时使用
     * @param doc
     * @param response
     */
    private async compileWhenUse(doc: Doc, cheerioStatic: CheerioStatic): Promise<Doc> {
        let whenUse: string = '';
        await cheerioStatic('article[itemprop=text]')
            .find('h2').find('a[id=user-content-何时使用]')
            .each(((index: number, element: CheerioElement) => {
                if (element.parent.next.next.name === 'p') {
                    element.parent.next.next.children.map(child => {
                        whenUse += child.data+'\n';
                    });
                } else if (element.parent.next.next.name = 'ul') {
                    element.parent.next.next.children.filter(child => {
                        return child.type === 'tag';
                    }).map(child => {
                        whenUse += child.children[0].data+'\n' ;
                    });
                }
            }));
        doc.whenUse = whenUse;
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