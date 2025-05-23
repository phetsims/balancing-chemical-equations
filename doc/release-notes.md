# Balancing Chemical Equations - Release Notes
<!-- 
Instructions:
* Replace {{SIM_TITLE}} with the simulation title.
* Replace {{VERSION}} with the version number, in MAJOR.MINOR format, e.g. "1.2".
* For a published version, replace {{PUBLICATION_DATE}} with the publication date, in year-month-day format, e.g. "2025-05-16".
* For a version that has not been published yet, replace {{PUBLICATION_DATE}} with "in progress".
* For a 1.0 release, only the 1.0 heading and date is needed. This includes ports of legacy sims.
* Developer and designer should collaborate on what to include for any release beyond 1.0. 
* For each new version, add a section to the top of these release notes - reverse chronological order, with the most-recent version at the top.

For an exemplar, see https://github.com/phetsims/balancing-chemical-equations/blob/main/doc/release-notes.md
-->

<!-- 
## {{VERSION}} ({{PUBLICATION_DATE}})

### New Features
* Describe a new feature.
* 

### Bug Fixes
* Describe a bug fix.
* 

### Other Changes
* Describe a change.
* ⚠️ Use this icon for a change that is breaking, removes a feature, etc. 
*
-->

## 2.0 (2025-05-23)

### New Features:
* New _Equations_ screen, with 12 equations representing synthesis, decomposition, and combustion reactions.
* New preference to set the initial coefficient for all equations. See _Preferences > Simulation > Initial Coefficient_.
* PhET-iO support, including PhET Studio.

### Other Changes:
* The "Tools" combo box has been re-titled "View", because these are not tools. They are alternative views (visual representations) of the selected equation.
* "Particles" view (Reactants & Products accordion boxes) has been added to the View combobox.   This is now a view that you select, rather than being visible all the time.
* ⚠️ All views (choices in the View combo box) are now mutually exclusive. Unlike the 1.X version, you cannot (for example) show Particles view and Balance Scales view at the same time. This was a compromise in order to make the new _Equations_ screen feasible (due to limited screen space) and to make the Balance Scales and Bar Charts views more usable by displaying them vertically.
* ⚠️ Balance Scales and Bar Charts views are now displayed vertically, rather than horizontally, because the horizontal layout was confusing.
* Balance Scales and Bar Charts will now highlight (turn yellow) individually when they are balanced. In previous versions, they did not highlight until the entire equation was balanced.
* The _Intro_ screen now shows the smiley face in the upper-left corner of the screen, rather than at top-center.  This change is to accommodate the new vertical layout of Balance Scales and Bar Charts views. A green checkmark with "Balanced" was also added. 
* Feedback in the _Game_ screen has been improved for balanced equations. In addition to telling the student that the equation is "Balanced", it also indicates whether the equation is "Simplified" (balanced with the smallest integer coefficients) or "Not Simplified".

## 1.3 (2024-11-15)

### New Features:
* UI Sounds
* Preferences
* Dynamic locale: see _Preferences > Localization > Languages_
* TypeScript implementation

## 1.2 (2019-01-15)

## 1.1 (2016-01-07)

## 1.0 (2014-07-31)
