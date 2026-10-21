import {portfolio as p} from '@/data/portfolio';

export function createContactDraft({name, email, message, topic}:{name:string;email:string;message:string;topic:string}) {
  const subject = `${topic} inquiry from ${name.trim()}`;
  const body = `Name: ${name.trim()}\nReply to: ${email.trim()}\n\n${message.trim()}`;
  return `mailto:${p.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
