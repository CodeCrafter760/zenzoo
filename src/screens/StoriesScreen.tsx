import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import { useZenZoo } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME } from '../theme/theme';
import { tapHaptic } from '../utils/haptics';
import { Feather } from '@expo/vector-icons';
import MassagePlayer, { MassageRoutine } from './MassagePlayer';
import AffirmationPlayer, { AffirmationItem } from './AffirmationPlayer';
import StoryPlayer from './StoryPlayer';
import { STORIES, StoryItem, StoryGenre, StoryAgeGroup, STORY_GENRES, STORY_AGE_GROUPS } from '../data/stories';

type Section = 'Affirmations' | 'Massages' | 'Stories';

// ── Affirmations ──────────────────────────────────────────────────────────────

const AFFIRMATIONS: AffirmationItem[] = [
  { text: 'I am brave and strong',           emoji: '🦁', color: '#FF8267', bg: '#FFF0EC', anim: 'pulse-ring',    es: 'Soy valiente y fuerte' },
  { text: 'I am loved exactly as I am',      emoji: '💛', color: '#FFB830', bg: '#FFF8E0', anim: 'float-hearts',  es: 'Me quieren tal como soy' },
  { text: 'I can do hard things',            emoji: '💪', color: '#7C6EF0', bg: '#F0EDFF', anim: 'rise-up',       es: 'Puedo hacer cosas difíciles' },
  { text: 'I am kind and caring',            emoji: '🌸', color: '#FF85A2', bg: '#FFF0F5', anim: 'spin-petals',   es: 'Soy amable y cariñoso' },
  { text: 'Every day I am growing',          emoji: '🌱', color: '#3DD6C0', bg: '#E0FAF5', anim: 'grow-plant',    es: 'Cada día estoy creciendo' },
  { text: 'My feelings are valid',           emoji: '💜', color: '#A88FF0', bg: '#F2EDFF', anim: 'wave',          es: 'Mis sentimientos son válidos' },
  { text: 'I am enough just as I am',        emoji: '⭐', color: '#FFB830', bg: '#FFF8E0', anim: 'star-burst',    es: 'Soy suficiente tal como soy' },
  { text: 'I choose joy today',              emoji: '🌈', color: '#5BB8E4', bg: '#EAF6FD', anim: 'rainbow',       es: 'Hoy elijo la alegría' },
  { text: 'I am a wonderful friend',         emoji: '🤝', color: '#3DD6C0', bg: '#E0FAF5', anim: 'come-together', es: 'Soy un amigo maravilloso' },
  { text: 'My dreams are worth chasing',     emoji: '🌙', color: '#6366F1', bg: '#EDE9FF', anim: 'float-dream',   es: 'Mis sueños valen la pena' },
  { text: 'I believe in myself',             emoji: '🌟', color: '#FFB830', bg: '#FFF8E0', anim: 'expand-rings',  es: 'Creo en mí' },
  { text: 'I am creative and full of ideas', emoji: '🎨', color: '#FF8267', bg: '#FFF0EC', anim: 'color-dots',    es: 'Tengo mucha creatividad y muchas ideas' },
];

// ── Massage routines ──────────────────────────────────────────────────────────

