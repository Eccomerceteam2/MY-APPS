import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

function EmailVerification({ verificationToken, onVerificationSuccess, onSwitchToLogin }) {
  const [token, setToken] = useState(verificationToken || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (verificationToken) {
      setToken(verificationToken);
    }
  }, [verificationToken]);

  const handleVerify = async () => {
    if (!token.trim()) {
      setMessage('Token verifikasi diperlukan');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
      setMessage(response.data.message);
      setIsSuccess(true);
      setTimeout(() => {
        if (onVerificationSuccess) {
          onVerificationSuccess();
        }
      }, 2000);
    } catch (error) {
      console.error('Verification error:', error);
      setMessage(error.response?.data?.error || 'Verifikasi gagal');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    // In a real app, this would resend the verification email
    setMessage('Fitur kirim ulang email belum diimplementasikan. Gunakan token yang ada.');
    setIsError(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            isSuccess ? 'bg-green-100' : isError ? 'bg-red-100' : 'bg-white'
          }`}>
            {isSuccess ? (
              <FaCheckCircle className="text-green-600 text-3xl" />
            ) : isError ? (
              <FaTimesCircle className="text-red-600 text-3xl" />
            ) : (
              <FaEnvelope className="text-primary-600 text-3xl" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">FATracker</h1>
          <p className="text-primary-100">Verifikasi Email</p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Verifikasi Email Anda
          </h2>

          <p className="text-gray-600 mb-6 text-center">
            Masukkan token verifikasi yang dikirim ke email Anda untuk mengaktifkan akun.
          </p>

          {message && (
            <div className={`px-4 py-3 rounded-lg mb-4 ${
              isSuccess
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {!isSuccess && (
            <>
              <div className="mb-6">
                <label className="label">
                  Token Verifikasi
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="input"
                  placeholder="Masukkan token verifikasi"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Token dapat ditemukan di console browser atau email (dalam implementasi penuh)
                </p>
              </div>

              <button
                onClick={handleVerify}
                className="btn btn-primary w-full btn-lg mb-4"
                disabled={loading}
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi Email'}
              </button>

              <button
                onClick={handleResendVerification}
                className="btn btn-outline w-full"
              >
                Kirim Ulang Email Verifikasi
              </button>
            </>
          )}

          {isSuccess && (
            <div className="text-center">
              <p className="text-green-600 font-semibold mb-4">
                Email berhasil diverifikasi! Anda akan diarahkan ke halaman login...
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Kembali ke Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-primary-100 mt-6 text-sm">
          © 2025 BY DANIL,ARA,ARUM,FEBI,RAFI.
        </p>
      </div>
    </div>
  );
}

export default EmailVerification;
