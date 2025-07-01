
import React, { useImperativeHandle, useRef } from 'react';
import { Branding } from '../constants';
import { GroundingChunk, GroundingChunkWeb } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisDisplayProps {
  analysisText: string;
}

export interface AnalysisDisplayRef {
  downloadPdf: () => Promise<void>;
}

interface FlashcardData {
  title: string;
  contentLines: string[];
  isGroundingSources?: boolean;
  groundingData?: GroundingChunkWeb[];
}

// Helper to render markdown-like text (simplified)
const renderFormattedText = (text: string, cardKey: string): React.ReactNode[] => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentListItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (currentListItems.length > 0) {
      const listKey = `list-${cardKey}-${elements.length}`;
      const listClasses = "list-inside mb-2 pl-5 space-y-1 text-gray-700 dark:text-gray-300";
      if (listType === 'ol') {
        elements.push(
          <ol key={listKey} className={`list-decimal ${listClasses}`}>
            {currentListItems.map((item, idx) => (
              <li key={`li-${idx}`}>{item}</li>
            ))}
          </ol>
        );
      } else { 
        elements.push(
          <ul key={listKey} className={`list-disc ${listClasses}`}>
            {currentListItems.map((item, idx) => (
              <li key={`li-${idx}`}>{item}</li>
            ))}
          </ul>
        );
      }
      currentListItems = [];
    }
    listType = null;
  };

  lines.forEach((line, index) => {
    const itemKey = `${cardKey}-line-${index}`;
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={itemKey} className="text-lg font-semibold mt-3 mb-1.5 text-secondary dark:text-primary">{line.substring(4)}</h3>);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      if (listType !== 'ul' && listType !== null) flushList(); 
      listType = 'ul';
      currentListItems.push(line.substring(2));
    } else if (line.match(/^\d+\.\s/)) {
      if (listType !== 'ol' && listType !== null) flushList(); 
      listType = 'ol';
      currentListItems.push(line.replace(/^\d+\.\s/, ''));
    } else if (line.trim() === '') {
      // flushList(); // Keep empty lines within content as they might be intentional paragraph breaks
    } else {
       if (listType && (line.startsWith('  ') || line.startsWith('\t'))) { 
         currentListItems[currentListItems.length -1] += `\n${line.trimStart()}`;
       } else {
        flushList();
        elements.push(<p key={itemKey} className="mb-1.5 text-gray-700 dark:text-gray-300 leading-relaxed">{line}</p>);
       }
    }
  });

  flushList(); 
  return elements;
};


const extractAndParseAnalysis = (analysisText: string): { flashcards: FlashcardData[], rawTitle?: string } => {
  const sourcesRegex = /\[SOURCES:(.*?)\]/g;
  let groundingSources: GroundingChunkWeb[] = [];
  
  const contentWithoutSources = analysisText.replace(sourcesRegex, (match, jsonString) => {
    try {
      const parsedSources: GroundingChunk[] = JSON.parse(jsonString);
      parsedSources.forEach(s => {
        if (s.web) {
          groundingSources.push(s.web);
        }
      });
    } catch (e) {
      console.warn("Could not parse grounding sources:", e);
    }
    return ""; 
  }).trim();

  const lines = contentWithoutSources.split('\n');
  const flashcards: FlashcardData[] = [];
  let currentCard: FlashcardData | null = null;
  let rawTitle: string | undefined = undefined;

  lines.forEach(line => {
    if (line.startsWith('## ')) {
      if (currentCard) {
        flashcards.push(currentCard);
      }
      currentCard = { title: line.substring(3).trim(), contentLines: [] };
    } else if (currentCard) {
      // Keep leading/trailing spaces for lines within a card as they might be markdown code blocks or preformatted text.
      // The renderFormattedText function will handle trimming for display if necessary.
      currentCard.contentLines.push(line);
    }
  });

  if (currentCard) {
    flashcards.push(currentCard);
  }

  if (groundingSources.length > 0) {
    flashcards.push({
      title: "Sources",
      contentLines: [], 
      isGroundingSources: true,
      groundingData: groundingSources,
    });
  }
  return { flashcards, rawTitle };
};


