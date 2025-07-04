'use client'

import { useState, useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export default function CookiePreferences() {
  const [currentConsent, setCurrentConsent] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    setCurrentConsent(consent)
  }, [])

  const updateConsentMode = (hasConsent: boolean) => {
    if (typeof window !== 'undefined' && window.gtag) {
      if (hasConsent) {
        // Update consent to granted
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          personalization_storage: 'granted'
        })
        
        // Send consent granted event
        window.gtag('event', 'consent_updated', {
          event_category: 'engagement',
          event_label: 'cookie_preferences_accepted'
        })
      } else {
        // Update consent to denied (conversion modeling will still work)
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied', 
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          personalization_storage: 'denied'
        })
        
        // Send consent denied event  
        window.gtag('event', 'consent_updated', {
          event_category: 'engagement',
          event_label: 'cookie_preferences_rejected'
        })
      }
    }
  }

  const updateConsent = (newConsent: string) => {
    localStorage.setItem('cookie-consent', newConsent)
    setCurrentConsent(newConsent)
    setShowSuccess(true)
    
    // Update Google Consent Mode
    updateConsentMode(newConsent === 'accepted')
    
    // Show success message briefly
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🍪 Cookie Preferences</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Current Setting</h4>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentConsent === 'accepted' 
                ? 'bg-green-100 text-green-800' 
                : currentConsent === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {currentConsent === 'accepted' ? '✅ Analytics Cookies Enabled' : 
               currentConsent === 'rejected' ? '❌ Analytics Cookies Disabled' : 
               '⚪ No Preference Set'}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Cookie Categories</h4>
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900">Essential Cookies</h5>
                  <p className="text-sm text-gray-600">Required for basic website functionality</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                  Always Active
                </span>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900">Analytics & Consent Mode</h5>
                  <p className="text-sm text-gray-600">Google Analytics with Consent Mode for conversion modeling and personalized ads</p>
                  <p className="text-xs text-gray-500 mt-1">Google Analytics ({GA_ID || 'G-XXXXXXX'}) + Consent Mode v2</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  currentConsent === 'accepted' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {currentConsent === 'accepted' ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            onClick={() => updateConsent('accepted')}
            disabled={currentConsent === 'accepted'}
            className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
              currentConsent === 'accepted'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Accept Analytics
          </button>
          <button
            onClick={() => updateConsent('rejected')}
            disabled={currentConsent === 'rejected'}
            className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
              currentConsent === 'rejected'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Reject Analytics
          </button>
        </div>

        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            ✅ Cookie preferences updated! Google Consent Mode has been notified of your choice.
          </div>
        )}
      </div>
    </div>
  )
} 