import { Converter, ConverterOptions } from 'showdown';

let galleryActive = false;

export default {
	type: 'lang',
	filter: function(text: string, converter: Converter, options: ConverterOptions | undefined): string{
        galleryActive = false;
        return text.replace(/!gallery{((?:\s*!\[.*\]\(.*\)\s*)+)}/gi, function(match: string, inner: string){
            galleryActive = true;
            inner = inner.replace(/[\t ]/gim, '');
            let images = converter.makeHtml(inner);
            images = images.replace(/<p>|<\/p>/gi, '');
            images = images.replace(/<img src="(.*)" alt=".*>/gi, '<a href="$1">$&</a>');
            return `<div class="gallery">${images}</div>`;
		});
	}
}

export function getGalleryImports(): string {
    if(true) {
        return `
            <link rel="stylesheet" href="/resources/css/gallery.css">
            <link rel="stylesheet" href="/resources/css/lightgallery.min.css">
            <script src="/resources/js/lightgallery.min.js" defer></script>
            <script src="/resources/js/lg-zoom.min.js" defer></script>
            <script src="/resources/js/lg-thumbnail.min.js" defer></script>
            <script src="/resources/js/lg-fullscreen.min.js" defer></script>
            <script src="/resources/js/gallery.js" defer></script>
            `;
    } else {
        return '';
    }
}
