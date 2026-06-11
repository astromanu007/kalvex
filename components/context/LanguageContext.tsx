"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Supported languages
export type Language = "en-UK" | "en-US" | "mr" | "hi";

// Translation Dictionary
const DICTIONARY: Record<Language, Record<string, string>> = {
  "en-UK": {
    "Favorite": "Favourite",
    "Color": "Colour",
    "client-favourite": "Client Favourite",
  },
  "en-US": {
    "Favorite": "Favorite",
    "Color": "Color",
    "client-favourite": "Client Favorite",
  },
  "mr": {
    // General / Settings
    "Settings Corridor": "सेटिंग्ज कॉरिडॉर",
    "Dashboard Settings": "डॅशबोर्ड सेटिंग्ज",
    "Configure display region and base multiplier node": "प्रदर्शित प्रदेश आणि बेस मल्टीप्लायर नोड कॉन्फिगर करा",
    "Display Language": "भाषा प्रदर्शित करा",
    "Primary Currency": "प्राथमिक चलन",
    "Security & Access Policies": "सुरक्षा आणि प्रवेश धोरणे",
    "Manage encryption settings and session safety protocols": "एनक्रिप्शन सेटिंग्ज आणि सत्र सुरक्षा प्रोटोकॉल व्यवस्थापित करा",
    "Save Settings": "सेटिंग्ज जतन करा",
    "Settings saved successfully.": "सेटिंग्ज यशस्वीरित्या जतन केल्या.",
    "English (UK)": "इंग्रजी (UK)",
    "English (US)": "इंग्रजी (US)",
    "Marathi (मराठी)": "मराठी",
    "Hindi (हिंदी)": "हिंदी",
    "INR (₹)": "INR (₹)",
    "USD ($)": "USD ($)",
    
    // Sidebar & Common Navigation
    "Developer Dashboard": "डेव्हलपर डॅशबोर्ड",
    "Writer Dashboard": "लेखक डॅशबोर्ड",
    "Expert Dashboard": "तज्ञ डॅशबोर्ड",
    "Admin Dashboard": "अॅडमिन डॅशबोर्ड",
    "User Dashboard": "वापरकर्ता डॅशबोर्ड",
    "Dashboard": "डॅशबोर्ड",
    "My Orders": "माझ्या ऑर्डर्स",
    "My Projects": "माझे प्रोजेक्ट्स",
    "Messages": "संदेश",
    "Wallet": "वॉलेट",
    "Reviews": "पुनरावलोकने",
    "Profile": "प्रोफाइल",
    "Affiliate Commission": "अॅफिलिएट कमिशन",
    "Settings": "सेटिंग्ज",
    "Help & Support": "मदत आणि समर्थन",
    "Log Out": "लॉग आउट",
    "Identity": "ओळख",
    "Rating": "रेटिंग",
    "Online": "ऑनलाइन",
    "Accept Assignment": "स्वीकारा",
    "Reject Assignment": "नाकारा",
    "AI Assistant: Active": "AI सहाय्यक: सक्रिय",
    "Hide Main Nav": "मुख्य नेव्हिगेशन लपवा",
    "Show Main Nav": "मुख्य नेव्हिगेशन दाखवा",
    "Sign Out": "लॉग आउट",
    "Sign out": "लॉग आउट",

    // Stats Grid Labels
    "Active Tasks": "सक्रिय कामे",
    "Marketplace": "मार्केटप्लेस",
    "Earnings": "कमाई",
    "Success Rate": "यशस्वी दर",
    "In progress": "प्रगतीपथावर",
    "Available to pick": "निवडण्यासाठी उपलब्ध",
    "Cleared balance": "निकालात काढलेली शिल्लक",
    "High quality": "उच्च गुणवत्ता",

    // Wallet Page
    "Cleared Earnings": "निकालात काढलेली कमाई",
    "Prepaid Credits": "प्रीपेड क्रेडिट्स",
    "Escrow Balance": "एस्क्रो शिल्लक",
    "Active Referrals": "सक्रिय संदर्भ",
    "Total Orders": "एकूण ऑर्डर्स",
    "Earnings Timeline": "कमाईची टाइमलाइन",
    "Project earnings trajectory over past 4 weeks": "मागील ४ आठवड्यांतील प्रकल्प कमाईचा मार्ग",
    "Secure Node": "सुरक्षित नोड",
    "Withdrawal Portal": "पैसे काढण्याचे पोर्टल",
    "UPI Address": "UPI पत्ता",
    "Select Payout Method": "पैसे देण्याची पद्धत निवडा",
    "Enter withdrawal amount": "पैसे काढण्याची रक्कम प्रविष्ट करा",
    "Bank Details": "बँक तपशील",
    "Account Holder Name": "खातेदाराचे नाव",
    "Account Number": "खाते क्रमांक",
    "IFSC Code": "IFSC कोड",
    "Bank Name": "बँकेचे नाव",
    "Initiate Cleared Cashout": "पैसे काढणे सुरू करा",
    "Transaction Ledger History": "व्यवहार खातेवही इतिहास",
    "Transaction ID": "व्यवहार आयडी",
    "Title": "शीर्षक",
    "Type": "प्रकार",
    "Amount": "रक्कम",
    "Date": "तारीख",
    "Status": "स्थिती",
    "Completed": "पूर्ण झाले",
    "Pending": "प्रलंबित",
    "Failed": "अपयशी",

    // Profile Page
    "Personal Info": "वैयक्तिक माहिती",
    "Professional Bio": "व्यावसायिक बायो",
    "Academic Info": "शैक्षणिक माहिती",
    "Security": "सुरक्षा",
    "Notifications": "अधिसूचना",
    "Save Profile": "प्रोफाइल जतन करा",
    "Full Name": "पूर्ण नाव",
    "Email Address": "ईमेल पत्ता",
    "Phone Number": "फोन नंबर",
    "GitHub Profile": "GitHub प्रोफाइल",
    "LinkedIn Profile": "LinkedIn प्रोफाइल",
    "Portfolio Website": "पोर्टफोलिओ वेबसाइट",
    "Specializations": "स्पेशलायझेशन",
    "Domain Expertise": "डोमेन कौशल्य",
    "Select Role": "भूमिका निवडा",
    "Resume URL": "रेझ्युमे URL",

    // Help Page
    "Help & Support Center": "मदत आणि समर्थन केंद्र",
    "Knowledge Base & FAQs": "ज्ञानकोश आणि FAQ",
    "Search topics...": "विषय शोधा...",
    "Contact Support Node": "समर्थन नोडशी संपर्क साधा",
    "Submit Support Ticket": "समर्थन तिकीट सबमिट करा",
    "Subject": "विषय",
    "Category": "वर्ग",
    "Priority": "प्राधान्य",
    "Message": "संदेश",
    "Create Ticket": "तिकीट तयार करा",
    "Active Tickets": "सक्रिय तिकिटे",

    // Reviews Page
    "Developer Testimonials Portfolio": "डेव्हलपर प्रशस्तीपत्र पोर्टफोलिओ",
    "My Reviews": "माझी पुनरावलोकने",
    "Average Rating": "सरासरी रेटिंग",
    "Direct Testimonials": "थेट प्रशस्तीपत्रे",
    "Total Submissions": "एकूण सबमिशन",
    "Trust Accuracy Score": "विश्वास अचूकता स्कोअर",
    "Rating Breakdown": "रेटिंगचे विश्लेषण",
    "Developer Badges": "डेव्हलपर बॅजेस",
    "Client Feedback Logs": "क्लायंट फीडबॅक लॉग्स",
    "Submitted Reviews": "सबमिट केलेली पुनरावलोकने",

    // Affiliate Page
    "Affiliate Commission Center": "अॅफिलिएट कमिशन केंद्र",
    "Referral Clicks": "रेफरल क्लिक्स",
    "Conversions": "रूपांतरणे",
    "Pending Payout": "प्रलंबित पेआउट",
    "Total Earnings": "एकूण कमाई",
    "Your Referral Link": "तुमची रेफरल लिंक",
    "Copy Link": "लिंक कॉपी करा",
    "Copied Release": "कॉपी केलेले",
    "Passive Income Estimator": "पॅसिव्ह इन्कमचा अंदाज",
    "Number of Referrals": "रेफरल्सची संख्या",
    "Average Order Value": "सरासरी ऑर्डर मूल्य",
    "Estimated Commissions": "अंदाजे कमिशन",
    "Affiliate Tiers": "अॅफिलिएट स्तर",
    "Current Status": "सध्याची स्थिती",
  },
  "hi": {
    // General / Settings
    "Settings Corridor": "सेटिंग्स कॉरिडोर",
    "Dashboard Settings": "डैशबोर्ड सेटिंग्स",
    "Configure display region and base multiplier node": "डिस्प्ले क्षेत्र और बेस मल्टीप्लायर नोड को कॉन्फ़िगर करें",
    "Display Language": "भाषा प्रदर्शित करें",
    "Primary Currency": "प्राथमिक मुद्रा",
    "Security & Access Policies": "सुरक्षा और पहुंच नीतियां",
    "Manage encryption settings and session safety protocols": "एन्क्रिप्शन सेटिंग्स और सत्र सुरक्षा प्रोटोकॉल प्रबंधित करें",
    "Save Settings": "सेटिंग्स सहेजें",
    "Settings saved successfully.": "सेटिंग्स सफलतापूर्वक सहेजी गईं।",
    "English (UK)": "अंग्रेजी (UK)",
    "English (US)": "अंग्रेजी (US)",
    "Marathi (मराठी)": "मराठी",
    "Hindi (हिंदी)": "हिंदी",
    "INR (₹)": "INR (₹)",
    "USD ($)": "USD ($)",

    // Sidebar & Common Navigation
    "Developer Dashboard": "डेवलपर डैशबोर्ड",
    "Writer Dashboard": "लेखक डैशबोर्ड",
    "Expert Dashboard": "विशेषज्ञ डैशबोर्ड",
    "Admin Dashboard": "एडमिन डैशबोर्ड",
    "User Dashboard": "उपयोगकर्ता डैशबोर्ड",
    "Dashboard": "डैशबोर्ड",
    "My Orders": "मेरे ऑर्डर्स",
    "My Projects": "मेरे प्रोजेक्ट्स",
    "Messages": "संदेश",
    "Wallet": "वॉलेट",
    "Reviews": "समीक्षाएं",
    "Profile": "प्रोफाइल",
    "Affiliate Commission": "अफ़िलिएट कमीशन",
    "Settings": "सेटिंग्स",
    "Help & Support": "मदद और सहायता",
    "Log Out": "लॉग आउट",
    "Identity": "पहचान",
    "Rating": "रेटिंग",
    "Online": "ऑनलाइन",
    "Accept Assignment": "स्वीकार करें",
    "Reject Assignment": "अस्वीकार करें",
    "AI Assistant: Active": "AI सहायक: सक्रिय",
    "Hide Main Nav": "मुख्य नेविगेशन छिपाएं",
    "Show Main Nav": "मुख्य नेविगेशन दिखाएं",
    "Sign Out": "साइन आउट",
    "Sign out": "साइन आउट",

    // Stats Grid Labels
    "Active Tasks": "सक्रिय कार्य",
    "Marketplace": "मार्केटप्लेस",
    "Earnings": "कमाई",
    "Success Rate": "सफलता दर",
    "In progress": "प्रगति पर",
    "Available to pick": "चुनने के लिए उपलब्ध",
    "Cleared balance": "निकासी योग्य शेष",
    "High quality": "उच्च गुणवत्ता",

    // Wallet Page
    "Cleared Earnings": "निकासी योग्य कमाई",
    "Prepaid Credits": "प्रीपेड क्रेडिट",
    "Escrow Balance": "एस्क्रो शेष",
    "Active Referrals": "सक्रिय रेफ़रल",
    "Total Orders": "कुल ऑर्डर्स",
    "Earnings Timeline": "कमाई की टाइमलाइन",
    "Project earnings trajectory over past 4 weeks": "पिछले 4 हफ्तों में परियोजना कमाई की प्रगति",
    "Secure Node": "सुरक्षित नोड",
    "Withdrawal Portal": "निकासी पोर्टल",
    "UPI Address": "UPI पता",
    "Select Payout Method": "भुगतान विधि चुनें",
    "Enter withdrawal amount": "निकासी राशि दर्ज करें",
    "Bank Details": "बैंक विवरण",
    "Account Holder Name": "खाताधारक का नाम",
    "Account Number": "खाता संख्या",
    "IFSC Code": "IFSC कोड",
    "Bank Name": "बैंक का नाम",
    "Initiate Cleared Cashout": "निकासी शुरू करें",
    "Transaction Ledger History": "लेनदेन बही इतिहास",
    "Transaction ID": "लेनदेन आईडी",
    "Title": "शीर्षक",
    "Type": "प्रकार",
    "Amount": "रकम",
    "Date": "तारीख",
    "Status": "स्थिति",
    "Completed": "पूरा हुआ",
    "Pending": "लंबित",
    "Failed": "विफल",

    // Profile Page
    "Personal Info": "व्यक्तिगत जानकारी",
    "Professional Bio": "पेशेवर बायो",
    "Academic Info": "शैक्षणिक जानकारी",
    "Security": "सुरक्षा",
    "Notifications": "अधिसूचनाएं",
    "Save Profile": "प्रोफाइल सहेजें",
    "Full Name": "पूरा नाम",
    "Email Address": "ईमेल पता",
    "Phone Number": "फ़ोन नंबर",
    "GitHub Profile": "GitHub प्रोफाइल",
    "LinkedIn Profile": "LinkedIn प्रोफाइल",
    "Portfolio Website": "पोर्टफोलियो वेबसाइट",
    "Specializations": "विशेषज्ञता",
    "Domain Expertise": "डोमेन विशेषज्ञता",
    "Select Role": "भूमिका चुनें",
    "Resume URL": "रिज्यूमे URL",

    // Help Page
    "Help & Support Center": "मदद और सहायता केंद्र",
    "Knowledge Base & FAQs": "ज्ञानकोश और अक्सर पूछे जाने वाले प्रश्न",
    "Search topics...": "विषय खोजें...",
    "Contact Support Node": "सहायता नोड से संपर्क करें",
    "Submit Support Ticket": "सहायता टिकट सबमिट करें",
    "Subject": "विषय",
    "Category": "श्रेणी",
    "Priority": "प्राथमिकता",
    "Message": "संदेश",
    "Create Ticket": "टिकट बनाएं",
    "Active Tickets": "सक्रिय टिकट",

    // Reviews Page
    "Developer Testimonials Portfolio": "डेवलपर प्रशंसापत्र पोर्टफोलियो",
    "My Reviews": "मेरी समीक्षाएं",
    "Average Rating": "औसत रेटिंग",
    "Direct Testimonials": "प्रत्यक्ष प्रशंसापत्र",
    "Total Submissions": "कुल सबमिशन",
    "Trust Accuracy Score": "ट्रस्ट सटीकता स्कोर",
    "Rating Breakdown": "रेटिंग का विवरण",
    "Developer Badges": "डेवलपर बैज",
    "Client Feedback Logs": "क्लायंट फीडबैक लॉग",
    "Submitted Reviews": "सबमिट की गई समीक्षाएं",

    // Affiliate Page
    "Affiliate Commission Center": "अफ़िलिएट कमीशन केंद्र",
    "Referral Clicks": "रेफ़रल क्लिक",
    "Conversions": "रूपांतरण",
    "Pending Payout": "लंबित भुगतान",
    "Total Earnings": "कुल कमाई",
    "Your Referral Link": "आपका रेफ़रल लिंक",
    "Copy Link": "लिंक कॉपी करें",
    "Copied Release": "कॉपी किया गया",
    "Passive Income Estimator": "निष्क्रिय आय का अनुमानक",
    "Number of Referrals": "रेफ़रल की संख्या",
    "Average Order Value": "औसत ऑर्डर मूल्य",
    "Estimated Commissions": "अनुमानित कमीशन",
    "Affiliate Tiers": "अफ़िलिएट स्तर",
    "Current Status": "वर्तमान स्थिति",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en-UK");

  useEffect(() => {
    const savedLang = localStorage.getItem("dashboard_lang") as Language;
    if (savedLang && ["en-UK", "en-US", "mr", "hi"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("dashboard_lang", lang);
  };

  const t = (text: string): string => {
    // If language is default English (UK), return original or mapped key
    const currentLangDict = DICTIONARY[language];
    if (currentLangDict && text in currentLangDict) {
      return currentLangDict[text];
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
