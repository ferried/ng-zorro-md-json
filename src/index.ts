import { Component } from './interfaces/component.interface';
import { Title } from './interfaces/title.interface';
import { Reptile } from './reptile/reptile';

const reptile: Reptile = new Reptile();

reptile.getDocumentList().then((titles: Title[]) => {
	reptile.getComponents(titles).then((promises) => {
		Promise.all(promises).then((component: Component[]) => {
            reptile.setProp(component);
		});
	});
});
