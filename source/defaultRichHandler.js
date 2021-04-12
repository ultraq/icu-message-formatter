export function defaultRichHandler(tag, tags, contents) {
	return `<${tag}>${contents}</${tag}>`;
}
