import { Converter, ConverterOptions } from 'showdown';
export default {
	type: 'lang',
	filter: function(text: string, converter: Converter, options: ConverterOptions | undefined): string{
		return text.replace(/!gallery{(.*)}/gi, function(match: string, inner: string){
            let images = converter.makeHtml(inner);
            images = images.replace(/<img src="(.*)".* >/gi, '<a href="$1">$&</a>');
            return `<div class="gallery">${images}</div>`;
		});
	}
}

export function getGalleryImports(converter: Converter): string {
    return `
        <link rel="stylesheet" href="/resources/style/gallery.css">
        <link rel="stylesheet" href="/resources/style/lightgallery.min.css">
        <script src="/resources/js/lightgallery.min.js" defer></script>
        <script src="/resources/js/lg-thumbnail.min.js" defer></script>
        <script src="/resources/js/lg-fullscreen.min.js" defer></script>
        <script src="/resources/js/gallery.js" defer></script>
        `;
}