export const AnalysisDisplay = React.forwardRef<AnalysisDisplayRef, AnalysisDisplayProps>(({ analysisText }, ref) => {
  const { flashcards, rawTitle } = extractAndParseAnalysis(analysisText);
  const analysisContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    async downloadPdf() {
      if (!analysisContainerRef.current) return;
      
      // Temporarily switch to light theme for PDF generation if current is dark, to ensure consistent PDF appearance
      const htmlElement = document.documentElement;
      const originalThemeIsDark = htmlElement.classList.contains('dark');
      if (originalThemeIsDark) {
        htmlElement.classList.remove('dark');
        // Force redraw if necessary, though html2canvas might handle it
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for styles to apply
      }

      const canvas = await html2canvas(analysisContainerRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff', // Explicitly set background to white for PDF
      });

      if (originalThemeIsDark) {
         htmlElement.classList.add('dark'); // Restore dark theme
      }
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4'); 
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; 
      const contentWidth = pdfWidth - 2 * margin;

      const logoUrl = Branding.brand.logo.title;
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous"; 
      logoImg.src = logoUrl;

      return new Promise((resolve, reject) => {
        logoImg.onload = () => {
          const logoHeight = 20; 
          const logoOriginalWidth = logoImg.width;
          const logoOriginalHeight = logoImg.height;
          const logoAspectRatio = logoOriginalWidth / logoOriginalHeight;
          const logoPdfWidth = logoHeight * logoAspectRatio;
          
          const logoX = (pdfWidth - logoPdfWidth) / 2; 
          pdf.addImage(logoImg, 'PNG', logoX, margin, logoPdfWidth, logoHeight);

          let currentY = margin + logoHeight + 10;
          pdf.setFontSize(16);
          pdf.setTextColor(Branding.brand.colors.secondary.replace('#',''));
          pdf.text("Marketing Campaign Analysis Report", pdfWidth / 2, currentY, { align: 'center' });
          currentY += 6;
          pdf.setFontSize(10);
          pdf.setTextColor(100); 
          pdf.text(Branding.brand.shortName, pdfWidth / 2, currentY, { align: 'center'});
          currentY += 15; 

          const imgProps = pdf.getImageProperties(imgData);
          const analysisImgHeight = (imgProps.height * contentWidth) / imgProps.width;
          let heightLeft = analysisImgHeight;
          let pageContentHeight = pdfHeight - currentY - margin;
          
          if (pageContentHeight <=0) { // Not enough space on first page after header
            pdf.addPage();
            currentY = margin; // Reset Y for new page
            pageContentHeight = pdfHeight - 2 * margin;
          }

          pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, analysisImgHeight);
          heightLeft -= pageContentHeight;

          while (heightLeft > 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, analysisImgHeight); // Image y position is relative to its own content
            heightLeft -= (pdfHeight - 2 * margin);
          }
          
          pdf.save('HERE_AND_NOW_AI_Campaign_Analysis.pdf');
          resolve();
        };
        logoImg.onerror = (err) => {
            console.error("Failed to load logo for PDF:", err);
            if (originalThemeIsDark) {
              htmlElement.classList.add('dark'); // Restore dark theme on error
            }
            // Simplified fallback for brevity
            pdf.setFontSize(16);
            pdf.text("Marketing Campaign Analysis Report (Logo Failed to Load)", pdfWidth / 2, margin + 10, { align: 'center' });
            // Add content image logic here too
            pdf.save('HERE_AND_NOW_AI_Campaign_Analysis_NoLogo.pdf');
            reject(new Error("Failed to load logo for PDF"));
        };
      });
    }
  }));

  if (flashcards.length === 0 && !rawTitle) {
    return (
      <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-lg shadow text-center">
        No analysis data to display. The AI might not have provided a response in the expected format.
      </div>
    );
  }

  return (
    <div ref={analysisContainerRef} className="mt-6 space-y-6">
      {rawTitle && (
         <h2 className="text-3xl font-bold mb-6 text-center text-secondary dark:text-primary">
           {rawTitle}
         </h2>
      )}
      {flashcards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl">
          <div className="p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 pb-2 border-b-2 text-secondary dark:text-primary" style={{ borderColor: Branding.brand.colors.primary }}>
              {card.title}
            </h2>
            {card.isGroundingSources && card.groundingData ? (
              <ul className="list-none pl-0 space-y-1.5">
                {card.groundingData.map((source, idx) => (
                  <li key={idx} className="text-sm">
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline visited:text-purple-600 dark:visited:text-purple-400 group break-all"
                    >
                      <svg className="w-4 h-4 mr-1.5 text-blue-500 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                      {source.title || source.uri}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
               <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert 
                              prose-headings:text-secondary prose-headings:dark:text-primary 
                              prose-p:text-gray-700 prose-p:dark:text-gray-300
                              prose-ul:text-gray-700 prose-ul:dark:text-gray-300
                              prose-ol:text-gray-700 prose-ol:dark:text-gray-300
                              prose-strong:text-gray-800 prose-strong:dark:text-gray-200
                              prose-a:text-blue-600 prose-a:dark:text-blue-400
                              prose-li:marker:text-secondary prose-li:dark:marker:text-primary">
                {renderFormattedText(card.contentLines.join('\n'), `card-${index}`)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default AnalysisDisplay;