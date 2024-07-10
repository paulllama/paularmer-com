---
styles: resume
importMd: 
    jobExperience=resumes/_job-experience.md, 
    sideProjects=resumes/_side-projects.md, 
    education=resumes/_education.md,
    introduction=resumes/_introduction.md,
---

<div id="header">
    <section id="name">Paul Armer</section>
    <aside id="email">me@paularmer.website</aside>
    <aside id="github">github.com/paulllama</aside>
</div>
<div id="introduction">
    {{introduction}}
</div>
<div id="experience">
    <div id="main-column">
        {{jobExperience}}
    </div>
    <div id="side-column">
        {{sideProjects}}
        {{education}}
    </div>
</div>
