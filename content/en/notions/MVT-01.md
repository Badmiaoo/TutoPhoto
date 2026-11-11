# MVT-01 · Freezing motion

## Explanation

During the exposure, a moving subject moves across the sensor. With a simple projection, a point at position (X, Z) in front of the camera projects to x = f X / Z; if it moves at velocity (vX, vZ), its trail on the sensor is f × (vX Z − X vZ) / Z² × t, for a focal length f and an exposure t. The trail therefore depends on the subject's speed, its direction (a subject crossing the frame trails more than one coming towards you) and its size in the image (f / Z). The subject is judged frozen when this trail stays below the acceptable blur, the sensor diagonal divided by 1500, or 0.029 mm for full frame ([Wikipedia, "Circle of confusion", revision 1335590423](https://en.wikipedia.org/w/index.php?title=Circle_of_confusion&oldid=1335590423)).

Calculation for the park's dog (3.5 m/s, side-on, 9 m away, at 50 mm): the trail is 50 × 3.5 / 9 × t ≈ 19.4 mm/s × t. It stays below 0.029 mm up to about 1/680 s: 1/800 s or faster is needed. For the walker (1.25 m/s at 12.5 m), 50 × 1.25 / 12.5 = 5 mm/s × t, so 1/200 s is enough.

## Simulator

The balance indicator and the report give the trail of the aimed subject, the walker and the dog, in pixels of the photo (1500 px on the long side), with the limit (1.2 px for full frame). The computed photo shows the real motion blur, frame by frame in a burst. Camera shake is neither sourced nor simulated.

## Exercise

The reference sheet suggests freezing a jump, then a cyclist side-on; the park has a dog running side-on and a walker. Find the slowest shutter speed that freezes the walker (1/200 s), then the one that freezes the dog (1/800 s), and check them with the report; pass challenge SIT-06.
