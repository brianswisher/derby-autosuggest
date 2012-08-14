Multi auto suggest component for Derby 
======================================

An auto-suggest component for Derby, plus working example. Use as you please.

Usage example:
ui:autoSuggest path="countries" field="{_user.countryIds}" cls="{{cls}}"

path: collection path
field: field where results are stored
cls: your class

Please post comments and feedbacks here:
https://groups.google.com/forum/?fromgroups#!topic/derbyjs/4wIuKEEHrSg

Vid:
http://www.youtube.com/watch?v=FozQ65fHieM


Changelog
======================================
14 August 2012
- Refactored component to encapsulate all business logic
- Updated example code



To-Do
======================================
1. Add "single/multiple" selection param
3. Add support to chose either filtering (client side) or quering. The use of "in" in query motifs is currently broken in Racer.
4. Look into how to pass dynamic field names to components; i.e. right now the component relies on {{{.text}}} for display, the path.text needs to be dynamic.



Notes
======================================
Make sure you download the latest version of Racer