import { Converter, ConverterOptions } from 'showdown';
export default {
	type: 'output',
	filter: function(text: string, converter: Converter, options: ConverterOptions | undefined): string{
		return text.replace(/<a href="(.*)\.(?:md)">/gi, '<a href="$1.html">');
	}
}
