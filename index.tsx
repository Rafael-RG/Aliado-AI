
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PublicTermsPage from './components/PublicTermsPage';
import PublicPrivacyPage from './components/PublicPrivacyPage';
import TermsAndConditions from './components/TermsAndConditions';
import MarketingPage from './components/MarketingPage';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/legal" element={<PublicTermsPage />} />
        <Route path="/privacy" element={<PublicPrivacyPage />} />
        <Route path="/terminos-de-uso-y-condiciones" element={<TermsAndConditions />} />
        <Route path="/marketing" element={<MarketingPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
