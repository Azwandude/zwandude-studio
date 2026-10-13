'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-hero-item', { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.2 });
      gsap.from('.contact-info-item', {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.5,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    // Simulate submission — connect to your backend or Formspree/EmailJS
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success('Message sent! I\'ll be in touch soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div ref={pageRef} style={{ paddingTop: 'var(--nav-height)' }}>
      {/* ── PAGE HERO ── */}
      <div
        className="relative py-20 md:py-32 overflow-hidden border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(232,56,26,0.07) 0%, transparent 70%)' }}
        />
        <div className="container-wide relative z-10">
          <p className="section-label contact-hero-item mb-4">Say Hello</p>
          <h1
            className="font-display text-white contact-hero-item mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            Contact
          </h1>
          <p
            className="text-xl max-w-xl contact-hero-item"
            style={{ color: 'var(--text-secondary)' }}
          >
            Have a project in mind, want to collaborate, or just want to say hi?
            I&apos;d love to hear from you.
          </p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container-wide py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — info */}
          <div className="space-y-10">
            <div className="space-y-3">
              <p className="section-label">Direct Contact</p>
              <a
                href="mailto:azwan160902@gmail.com"
                className="contact-info-item flex items-center gap-4 p-5 border transition-colors duration-300 hover:border-[#e8381a]/40 group"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: 'var(--accent-dim)' }}
                >
                  <Mail size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Email</p>
                  <p
                    className="text-sm font-medium transition-colors duration-300 group-hover:text-[#e8381a]"
                    style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    azwan160902@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-info-item flex items-center gap-4 p-5 border transition-colors duration-300 hover:border-[#e8381a]/40 group"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: 'var(--accent-dim)' }}
                >
                  <FaInstagram size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Instagram</p>
                  <p
                    className="text-sm font-medium transition-colors duration-300 group-hover:text-[#e8381a]"
                    style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    @zwandude
                  </p>
                </div>
              </a>

              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-info-item flex items-center gap-4 p-5 border transition-colors duration-300 hover:border-[#e8381a]/40 group"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: 'var(--accent-dim)' }}
                >
                  <FaYoutube size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>YouTube</p>
                  <p
                    className="text-sm font-medium transition-colors duration-300 group-hover:text-[#e8381a]"
                    style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Zwandude Studio
                  </p>
                </div>
              </a>
            </div>

            <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="section-label mb-3">Response Time</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                I typically respond within <strong style={{ color: 'var(--text-primary)' }}>24–48 hours</strong> on business days.
                For urgent projects, mention it in the subject line.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center text-center py-20 h-full"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
              >
                <CheckCircle size={48} className="mb-6" style={{ color: 'var(--accent)' }} />
                <h3 className="font-display text-3xl text-white mb-3">Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. I&apos;ll be in touch soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline mt-8"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
                <p className="section-label mb-6">Send a Message</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
                      Name <span style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="input-dark"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
                      Email <span style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="input-dark"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
                    Project Type
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="input-dark"
                  >
                    <option value="">Select a category...</option>
                    <option value="Videography">Videography</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Talent / Presenting">Talent / Presenting</option>
                    <option value="Full Package">Full Package (Shoot + Edit)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
                    Message <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell me about your project — what, when, where, and any details that help me understand the scope..."
                    className="input-dark resize-none"
                    required
                  />
                </div>

                <button
                  id="contact-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center"
                  style={{ opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>Send Message <Send size={15} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
