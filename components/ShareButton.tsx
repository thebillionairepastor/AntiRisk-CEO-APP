
import React, { useState, useRef, useEffect } from 'react';
import { Share2, Mail, MessageCircle, Check, Printer, Link, Copy, X } from 'lucide-react';

interface ShareButtonProps {
  content: string;
  title: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ content, title, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`*${title}*\n\n${content}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setIsOpen(false);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(content);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setIsOpen(false);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      setIsOpen(false);
    }, 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
              h1 { color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 24px; }
              .content { white-space: pre-wrap; background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
              .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div class="content">${content}</div>
            <div class="footer">Confidential Intelligence - AntiRisk Management Security Advisory</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
    setIsOpen(false);
  };

  const handleCopyPlain = () => {
    navigator.clipboard.writeText(content);
    setCopiedText(true);
    setTimeout(() => {
      setCopiedText(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#2962ff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-900/20 active:scale-95"
      >
        <Share2 size={18} />
        Broadcast
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-[#0d1421] border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5 flex flex-col">
            <button 
              onClick={handleWhatsApp}
              className="flex items-center w-full gap-4 px-4 py-3 text-left text-[15px] text-slate-300 hover:bg-white/5 hover:text-white transition-colors rounded-xl"
            >
              <div className="w-5 flex justify-center text-[#25d366]">
                <MessageCircle size={20} />
              </div>
              <span className="font-medium">WhatsApp</span>
            </button>
            
            <button 
              onClick={handleEmail}
              className="flex items-center w-full gap-4 px-4 py-3 text-left text-[15px] text-slate-300 hover:bg-white/5 hover:text-white transition-colors rounded-xl"
            >
              <div className="w-5 flex justify-center text-[#2962ff]">
                <Mail size={20} />
              </div>
              <span className="font-medium">Email Team</span>
            </button>

            <div className="my-1.5 border-t border-white/5 mx-2" />

            <button 
              onClick={handleCopyShareLink}
              className="flex items-center w-full gap-4 px-4 py-3 text-left text-[15px] text-slate-300 hover:bg-white/5 hover:text-white transition-colors rounded-xl"
            >
              <div className="w-5 flex justify-center text-slate-400">
                {copiedLink ? <Check size={20} className="text-emerald-500" /> : <Link size={20} />}
              </div>
              <span className="font-medium">{copiedLink ? "Link Copied" : "Copy Share Link"}</span>
            </button>

            <button 
              onClick={handlePrint}
              className="flex items-center w-full gap-4 px-4 py-3 text-left text-[15px] text-slate-300 hover:bg-white/5 hover:text-white transition-colors rounded-xl"
            >
              <div className="w-5 flex justify-center text-slate-400">
                <Printer size={20} />
              </div>
              <span className="font-medium">Print Document</span>
            </button>

            <button 
              onClick={handleCopyPlain}
              className="flex items-center w-full gap-4 px-4 py-3 text-left text-[15px] text-slate-300 hover:bg-white/5 hover:text-white transition-colors rounded-xl"
            >
              <div className="w-5 flex justify-center text-slate-400">
                {copiedText ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
              </div>
              <span className="font-medium">{copiedText ? "Text Copied" : "Copy Plain Text"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
