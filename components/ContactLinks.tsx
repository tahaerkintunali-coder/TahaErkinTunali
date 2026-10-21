import {ArrowUpRight, Mail, MapPin} from 'lucide-react';
import {portfolio as p} from '@/data/portfolio';

function LinkedInMark() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>;
}

export default function ContactLinks() {
  const channels = [
    {name:'Email', value:p.email, action:'Write an email', href:`mailto:${p.email}`, icon:<Mail size={22} aria-hidden="true"/>, external:false},
    {name:'LinkedIn', value:p.fullName, action:'View my profile', href:p.linkedin, icon:<LinkedInMark/>, external:true}
  ];

  return <div className="contact-direct">
    <div className="contact-channels" role="group" aria-label="Direct contact links">
      {channels.map(channel => <a
        className={`contact-channel contact-channel-${channel.name.toLowerCase()}`}
        key={channel.name}
        href={channel.href}
        target={channel.external ? '_blank' : undefined}
        rel={channel.external ? 'noopener noreferrer' : undefined}
        aria-label={`${channel.action}: ${channel.value}${channel.external ? ' (opens in a new tab)' : ''}`}
      >
        <span className="contact-channel-icon">{channel.icon}</span>
        <span className="contact-channel-copy">
          <span className="contact-channel-label">{channel.name}</span>
          <strong>{channel.value}</strong>
          <span className="contact-channel-action">{channel.action}</span>
        </span>
        <ArrowUpRight className="contact-channel-arrow" size={18} aria-hidden="true"/>
      </a>)}
    </div>
    <p className="contact-location"><MapPin size={15} aria-hidden="true"/>{p.location}</p>
  </div>;
}
