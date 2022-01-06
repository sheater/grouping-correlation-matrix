# PV251 Visualization - Grouping correlation matrix

This is the final project for the PV251 course. In general, it a set of stacked correlation matrices onto each other, where each such a matrix displays correlation of particular group (value of some qualitative variable).
This can be seen in the following screenshot (this particular project uses the [German housing prices dataset]([https://link](https://www.kaggle.com/scriptsultan/german-house-prices))):

![Screenshot](docs/images/screenshot1.png)

The _ground_ (gray plane) consists of two axes, as it is common for basic correlation matrix. The _wall_ (plane including vertical description, perpendicular to the ground) describes what group the correlation matrix in that level stands for. In this particular example, the wall represents "type of house", where the first 3 levels (Duplex, Single Dwelling and Residential Property) are highlighted.

Each box represents the value of correlation, meaning the correlation coefficient of variable X and Y within group G such that:

- opaque box => high correlation
- transparent box => low correlation
- blue box => positive correlation
- red box => negative correlation


## Live demo

https://sheater.github.io/grouping-correlation-matrix/

### Controls

Left pane:
- Categorical variable - what categorical variable from the dataset we want to display
- Correlation coefficient - type of correlation coefficient (what formula to use)
- Correlation visibility boundaries - e.g., hiding low correlated values or restrict specific interval of correlation coefficient values
- Levels of interest - how many consecutive levels from the ground we want to highlight


Right pane:
The slider changes the level of the ground. In other words, ground acts as an elevator, when the slider is moved up or down.
Beside slider, we can see correlation preview which is usefull for navigation.


## Motivation and personal impact

I am a junior researcher at the Brno University of Technology, where my primary focus is on real estate market segmentation. The proper real estate market segmentation lies in dividing the heterogeneous market into smaller, more homogeneous submarkets. This can be utilized, for example, for:
- more accurate real estate property valuation
- assist with stakeholders' or investors' business decisions
- identify distinct groups with special needs or potential growth
- delineate specific supply/demand groups (through revealed preference)
- as a foundation for public administration, planning and zoning

Unfortunately, there is no holy grail, how to do segmentation properly.

TODO:

## Local development/testing

To install dependencies:

```bash
yarn install # this is preferred (dependencies version lock)
# or
npm install
```

To run dev server:

```
yarn start
# or
npm run start
```
