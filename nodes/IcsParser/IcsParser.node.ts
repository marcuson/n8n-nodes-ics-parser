import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeExecutionWithMetadata,
} from 'n8n-workflow';
import { lines2tree } from 'icalts';

export class IcsParser implements INodeType {
	static readonly IcsDataField = 'icsData';

	description: INodeTypeDescription = {
		displayName: 'IcsParser',
		name: 'icsParser',
		icon: 'file:icsParser.svg',
		group: ['transform'],
		version: 1.0,
		subtitle: 'subtitle here',
		description: 'Parse ICS (iCal) data.',
		defaults: {
			name: 'ICS parse',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			{
				displayName: 'ICS Data',
				name: 'icsData',
				type: 'string',
				default: '',
				required: true,
			},
		],
	};

	async execute(
		this: IExecuteFunctions,
	): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const items = this.getInputData();
		const parsedItems = [] as {}[];

		for (let i = 0; i < items.length; i++) {
			const icsData = this.getNodeParameter(IcsParser.IcsDataField, i) as string;
			const parsedData = lines2tree(icsData.split(/\r?\n/));
			parsedItems.push({ parsedData });
		}

		return [this.helpers.returnJsonArray(parsedItems)];
	}
}
