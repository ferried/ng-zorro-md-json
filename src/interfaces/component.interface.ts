import { Properties } from './properties.interface';
export interface Component {
	name: string;
	description: string;
	type: string;
	url: string;
	properties: Properties[];
}
