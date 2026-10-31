/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 'en' | 'mr' | 'hi';

export interface TranslationDictionary {
  tagline: string;
  // Navigation
  dashboard: string;
  myFarms: string;
  myPlots: string;
  cropRowManagement: string;
  canopyControl: string;
  weatherAlerts: string;
  sensorMonitoring: string;
  activityHistory: string;
  maintenance: string;
  analyticsReports: string;
  subscriptionPlans: string;
  settings: string;
  helpSupport: string;
  // Common Labels & Actions
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  latestUpdateSub: string;
  totalFarms: string;
  protectedPlots: string;
  canopyStatus: string;
  weatherRisk: string;
  deployCanopy: string;
  retractCanopy: string;
  deployAll: string;
  retractAll: string;
  emergencyHalt: string;
  checkStatus: string;
  viewAlerts: string;
  viewWeather: string;
  viewFarm: string;
  recentActivity: string;
  noData: string;
  low: string;
  moderate: string;
  high: string;
  critical: string;
  deployed: string;
  retracted: string;
  moving: string;
  stopped: string;
  operational: string;
  windSpeed: string;
  humidity: string;
  rainProbability: string;
  hailRisk: string;
  temperature: string;
  acres: string;
  rows: string;
  grapes: string;
  pomegranate: string;
  tomato: string;
  onion: string;
  online: string;
  offline: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    tagline: 'Smart Canopies. Safer Harvests.',
    // Navigation
    dashboard: 'Dashboard',
    myFarms: 'My Farms',
    myPlots: 'My Plots',
    cropRowManagement: 'Crop & Row Management',
    canopyControl: 'Canopy Control',
    weatherAlerts: 'Weather & Hail Alerts',
    sensorMonitoring: 'Sensor Monitoring',
    activityHistory: 'Activity History',
    maintenance: 'Maintenance',
    analyticsReports: 'Analytics & Reports',
    subscriptionPlans: 'Subscription & Plans',
    settings: 'Settings',
    helpSupport: 'Help & Support',
    // Common
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    latestUpdateSub: 'Here is the latest update from your farm.',
    totalFarms: 'Total Farms',
    protectedPlots: 'Protected Plots',
    canopyStatus: 'Canopy Status',
    weatherRisk: 'Current Weather Risk',
    deployCanopy: 'Deploy Canopy',
    retractCanopy: 'Retract Canopy',
    deployAll: 'Deploy All Canopies',
    retractAll: 'Retract All Canopies',
    emergencyHalt: 'Emergency Stop',
    checkStatus: 'Check Status',
    viewAlerts: 'View Alerts',
    viewWeather: 'View Weather',
    viewFarm: 'View Farm',
    recentActivity: 'Recent Activity',
    noData: 'No data available',
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    critical: 'Critical',
    deployed: 'Deployed (Covered)',
    retracted: 'Retracted (Open)',
    moving: 'Moving',
    stopped: 'Stopped',
    operational: 'Operational',
    windSpeed: 'Wind Speed',
    humidity: 'Humidity',
    rainProbability: 'Rain Probability',
    hailRisk: 'Hail Risk Level',
    temperature: 'Temperature',
    acres: 'Acres',
    rows: 'Rows',
    grapes: 'Grapes',
    pomegranate: 'Pomegranate',
    tomato: 'Tomato',
    onion: 'Onion',
    online: 'Online',
    offline: 'Offline',
  },
  mr: {
    tagline: 'स्मार्ट कॅनोपी. सुरक्षित पीक.',
    dashboard: 'डॅशबोर्ड',
    myFarms: 'माझी शेतं',
    myPlots: 'माझे प्लॉट्स',
    cropRowManagement: 'पीक व ओळी व्यवस्थापन',
    canopyControl: 'कॅनोपी नियंत्रण',
    weatherAlerts: 'हवामान व गारपीट इशारे',
    sensorMonitoring: 'सेन्सर निरीक्षण',
    activityHistory: 'कामकाज इतिहास',
    maintenance: 'देखभाल व दुरुस्ती',
    analyticsReports: 'अहवाल व विश्लेषण',
    subscriptionPlans: 'योजना व सदस्यत्व',
    settings: 'सेटिंग्ज',
    helpSupport: 'मदत व संपर्क',
    greetingMorning: 'शुभ सकाळ',
    greetingAfternoon: 'शुभ दुपार',
    greetingEvening: 'शुभ संध्याकाळ',
    latestUpdateSub: 'आपल्या शेताची अद्ययावत माहिती येथे आहे.',
    totalFarms: 'एकूण शेतं',
    protectedPlots: 'संरक्षित प्लॉट्स',
    canopyStatus: 'कॅनोपी स्थिती',
    weatherRisk: 'हवामान धोका',
    deployCanopy: 'कॅनोपी लावा',
    retractCanopy: 'कॅनोपी उघडा',
    deployAll: 'सर्व कॅनोपी लावा',
    retractAll: 'सर्व कॅनोपी उघडा',
    emergencyHalt: 'तातडीने थांबवा',
    checkStatus: 'स्थिती तपासा',
    viewAlerts: 'इशारे पहा',
    viewWeather: 'हवामान पहा',
    viewFarm: 'शेत पहा',
    recentActivity: 'अलीकडील हालचाली',
    noData: 'माहिती उपलब्ध नाही',
    low: 'कमी धोका',
    moderate: 'मध्यम',
    high: 'जास्त धोका',
    critical: 'अतिधोकादायक',
    deployed: 'झाकलेले (संरक्षित)',
    retracted: 'उघडे (सूर्यप्रकाश)',
    moving: 'हालचाल सुरू',
    stopped: 'थांबलेले',
    operational: 'सक्रिय',
    windSpeed: 'वाऱ्याचा वेग',
    humidity: 'आर्द्रता',
    rainProbability: 'पावसाची शक्यता',
    hailRisk: 'गारपीट धोका पातळी',
    temperature: 'तापमान',
    acres: 'एकर',
    rows: 'ओळी (तास)',
    grapes: 'द्राक्ष बाग',
    pomegranate: 'डाळिंब बाग',
    tomato: 'टोमॅटो',
    onion: 'कांदा',
    online: 'सक्रिय (ऑनलाईन)',
    offline: 'ऑफलाईन',
  },
  hi: {
    tagline: 'स्मार्ट कैनोपी. सुरक्षित फसल.',
    dashboard: 'डैशबोर्ड',
    myFarms: 'मेरे खेत',
    myPlots: 'मेरे प्लॉट्स',
    cropRowManagement: 'फसल एवं पंक्ति प्रबंधन',
    canopyControl: 'कैनोपी नियंत्रण',
    weatherAlerts: 'मौसम एवं ओलावृष्टि चेतावनी',
    sensorMonitoring: 'सेंसर निगरानी',
    activityHistory: 'गतिविधि इतिहास',
    maintenance: 'रखरखाव एवं सेवा',
    analyticsReports: 'एनालिटिक्स एवं रिपोर्ट',
    subscriptionPlans: 'योजनाएं एवं बिलिंग',
    settings: 'सेटिंग्स',
    helpSupport: 'मदद एवं सहायता',
    greetingMorning: 'शुभ प्रभात',
    greetingAfternoon: 'शुभ दोपहर',
    greetingEvening: 'शुभ संध्या',
    latestUpdateSub: 'आपके खेत की नवीनतम जानकारी यहाँ है।',
    totalFarms: 'कुल खेत',
    protectedPlots: 'सुरक्षित प्लॉट्स',
    canopyStatus: 'कैनोपी स्थिति',
    weatherRisk: 'वर्तमान मौसम जोखिम',
    deployCanopy: 'कैनोपी लगाएं',
    retractCanopy: 'कैनोपी हटाएं',
    deployAll: 'सभी कैनोपी लगाएं',
    retractAll: 'सभी कैनोपी समेटें',
    emergencyHalt: 'आपातकालीन रोक',
    checkStatus: 'स्थिति जांचें',
    viewAlerts: 'अलर्ट देखें',
    viewWeather: 'मौसम देखें',
    viewFarm: 'खेत देखें',
    recentActivity: 'हालिया गतिविधियां',
    noData: 'कोई जानकारी उपलब्ध नहीं',
    low: 'कम',
    moderate: 'मध्यम',
    high: 'उच्च',
    critical: 'अत्यधिक गंभीर',
    deployed: 'सुरक्षित (ढका हुआ)',
    retracted: 'खुला (धूप हेतु)',
    moving: 'गतिमान',
    stopped: 'रुका हुआ',
    operational: 'सक्रिय',
    windSpeed: 'हवा की गति',
    humidity: 'नमी',
    rainProbability: 'बारिश की संभावना',
    hailRisk: 'ओलावृष्टि स्तर',
    temperature: 'तापमान',
    acres: 'एकड़',
    rows: 'पंक्तियाँ',
    grapes: 'अंगूर बाग',
    pomegranate: 'अनार बाग',
    tomato: 'टमाटर',
    onion: 'प्याज',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
  },
};
