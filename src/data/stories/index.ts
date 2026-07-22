import sleepyCloud from './sleepyCloud';
import breathingGarden from './breathingGarden';
import braveLittleStar from './braveLittleStar';
import calmRiver from './calmRiver';
import forestFriends from './forestFriends';
import wiggleWorm from './wiggleWorm';
import focusCrystal from './focusCrystal';
import balloonRide from './balloonRide';
import coloringHeart from './coloringHeart';
import tummyBoat from './tummyBoat';

import sleepStories from './sleepStories';
import breathingStories from './breathingStories';
import focusStories from './focusStories';
import anxietyStories from './anxietyStories';
import kindnessStories from './kindnessStories';
import confidenceStories from './confidenceStories';
import emotionsStories from './emotionsStories';

export * from './types';

export const STORIES = [
  sleepyCloud,
  breathingGarden,
  braveLittleStar,
  calmRiver,
  forestFriends,
  wiggleWorm,
  focusCrystal,
  balloonRide,
  coloringHeart,
  tummyBoat,

  ...sleepStories,
  ...breathingStories,
  ...focusStories,
  ...anxietyStories,
  ...kindnessStories,
  ...confidenceStories,
  ...emotionsStories,
];
