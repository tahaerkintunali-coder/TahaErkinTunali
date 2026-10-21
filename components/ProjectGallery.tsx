"use client";

import {useState} from 'react';
import {projects} from '@/data/projects';
import ProjectCard from './ProjectCard';

const order=['04','03','01','02','05','06'];
const selected=order.map(id=>projects.find(project=>project.id===id)!);
const filters=['All projects','Industry','University'] as const;

export default function ProjectGallery(){
  const [filter,setFilter]=useState<typeof filters[number]>('All projects');
  const visible=selected.filter(project=>filter==='All projects'||project.group===filter);
  return <div className="project-gallery">
    <div className="project-gallery-heading"><div className="project-filters" role="group" aria-label="Filter projects">{filters.map(option=><button key={option} type="button" aria-pressed={filter===option} onClick={()=>setFilter(option)}>{option}<span>{option==='All projects'?selected.length:selected.filter(project=>project.group===option).length}</span></button>)}</div><span className="project-result-count" aria-live="polite">{visible.length} projects</span></div>
    <div className="project-grid">{visible.map(project=><ProjectCard key={project.id} project={project}/>)}</div>
    <p className="project-visual-note">Illustrations show the subject of each project. Select a card to read the scope, my contribution and the outcome.</p>
  </div>;
}
