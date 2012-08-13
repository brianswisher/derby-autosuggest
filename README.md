Multi auto suggest component for Derby 
======================================


An auto-suggest component for Derby, plus working example. Use as you please.

Usage:
<ui:autoSuggest response="{_yourlist}" searchq="{_searchq}" valuefield="{_wheretostorevals}" selecteditems="{_reflistofvals}" cls="{{componentclass}}">

Known issues:
-------------
1. Racer will through "Model bundling took longer than..." on first run.
2. Model.filter() returns an array of "unidentified" object, I suspect it's a Racer issue, for now using queries.

To-do:
------
1. Once the above are resolved; encapsulate all business logic inside the component itself
2. Add "single" selection support
3. Add support to chose either filtering (client side) or quering. The use of "in" in query motifs is currently broken in Racer.
4. Look into how to pass dynamic field names to components; i.e. right now the component relies on {{{.text}}} for display, the path.text needs to be dynamic.

Comments and feedbacks are welcome. 