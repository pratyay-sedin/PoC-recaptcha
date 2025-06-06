'use client';

import { useState, useEffect } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const SITE_KEY = '6LfccVcrAAAAAIMP2iIK3uYkX8j8h5yn1kYNczlV';

  useEffect(() => {
    // Load reCAPTCHA script
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
          console.log('reCAPTCHA v3 is ready');
          setRecaptchaLoaded(true);
          // Execute on page load for initial assessment
          window.grecaptcha
            .execute(SITE_KEY, { action: 'page_load' })
            .then((token) => {
              console.log('Page load reCAPTCHA token generated');
            });
        });
      };
      document.head.appendChild(script);
    };

    loadRecaptcha();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha || !recaptchaLoaded) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(SITE_KEY, { action: 'contact_form' })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  const submitFormToServer = async (recaptchaToken) => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('company', formData.company);
    console.log(recaptchaToken);
    formDataToSend.append('g-recaptcha-response', recaptchaToken);

    try {
      const response = await fetch('https://eager-sensibly-raven.ngrok-free.app/api/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.text();
        console.log('Server response:', data);
        setMessage({
          type: 'success',
          text: 'Form submitted successfully! reCAPTCHA verification passed.',
        });
        setFormData({ name: '', email: '', company: '' });
      } else {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      if (error.message.includes('403')) {
        setMessage({
          type: 'error',
          text: 'reCAPTCHA verification failed. Please try again.',
        });
      } else {
        setMessage({
          type: 'error',
          text: `Form submission failed: ${error.message}`,
        });
      }
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
      console.error('reCAPTCHA error:', error);
      setMessage({
        type: 'error',
        text: 'reCAPTCHA verification failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          <h2 className='text-3xl font-bold text-center text-gray-800 mb-8'>
            Enquiry Form
          </h2>
          {/* Success/Error Messages */}
          {message.text && (
            <div
              className={`p-4 rounded-lg mb-6 border-l-4 ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-400 text-green-700'
                  : 'bg-red-50 border-red-400 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={isLoading ? 'opacity-70 pointer-events-none' : ''}
          >
            <div className='mb-6'>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Name:
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg text-gray-900'
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Email:
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg text-gray-900'
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='company'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Company:
              </label>
              <input
                type='text'
                id='company'
                name='company'
                value={formData.company}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg text-gray-900'
              />
            </div>
            <button
              type='submit'
              disabled={isLoading || !recaptchaLoaded}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-lg'
            >
              {isLoading ? 'Processing...' : 'Send Message'}
            </button>
            ß
          </form>
        </div>
      </div>
    </div>
  );
}
