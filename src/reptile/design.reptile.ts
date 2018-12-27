import cheerio from 'cheerio';
import request from 'superagent';
import {Doc} from '../interfaces/doc';
import {NgAntDesign} from '../models/ng.ant.design';

export class DesignReptile {

    public async componentList(): Promise<Doc[]> {
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
                    desc: '',
                    whenUse: '',
                    apis: [],
                    cnAddress: `${NgAntDesign.ADDRESS}${element.attribs.href}/doc/index.zh-CN.md`,
                    enAddress: `${NgAntDesign.ADDRESS}${element.attribs.href}/doc/index.en-US.md`
                });
            }
        );
        // 过滤所有带后缀名的文件
        docs = docs.filter((doc: Doc) => {
            return doc.title.indexOf('.') === -1 && doc.title !== NgAntDesign.IGNORE_PARENT_HOME ?
                doc : console.log(`removing ${doc.title}.`);
        });
        console.log('over parsing.');
        return docs;
    }

    public async completeDoc(doc: Doc): Promise<Doc> {
        console.log(`request to:${doc.cnAddress}`);
        const response = await request.get(doc.cnAddress);
        console.log(`response from:${doc.cnAddress}`);
        console.log(`parsing component info:${doc.title}`);
        await cheerio.load(response.text)('article').find('table[data-table-type=yaml-metadata]')
            .map((index: number, element: CheerioElement) => {
                console.log(element);
            });
        return doc;
    }

}