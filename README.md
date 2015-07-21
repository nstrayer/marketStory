# Narrative visualization of state statistics for farmers markets and agriculture.


1) Number of farmers markets per state

2) Number of farmers markets normalized by pop

3) Percentage of gdp coming from Agriculture

4) Ratio of GDP coming from ag to farmers markets per person.


---
Measure $= \frac{\text{markets per person}}{\% \text{gpd from ag}}$ 

if we have a low gdp % and high per person ratio this becomes small.  


Make the visualization a trend chart.
Each line represents the different steps. At each step a line is animated from it's current position to the next position.

<<<<<<< HEAD
#ToDo: 
- Fix the problem with interaction with the lines messing up the animation. 
- Add a second type of selection: hover select. This is different from clicking on a state select. Make sure that the hover has presidence over the click select. 
- Color code the states by region and/or add buttons to view interesting clusters. 
	- Consider walking the user through the interesting clusters then giving them the reigns to explore at tthe end. 
=======
Problems that might arise: Clustering of states. Could put in a search feature to fix this. Point would be to highlight the outlier states. 

# New Idea:

Two panel style like the points visualization. 

The menu/nav panel is the grid states map. To highlight lines you click on a given state. 

To deal with mobile/normal use the same paradigm that was used for the points visualization.  


## ToDo
- Add a data info field on the selected states with columns for different metrics. Add rankings next to them for context. e.g. `Michigan 4.2% (31)`. 
- Maybe add the ability to switch stuff to the ranking view? not sure if it's a good idea. 
>>>>>>> gh-pages
