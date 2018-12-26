import { Reptile } from './reptile/reptile';

const reptile: Reptile = new Reptile();
reptile.getDocumentList().then((response)=>{
    console.log(response);
})