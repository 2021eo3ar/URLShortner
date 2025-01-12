import React, { useState, useEffect } from 'react';
import { LinkIcon, QrCode, Share2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createShortURL, resetURLState } from '../redux/urlSlice';
import QRCode from 'qrcode';

const ShortnerForm = () => {
  const [formData, setFormData] = useState({
    customAlias: '',
    topic: '',
    longUrl: '',
  });
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const dispatch = useDispatch();
  const { shortURL, loading, error } = useSelector((state) => state.url);

  useEffect(() => {
    if (shortURL?.shortUrl) {
      generateQRCode(shortURL.shortUrl);
    }
  }, [shortURL]);

  const generateQRCode = async (url) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url);
      setQrCode(qrDataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createShortURL(formData));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortURL.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (platform) => {
    const url = shortURL.shortUrl;
    const text = 'Check out this link:';
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank');
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-6 border border-green-500/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customAlias" className="block text-sm font-medium text-gray-300 mb-1">
            Custom Alias (Optional)
          </label>
          <input
            id="customAlias"
            type="text"
            value={formData.customAlias}
            onChange={(e) => setFormData({ ...formData, customAlias: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-black border border-gray-800 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            placeholder="Enter custom alias"
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-1">
            Topic
          </label>
          <input
            id="topic"
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-black border border-gray-800 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            placeholder="Enter topic"
            required
          />
        </div>

        <div>
          <label htmlFor="longUrl" className="block text-sm font-medium text-gray-300 mb-1">
            Long URL
          </label>
          <input
            id="longUrl"
            type="url"
            value={formData.longUrl}
            onChange={(e) => setFormData({ ...formData, longUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-black border border-gray-800 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            placeholder="Enter your long URL"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-md transition-colors flex items-center justify-center gap-2"
          disabled={loading}
        >
          <LinkIcon className="h-4 w-4" />
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-500 text-white rounded-md">
          <p>Error: {error}</p>
        </div>
      )}

      {shortURL && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-black rounded-md border border-green-500">
            <p className="text-sm text-gray-400 mb-1">Your shortened URL:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shortURL.shortUrl}
                readOnly
                className="flex-1 px-3 py-2 rounded bg-gray-900 text-green-500 font-medium"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gray-900 text-gray-300 rounded hover:text-green-500 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              Show QR Code
            </button>
            <button
              onClick={() => setShowShare(true)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          {/* QR Code Modal */}
          {showQR && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full relative">
                <button
                  onClick={() => setShowQR(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
                <h3 className="text-white font-semibold mb-4">QR Code</h3>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <img src={qrCode} alt="QR Code" className="w-full" />
                </div>
                <button
                  onClick={downloadQR}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-md"
                >
                  Download QR Code
                </button>
              </div>
            </div>
          )}

          {/* Share Modal */}
          {showShare && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full relative">
                <button
                  onClick={() => setShowShare(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
                <h3 className="text-white font-semibold mb-4">Share via</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="bg-[#25D366] hover:bg-opacity-90 text-white px-4 py-2 rounded-md"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="bg-[#1877F2] hover:bg-opacity-90 text-white px-4 py-2 rounded-md"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="bg-[#1DA1F2] hover:bg-opacity-90 text-white px-4 py-2 rounded-md"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="bg-[#0A66C2] hover:bg-opacity-90 text-white px-4 py-2 rounded-md"
                  >
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShortnerForm;