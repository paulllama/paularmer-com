---
importMd: 
    jobExperience=resume/job-experience.md, 
    sideProjects=resume/side-projects.md, 
    education=resume/education.md,
    introduction=resume/introduction.md
---
<script type="application/javascript">
    window.print()
</script>

<h2 class="hide-for-print">printing</h2>

<div class="hide-for-screen">
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
</div>