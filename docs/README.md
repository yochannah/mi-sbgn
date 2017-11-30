# Architecture notes:

Dependencies: This repo uses 
- d3 to create visual components, 
- webcola to lay them out, 
- MI-Model to create a common data model for any other potential views of the same protein complex on the same page.
- jstoxml to convert the js layout into an SBGN-ML file.

## Design
This repo has been designed to enable semi-automated layouts of protein complexes in SBGN-ML. 

SBGN-ML is the XML representation of Systems Biology Graphical Notation (SBGN), a visual language to represent biochemical interactions.

Original paper describing SBGN: http://www.nature.com/nbt/journal/v27/n8/full/nbt.1558.html Original paper describing SBGN-ML: https://academic.oup.com/bioinformatics/article/28/15/2016/236089/Software-support-for-SBGN-maps-SBGN-ML-and-LibSBGN - It says laying out SBGN is a 'hard problem'.

SBGN has three sub-languages:

- Process Diagram, depicting entities over time
- Entity Relationship
- Activity Flow, used for scenarios in which broad details are conveyed without necessarily depicting specific entities.

Entity Relationship seems to be most pertinent to depicting the protein complexes shown in the complex viewer.

Specification for SBGN Entity Relationship (ER) Version 2 (August 2015): http://journal.imbio.de/article.php?aid=264 pages 16, 17 have info about interactions.

### Notes about the layout

Given that the layout of SBGN in an automated fashion is considered a hard problem, this viewer allows users to drag and re-arrange automated views until they reach a more pleasing state visul state. Once this is reached they may then download the re-arranged view in a serialised SBGN-ML format, preserving their manual layouts. Skipping the preview/re-arrange step would likely result in messy graphs at this stage, without much more complex (and time-intensive) layout algorithms. 

## installation

Please see [the main README](../README.md) for installation info.
