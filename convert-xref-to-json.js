const fs = require('fs');
const path = require('path');

function convertXrefHtmlToJson(htmlFilePath, outputFilePath, chapterNumber = 1) {
  try {
    // Read the HTML file
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Extract content between <body> and </body> tags
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) {
      throw new Error('No body tag found in HTML file');
    }
    
    const bodyContent = bodyMatch[1];
    
    // Extract all paragraph content
    const paragraphMatches = bodyContent.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
    if (!paragraphMatches) {
      throw new Error('No paragraph tags found in HTML file');
    }
    
    const xrefData = {};
    
    paragraphMatches.forEach(paragraph => {
      // Extract content inside <p> tags
      const contentMatch = paragraph.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      if (contentMatch) {
        let paragraphContent = contentMatch[1];
        
        // Clean up HTML entities and formatting
        let cleanContent = paragraphContent
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/<br\s*\/?>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Parse cross-reference entries
        // Pattern: verseNumber + letter (like "1a", "1b", "1c") followed by references
        const xrefMatch = cleanContent.match(/^(\d+)([a-z])\s+(.*)$/);
        if (xrefMatch) {
          const verseNumber = xrefMatch[1];
          const letter = xrefMatch[2];
          const references = xrefMatch[3];
          
          // Initialize verse if it doesn't exist
          if (!xrefData[verseNumber]) {
            xrefData[verseNumber] = {};
          }
          
          // Add the cross-reference
          xrefData[verseNumber][`${verseNumber}${letter}`] = references;
        }
      }
    });
    
    // Create JSON structure
    const jsonData = {
      [chapterNumber.toString()]: xrefData
    };
    
    // Write the JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    
    const totalXrefs = Object.values(xrefData).reduce((sum, verse) => sum + Object.keys(verse).length, 0);
    
    console.log(`Successfully converted ${htmlFilePath} to ${outputFilePath}`);
    console.log(`Found ${totalXrefs} cross-references in chapter ${chapterNumber}`);
    console.log(`Cross-references for ${Object.keys(xrefData).length} verses`);
    
    // Print summary
    Object.keys(xrefData).forEach(verse => {
      const xrefCount = Object.keys(xrefData[verse]).length;
      console.log(`Verse ${verse}: ${xrefCount} cross-references`);
    });
    
  } catch (error) {
    console.error('Error converting file:', error.message);
  }
}

// Usage example
const inputFile = path.join(__dirname, 'data', 'raw_data', 'xref.html');
const outputFile = path.join(__dirname, 'converted-xref.json');

// Convert to JSON format (chapter 1)
convertXrefHtmlToJson(inputFile, outputFile, 1);
