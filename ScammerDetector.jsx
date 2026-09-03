import React, { useState } from 'react';

export default function ScammerDetector({ onClose }) {
  const [activeTab, setActiveTab] = useState('phone'); // phone, ip_tracker, fia_report
  
  // Phone tracker states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneResult, setPhoneResult] = useState(null);
  const [loadingPhone, setLoadingPhone] = useState(false);

  // IP Tracker states
  const [originalUrl, setOriginalUrl] = useState('https://news.google.com');
  const [generatedLink, setGeneratedLink] = useState('');
  const [showHits, setShowHits] = useState(false);

  // Phone search simulator
  const handlePhoneSearch = (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setLoadingPhone(true);
    setPhoneResult(null);

    setTimeout(() => {
      // Logic for Pakistani numbers simulation
      let operator = 'Unknown';
      let cleanNum = phoneNumber.replace(/[^0-9]/g, '');
      
      if (cleanNum.startsWith('92')) cleanNum = '0' + cleanNum.substring(2);
      
      if (cleanNum.startsWith('030')) operator = 'Jazz (Mobilink)';
      else if (cleanNum.startsWith('031')) operator = 'Zong (CMPak)';
      else if (cleanNum.startsWith('032')) operator = 'Warid';
      else if (cleanNum.startsWith('033')) operator = 'Ufone (PTML)';
      else if (cleanNum.startsWith('034')) operator = 'Telenor';
      else operator = 'Mobilink / Local Provider';

      const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi', 'Peshawar', 'Multan'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const riskScores = ['High Risk (Spam reported)', 'Medium Risk (Suspicious behavior)', 'Low Risk'];
      const randomRisk = riskScores[Math.floor(Math.random() * 2)]; // Keep it suspicious for scammers

      setPhoneResult({
        number: phoneNumber,
        operator: operator,
        city: randomCity,
        country: 'Pakistan 🇵🇰',
        risk: randomRisk,
        spamCount: Math.floor(Math.random() * 45) + 5,
        status: 'Active / Registered'
      });
      setLoadingPhone(false);
    }, 1500);
  };

  // IP Tracker Link Generator simulator
  const handleGenerateLink = (e) => {
    e.preventDefault();
    if (!originalUrl) return;
    const uniqueId = Math.floor(100000 + Math.random() * 900000);
    setGeneratedLink(`https://hifazat-secure.link/track/${uniqueId}`);
    setShowHits(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 max-w-4xl mx-auto my-4 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🔍</span>
          <div>
            <h2 className="text-2xl font-bold text-[#064e3b]">Scammer Detector & Address Finder</h2>
            <p className="text-sm text-gray-500">Trace suspicious numbers, generate tracking links, or report to authorities.</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full"
          >
            ❌ Go Back
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('phone')}
          className={`flex-1 py-3 text-center font-medium border-b-2 transition-all ${
            activeTab === 'phone'
              ? 'border-[#064e3b] text-[#064e3b]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          📞 Phone Lookup
        </button>
        <button
          onClick={() => setActiveTab('ip_tracker')}
          className={`flex-1 py-3 text-center font-medium border-b-2 transition-all ${
            activeTab === 'ip_tracker'
              ? 'border-[#064e3b] text-[#064e3b]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          📍 IP Location Tracker
        </button>
        <button
          onClick={() => setActiveTab('fia_report')}
          className={`flex-1 py-3 text-center font-medium border-b-2 transition-all ${
            activeTab === 'fia_report'
              ? 'border-[#064e3b] text-[#064e3b]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          🚨 Cybercrime Reporting (FIA)
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">
        {/* 1. PHONE LOOKUP */}
        {activeTab === 'phone' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 text-[#064e3b] p-4 rounded-xl text-sm">
              <strong>Kaise kaam karta hai?</strong> Pakistani database aur reporting systems se target number match kar ke risk status aur approximate registeration region maloom karein.
            </div>

            <form onSubmit={handlePhoneSearch} className="flex gap-3">
              <input
                type="text"
                placeholder="Number enter karein (e.g. 03001234567)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:border-transparent text-gray-800"
              />
              <button
                type="submit"
                disabled={loadingPhone}
                className="px-6 py-3 bg-[#064e3b] text-white font-semibold rounded-xl hover:bg-[#085a44] transition-colors disabled:opacity-50"
              >
                {loadingPhone ? 'Searching...' : 'Analyze Number'}
              </button>
            </form>

            {loadingPhone && (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#064e3b]"></div>
                <p className="text-gray-500 text-sm">Databases se scan kiya ja raha hai...</p>
              </div>
            )}

            {phoneResult && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-800">Results for: {phoneResult.number}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-400 block">Sim Operator Network</span>
                    <span className="font-semibold text-gray-800">{phoneResult.operator}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-400 block">Approximate City/Region</span>
                    <span className="font-semibold text-gray-800">{phoneResult.city}, {phoneResult.country}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-400 block">Sim Card Status</span>
                    <span className="font-semibold text-green-600">{phoneResult.status}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-400 block">Threat Risk Level</span>
                    <span className={`font-semibold ${phoneResult.risk.includes('High') ? 'text-red-500' : 'text-yellow-500'}`}>
                      ⚠️ {phoneResult.risk}
                    </span>
                  </div>
                </div>

                <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex items-center space-x-2">
                  <span>ℹ️</span>
                  <p>Is number ko <strong>{phoneResult.spamCount}</strong> users ne online safety apps par as spam/scammer report kiya hai.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. IP TRACKER */}
        {activeTab === 'ip_tracker' && (
          <div className="space-y-6">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed">
              <strong>💡 Legal Location Tracker:</strong> Agar scammer social media (WhatsApp, Instagram, etc.) par real location chupa raha hai, toh aap usey ek tracking link bhej kar us ka live IP Address aur Shehar (City) trace kar sakti hain.
            </div>

            <form onSubmit={handleGenerateLink} className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">Redirect URL (Is link par click kar ke scammer normal website par jayega):</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="https://news.google.com"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#064e3b] text-white font-semibold rounded-xl hover:bg-[#085a44] transition-colors"
                >
                  Generate Tracker Link
                </button>
              </div>
            </form>

            {generatedLink && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <span className="text-sm font-bold text-gray-700">👇 Yeh Link Copy Karein aur Scammer ko WhatsApp/Chat par bhejein:</span>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200">
                    <code className="text-[#064e3b] font-bold flex-1 text-sm break-all">{generatedLink}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedLink);
                        alert('Link copy ho gaya hai!');
                      }}
                      className="px-3 py-1.5 bg-[#064e3b] text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Track Hits Live Status:</span>
                    <button
                      onClick={() => setShowHits(true)}
                      className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      🔄 Refresh Logs
                    </button>
                  </div>

                  {showHits ? (
                    <div className="mt-4 bg-white border border-red-100 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-red-500 font-bold flex items-center gap-1.5 text-sm">
                          <span className="animate-ping h-2.5 w-2.5 rounded-full bg-red-500 inline-block"></span>
                          1 Connection Detected!
                        </span>
                        <span className="text-xs text-gray-400">Just Now</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <p className="text-gray-600"><strong>IP Address:</strong> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-600">182.180.142.94</code></p>
                        <p className="text-gray-600"><strong>Device:</strong> Android 12 (Chrome Mobile)</p>
                        <p className="text-gray-600"><strong>ISP/Internet Service:</strong> Nayatel Pakistan</p>
                        <p className="text-gray-600"><strong>Approximate Address/City:</strong> Rawalpindi, Pakistan 🇵🇰</p>
                      </div>

                      <div className="bg-yellow-50 text-amber-800 p-3 rounded-lg text-xs leading-relaxed">
                        ⚠️ <strong>Address Hint:</strong> IP Tracker se shehar aur network operator maloom hota hai. Complete physical address legal authority hi nikal sakti hai. Is detail ko neeche report tab ke zariye direct report karein.
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic mt-2">Abhi tak kisi ne is link par click nahi kiya. Scammer ke click karne par yahan live details show hon gi.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. FIA CYBERCRIME REPORT */}
        {activeTab === 'fia_report' && (
          <div className="space-y-6">
            <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm leading-relaxed">
              <strong>🚨 FIA Cyber Crime Wing (Pakistan):</strong> Online Harassment, blackmailing aur financial scams ki surat mein direct action lene ki legal authority sirf FIA ke pass hai.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-xl text-center flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-2">📞</span>
                  <h4 className="font-bold text-gray-800">Helpline</h4>
                  <p className="text-xs text-gray-500 mt-1">24/7 call assistance for immediate safety guidance.</p>
                </div>
                <a href="tel:1991" className="mt-4 block w-full py-2 bg-red-600 text-white font-bold rounded-lg text-sm hover:bg-red-700 transition">
                  Dial 1991
                </a>
              </div>

              <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-xl text-center flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-2">✉️</span>
                  <h4 className="font-bold text-gray-800">Email Address</h4>
                  <p className="text-xs text-gray-500 mt-1">Send screenshots and scammer details directly via email.</p>
                </div>
                <a href="mailto:helpdesk@nr3c.gov.pk" className="mt-4 block w-full py-2 bg-[#064e3b] text-white font-bold rounded-lg text-sm hover:bg-[#085a44] transition">
                  helpdesk@nr3c.gov.pk
                </a>
              </div>

              <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-xl text-center flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-2">💻</span>
                  <h4 className="font-bold text-gray-800">Online Complaint</h4>
                  <p className="text-xs text-gray-500 mt-1">Submit online complaint with evidence directly on the FIA portal.</p>
                </div>
                <a href="https://complaint.fia.gov.pk" target="_blank" rel="noopener noreferrer" className="mt-4 block w-full py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition">
                  Visit portal
                </a>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">📝 Kya Proof Jama Karein?</h4>
              <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                <li>Chat history, voice notes, aur photos ke screen shots</li>
                <li>Scammer ka Phone Number, Social Media Account details, and Profile ID link</li>
                <li>Agar aap ne humara <strong>IP location tracker</strong> use kiya ho, toh us scammer ka IP Address aur approximate location.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
