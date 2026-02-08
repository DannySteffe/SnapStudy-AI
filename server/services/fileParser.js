import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const parsePDF = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error("Failed to parse PDF file");
    }
};
