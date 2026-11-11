# EXP-06 · ISO

## Explanation

The Nikon Z 6 manual sums it up: the higher the ISO sensitivity, the less light needed to make an exposure, allowing faster shutter speeds or smaller apertures, but the more likely the image is to be affected by noise ([Nikon, Z 7/Z 6 online manual, "The S (ISO Sensitivity) Button"](https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_02.html), read on 10 November 2026). Extended settings come at a price: noise is "particularly likely" from Hi 0.3 to Hi 2, and at Lo settings highlights may lose some detail (same source).

To judge noise, the digital sensitivity standard uses a signal-to-noise ratio of 40:1 for "excellent image quality" and 10:1 for "acceptable image quality" ([Wikipedia, "Film speed", revision 1383727213](https://en.wikipedia.org/w/index.php?title=Film_speed&oldid=1383727213), read on 10 November 2026).

## Simulator

The "ISO" dial goes from 100 to 6400 in third stops (the Z 6 goes further; TutoPhoto stops where its noise measurements stop). Noise is computed from measurements of real sensors and shows in the viewfinder and on the photo, with the 100% loupe. The balance indicator and the photo report give the signal-to-noise ratio at the aimed point, with the 40:1 and 10:1 thresholds. With auto ISO (MES-10), the camera chooses the sensitivity.

## Exercise

In mode M, without auto ISO, impose f/4 and 1/1000 s. Find the lowest ISO that exposes correctly. Calculation: at ISO 100, these settings are worth 14 EV₁₀₀ (log₂(4²) + log₂(1000) ≈ 4 + 10), for a scene at 12.5 EV₁₀₀; 1.5 EV is missing, hence ISO 100 × 2^1.5 ≈ 283, between two steps; ISO 250 gives −1/6 EV, ISO 320 gives +1/6 EV. Compare the noise at the aimed point at ISO 320 and at ISO 6400.
