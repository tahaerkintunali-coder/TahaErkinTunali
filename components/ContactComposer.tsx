"use client";

import {useState, type CSSProperties, type FormEvent} from 'react';
import {ArrowRight, Check, Mail, MessageCircle} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {portfolio as p} from '@/data/portfolio';
import {createContactDraft} from '@/lib/contact-draft';

const topics = [
  {name: 'Engineering', placeholder: 'Tell me about the system, the challenge and what you have in mind…'},
  {name: 'Research', placeholder: 'What research question or collaboration would you like to explore?'},
  {name: 'Opportunity', placeholder: 'Tell me about the role, the team and the opportunity…'}
];

export default function ContactComposer() {
  const [topic, setTopic] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState('');
  const completed = [name.trim().length > 0, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), message.trim().length >= 10];
  const count = completed.filter(Boolean).length;
  function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const link = createContactDraft({name, email, message, topic:topics[topic].name});
    setDraft(link);
    window.location.href = link;
  }
  return <form onSubmit={submit} className="contact-form contact-composer reveal" style={{'--compose-progress':`${count / 3 * 100}%`} as CSSProperties}>
    <div className="composer-heading"><div className="interaction-label"><MessageCircle size={17}/>Start a conversation</div><span>01 → 03</span></div>
    <div className="contact-topics" aria-label="Conversation topic">{topics.map((item, i) => <button type="button" key={item.name} aria-pressed={topic === i} onClick={() => { setTopic(i); setDraft(''); }}>{item.name}<ArrowRight size={14}/></button>)}</div>
    <div className="composer-progress" role="progressbar" aria-label="Contact details completed" aria-valuemin={0} aria-valuemax={3} aria-valuenow={count} aria-valuetext={`${count} of 3 contact details completed`}><div className="composer-progress-rail" aria-hidden="true"/>{['Your name', 'Reply address', 'Your message'].map((label, i) => <span className={completed[i] ? 'is-complete' : ''} key={label}><i>{completed[i] ? <Check size={12}/> : i + 1}</i>{label}</span>)}</div>
    <div className="form-row"><label>Your name<Input name="name" autoComplete="name" placeholder="Your name" required maxLength={100} value={name} onChange={event => { setName(event.target.value); setDraft(''); }}/></label><label>Email address<Input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={200} value={email} onChange={event => { setEmail(event.target.value); setDraft(''); }}/></label></div>
    <label>What are you working on?<Textarea name="message" placeholder={topics[topic].placeholder} required minLength={10} maxLength={3000} rows={5} value={message} onChange={event => { setMessage(event.target.value); setDraft(''); }}/></label>
    <div className="form-bottom"><span>Opens your email app. Send the draft there.</span><button className="button primary" type="submit">Compose email<Mail size={16}/></button></div>
    {draft && <div className="email-draft-result" role="status"><p>Your message is prepared for {p.email}. It is sent when you press Send in your email app.</p><a className="text-button" href={draft}>Open the prepared email again <Mail size={16}/></a></div>}
  </form>;
}