const MASSAGES: MassageRoutine[] = [
  {
    title: 'Morning Wake-Up',
    emoji: '☀️',
    description: 'Gentle strokes to help your baby greet the day',
    duration: '5 min',
    color: '#FFB830',
    bg: '#FFF8E0',
    tip: 'Best after a nappy change when baby is calm and alert',
    es: {
      title: 'Despertar Matutino',
      description: 'Caricias suaves para ayudar a tu bebé a comenzar el día',
      tip: 'Ideal después de cambiar el pañal, cuando el bebé está tranquilo y despierto',
      steps: [
        {
          instruction: 'Calienta tus manos',
          detail: 'Vierte unas gotas de aceite apto para bebés en tus palmas. Frótalas en círculos lentos hasta que sientas tus manos calientitas y suaves.',
        },
        {
          instruction: 'Caricia de "libro abierto" en el pecho',
          detail: 'Coloca ambas manos planas en el centro del pecho del bebé. Desliza suavemente hacia los lados, como si abrieras las páginas de un libro. Repite 6 veces.',
        },
        {
          instruction: 'Caricias en los brazos',
          detail: 'Envuelve suavemente un brazo del bebé con una mano, comenzando en el hombro. Desliza suavemente hasta la muñeca. Alterna los brazos y repite 4 veces en cada uno.',
        },
        {
          instruction: 'Círculos en la pancita, en sentido horario',
          detail: 'Con dos dedos, traza círculos lentos y suaves sobre la pancita del bebé. Muévete siempre en sentido horario, la misma dirección en la que viaja la comida. Haz 8 círculos lentos.',
        },
        {
          instruction: 'Caricias en las piernas',
          detail: 'Envuelve el muslo del bebé con ambas manos y desliza con firmeza y suavidad hasta el tobillo. Repite en ambas piernas 4 veces cada una, siempre de arriba hacia abajo.',
        },
        {
          instruction: 'Sostén cálido para terminar',
          detail: 'Coloca ambas manos calientitas suavemente sobre la pancita del bebé. Quédate quieto, respira despacio y haz contacto visual suave. Deja que el bebé sienta tu calma.',
        },
      ],
    },
    steps: [
      {
        instruction: 'Warm your hands',
        detail: 'Pour a few drops of baby-safe oil into your palms. Rub them together in slow circles until your hands feel warm and cosy.',
        anim: 'small-circles',
        zone: 'full-body',
      },
      {
        instruction: 'Open-book chest stroke',
        detail: 'Place both hands flat at the centre of baby\'s chest. Slowly stroke outward to the sides, like opening the pages of a book. Repeat 6 times.',
        anim: 'stroke-out',
        zone: 'chest',
      },
      {
        instruction: 'Arm strokes',
        detail: 'Wrap one hand gently around baby\'s arm at the shoulder. Stroke smoothly down to the wrist. Alternate arms and repeat 4 times each.',
        anim: 'stroke-down',
        zone: 'both-arms',
      },
      {
        instruction: 'Clockwise tummy circles',
        detail: 'Using two fingers, trace slow, gentle circles on baby\'s tummy. Always move clockwise — the same direction food travels. Do 8 slow circles.',
        anim: 'circle-cw',
        zone: 'tummy',
      },
      {
        instruction: 'Leg strokes',
        detail: 'Wrap both hands around baby\'s thigh and stroke long and firmly down to the ankle. Repeat on both legs 4 times each, always top to bottom.',
        anim: 'stroke-down',
        zone: 'both-legs',
      },
      {
        instruction: 'Warm hold to finish',
        detail: 'Place both warm hands gently over baby\'s tummy. Hold still, breathe slowly, and make gentle eye contact. Let baby feel your calm.',
        anim: 'hold',
        zone: 'tummy',
      },
    ],
  },
  {
    title: 'Tummy Relief',
    emoji: '🌀',
    description: 'Eases gas and colic with soothing tummy strokes',
    duration: '6 min',
    color: '#3DD6C0',
    bg: '#E0FAF5',
    tip: 'Wait at least 30 min after a feed. Stop if baby seems uncomfortable.',
    es: {
      title: 'Alivio de la Pancita',
      description: 'Alivia los gases y los cólicos con caricias calmantes en la pancita',
      tip: 'Espera al menos 30 minutos después de una toma. Detente si el bebé parece incómodo.',
      steps: [
        {
          instruction: 'Dobla las rodillas con suavidad',
          detail: 'Acuesta al bebé boca arriba. Con ambas manos, dobla suavemente sus rodillas hacia la pancita y sostén durante 5 segundos. Esto relaja los músculos del abdomen.',
        },
        {
          instruction: 'Círculos grandes en sentido horario',
          detail: 'Con toda la palma de tu mano, haz círculos grandes y lentos en sentido horario por toda la pancita del bebé. Ve siempre en sentido horario, ya que sigue la dirección de la digestión. Repite 8 veces.',
        },
        {
          instruction: 'Caricia "Te Quiero"',
          detail: 'Traza la letra I hacia abajo por el lado izquierdo de la pancita. Luego traza una L invertida a lo largo de la parte superior y hacia abajo por la izquierda. Por último, traza una U desde la derecha, cruzando la parte inferior y subiendo por la izquierda. Di "Te… Quiero…" mientras lo haces.',
        },
        {
          instruction: 'Piernas de bicicleta',
          detail: 'Sostén suavemente los tobillos del bebé y pedalea lentamente sus piernas —la rodilla izquierda hacia la pancita, luego la derecha— con un movimiento suave de bicicleta. Continúa durante 30 segundos.',
        },
        {
          instruction: 'Presión de rodillas hacia la pancita',
          detail: 'Junta ambas rodillas y presiónalas suavemente hacia la pancita del bebé. Sostén durante 5 segundos y luego suelta lentamente. Repite 5 veces.',
        },
        {
          instruction: 'Caricias finales hacia abajo',
          detail: 'Coloca ambas manos una junto a la otra justo debajo de las costillas del bebé. Desliza lentamente y con firmeza hacia las caderas. Repite 6 veces para calmar la pancita.',
        },
      ],
    },
    steps: [
      {
        instruction: 'Bend the knees gently',
        detail: 'Lay baby on their back. With both hands, gently bend baby\'s knees toward their tummy and hold for 5 seconds. This relaxes the belly muscles.',
        anim: 'hold',
        zone: 'both-legs',
      },
      {
        instruction: 'Big clockwise circles',
        detail: 'Using your whole palm, make large, slow clockwise circles around baby\'s entire tummy. Always go clockwise — this follows the direction of digestion. Repeat 8 times.',
        anim: 'circle-cw',
        zone: 'tummy',
      },
      {
        instruction: '"I Love You" stroke',
        detail: 'Trace the letter I down baby\'s left side. Then trace an upside-down L across the top and down the left. Finally trace a U from the right, across the bottom, and up the left. Say "I… Love… You" as you go.',
        anim: 'circle-cw',
        zone: 'tummy',
      },
      {
        instruction: 'Bicycle legs',
        detail: 'Hold baby\'s ankles gently and slowly pedal their legs — left knee toward tummy, then right — in a smooth cycling motion. Continue for 30 seconds.',
        anim: 'bicycle',
        zone: 'both-legs',
      },
      {
        instruction: 'Knees to tummy press',
        detail: 'Hold both knees together and gently press them toward baby\'s tummy. Hold for 5 seconds, then slowly release. Repeat 5 times.',
        anim: 'squeeze',
        zone: 'both-legs',
      },
      {
        instruction: 'Downward finishing strokes',
        detail: 'Place both hands side by side just below baby\'s ribs. Stroke down slowly and firmly toward the hips. Repeat 6 times to settle the tummy.',
        anim: 'stroke-down',
        zone: 'tummy',
      },
    ],
  },
  {
    title: 'Leg & Foot Massage',
    emoji: '🦶',
    description: 'Calming strokes for little legs and tiny toes',
    duration: '5 min',
    color: '#FF85A2',
    bg: '#FFF0F5',
    tip: 'Babies especially love this routine before sleep — try it as part of bedtime',
    es: {
      title: 'Masaje de Piernas y Pies',
      description: 'Caricias calmantes para piernitas y deditos pequeños',
      tip: 'A los bebés les encanta esta rutina antes de dormir. Pruébala como parte de la hora de acostarse.',
      steps: [
        {
          instruction: 'Aceite tibio en tus manos',
          detail: 'Frota unas gotas de aceite para bebé entre tus palmas para calentarlo. Prueba la temperatura en tu muñeca antes de tocar al bebé.',
        },
        {
          instruction: 'Caricia de "ordeño"',
          detail: 'Envuelve el muslo del bebé con ambas manos. Desliza con firmeza pero con suavidad hasta el tobillo, una mano siguiendo a la otra como en un movimiento de ordeño. Repite 5 veces en cada pierna.',
        },
        {
          instruction: 'Suave presión a lo largo de la pierna',
          detail: 'Comenzando en el muslo, presiona y suelta suavemente la pierna mientras avanzas hacia la pantorrilla. Como si amasaras masa con suavidad. Hazlo dos veces en cada pierna.',
        },
        {
          instruction: 'Círculos con el pulgar en la planta',
          detail: 'Sostén el pie del bebé con una mano. Usa ambos pulgares para dibujar pequeños círculos por toda la planta, desde el talón hasta la base de los dedos. Dedica 20 segundos a cada pie.',
        },
        {
          instruction: 'Suave estiramiento de los deditos',
          detail: 'Toma cada dedito entre tu dedo y tu pulgar. Hazlo girar con mucha suavidad y estíralo suavemente desde la base hasta la punta. Trabaja los cinco deditos de cada pie.',
        },
        {
          instruction: 'Caricias en el empeine',
          detail: 'Usa tu pulgar para deslizar desde el tobillo hasta los dedos a lo largo del empeine. Luego traza de regreso por los costados. Repite 4 veces en cada pie.',
        },
        {
          instruction: 'Sostén ambos pies para terminar',
          detail: 'Envuelve ambos pies del bebé con tus palmas tibias y simplemente sostenlos durante 20 a 30 segundos. Este calor y esta suave presión le indican al bebé que todo está seguro y tranquilo.',
        },
      ],
    },
    steps: [
      {
        instruction: 'Warm oil on your hands',
        detail: 'Rub a few drops of baby oil between your palms to warm them. Test the temperature on your wrist before touching baby.',
        anim: 'small-circles',
        zone: 'full-body',
      },
      {
        instruction: 'Indian milking stroke',
        detail: 'Wrap both hands around baby\'s thigh. Stroke firmly but gently all the way down to the ankle, one hand following the other like a milking motion. Repeat 5 times per leg.',
        anim: 'stroke-down',
        zone: 'both-legs',
      },
      {
        instruction: 'Gentle squeeze along the leg',
        detail: 'Starting at the thigh, gently squeeze and release the leg as you work down toward the calf. Like gently kneading dough. Do both legs twice.',
        anim: 'squeeze',
        zone: 'both-legs',
      },
      {
        instruction: 'Thumb circles on the sole',
        detail: 'Hold baby\'s foot in one hand. Use both thumbs to draw small circles all over the sole, from the heel to the base of the toes. Spend 20 seconds on each foot.',
        anim: 'small-circles',
        zone: 'feet',
      },
      {
        instruction: 'Gentle toe pull',
        detail: 'Take each tiny toe between your finger and thumb. Give it a very gentle roll and soft pull from its base to the tip. Work across all five toes on each foot.',
        anim: 'toe-pull',
        zone: 'feet',
      },
      {
        instruction: 'Top of foot strokes',
        detail: 'Use your thumb to stroke from the ankle down to the toes along the top of the foot. Then trace back up the sides. Repeat 4 times per foot.',
        anim: 'stroke-down',
        zone: 'feet',
      },
      {
        instruction: 'Hold both feet to finish',
        detail: 'Cup both of baby\'s feet in your warm palms and simply hold for 20–30 seconds. This warmth and gentle pressure signals to baby that all is safe and calm.',
        anim: 'hold',
        zone: 'feet',
      },
    ],
  },
  {
    title: 'Back Massage',
    emoji: '🌊',
    description: 'Long soothing strokes to melt away tension',
    duration: '5 min',
    color: '#7C6EF0',
    bg: '#F0EDFF',
    tip: 'Lay baby face-down on your lap or a padded surface with head turned to one side',
    es: {
      title: 'Masaje de Espalda',
      description: 'Caricias largas y calmantes para disolver la tensión',
      tip: 'Acuesta al bebé boca abajo sobre tu regazo o una superficie acolchada, con la cabeza girada hacia un lado',
      steps: [
        {
          instruction: 'Asienta tus manos',
          detail: 'Después de calentar el aceite, coloca ambas manos suavemente en la parte superior de la espalda del bebé. Haz una pausa de 10 segundos. Deja que el bebé sienta tu calidez y se ponga cómodo.',
        },
        {
          instruction: 'Caricias largas en la espalda',
          detail: 'Desliza ambas manos lentamente desde los hombros del bebé hasta la colita. Mantén las manos planas, adaptadas a la forma del bebé. Haz 8 caricias lentas.',
        },
        {
          instruction: 'Caricias de "limpiaparabrisas"',
          detail: 'Coloca ambas manos a un lado de la espalda del bebé y desliza alternadamente hacia el otro lado. Ve bajando desde los hombros hasta la colita, como un limpiaparabrisas.',
        },
        {
          instruction: 'Círculos a los lados de la columna',
          detail: 'Con la yema de los dedos, haz pequeños círculos suaves a ambos lados de la columna del bebé, nunca presiones directamente sobre la columna. Trabaja despacio desde el cuello hasta la parte baja de la espalda.',
        },
        {
          instruction: 'Palmaditas suaves',
          detail: 'Con los dedos suaves y planos, da palmaditas rítmicas muy suaves en la parte baja de la espalda y la colita del bebé, como un redoble de tambor lento y suave. Esto es profundamente calmante para los bebés.',
        },
        {
          instruction: 'Caricia final de cuerpo completo',
          detail: 'Con ambas manos juntas, desliza lentamente desde la parte más alta de la cabeza del bebé hasta los pies en un solo movimiento largo y continuo. Repite 3 veces y luego descansa las manos.',
        },
      ],
    },
    steps: [
      {
        instruction: 'Settle your hands',
        detail: 'After warming your oil, place both hands gently on baby\'s upper back. Pause for 10 seconds. Let baby feel your warmth and get comfortable.',
        anim: 'hold',
        zone: 'back',
      },
      {
        instruction: 'Long back strokes',
        detail: 'Stroke both hands slowly from baby\'s shoulders all the way down to the bottom. Keep your hands flat and moulded to baby\'s shape. Do 8 slow strokes.',
        anim: 'stroke-down',
        zone: 'back',
      },
      {
        instruction: 'Windshield wiper strokes',
        detail: 'Place both hands on one side of baby\'s back and alternately stroke across to the other side. Work your way down from the shoulders to the bottom, like windshield wipers.',
        anim: 'windshield',
        zone: 'back',
      },
      {
        instruction: 'Spine-side circles',
        detail: 'Using your fingertips, make small gentle circles on either side of baby\'s spine — never press on the spine itself. Work slowly from the neck all the way down to the lower back.',
        anim: 'small-circles',
        zone: 'back',
      },
      {
        instruction: 'Gentle patting',
        detail: 'Using soft, flat fingers, give very gentle rhythmic pats across baby\'s lower back and bottom — like a slow soft drumroll. This is deeply calming for babies.',
        anim: 'windshield',
        zone: 'back',
      },
      {
        instruction: 'Full-body finishing stroke',
        detail: 'With both hands together, stroke slowly from the very top of baby\'s head all the way to the feet in one long, connected motion. Repeat 3 times, then rest your hands.',
        anim: 'stroke-down',
        zone: 'full-body',
      },
    ],
  },
  {
    title: 'Face & Head',
    emoji: '💆',
    description: 'Tiny gentle touches for deep bonding and calm',
    duration: '4 min',
    color: '#FF8267',
    bg: '#FFF0EC',
    tip: 'Use clean dry hands — no oil on the face. Keep all movements feather-light.',
    es: {
      title: 'Cara y Cabeza',
      description: 'Pequeños toques suaves para un vínculo profundo y calma',
      tip: 'Usa las manos limpias y secas, sin aceite en la cara. Mantén todos los movimientos ligeros como una pluma.',
      steps: [
        {
          instruction: 'Manos limpias y secas',
          detail: 'Lávate y sécate las manos. No se necesita aceite para la cara. Sostén la cabeza del bebé entre tus manos por un momento para que se calme y se sienta seguro.',
        },
        {
          instruction: 'Círculos en el cuero cabelludo',
          detail: 'Con la yema de los dedos, haz pequeños círculos muy ligeros por todo el cuero cabelludo del bebé. Muévete lentamente desde la frente hacia la parte de atrás de la cabeza. Dedica unos 30 segundos a esto.',
        },
        {
          instruction: 'Caricia hacia afuera en la frente',
          detail: 'Coloca ambos pulgares en el centro de la frente del bebé. Desliza hacia afuera, hacia las sienes, en líneas lentas y suaves. Es una caricia maravillosa para liberar tensión. Repite 6 veces.',
        },
        {
          instruction: 'Círculos en las mejillas',
          detail: 'Con uno o dos dedos en cada lado, haz círculos suaves en las mejillas del bebé. Sonríe y habla suavemente mientras lo haces: los bebés leen tu rostro mientras sienten tu toque.',
        },
        {
          instruction: 'Caricia en la ceja y la nariz',
          detail: 'Con un dedo, traza suavemente desde el puente de la nariz hacia afuera, a lo largo de la ceja hasta la sien. Repite en ambos lados. Esto suele hacer que los bebés cierren los ojitos.',
        },
        {
          instruction: 'Trazo en la mandíbula',
          detail: 'Con un dedo en cada lado, traza suavemente a lo largo de la mandíbula del bebé, desde el mentón hasta la oreja. Con una presión muy ligera. Repite 3 veces.',
        },
        {
          instruction: 'Sostén la cabeza para cerrar',
          detail: 'Acuna la cabeza del bebé suavemente con ambas manos. Sostén durante 15 a 20 segundos en silencio. Respira despacio. Este último momento es uno de los más íntimos de toda la rutina.',
        },
      ],
    },
    steps: [
      {
        instruction: 'Clean, dry hands',
        detail: 'Wash and dry your hands. No oil is needed for the face. Cup baby\'s head in your hands for a moment to let them settle and feel safe.',
        anim: 'hold',
        zone: 'head',
      },
      {
        instruction: 'Scalp circles',
        detail: 'With your fingertips, make tiny, feather-light circles all over baby\'s scalp. Move slowly from the forehead toward the back of the head. Spend about 30 seconds here.',
        anim: 'small-circles',
        zone: 'head',
      },
      {
        instruction: 'Forehead outward stroke',
        detail: 'Place both thumbs at the centre of baby\'s forehead. Stroke outward toward the temples in slow, smooth lines. This is a lovely tension-releasing stroke. Repeat 6 times.',
        anim: 'stroke-out',
        zone: 'face',
      },
      {
        instruction: 'Cheek circles',
        detail: 'Using one or two fingertips on each side, make gentle circles on baby\'s cheeks. Smile and talk softly while you do this — babies read your face as they feel your touch.',
        anim: 'small-circles',
        zone: 'face',
      },
      {
        instruction: 'Brow and nose stroke',
        detail: 'Using one finger, trace gently from the bridge of the nose outward along the brow bone to the temple. Repeat on both sides. This often makes babies close their eyes.',
        anim: 'stroke-out',
        zone: 'face',
      },
      {
        instruction: 'Jawline trace',
        detail: 'With one fingertip on each side, trace gently along baby\'s jaw from the chin to the ear. Very light pressure. Repeat 3 times.',
        anim: 'windshield',
        zone: 'face',
      },
      {
        instruction: 'Cup the head to close',
        detail: 'Cradle baby\'s head softly in both hands. Hold for 15–20 quiet seconds. Breathe slowly. This final hold is one of the most bonding moments of the whole routine.',
        anim: 'hold',
        zone: 'head',
      },
    ],
  },
  {
    title: 'Bedtime Calm',
    emoji: '🌙',
    description: 'A full-body wind-down to prepare baby for sleep',
    duration: '8 min',
    color: '#6366F1',
    bg: '#EDE9FF',
    tip: 'Dim the lights, play soft music or white noise, and use lavender baby oil if you have it',
    es: {
      title: 'Calma para Dormir',
      description: 'Una rutina de relajación de cuerpo completo para preparar al bebé para dormir',
      tip: 'Baja las luces, pon música suave o ruido blanco, y usa aceite de bebé con lavanda si lo tienes',
      steps: [
        {
          instruction: 'Crea el ambiente',
          detail: 'Atenúa la habitación. Pon música suave. Calienta el aceite y coloca ambas manos sobre el pecho del bebé. Respira lenta y profundamente. El bebé sentirá tu calma incluso antes de que empieces.',
        },
        {
          instruction: 'Caricias de la cabeza a los pies',
          detail: 'Con toda la mano, desliza desde la parte superior de la cabeza del bebé hasta los pies en un solo movimiento largo y continuo. Muévete tan lento como te sea posible. Repite 6 veces.',
        },
        {
          instruction: 'Círculos suaves en el pecho',
          detail: 'Usa dos dedos para dibujar círculos lentos, en sentido horario, sobre el pecho del bebé. Mantén una presión ligera y un ritmo muy lento, más lento de lo que te parezca natural.',
        },
        {
          instruction: 'Caricias lentas en las piernas',
          detail: 'Envuelve los muslos del bebé con ambas manos y desliza hacia los pies. Usa una presión firme y lenta. Repite 5 veces en cada pierna, alternando entre ellas.',
        },
        {
          instruction: 'Sostén ambos pies',
          detail: 'Envuelve ambos pies del bebé con tus palmas tibias y sostenlos durante 30 segundos. El calor y el suave peso de tus manos son profundamente calmantes a la hora de dormir.',
        },
        {
          instruction: 'Mano en el pecho',
          detail: 'Coloca una mano en el pecho del bebé y otra en la pancita. Siente su respiración. Respira con él: inhala despacio, exhala despacio. Deja que tu respiración calmada se convierta en la suya.',
        },
        {
          instruction: 'Mece y tararea',
          detail: 'Levanta al bebé despacio y mécelo suavemente de lado a lado. Tararea o canta una canción suave. Su cuerpo ya está preparado para dormir; ahora deja que tu voz y tu ritmo lo lleven hasta allí.',
        },
      ],
    },
    steps: [
      {
        instruction: 'Set the mood',
        detail: 'Dim the room. Play soft music. Warm your oil and place both hands on baby\'s chest. Breathe slowly and deeply. Baby will feel your calm before you even begin.',
        anim: 'hold',
        zone: 'chest',
      },
      {
        instruction: 'Head-to-toe strokes',
        detail: 'With your whole hand, stroke from the top of baby\'s head all the way to their feet in one long, connected motion. Move as slowly as you possibly can. Repeat 6 times.',
        anim: 'stroke-down',
        zone: 'full-body',
      },
      {
        instruction: 'Gentle chest circles',
        detail: 'Use two fingers to draw slow, clockwise circles on baby\'s chest. Keep the pressure light and the pace very slow — slower than feels natural to you.',
        anim: 'circle-cw',
        zone: 'chest',
      },
      {
        instruction: 'Slow leg strokes',
        detail: 'Wrap both hands around baby\'s thighs and stroke down to the feet. Use firm, slow pressure. Repeat 5 times on each leg, alternating between them.',
        anim: 'stroke-down',
        zone: 'both-legs',
      },
      {
        instruction: 'Hold both feet',
        detail: 'Cup both of baby\'s feet in your warm palms and hold for 30 seconds. The warmth and gentle weight of your hands is profoundly soothing at sleep time.',
        anim: 'hold',
        zone: 'feet',
      },
      {
        instruction: 'Hand on chest',
        detail: 'Place one hand on baby\'s chest and one on their tummy. Feel their breathing. Breathe with them — slowly in, slowly out. Let your calm breathe become their calm.',
        anim: 'hold',
        zone: 'chest',
      },
      {
        instruction: 'Rock and hum',
        detail: 'Lift baby slowly and rock gently side to side. Hum or sing a quiet song. Their body has been prepared for sleep — now let your voice and rhythm carry them there.',
        anim: 'hold',
        zone: 'full-body',
      },
    ],
  },
];

