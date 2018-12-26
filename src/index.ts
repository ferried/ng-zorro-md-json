import { Title } from './interfaces/title.interface';
import { Reptile } from './reptile/reptile';

const reptile: Reptile = new Reptile();

 reptile.getDocumentList().then((response)=>{
     reptile.getComponents(response).then((response)=>{
         console.log(response);
     });
 });

