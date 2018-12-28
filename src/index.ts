import {Doc} from './interfaces/doc';
import {DesignReptile} from './reptile/design.reptile';

const designReptile: DesignReptile = new DesignReptile();

// 获取文档component列表
const docs: Promise<Doc[]> = designReptile.componentList();
docs.then((docs: Doc[]) => {
    docs.forEach((doc: Doc) => {
        designReptile.completeDoc(doc).then((doc: Doc) => {
            console.log(doc);
        });
    });
});
