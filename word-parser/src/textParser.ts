import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
class TextParser {
    private text: string;

    constructor(text: string) {
        this.text = text;
    }

    // Extract sequences of English and Hebrew characters
    extractSequences(): string[] {
        const sequences: string[] = [];
        let currentSequence = '';
        let currentLanguage: 'english' | 'hebrew' | null = null;

        for (let i = 0; i < this.text.length; i++) {
            const char = this.text[i];

            // Check if character is English (Latin)
            const isEnglish = /[a-zA-Z]/.test(char);
            // Check if character is Hebrew
            const isHebrew = /[\u0590-\u05FF]/.test(char);
            // Check if character is a digit
            const isDigit = /\d/.test(char);
            // Check if character is a symbol
            const isSymbol = /[%&#@\^\$]/.test(char);
            // Check if character is a punctuation mark
            const isPunctuation = /[.,!?;:'"\-_(){}[\]]/.test(char);
            // Check if character is a special punctuation mark to start a new sequence
            // const isSpecialPunctuation = /['"\(\)\{\} \[\]]/.test(char);

            // Determine language rules
            if (isEnglish || isDigit || isSymbol) {
                // English sequence rules
                if (currentLanguage === 'hebrew') {
                    // End Hebrew sequence if English/digit character found
                    if (currentSequence) {
                        sequences.push(currentSequence);
                        currentSequence = '';
                    }
                    currentLanguage = 'english';
                }
                
                if (currentLanguage === null || currentLanguage === 'english') {
                    currentSequence += char;
                    currentLanguage = 'english';
                }
            } else if (isHebrew) {
                // Hebrew sequence rules
                if (currentLanguage === 'english') {
                    // End English sequence if Hebrew character found
                    if (currentSequence) {
                        sequences.push(currentSequence);
                        currentSequence = '';
                    }
                    currentLanguage = 'hebrew';
                }
                
                if (currentLanguage === null || currentLanguage === 'hebrew') {
                    currentSequence += char;
                    currentLanguage = 'hebrew';
                }
            // } else if (isPunctuation) {
            //     // Preserve punctuation in current sequence
            //     if (currentLanguage !== null) {
            //         currentSequence += char;
            //     }
            } else if (isPunctuation ) {   //&& !isSpecialPunctuation
                // Preserve punctuation in current sequence
                if (currentLanguage !== null) { 
                    currentSequence += char;
                }
            } else if (char === '\n') {
                // New line always ends the current sequence
                if (currentSequence) {
                    sequences.push(currentSequence);
                    currentSequence = '';
                    currentLanguage = null;
                }
            // } else if (isSpecialPunctuation) { 
            //     // Handle special punctuation to start a new sequence if next character is different language
            //     if (currentSequence) {
            //         sequences.push(currentSequence);
            //         currentSequence = '';
            //         currentLanguage = null;
            //     }
            //     currentSequence += char;
            //     sequences.push(currentSequence);
            //     currentSequence = '';
            //     currentLanguage = null;
            } else if (/\s/.test(char)) {
                // Spaces within a sequence are preserved
                if (currentLanguage !== null) {
                    currentSequence += char;
                }
            }
        }

        // Add the last sequence if not empty
        if (currentSequence) {
            sequences.push(currentSequence);
        }

        return sequences;
    }

    // Print extracted sequences with their details
    printSequences() {
        const sequences = this.extractSequences();
        
        console.log("Extracted Sequences:");
        sequences.forEach((sequence, index) => {
            console.log(`Sequence ${index + 1}:`);
            console.log(`  Text: "${sequence}"`);
            console.log(`  Length: ${sequence.length}`);
            console.log(`  Language: ${/[\u0590-\u05FF]/.test(sequence) ? 'Hebrew' : 'English/Digits'}`);
            console.log('---');
        });

    }
    // Return extracted sequences as a formatted string
    getSequencesAsString(): string {
        const sequences = this.extractSequences();
        let result = "Extracted Sequences:\n";
        sequences.forEach((sequence, index) => {
            result += `${sequence}`;
            // result += `Sequence ${index + 1}:\n`;
            // result += ` Text: "${sequence}"\n`;
            // result += ` Length: ${sequence.length}\n`;
            // result += ` Language: ${/[\u0590-\u05FF]/.test(sequence) ? 'Hebrew' : 'English/Digits'}\n`;
            // result += '---\n';
        });
        return result;
    }
}

// Function to read file from project root
function readFileFromRoot(fileName: string): string {
    try {
        // Resolve the file path from the project root
        const filePath = path.resolve(process.cwd(), fileName);
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error reading file: ${error}`);
        return '';
    }
}

// Helper function to generate a unique file name
function generateUniqueFileName(baseName: string, extension: string): string {
    let fileName = `${baseName}.${extension}`;
    let counter = 1;

    while (fs.existsSync(fileName)) {
        fileName = `${baseName}(${counter}).${extension}`;
        counter++;
    }

    return fileName;
}
// Function to write sequences to a PDF file
async function writeSequencesToPDF(sequences: string[], outputFileName: string) {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    
    // Add a page to the document
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    let yPosition = height - fontSize;
  
    // Embed a font that supports Hebrew characters
    const fontBytes = fs.readFileSync('./fonts/David.ttf');
    const customFont = await pdfDoc.embedFont(fontBytes);

    // Add each sequence to the page
    sequences.forEach(sequence => {
      page.drawText(sequence, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: customFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= fontSize + 5; // Move down for the next line
    });
  
    // Serialize the PDF document to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
  
    // Write the PDF to a file
    const uniqueFileName = generateUniqueFileName(outputFileName, 'pdf');
    fs.writeFileSync(uniqueFileName, pdfBytes);
    console.log(`Parsed sequences written to ${uniqueFileName}`);

  }

// Main function to run the parser
async function main() {
    // Read from ex.txt in the project root
    const fileContent = readFileFromRoot('ex.txt');
    
    if (fileContent) {
        const parser = new TextParser(fileContent);
        parser.printSequences();
        const parsedSequences = parser.extractSequences();
    // Write the parsed sequences to PDF
        await writeSequencesToPDF(parsedSequences, 'parsedText');

        // Write the parsed sequences to parsedText.txt 
            // fs.writeFileSync('parsedText.txt', parsedSequences);
            // console.log("Parsed sequences written to parsedText.txt");

    } else {
        console.log("No content to parse.");
    }
}

// Run the main function
main();

// To be used in main 
    // const sampleText = "Hello world! This is a sample text. This text demonstrates word parsing and counting.";
    // const parser = new TextParser(sampleText);

    // console.log("Words with Indices:");
    // parser.printWordsWithIndices();

    // console.log("\nWord Counts:");
    // parser.printWordCounts();