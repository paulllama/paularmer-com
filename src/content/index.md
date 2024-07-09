---
importMd: 
    intro=content/_intro.md,
    product=content/_product-manager.md,
    artist=content/_artist.md,
    gamer=content/_gamer.md,
    software=content/_software-engineer.md,
---

<div id="skeleton">
    <aside id="tree">
        <div id="tree_name">PAUL ARMER</div>
        <svg id="tree_greenery" viewbox="0 0 122 210">
            <use xlink:href="/media/redwood.svg#greenery"></use>
        </svg>
        <svg id="tree_bark" viewbox="0 0 122 210">
            <use xlink:href="/media/redwood.svg#bark"></use>
        </svg>
        <svg id="tree_outline" viewbox="0 0 122 210">
            <use xlink:href="/media/redwood.svg#outline"></use>
        </svg>
        <svg id="tree_negative" viewbox="0 0 122 210">
            <use xlink:href="/media/redwood.svg#negative"></use>
        </svg>
    </aside>
    <div id="content_container">
        <div id="content">
            {{intro}}
            {{product}}
            {{artist}}
            {{gamer}}
            {{software}}
        </div>
    </div>
</div>

<script src="scripts.js" defer="defer"></script>

