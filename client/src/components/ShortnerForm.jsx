import React, { useState } from 'react';
import { LinkIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createShortURL, resetURLState } from '../redux/urlSlice';

const ShortnerForm = () => {
  const [formData, setFormData] = useState({
    alias: '',
    topic: '',
    longUrl: ''
  });

  const dispatch = useDispatch();
  const { shortURL, loading, error } = useSelector((state) => state.url);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createShortURL(formData));
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-6 border border-green-500/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="alias" className="block text-sm font-medium text-gray-300 mb-1">
            Custom Alias (Optional)
          </label>
          <input
            id="alias"
            type="text"
            value={formData.alias}
            onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
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
        <div className="mt-6 p-4 bg-black rounded-md border border-green-500">
          <p className="text-sm text-gray-400 mb-1">Your shortened URL:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shortURL.shortUrl}
              readOnly
              className="flex-1 px-3 py-2 rounded bg-gray-900 text-green-500 font-medium"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shortURL.shortUrl)}
              className="px-4 py-2 bg-gray-900 text-gray-300 rounded hover:text-green-500 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortnerForm;
