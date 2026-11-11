# MES-10 · Auto ISO

## Explanation

With auto ISO sensitivity control, the camera adjusts the sensitivity itself when optimal exposure cannot be achieved at the selected value ([Nikon, Z 7/Z 6 online manual, "ISO sensitivity settings"](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_03_08.html), read on 10 November 2026). Two settings frame it (same source):
- the maximum sensitivity, to keep it from going too high;
- the minimum shutter speed, below which auto ISO kicks in in modes P and A; the shutter speed may still drop lower if the maximum sensitivity is not enough.

In mode M, auto ISO adjusts the sensitivity for optimal exposure at the selected shutter speed and aperture (["The Mode Dial"](https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_01.html)), and takes exposure compensation into account (["The E (Exposure Compensation) Button"](https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_03.html)). Auto ISO is on by default on the Z 6 (["Defaults"](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html)).

## Simulator

In the "Exposure" window: auto ISO sensitivity control, maximum sensitivity (ISO 200 to 6400) and minimum shutter speed. The dial is then called "ISO auto" and shows the value chosen. Two rules come from the Nikon D850 manual, since the Z 6 manual does not give them: auto ISO goes down to ISO 100, and in mode A it only rises if the shutter speed would drop below the minimum ([Nikon, D850 online manual, "Auto ISO Sensitivity Control"](https://onlinemanual.nikonimglib.com/d850/en/10_iso_sensitivity_02.html)). The "Auto" option of the minimum shutter speed is not simulated: its rule is not published.

## Exercise

The reference sheet mentions a child running at the end of the day; in the park, it is the dog. Set mode A at f/8, auto ISO with a minimum shutter speed of 1/1000 s and a maximum sensitivity of 6400. The camera takes about ISO 1000 and 1/1000 s. At 1/1000 s, the dog (3.5 m/s at 9 m, 50 mm) leaves 50 × 3.5 × 0.001 / 9 ≈ 0.019 mm, or 0.8 px on the photo, under the 1.2 px limit: it is frozen. Check it with challenge SIT-06.
