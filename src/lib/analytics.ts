import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://cxemktcyndsbvniibgad.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZW1rdGN5bmRzYnZuaWliZ2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NDY2NzUsImV4cCI6MjA2MDQyMjY3NX0.JjfAtG4I19sqb7BerZbMRiC6qVbc9PMrzvmHNN5I3XQ');

interface UserInfo {
  userAgent: string;
  referrer: string;
}

const getVisitorIp = async (): Promise<string> => {
  try {
    const response = await axios.get<{ ip: string }>('https://api.ipify.org?format=json'); 
    return response.data.ip; 
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'unknown'; 
  }
};

const getUserInfo = (): UserInfo => {
  return {
    userAgent: navigator.userAgent, 
    referrer: document.referrer || 'unknown',
  };
};

const sendAnalyticsData = async (ip: string, userAgent: string, referrer: string): Promise<void> => {
   
    // const language = navigator.language;
    // const screenSize = `${window.screen.width}x${window.screen.height}`;
    // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log('navigator',navigator) 
    
    
    // await supabase
    // .from('visitors')
    // .insert([
    //   {
    //     ip_address: ip,
    //     user_agent: userAgent,
    //     referrer: referrer,
    //     timestamp: new Date().toISOString(),
    //   },
    // ]);

    await supabase
    .from('visitors')
    .upsert([ 
      {
        ip_address: ip,
        user_agent: userAgent,
        referrer: referrer,
        timestamp: new Date().toISOString(),
        visits: 1, 
      },
    ], { onConflict: 'ip_address' });


//   if (error) {
//     console.error('Error sending data to Supabase:', error);
//   } else {
//     console.log('Analytics data sent successfully:', data);
//   }
};

export const trackAnalytics = async (): Promise<void> => {
  const ip = await getVisitorIp(); 
  const { userAgent, referrer } = getUserInfo(); 
  await sendAnalyticsData(ip, userAgent, referrer); 
};

// appCodeName: "Mozilla"
// appName: "Netscape"
// appVersion: "5.0 (Macintosh)"
// buildID: "20181001000000"
// clipboard: Clipboard {  }
// cookieEnabled: true
// credentials: CredentialsContainer {  }
// doNotTrack: "unspecified"
// geolocation: Geolocation {  }
// globalPrivacyControl: false
// hardwareConcurrency: 8
// language: "en-US"
// languages: Array [ "en-US", "en" ]
// locks: LockManager {  }
// maxTouchPoints: 0
// mediaCapabilities: MediaCapabilities {  }
// mediaDevices: MediaDevices { ondevicechange: null }
// mediaSession: MediaSession { metadata: null, playbackState: "none" }
// mimeTypes: MimeTypeArray { 0: MimeType, 1: MimeType, length: 2, … }
// onLine: true
// oscpu: "Intel Mac OS X 10.15"
// pdfViewerEnabled: true
// permissions: Permissions {  }
// platform: "MacIntel"
// plugins: PluginArray { 0: Plugin, 1: Plugin, length: 5, … }
// product: "Gecko"
// productSub: "20100101"
// serviceWorker: ServiceWorkerContainer { controller: null, ready: Promise { "pending" }, oncontrollerchange: null, … }
// storage: StorageManager {  }
// userActivation: UserActivation { hasBeenActive: false, isActive: false }
// userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0"
// vendor: ""
// vendorSub: ""
// wakeLock: WakeLock {  }
// webdriver: false

