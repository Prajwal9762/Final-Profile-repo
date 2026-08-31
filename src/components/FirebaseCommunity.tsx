import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogIn,
  LogOut,
  Send,
  Sparkles,
  MessageSquare,
  Heart,
  CheckCircle,
  ShieldCheck,
  User,
  Flame,
  Award,
} from 'lucide-react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  setDoc,
  doc,
} from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  db,
  auth,
  loginWithGoogle,
  logoutUser,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { soundFx } from '../utils/audio';

export interface GuestbookItem {
  id: string;
  userId: string;
  authorName: string;
  authorEmail?: string;
  authorPhoto?: string;
  message: string;
  category: 'general' | 'collaboration' | 'hiring' | 'shoutout';
  createdAt: string;
}

export const FirebaseCommunity: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [entries, setEntries] = useState<GuestbookItem[]>([]);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'general' | 'collaboration' | 'hiring' | 'shoutout'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Guestbook listener
  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(30));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: GuestbookItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetched.push({
            id: docSnap.id,
            userId: data.userId || '',
            authorName: data.authorName || 'Anonymous',
            authorEmail: data.authorEmail,
            authorPhoto: data.authorPhoto,
            message: data.message || '',
            category: data.category || 'general',
            createdAt: data.createdAt || '',
          });
        });
        setEntries(fetched);
      },
      (error) => {
        console.error('Failed to subscribe to guestbook:', error);
        handleFirestoreError(error, OperationType.LIST, 'guestbook');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    soundFx.playClick();
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      soundFx.playSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Google Sign-In failed');
    }
  };

  const handleSignOut = async () => {
    soundFx.playClick();
    try {
      await logoutUser();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    const entryId = `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const payload = {
      userId: currentUser.uid,
      authorName: currentUser.displayName || 'Visitor',
      authorEmail: currentUser.email || '',
      authorPhoto: currentUser.photoURL || '',
      message: message.trim().slice(0, 500),
      category,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'guestbook', entryId), payload);
      soundFx.playSuccess();
      setMessage('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error adding guestbook entry:', err);
      handleFirestoreError(err, OperationType.CREATE, `guestbook/${entryId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryLabels = {
    general: { label: 'General Note', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    collaboration: { label: 'Collab / Project', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    hiring: { label: 'Hiring / Opportunity', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    shoutout: { label: 'Endorsement / Kudos', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  };

  return (
    <div className="rounded-3xl border border-cyan-500/25 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header & Auth Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
              Firebase Live Cloud Sync
            </span>
          </div>
          <h3 className="font-syne text-xl sm:text-2xl font-bold text-white mt-1">
            Community Guestbook & Endorsements
          </h3>
        </div>

        {/* User Auth Controls */}
        <div>
          {authLoading ? (
            <div className="font-mono text-xs text-slate-500">Checking auth...</div>
          ) : currentUser ? (
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 pr-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Avatar'}
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full border border-cyan-500/40"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="text-left font-mono">
                <div className="text-xs font-bold text-white truncate max-w-[130px]">
                  {currentUser.displayName || 'Developer'}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Signed In
                </div>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1.5 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg text-slate-400 transition-colors ml-1"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              data-cursor="SIGN IN"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-xs">
          {errorMsg}
        </div>
      )}

      {/* New Message Input (When Logged In) or Sign In Prompt */}
      <div className="mt-6 mb-8">
        {currentUser ? (
          <form onSubmit={handleSubmitEntry} className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(['general', 'collaboration', 'hiring', 'shoutout'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold border transition-all ${
                    category === cat
                      ? categoryLabels[cat].color + ' shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {categoryLabels[cat].label}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                rows={2}
                placeholder={`Leave an endorsement, shoutout, or note for Prajwal...`}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 pr-28 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 font-sans resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="absolute right-2.5 bottom-3.5 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-mono text-xs font-bold disabled:opacity-40 hover:brightness-110 transition-all shadow-md"
              >
                {isSubmitting ? (
                  <span>Posting...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>POST</span>
                  </>
                )}
              </button>
            </div>

            {submitSuccess && (
              <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Endorsement posted to live Firebase Firestore!</span>
              </div>
            )}
          </form>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-center">
            <p className="text-slate-300 font-sans text-xs sm:text-sm">
              ✨ Sign in with your Google account to post an endorsement or note on Prajwal's live guestbook.
            </p>
          </div>
        )}
      </div>

      {/* Live Entries List */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <div className="py-8 text-center font-mono text-xs text-slate-500">
            No guestbook notes yet. Be the first to leave one!
          </div>
        ) : (
          entries.map((entry) => {
            const catInfo = categoryLabels[entry.category] || categoryLabels.general;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 text-left font-sans text-xs transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    {entry.authorPhoto ? (
                      <img
                        src={entry.authorPhoto}
                        alt={entry.authorName}
                        referrerPolicy="no-referrer"
                        className="h-6 w-6 rounded-full border border-slate-700 object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 font-mono text-[10px] font-bold">
                        {entry.authorName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold text-white font-mono">{entry.authorName}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] border ${catInfo.color}`}>
                    {catInfo.label}
                  </span>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed pl-8">
                  {entry.message}
                </p>

                {entry.createdAt && (
                  <div className="mt-2 text-right font-mono text-[10px] text-slate-500">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
