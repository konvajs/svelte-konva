/**
 * Create a Html image element from the provided image source
 *
 * @param src of image
 * @returns HtmlImageElement
 */
export async function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}
