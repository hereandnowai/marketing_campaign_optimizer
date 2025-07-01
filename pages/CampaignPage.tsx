
import React, { useState, useCallback, useRef } from 'react';
import { ChatInput } from '../components/ChatInput';
import AnalysisDisplay, { AnalysisDisplayRef } from '../components/AnalysisDisplay'; 
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Branding, analysisOptions } from '../constants';
import { AnalysisType, SelectOption } from '../types';
import { generateMarketingAnalysis } from '../services/geminiService';

export const CampaignPage: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>(analysisOptions[0].value);
  const [userInput, setUserInput] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analysisDisplayRef = useRef<AnalysisDisplayRef>(null);

  const handleAnalysisSubmit = useCallback(async () => {
    if (!userInput.trim()) {
      setError("Please provide some details for the analysis.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await generateMarketingAnalysis(selectedAnalysis, userInput);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Error generating analysis:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Ensure your API key is set up correctly.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAnalysis, userInput]);

  const handleDownloadPdf = async () => {
    if (!analysisResult || !analysisDisplayRef.current) {
      setError("No analysis content available to download.");
      return;
    }
    setIsGeneratingPdf(true);
    setError(null);
    try {
      await analysisDisplayRef.current.downloadPdf();
    } catch (downloadError) {
      console.error("Error generating PDF:", downloadError);
      setError(downloadError instanceof Error ? downloadError.message : "Failed to generate PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="page-container py-8">
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-secondary dark:text-primary">AI Marketing Campaign Optimizer</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{Branding.brand.slogan}</p>
        
        <div className="mb-6">
          <label htmlFor="analysisType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Analysis Type:</label>
          <select
            id="analysisType"
            value={selectedAnalysis}
            onChange={(e) => setSelectedAnalysis(e.target.value as AnalysisType)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-secondary dark:focus:ring-primary focus:border-secondary dark:focus:border-primary sm:text-sm rounded-md shadow-sm bg-white dark:bg-slate-700 text-black dark:text-white"
            style={{ borderColor: Branding.brand.colors.secondary }}
            aria-label="Select type of marketing analysis"
            disabled={isLoading || isGeneratingPdf}
          >
            {analysisOptions.map((option: SelectOption<AnalysisType>) => (
              <option key={option.value} value={option.value} className="text-black dark:text-white bg-white dark:bg-slate-700">{option.label}</option>
            ))}
          </select>
        </div>

        <ChatInput
          userInput={userInput}
          setUserInput={setUserInput}
          onSubmit={handleAnalysisSubmit}
          isLoading={isLoading || isGeneratingPdf}
          selectedAnalysisTypeLabel={analysisOptions.find(opt => opt.value === selectedAnalysis)?.label || ''}
        />

        {(isLoading || isGeneratingPdf) && <LoadingSpinner message={isGeneratingPdf ? "Generating PDF report..." : undefined}/>}
        {error && <div role="alert" aria-live="assertive" className="mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 border border-red-400 dark:border-red-600 rounded-md">{error}</div>}
        
        {analysisResult && !isLoading && !isGeneratingPdf && (
          <>
            <div className="my-6 text-right">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 transition-colors"
                style={{ 
                  backgroundColor: Branding.brand.colors.primary, 
                  color: Branding.brand.colors.secondary,
                }}
              >
                {isGeneratingPdf ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
                  Download PDF Report
                  </>
                )}
              </button>
            </div>
            <AnalysisDisplay ref={analysisDisplayRef} analysisText={analysisResult} />
          </>
        )}
      </div>
    </div>
  );
};