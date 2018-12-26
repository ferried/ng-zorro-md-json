import { Properties } from './properties.interface';

export interface Component {
	 category: string;
	 subtitle: string;
	 type: string;
	 title: string;
	 url: string;
	 properties: Properties[];

}
