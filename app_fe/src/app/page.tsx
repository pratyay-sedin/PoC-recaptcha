'use client';

import { useState, useEffect } from 'react';
import * as dotenv from 'dotenv';

dotenv.config();

const SITE_URL = process.env.NEXT_PUBLIC_SITE_API || '';
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || '';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        setRecaptchaLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.grecaptcha.ready(() => {
          setRecaptchaLoaded(true);
          window.grecaptcha.execute(SITE_KEY, { action: 'page_load' }).then(() => {});
        });
      };
      document.head.appendChild(script);
    };

    loadRecaptcha();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha || !recaptchaLoaded) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(SITE_KEY, { action: 'contact_form' }).then(resolve).catch(reject);
      });
    });
  };

  const submitFormToServer = async (recaptchaToken) => {
    const payload = {
      'Name': formData.name,
      'Business email': formData.email,
      'Company name': formData.company,
      'recaptcha_token': recaptchaToken,
    };

    try {
      const response = await fetch(SITE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.text();
        console.log('Server response:', data);
        setMessage({ type: 'success', text: 'Thanks! Your message has been sent.' });
        setFormData({ name: '', email: '', company: '' });
      } else {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message.includes('403')
          ? 'reCAPTCHA verification failed. Try again.'
          : `Submission failed: ${error.message}`,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const recaptchaToken = await executeRecaptcha();
      await submitFormToServer(recaptchaToken);
    } catch (error) {
      setMessage({ type: 'error', text: 'reCAPTCHA verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Get in Touch
        </h2>

        {message.text && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg border-l-4 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'bg-red-50 border-red-500 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`${isLoading ? 'opacity-70 pointer-events-none' : ''} space-y-6`}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              id="company"
              required
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !recaptchaLoaded}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 text-lg"
          >
            {isLoading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
