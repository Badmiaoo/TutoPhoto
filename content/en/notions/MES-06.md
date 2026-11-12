# MES-06 · Histogram

## Explanation

A histogram shows how the tones of a photo are distributed, "with pixel brightness (tone) plotted on the horizontal axis and the number of pixels on the vertical axis" ([Nikon, Z 7/Z 6 online manual, "Photo Information"](https://onlinemanual.nikonimglib.com/z7_z6/en/08_more_about_playback_02.html), read on 12 November 2026). According to that page:
- if the image is dark, the tone distribution is shifted to the left; if it is bright, to the right;
- if the image contains objects with a wide range of brightnesses, the distribution is relatively even;
- increasing exposure compensation shifts the distribution to the right, decreasing it shifts the distribution to the left (see MES-04);
- histograms give a rough idea of overall exposure when bright ambient lighting makes the display hard to see.

The Sony A7 III guide adds that a peak at the right or left end of the histogram indicates an overexposed or underexposed area, and that such defects cannot be corrected on a computer after shooting: compensate the exposure before shooting ([Sony, ILCE-7M3 Help Guide, "Switching the screen display"](https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001653116.html)).

**Channel by channel.** During playback, both cameras display four histograms. On the Z 6, the "RGB histogram" page shows "Histogram (RGB channel)", then the red, green and blue channels; the manual does not define this "RGB channel". On the A7 III, the playback "Histogram" display shows "Histogram (Luminance/R/G/B)" ([Sony, "List of icons on the monitor"](https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001667671.html)). None of these pages says what each channel is for; the "Simulator" part gives a computed case where one channel shows what luminance hides.

**Limit stated by Nikon.** "Camera histograms are intended as a guide only and may differ from those displayed in imaging applications."

## Simulator

On the review screen, after each photo, the "Info" button cycles through three displays, like the DISP button of both cameras during playback: photo only (the default), histograms, highlights (see MES-07). The choice is kept for the next photos and for each frame of a burst.

"Histograms" display: the photo, reduced, and four histograms under it, in the order of both cameras: luminance, red, green, blue. Black is on the left (value 0), white on the right (value 255); the height of a column gives the number of pixels with that value. A line of text gives the share of pixels with at least one channel at the maximum value. With the review screen's magnifier, histograms and text cover the displayed part, as on the Z 6: "The histogram will be updated to show only the data for the portion of the image visible in the display."

TutoPhoto's choices, not sourced, as none of the pages read gives a camera's computation:
- histograms are computed on the final photo, at 8 bits per channel: 256 columns, from 0 to 255;
- luminance: 0.2126 R + 0.7152 G + 0.0722 B, rounded to the nearest integer, on the photo's values. These coefficients are those of the sRGB standard ([Wikipedia, "sRGB", revision 1378992844](https://en.wikipedia.org/w/index.php?title=SRGB&oldid=1378992844), a secondary source, read on 12 November 2026), where they apply to linear values; applying them to the photo's values is TutoPhoto's choice, which borrows the name "Luminance" from Sony;
- height: each histogram is scaled to its tallest column, not counting columns 0 and 255, so that a peak at one end does not flatten the rest; these two columns are drawn at their true height, capped at the edge of the plot.

What luminance hides: a bright red pixel (255, 0, 0) has one channel at the maximum value, but its luminance is 0.2126 × 255, that is 54. The luminance histogram files it among the dark tones; the red histogram shows it at the right end.

Not simulated: the camera's picture settings ("Picture Control" on the Z 6), which TutoPhoto does not apply to its photo, so its histograms cannot match a camera's; the histogram shown while shooting, which both cameras offer; the other playback information pages. The pages read do not say on which image a camera computes its histograms.

## Exercise

The reference sheet suggests matching four histograms with four photos; the exercise is adapted to the park. In mode A at f/8, with the "Info: histograms" display:
- release the shutter without exposure compensation, then with −2 EV, then with +2 EV; the report shows about −0.2 EV, −2.2 EV and +1.8 EV;
- compare the three displays: which way does the distribution move when the photo gets darker? When it gets brighter?
- read the line of text under the histograms of each photo: which one has no pixel at the maximum value? Which one has the most?
- set exposure compensation back to 0: it stays memorised.

Measured on 12 November 2026 with the starting framing, at 50 mm: no pixel at the maximum value at −2.2 EV, 0.8% of the image at −0.2 EV, 6.1% at +1.8 EV. The walker and the dog cross the frame: your values will be close, not identical.

To see where these pixels are on the photo, switch to the "Info: highlights" display (MES-07).