// ── Story filters ──────────────────────────────────────────────────────────────

const GENRE_EMOJI: Record<StoryGenre, string> = {
  Sleep: '🌙', Breathing: '🌬️', Focus: '🎯', Anxiety: '🎈', Kindness: '💗', Confidence: '⭐', Emotions: '🌲',
};
const AGE_EMOJI: Record<StoryAgeGroup, string> = {
  'Toddler (2-4)': '🍼', 'Preschool (4-6)': '🧒', 'Big Kid (6-9)': '🧑',
};

type GenreFilter = StoryGenre | 'All';
type AgeFilter = StoryAgeGroup | 'All';

// ── Sections config ───────────────────────────────────────────────────────────

const ACCENT = '#FF7BAC';

const SECTIONS: { id: Section; emoji: string }[] = [
  { id: 'Affirmations', emoji: '✨' },
  { id: 'Massages',     emoji: '🤲' },
  { id: 'Stories',      emoji: '📖' },
];

// ── Screen ────────────────────────────────────────────────────────────────────

function FilterChip({ label, active, isDark, T, onPress }: {
  label: string; active: boolean; isDark: boolean; T: typeof LIGHT_THEME | typeof DARK_THEME; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: isDark ? T.edge : '#F5F0FF' },
        active && { backgroundColor: ACCENT },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, { color: active ? '#FFF' : T.mid }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function useSprings(count: number) {
  const vals = useRef(Array.from({ length: count }, () => new Animated.Value(1))).current;
  const pressIn  = (i: number) => { tapHaptic(); Animated.spring(vals[i], { toValue: 0.94, friction: 6, tension: 300, useNativeDriver: true }).start(); };
  const pressOut = (i: number) => Animated.spring(vals[i], { toValue: 1,    friction: 4, tension: 300, useNativeDriver: true }).start();
  return { vals, pressIn, pressOut };
}

export default function StoriesScreen() {
  const { isDark, ageGroup, language, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;

  const [section,           setSection]           = useState<Section>('Affirmations');
  const [activeRoutine,     setActiveRoutine]     = useState<MassageRoutine | null>(null);
  const [activeAffirmation, setActiveAffirmation] = useState<AffirmationItem | null>(null);
  const [activeStory,       setActiveStory]       = useState<StoryItem | null>(null);
  const [genreFilter,       setGenreFilter]       = useState<GenreFilter>('All');
  // Defaults to the active child's own age group, so stories are age-appropriate
  // right away — the "All" chip is still there if they want to browse everything.
  const [ageFilter,         setAgeFilter]         = useState<AgeFilter>(ageGroup);
  // Toddlers get no filter UI at all — too many choices — and stay locked to
  // their own bracket instead of being able to browse into older content.
  const isToddler = ageGroup === 'Toddler (2-4)';

  const affSprings     = useSprings(AFFIRMATIONS.length);
  const routineSprings = useSprings(MASSAGES.length);
  const storySprings   = useSprings(STORIES.length);
  const sectionScale   = useRef(new Animated.Value(1)).current;

  const filteredStories = STORIES.filter(s =>
    (genreFilter === 'All' || s.genre === genreFilter) &&
    (ageFilter   === 'All' || s.ageGroup === ageFilter)
  );

  const switchSection = (s: Section) => {
    tapHaptic();
    setSection(s);
    sectionScale.setValue(1.08);
    Animated.spring(sectionScale, { toValue: 1, friction: 4, tension: 300, useNativeDriver: true }).start();
  };

  if (activeRoutine) {
    return <MassagePlayer routine={activeRoutine} onClose={() => setActiveRoutine(null)} />;
  }

  if (activeAffirmation) {
    return <AffirmationPlayer item={activeAffirmation} onClose={() => setActiveAffirmation(null)} />;
  }

  if (activeStory) {
    return <StoryPlayer story={activeStory} onClose={() => setActiveStory(null)} />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#FFF5F8' }]}>

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: T.edge }]}>
        <Text style={[styles.title, { color: T.text }]}>{t('Stories & Calm')}</Text>
        <View style={styles.sectionRow}>
          {SECTIONS.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.sectionTab,
                { backgroundColor: isDark ? T.edge : '#F5F0FF' },
                section === s.id && { backgroundColor: ACCENT },
              ]}
              onPress={() => switchSection(s.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionEmoji}>{s.emoji}</Text>
              <Text style={[styles.sectionLabel, { color: section === s.id ? '#FFF' : T.mid }]}>
                {t(s.id)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={section === 'Stories'}>

        {/* ── AFFIRMATIONS ── */}
        {section === 'Affirmations' && (
          <>
            <Text style={[styles.hint, { color: T.mid }]}>{t('Read one slowly and let it sink in 💛')}</Text>
            <View style={styles.affGrid}>
              {AFFIRMATIONS.map((a, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.affCard, {
                    backgroundColor: isDark ? T.card : a.bg,
                    borderColor:     isDark ? T.edge : a.color + '55',
                    transform:       [{ scale: affSprings.vals[i] }],
                  }]}
                  onPress={() => setActiveAffirmation(a)}
                  onPressIn={() => affSprings.pressIn(i)}
                  onPressOut={() => affSprings.pressOut(i)}
                  activeOpacity={1}
                >
                  <Text style={styles.affEmoji}>{a.emoji}</Text>
                  <Text style={[styles.affText, { color: isDark ? T.text : a.color }]}>{language === 'es' ? (a.es ?? a.text) : a.text}</Text>
                  <View style={[styles.affPlayBtn, { backgroundColor: a.color }]}>
                    <Text style={styles.affPlayText}>{t('Tap')} ✨</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ── MASSAGES ── */}
        {section === 'Massages' && (
          <>
            <View style={[styles.parentBanner, { backgroundColor: isDark ? T.card : '#FFF0F5', borderColor: ACCENT + '55' }]}>
              <Text style={[styles.parentBannerText, { color: isDark ? T.text : '#C2447A' }]}>
                {t('👨‍👩‍👧 For parents & carers — these guided massages are for you to gently give your child, not for kids to do alone.')}
              </Text>
            </View>
            <Text style={[styles.hint, { color: T.mid }]}>{t('Tap a routine to begin 🤲')}</Text>
            <View style={styles.cardList}>
              {MASSAGES.map((m, i) => {
                const tr = language === 'es' ? m.es : undefined;
                return (
                <TouchableOpacity
                  key={i}
                  style={[styles.routineCard, { backgroundColor: T.card, borderColor: T.edge, transform: [{ scale: routineSprings.vals[i] }] }]}
                  onPress={() => setActiveRoutine(m)}
                  onPressIn={() => routineSprings.pressIn(i)}
                  onPressOut={() => routineSprings.pressOut(i)}
                  activeOpacity={1}
                >
                  <View style={[styles.routineEmojiBox, { backgroundColor: isDark ? m.color + '22' : m.bg }]}>
                    <Text style={styles.routineEmoji}>{m.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.routineTitle, { color: T.text }]}>{tr?.title ?? m.title}</Text>
                    <Text style={[styles.routineDesc,  { color: T.mid  }]}>{tr?.description ?? m.description}</Text>
                    <View style={styles.routineMeta}>
                      <View style={[styles.badge, { backgroundColor: isDark ? m.color + '22' : m.bg }]}>
                        <Text style={[styles.badgeText, { color: m.color }]}>⏱ {m.duration}</Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: isDark ? m.color + '22' : m.bg }]}>
                        <Text style={[styles.badgeText, { color: m.color }]}>{m.steps.length} {t('steps')}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.startBtn, { backgroundColor: m.color }]}>
                    <Text style={styles.startBtnText}>{t('Start')}</Text>
                    <Feather name="arrow-right" size={16} color="#FFF" />
                  </View>
                </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* ── STORIES ── */}
        {section === 'Stories' && (
          <>
            <Text style={[styles.hint, { color: T.mid }]}>{t('Tap a story to begin 📖')}</Text>

            {/* Filter bar — hidden for Toddler, who just sees their own bracket */}
            {!isToddler && (
              <View style={styles.filterBlock}>
                <Text style={[styles.filterLabel, { color: T.mid }]}>{t('Genre')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                  <FilterChip label={t('All')} active={genreFilter === 'All'} isDark={isDark} T={T} onPress={() => { tapHaptic(); setGenreFilter('All'); }} />
                  {STORY_GENRES.map(g => (
                    <FilterChip key={g} label={`${GENRE_EMOJI[g]} ${t(g)}`} active={genreFilter === g} isDark={isDark} T={T} onPress={() => { tapHaptic(); setGenreFilter(g); }} />
                  ))}
                </ScrollView>

                <Text style={[styles.filterLabel, { color: T.mid, marginTop: 10 }]}>{t('Age')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                  <FilterChip label={t('All')} active={ageFilter === 'All'} isDark={isDark} T={T} onPress={() => { tapHaptic(); setAgeFilter('All'); }} />
                  {STORY_AGE_GROUPS.map(a => (
                    <FilterChip key={a} label={`${AGE_EMOJI[a]} ${t(a)}`} active={ageFilter === a} isDark={isDark} T={T} onPress={() => { tapHaptic(); setAgeFilter(a); }} />
                  ))}
                </ScrollView>
              </View>
            )}

            {filteredStories.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={[styles.emptyText, { color: T.mid }]}>{t('No stories match those filters yet.')}</Text>
              </View>
            ) : (
              <View style={styles.storyGrid}>
                {filteredStories.map((story, i) => {
                  const tr = language === 'es' ? story.es : undefined;
                  return (
                  <TouchableOpacity
                    key={story.title}
                    style={[styles.storyCard, {
                      backgroundColor: isDark ? T.card : story.bg,
                      borderColor:     isDark ? T.edge : story.color + '55',
                      transform:       [{ scale: storySprings.vals[i] }],
                    }]}
                    onPress={() => setActiveStory(story)}
                    onPressIn={() => storySprings.pressIn(i)}
                    onPressOut={() => storySprings.pressOut(i)}
                    activeOpacity={1}
                  >
                    <Text style={styles.storyEmoji}>{story.emoji}</Text>
                    <Text style={[styles.storyTitle, { color: isDark ? T.text : story.color }]} numberOfLines={2}>{tr?.title ?? story.title}</Text>
                    <View style={[styles.storyMetaPill, { backgroundColor: story.color }]}>
                      <Text style={styles.storyMetaText}>📖 {tr?.readTime ?? story.readTime}</Text>
                    </View>
                  </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
    borderBottomWidth: 1.5,
  },
  title:      { fontSize: 24, fontWeight: '900', letterSpacing: -0.3, marginBottom: 14 },
  sectionRow: { flexDirection: 'row', gap: 8 },
  sectionTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 10, borderRadius: 18,
  },
  sectionEmoji: { fontSize: 14 },
  sectionLabel: { fontSize: 12, fontWeight: '800' },

  scroll: { padding: 16, paddingTop: 18 },
  hint:   { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 18 },

  // Story filters
  filterBlock: { marginBottom: 16, marginTop: -8 },
  filterLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6, marginLeft: 2 },
  filterRow:   { flexDirection: 'row', gap: 8, paddingRight: 4 },
  chip:        { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  chipText:    { fontSize: 12, fontWeight: '800' },

  parentBanner:     { borderRadius: 16, borderWidth: 1.5, padding: 12, marginBottom: 14 },
  parentBannerText: { fontSize: 12.5, fontWeight: '700', lineHeight: 18 },

  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyEmoji: { fontSize: 32 },
  emptyText:  { fontSize: 13, fontWeight: '600' },

  // Affirmations
  affGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  affCard: {
    width: '47.5%', borderRadius: 20, padding: 18,
    alignItems: 'center', borderWidth: 1.5, gap: 10,
  },
  affEmoji:    { fontSize: 36 },
  affText:     { fontSize: 13, fontWeight: '700', textAlign: 'center', lineHeight: 20 },
  affPlayBtn:  { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5, marginTop: 4 },
  affPlayText: { fontSize: 11, fontWeight: '800', color: '#FFF' },

  // Story cards — square, 3 per row
  storyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  storyCard: {
    width: '31%', aspectRatio: 1, borderRadius: 18, padding: 10,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, gap: 6,
  },
  storyEmoji:     { fontSize: 28 },
  storyTitle:     { fontSize: 11.5, fontWeight: '800', textAlign: 'center', lineHeight: 14 },
  storyMetaPill:  { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginTop: 2 },
  storyMetaText:  { fontSize: 10, fontWeight: '800', color: '#FFF' },

  // Shared card list
  cardList: { gap: 14 },

  // Massage routine cards
  routineCard: {
    borderRadius: 22, borderWidth: 1.5, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  routineEmojiBox: { width: 64, height: 64, borderRadius: 18, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  routineEmoji:    { fontSize: 34 },
  routineTitle:    { fontSize: 16, fontWeight: '900', marginBottom: 4 },
  routineDesc:     { fontSize: 12, fontWeight: '600', lineHeight: 18, marginBottom: 6 },
  routineMeta:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge:           { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:       { fontSize: 11, fontWeight: '700' },
  startBtn:        { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center', gap: 2, flexShrink: 0 },
  startBtnText:    { fontSize: 12, fontWeight: '900', color: '#FFF' },
  startArrow:      { fontSize: 14, color: '#FFF' },
});
