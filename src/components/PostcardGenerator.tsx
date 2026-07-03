/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { POSTCARDS } from '../data/okpoamaData';
import { PostcardTemplate } from '../types';
import { Mail, Edit3, Image as ImageIcon, RefreshCw, Send, Check } from 'lucide-react';

export const PostcardGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<PostcardTemplate>(POSTCARDS[0]);
  const [cardMessage, setCardMessage] = useState('Having an incredible time discovering the ancient Okpoama Kingdom! The beach and the mangroves are majestic.');
  const [recipientName, setRecipientName] = useState('Sarah Kpe');
  const [selectedStamp, setSelectedStamp] = useState<'ruler' | 'masquerade' | 'fish'>('masquerade');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const stamps = {
    ruler: { name: 'Amanyanabo XXI', icon: '👑', price: '₦150' },
    masquerade: { name: 'Egbelegbe Oru', icon: '🎭', price: '₦200' },
    fish: { name: 'Atlantic Barracuda', icon: '🐟', price: '₦100' }
  };

  const handleSendCard = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Control panel: Left */}
      <div className="lg:col-span-4 space-y-6">
        <div>
          <span className="font-mono text-3xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
            Interactive Souvenir
          </span>
          <h3 className="font-display text-lg font-bold text-stone-900 tracking-tight">
            Virtual Postcard Studio
          </h3>
          <p className="font-sans text-xs text-stone-500 leading-relaxed mt-1">
            Design a custom, double-sided vintage postcard to document your virtual exploration of Okpoama Kingdom.
          </p>
        </div>

        {/* Template Selector */}
        <div className="space-y-2">
          <label className="font-sans text-2xs font-bold text-stone-600 uppercase tracking-wider block mb-1.5">
            1. Select Front Backdrop
          </label>
          <div className="space-y-2">
            {POSTCARDS.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                  selectedTemplate.id === tpl.id
                    ? 'bg-amber-5 border-amber-300 text-amber-950 shadow-xs'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                }`}
                id={`postcard-tpl-${tpl.id}`}
              >
                <div className="w-12 h-10 rounded overflow-hidden shrink-0 bg-stone-100">
                  <img src={tpl.imageUrl} alt={tpl.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-display font-bold text-xs block">{tpl.name}</span>
                  <span className="font-sans text-3xs text-stone-500 block truncate max-w-[180px]">{tpl.cardTitle}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stamp Selector */}
        <div className="space-y-2">
          <label className="font-sans text-2xs font-bold text-stone-600 uppercase tracking-wider block mb-1.5">
            2. Choose Postal Stamp
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(stamps) as Array<keyof typeof stamps>).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedStamp(key)}
                className={`p-2 rounded-xl border text-center flex flex-col items-center justify-between gap-1.5 transition-all duration-200 cursor-pointer ${
                  selectedStamp === key
                    ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
                }`}
                id={`postcard-stamp-${key}`}
              >
                <span className="text-xl">{stamps[key].icon}</span>
                <span className="font-sans text-4xs font-bold uppercase tracking-tight block">
                  {stamps[key].price}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="space-y-3">
          <label className="font-sans text-2xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
            3. Personalize Greeting
          </label>
          
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Recipient's Name (e.g. Sarah Kpe)"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-white border border-stone-200 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs font-sans text-stone-800 outline-none transition-all duration-200"
              id="postcard-input-recipient"
            />
            <textarea
              placeholder="Write your custom greeting..."
              value={cardMessage}
              maxLength={180}
              onChange={(e) => setCardMessage(e.target.value)}
              className="w-full bg-white border border-stone-200 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs font-sans text-stone-800 h-24 resize-none outline-none transition-all duration-200"
              id="postcard-input-msg"
            />
            <div className="text-right font-mono text-4xs text-stone-400">
              {cardMessage.length} / 180 chars max
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 hover:text-stone-950 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs font-sans"
            id="postcard-flip-btn"
          >
            <RefreshCw className="w-4 h-4" />
            Flip Postcard
          </button>
          
          <button
            onClick={handleSendCard}
            disabled={isSent}
            className={`flex-1 py-3 font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs font-sans ${
              isSent
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950'
            }`}
            id="postcard-send-btn"
          >
            {isSent ? (
              <>
                <Check className="w-4 h-4" />
                Sent Successfully!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Mail Postcard
              </>
            )}
          </button>
        </div>
      </div>

      {/* Postcard Container: Right */}
      <div className="lg:col-span-8 flex flex-col items-center justify-center p-4 lg:p-8 bg-stone-100 border border-stone-200 rounded-3xl min-h-[420px]">
        {/* Interactive card viewport with custom 3D flipping class */}
        <div className="relative w-full max-w-[580px] h-[340px] perspective-1000">
          <motion.div
            className="w-full h-full relative duration-700 preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: 'spring', damping: 18 }}
          >
            {/* Front of card */}
            <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white flex flex-col justify-end">
              <img
                src={selectedTemplate.imageUrl}
                alt={selectedTemplate.name}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Cover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              <div className="relative p-6 text-white text-left space-y-1.5 z-10">
                <span className="font-display text-base tracking-widest text-amber-400 font-semibold block uppercase">
                  Greetings from
                </span>
                <h3 className="font-display text-2xl md:text-3.5xl font-black tracking-tight leading-none text-white">
                  OKPOAMA KINGDOM
                </h3>
                <p className="font-sans text-xs italic text-stone-200 leading-relaxed font-light">
                  {selectedTemplate.tagline}
                </p>
              </div>

              {/* Top right decorative watermark */}
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded text-white border border-white/20 font-mono text-4xs uppercase tracking-widest">
                Atlantic Souvenir
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-xl border-4 border-stone-200 bg-amber-50/90 text-stone-800 p-6 flex flex-col justify-between"
                 style={{ transform: 'rotateY(180deg)' }}>
              
              {/* Back background texture */}
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedTemplate.bgGradient} pointer-events-none rounded-xl`} />

              {/* Postcard Layout Grid */}
              <div className="grid grid-cols-12 gap-4 flex-1 h-full relative z-10">
                
                {/* Left side: Handwritten Message */}
                <div className="col-span-7 border-r border-stone-300 pr-4 text-left flex flex-col justify-between py-2">
                  <div className="space-y-2">
                    <span className="font-display text-3xs font-semibold uppercase tracking-wider text-stone-400">
                      Private Correspondence
                    </span>
                    <p className="font-serif text-sm italic leading-relaxed text-stone-800 tracking-wide font-medium mt-1">
                      "{cardMessage || 'Wish you were here!'}"
                    </p>
                  </div>
                  
                  <span className="font-serif text-xs font-semibold text-stone-700 italic block mt-2 text-right">
                    — Warmest Regards
                  </span>
                </div>

                {/* Right side: Stamp & Address */}
                <div className="col-span-5 pl-2 flex flex-col justify-between py-2 text-left">
                  
                  {/* Stamp box */}
                  <div className="flex justify-end">
                    <div className="w-16 h-20 border-2 border-dashed border-amber-600/50 bg-amber-100/50 rounded flex flex-col items-center justify-center p-1 relative shadow-xs rotate-2">
                      <span className="text-3xl filter drop-shadow-sm">{stamps[selectedStamp].icon}</span>
                      <span className="font-mono text-5xs text-amber-900 font-extrabold uppercase mt-1">
                        {stamps[selectedStamp].name}
                      </span>
                      <span className="font-mono text-5xs text-stone-400">
                        OKPOAMA G.P.O.
                      </span>
                    </div>
                  </div>

                  {/* Postal Mark stamp circle */}
                  <div className="absolute top-2 right-16 w-12 h-12 border border-stone-400 rounded-full border-dashed flex items-center justify-center opacity-40 -rotate-12 scale-90 pointer-events-none">
                    <span className="font-mono text-5xs font-bold text-stone-600 text-center leading-none">
                      BRASS ISLAND<br />JULY 2026
                    </span>
                  </div>

                  {/* Lines for Address */}
                  <div className="space-y-2 mt-4">
                    <div className="border-b border-stone-300 pb-1 flex items-end">
                      <span className="font-sans text-4xs font-bold uppercase text-stone-400 shrink-0 mr-1.5">To:</span>
                      <span className="font-serif text-2xs font-bold text-stone-800 truncate">{recipientName || 'Visitor'}</span>
                    </div>
                    <div className="border-b border-stone-300 pb-1 flex items-end">
                      <span className="font-serif text-2xs text-stone-500 font-medium">12 Coastal Beach Boulevard</span>
                    </div>
                    <div className="border-b border-stone-300 pb-1 flex items-end">
                      <span className="font-serif text-2xs text-stone-500 font-medium">Brass Island, Bayelsa, NG</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Footer divide bar */}
              <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-4xs font-mono font-bold text-stone-400 uppercase tracking-widest relative z-10">
                <span>© 2026 Okpoama Kingdom Tourism Bureau</span>
                <span>Ref: OKPOAMA-POST-CARD</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info label */}
        <p className="font-sans text-3xs text-stone-500 italic mt-6 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          Tip: Click the <strong>"Flip Postcard"</strong> button to flip between the photo side and your customized handwritten letter side!
        </p>
      </div>
    </div>
  );
};
