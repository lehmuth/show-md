import { Converter, ConverterOptions } from 'showdown';
export default {
  type: 'output',
  filter: function (
    text: string,
    converter: Converter,
    options: ConverterOptions | undefined
  ): string {
    return text.replace(
      /<a href="(.*)README(\.md|\.html)">/gi,
      '<a href="$1index$2">'
    );
  },
};
