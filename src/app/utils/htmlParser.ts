export const htmlParser = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // List of tags to extract text from
    const tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote'];
    let extractedText = '';

    // Loop through the tags and append text content
    tags.forEach(tag => {
        const elements = doc.getElementsByTagName(tag);
        for (let i = 0; i < elements.length; i++) {
            const text = elements[i].textContent?.trim();
            if (text) {
                extractedText += text + ' ';
            }
        }
    });

    return extractedText.trim();
};
