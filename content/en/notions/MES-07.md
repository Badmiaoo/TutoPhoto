# MES-07 · Highlight alerts, zebras

## Explanation

**During playback.** The Nikon Z 6 has a "Highlights" information page, which flags "areas that may be overexposed" ([Nikon, Z 7/Z 6 online manual, "Photo Information"](https://onlinemanual.nikonimglib.com/z7_z6/en/08_more_about_playback_02.html), read on 12 November 2026). The manual says neither how these areas are marked nor from which brightness; its illustration shows an area surrounded by a dotted line. The page is displayed only if it is selected in "Playback display options", in the playback menu.

On the Sony A7 III, the alert is part of the playback "Histogram" display: "If the image has an overexposed or underexposed area, the corresponding section will blink on the histogram display (overexposed/underexposed warning)" ([Sony, ILCE-7M3 Help Guide, "Switching the screen display"](https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001653116.html)). The threshold is not given. According to the same page, such defects cannot be corrected on a computer after shooting: compensate the exposure before shooting (see MES-04).

**While shooting: zebras.** On the A7 III, "Zebra Setting" sets "a zebra pattern, which appears over part of an image if the brightness level of that part meets the IRE level that you have set"; to check overexposure, you set a minimum value, and the pattern appears "over areas with a brightness level equal to or higher than the value you set" ([Sony, "Zebra Setting"](https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001667679.html)). The page does not define the IRE scale and does not list the values.

The Z 6 manual describes such a display for movies only: setting g6, "Highlight Display", in the "g: Movie" group, draws shading over bright areas, with an adjustable threshold. It is the only threshold value written in the pages read: "If 255 is selected, the highlight display will show only areas that are potentially overexposed" ([Nikon, "g6: Highlight Display"](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_g06.html)).

## Simulator

On the review screen, the "Info" button leads to the "highlights" display, after "histograms" (see MES-06). Areas where at least one channel, red, green or blue, is at the maximum value (255) blink on the photo: one second in black, one second visible. A line of text gives their share of the image. With no pixel at the maximum value, the photo does not change and the text says so. Tapping the photo still opens the magnifier; areas and text then cover the displayed part. If your device asks for reduced motion, the areas stay black, without blinking.

In TutoPhoto's photo, everything brighter than white is brought down to the maximum value: in a blinking area, the channel concerned has no detail left.

TutoPhoto's choices, not sourced:
- the threshold: one channel at 255, the maximum value of a photo at 8 bits per channel; it rests on Nikon's sentence about the 255 threshold for movies;
- blinking, described by Sony, is applied whatever body is chosen, and its rhythm is written nowhere; the Z 6 manual does not say how its "Highlights" page marks the areas;
- a separate display, like the Z 6 "Highlights" page, whereas the A7 III shows the alert with the histograms.

Not simulated: Sony's underexposed-area warning; zebras while shooting; the Z 6 "Playback display options" setting.

## Exercise

The reference sheet suggests exposing as brightly as possible without blowing out a white dress; in the park, it is Sophia's white top. In mode A at f/8, with the "Info: highlights" display:
- release the shutter without exposure compensation: with the starting framing, part of Sophia's top already blinks;
- lower exposure compensation one third of an EV at a time, releasing the shutter each time, until nothing blinks on her top any more; tap the photo to check with the magnifier;
- note that compensation: it is the brightest photo that keeps detail in this white. Compare it with the first one: what did you gain, what did you lose?
- set exposure compensation back to 0: it stays memorised.

Measured on 12 November 2026 with the starting framing, at 50 mm: without compensation (−0.2 EV in the report), 0.8% of the image is at the maximum value, on the characters' light clothes; at −1 EV of compensation, less than 0.1%; at −2 EV, no pixel. Areas other than Sophia's top may blink: look at where they are on the photo, not only at their share of the image, and decide what matters for your photo. The report does not judge highlights: there is no computed right answer.
