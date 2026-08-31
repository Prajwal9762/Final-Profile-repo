import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Globe, Github, MessageSquare, CheckCircle, Flame, Users, Sparkles, Mail, MapPin } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { soundFx } from '../utils/audio';
import { FirebaseCommunity } from './FirebaseCommunity';
import { BRAND_EMAIL, BRAND_GITHUB, BRAND_LOCATION, BRAND_NAME, BRAND_WEBSITE } from '../utils/brand';

export const ContactSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inquiry' | 'guestbook'>('inquiry');
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.message) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      await setDoc(doc(db, 'inquiries', inquiryId), {
        name: formState.name.trim().slice(0, 100),
        email: formState.email.trim().slice(0, 150) || 'anonymous@visitor.com',
        subject: formState.subject.trim().slice(0, 150) || 'Direct Portfolio Inquiry',
        message: formState.message.trim().slice(0, 2000),
        createdAt: new Date().toISOString(),
      });

      soundFx.playSuccess();
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setFormState({ name: '', email: '', subject: '', message: '' });
      }, 4000);
    } catch (err: any) {
      console.error('Error submitting inquiry to Firestore:', err);
      setErrorMsg('Failed to transmit message to cloud database. Please try again.');
      try {
        handleFirestoreError(err, OperationType.CREATE, `inquiries/${inquiryId}`);
      } catch (e) {
        // logged via handleFirestoreError
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-slate-950/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Section Heading */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-mono text-amber-300 mb-3">
            <Mail className="h-3.5 w-3.5 text-amber-400" />
            <span>06 // DIRECT TRANSMISSION & CONTACT</span>
          </div>

          <h2 className="font-syne text-4xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight">
            LET'S CONNECT.
          </h2>

          <p className="mt-3 font-syne text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">
            {BRAND_NAME} • {BRAND_LOCATION}
          </p>
        </div>

        {/* Contact Badges */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
          <a
            href={`mailto:${BRAND_EMAIL}`}
            className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-slate-900/90 px-4 py-2.5 font-mono text-xs text-amber-300 hover:bg-amber-500/20 transition-all shadow-lg"
          >
            <Mail className="h-4 w-4 text-amber-400" />
            <span>{BRAND_EMAIL}</span>
          </a>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 font-mono text-xs text-slate-300">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span>{BRAND_LOCATION}</span>
          </div>

          <a
            href={BRAND_GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 font-mono text-xs text-slate-300 hover:text-white transition-all"
          >
            <Github className="h-4 w-4 text-cyan-400" />
            <span>@prajwal9762</span>
          </a>
        </div>

        {/* Tab Switcher: Direct Transmission vs. Live Firebase Guestbook */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-2xl border border-slate-800 bg-slate-950/90 p-1.5 font-mono text-xs shadow-xl">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('inquiry');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'inquiry'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>DIRECT MESSAGE</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('guestbook');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'guestbook'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>LIVE COMMUNITY BOARD</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="text-left">
          {activeTab === 'guestbook' ? (
            <FirebaseCommunity />
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              {isSent ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="font-syne text-2xl font-bold text-white mb-2">Message Dispatched!</h3>
                  <p className="font-mono text-sm text-slate-400 max-w-md mx-auto">
                    Your message has been securely recorded to Prajwal's Firestore queue. He will respond to your email soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-xs text-rose-300">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-slate-400 mb-1">Your Name *</label>
                      <input
                        required
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Alex Rivers"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-white outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-slate-400 mb-1">Your Email</label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="alex@example.com"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-white outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">Subject / Inquiry Type</label>
                    <input
                      type="text"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder="Tech collaboration / Academic study / Web project"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-white outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Hey Prajwal! Loved checking out your ultra-animated BSc CSIT portfolio and lab demos..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-white outline-none focus:border-amber-400 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-cursor="TRANSMIT"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-3.5 font-mono text-xs font-bold text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? 'TRANSMITTING TO CLOUD...' : 'TRANSMIT TO PRAJWAL VIA FIRESTORE'}</span>
                  </button>
                </form>
              )}

              {/* Official Channel Links */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
                <a
                  href={BRAND_WEBSITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <Globe className="h-4 w-4 text-amber-400" />
                  <span>prajwal-pokharel.com.np</span>
                </a>

                <span>•</span>

                <a
                  href={BRAND_GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <Github className="h-4 w-4 text-amber-400" />
                  <span>GitHub @prajwal9762</span>
                </a>

                <span>•</span>

                <a
                  href={`mailto:${BRAND_EMAIL}`}
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <Mail className="h-4 w-4 text-amber-400" />
                  <span>{BRAND_EMAIL}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
