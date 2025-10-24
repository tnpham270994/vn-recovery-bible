const fs = require('fs');
const path = require('path');

class BibleConversionService {
  constructor() {
    this.rawDataPath = path.join(__dirname, 'data', 'raw_data');
  }

  /**
   * Parse verses from HTML content
   */
  parseVersesFromHTML(htmlContent) {
    const contentItems = [];
    
    // Extract content between <body> and </body> tags
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) {
      throw new Error('No body tag found in HTML file');
    }
    
    const bodyContent = bodyMatch[1];
    
    // Extract all paragraph content with multiline support
    const paragraphMatches = bodyContent.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
    if (!paragraphMatches) {
      throw new Error('No paragraph tags found in HTML file');
    }
    
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
          .replace(/<em>([^<]*)<\/em>/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Check if this paragraph starts with a verse number (like "1 ", "2 ", etc.)
        const verseNumberMatch = cleanContent.match(/^(\d+)\s+(.*)$/s);
        if (verseNumberMatch) {
          const verseNumber = verseNumberMatch[1];
          let verseText = verseNumberMatch[2];
          
          // Convert <sup>content</sup> to [content]
          verseText = verseText.replace(/<sup>([^<]*)<\/sup>/g, '[$1]');
          
          // Only add non-empty verses
          if (verseText && verseText.length > 0) {
            contentItems.push({
              type: 'verse',
              verse_no: parseInt(verseNumber),
              content: verseText
            });
          }
        } else if (cleanContent && cleanContent.length > 0) {
          // Check if this looks like a title/header (contains Roman numerals, letters with periods, or specific patterns)
          const isTitle = /^[IVX]+\.|^[A-Z]\.|^CHƯƠNG|^cc\.|^\d+:\d+/.test(cleanContent) || 
                         cleanContent.includes('–') || 
                         cleanContent.includes('để') && cleanContent.length < 100;
          
          if (isTitle) {
            contentItems.push({
              type: 'title',
              content: cleanContent
            });
          }
        }
      }
    });
    
    return contentItems;
  }

  /**
   * Parse footnotes from HTML content
   */
  parseFootnotesFromHTML(htmlContent) {
    const footnotes = {};
    
    // More comprehensive regex to handle various footnote formats
    const footnoteRegex = /<p>(\d+)<sup>(\d+)<\/sup>\s*(.*?)<\/p>/gs;
    let match;
    
    while ((match = footnoteRegex.exec(htmlContent)) !== null) {
      const verseNumber = match[1];
      const footnoteId = match[2];
      let footnoteText = match[3];
      
      // Clean up the footnote text
      footnoteText = footnoteText
        .replace(/<em>(.*?)<\/em>/g, '$1') // Remove em tags but keep content
        .replace(/<sup>(\d+)<\/sup>/g, '$1') // Convert superscript references to plain text
        .replace(/<\/p>$/g, '') // Remove trailing </p> tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      // Skip empty footnotes
      if (!footnoteText) continue;
      
      // Initialize verse if it doesn't exist
      if (!footnotes[verseNumber]) {
        footnotes[verseNumber] = [];
      }
      
      // Add footnote to the verse
      footnotes[verseNumber].push({
        id: footnoteId,
        text: footnoteText
      });
    }
    
    return footnotes;
  }

  /**
   * Parse cross-references from HTML content
   */
  parseXrefFromHTML(htmlContent) {
    const xrefData = {};
    
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
    
    return xrefData;
  }

  /**
   * Extract chapter number from HTML content
   */
  extractChapterFromTitle(htmlContent) {
    // Try to extract chapter number from title
    const titleMatch = htmlContent.match(/Chuong (\d+)/i);
    return titleMatch ? titleMatch[1] : "1";
  }

  /**
   * Convert a single chapter from HTML files to unified JSON format
   */
  convertChapter(chapterNumber, bookCode) {
    try {
      const verseFile = path.join(this.rawDataPath, 'verse.html');
      const footnoteFile = path.join(this.rawDataPath, 'footnotes.html');
      const xrefFile = path.join(this.rawDataPath, 'xref.html');

      // Read HTML files
      const verseHtml = fs.readFileSync(verseFile, 'utf8');
      const footnoteHtml = fs.readFileSync(footnoteFile, 'utf8');
      const xrefHtml = fs.readFileSync(xrefFile, 'utf8');

      // Extract chapter number from verse HTML
      const extractedChapter = this.extractChapterFromTitle(verseHtml);
      const finalChapterNumber = chapterNumber || extractedChapter;

      // Parse all components
      const verseData = this.parseVersesFromHTML(verseHtml);
      const footnotes = this.parseFootnotesFromHTML(footnoteHtml);
      const xrefData = this.parseXrefFromHTML(xrefHtml);

      // Create unified JSON structure matching gi.json format
      const result = {
        verse_data: {
          [finalChapterNumber]: verseData
        },
        footnotes: {
          [finalChapterNumber]: footnotes
        },
        xrefs: {
          [finalChapterNumber]: xrefData
        }
      };

      return result;

    } catch (error) {
      console.error(`Error converting chapter ${chapterNumber}:`, error.message);
      throw error;
    }
  }

  /**
   * Convert and save a chapter to JSON file
   */
  convertAndSaveChapter(chapterNumber, bookCode, outputDir = null) {
    try {
      const result = this.convertChapter(chapterNumber, bookCode);
      
      // Determine output directory
      const targetDir = outputDir || path.join(__dirname, 'data');
      
      // Create output filename
      const outputFile = path.join(targetDir, `${bookCode}.json`);
      
      // Write the JSON file
      fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');
      
      // Print summary
      const verseCount = result.verse_data[Object.keys(result.verse_data)[0]].filter(item => item.type === 'verse').length;
      const titleCount = result.verse_data[Object.keys(result.verse_data)[0]].filter(item => item.type === 'title').length;
      const footnoteCount = Object.values(result.footnotes[Object.keys(result.footnotes)[0]]).reduce((sum, footnotes) => sum + footnotes.length, 0);
      const xrefCount = Object.values(result.cross_references[Object.keys(result.cross_references)[0]]).reduce((sum, verse) => sum + Object.keys(verse).length, 0);
      
      console.log(`Successfully converted and saved ${outputFile}`);
      console.log(`Chapter: ${Object.keys(result.verse_data)[0]}`);
      console.log(`Found ${verseCount} verses, ${titleCount} titles`);
      console.log(`Found ${footnoteCount} footnotes`);
      console.log(`Found ${xrefCount} cross-references`);
      
      return result;

    } catch (error) {
      console.error(`Error converting and saving chapter ${chapterNumber}:`, error.message);
      throw error;
    }
  }

  /**
   * Convert multiple chapters for a book
   */
  convertBook(bookCode, chapters = [1], outputDir = null) {
    const results = {};
    
    for (const chapter of chapters) {
      try {
        console.log(`Converting chapter ${chapter} for book ${bookCode}...`);
        const result = this.convertChapter(chapter, bookCode);
        results[chapter] = result;
      } catch (error) {
        console.error(`Failed to convert chapter ${chapter}:`, error.message);
      }
    }
    
    // If only one chapter, save directly
    if (chapters.length === 1) {
      return this.convertAndSaveChapter(chapters[0], bookCode, outputDir);
    }
    
    // For multiple chapters, combine them
    const combinedResult = {
      verse_data: {},
      footnotes: {},
      cross_references: {}
    };
    
    Object.values(results).forEach(result => {
      Object.assign(combinedResult.verse_data, result.verse_data);
      Object.assign(combinedResult.footnotes, result.footnotes);
      Object.assign(combinedResult.cross_references, result.cross_references);
    });
    
    // Save combined result
    const targetDir = outputDir || path.join(__dirname, 'data');
    const outputFile = path.join(targetDir, `${bookCode}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(combinedResult, null, 2), 'utf8');
    
    console.log(`Successfully converted and saved book ${bookCode} with ${chapters.length} chapters to ${outputFile}`);
    
    return combinedResult;
  }
}

// Export the service class
module.exports = BibleConversionService;

// CLI usage if run directly
if (require.main === module) {
  const service = new BibleConversionService();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const bookCode = args[0] || 'gi';
  const chapterNumber = parseInt(args[1]) || 1;
  
  console.log(`Converting book: ${bookCode}, chapter: ${chapterNumber}`);
  
  try {
    service.convertAndSaveChapter(chapterNumber, bookCode);
  } catch (error) {
    console.error('Conversion failed:', error.message);
    process.exit(1);
  }
}
