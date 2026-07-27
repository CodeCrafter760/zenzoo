import { StoryItem } from './types';

// Teen-tagged stories reuse the same animations/genres as younger tiers but
// reframe the situations toward what actually stresses out 13-17 year olds —
// exam pressure, comparison/social media, and identity — instead of new content.
const teenStories: StoryItem[] = [
  {
    title: 'The Lighthouse in the Fog',
    emoji: '🌫️',
    description: 'The night before finals, a lighthouse keeper learns that steady beats bright when the fog rolls in.',
    readTime: '5 min',
    color: '#5BB8E4',
    bg: '#EAF6FD',
    anim: 'lighthouse-beam',
    audio: null,
    genre: 'Focus',
    ageGroup: 'Teen (13-17)',
    content: `Mara had kept the lighthouse for exactly one season, and tonight was the thickest fog she'd ever seen roll in off the water. Ships were due. Her notes on the schedule were a mess. She stood at the top of the tower running through everything she hadn't finished — the log she hadn't updated, the lens she hadn't cleaned in a week, the storm she should've seen coming.

"You're doing the thing again," said old Tomas, the harbor master, climbing the last few steps behind her. "Trying to fix six things at once instead of turning the light on."

"But what if the light isn't enough? What if I need to also fix the—"

"Mara." He put a hand on the railing, steady. "A lighthouse doesn't clear the fog. It doesn't do your other work for you either. It does exactly one thing: it turns, at exactly the same speed, all night, so that from wherever a ship is, the light reaches them eventually."

She looked at the lens, dusty but functional. Not perfect. Just working.

"I don't have to be the smartest light on the coast tonight," she said slowly.

"No," Tomas agreed. "You have to be the one that's on, and turning, and predictable. A ship out there isn't hoping for a brilliant lighthouse. It's hoping for one it can count on to still be there in ten minutes."

Mara lit the lamp. It wasn't dazzling — it was steady, sweeping the same slow arc it always had, cutting through the grey in patient, even turns.

She didn't finish the log that night, or clean the lens, or solve the schedule. She just kept the light turning, one slow rotation after another, and by morning three ships had come in safely, guided not by brilliance but by rhythm.

"How'd you know it would be enough?" she asked Tomas as the fog finally lifted.

"I didn't," he said. "But panicking about everything at once has never once turned a light on faster than just turning it on."`,
    es: {
      title: 'El Faro en la Niebla',
      description: 'La noche antes de los exámenes finales, un farero aprende que la constancia vale más que el brillo cuando llega la niebla.',
      readTime: '5 min',
      content: `Mara llevaba exactamente una temporada cuidando el faro, y esta noche la niebla que subía del mar era la más espesa que había visto. Debían llegar barcos. Sus notas del horario eran un desastre. Se quedó en lo alto de la torre repasando todo lo que no había terminado: el registro sin actualizar, la lente sin limpiar en una semana, la tormenta que debió haber previsto.

—Estás haciendo eso otra vez —dijo el viejo Tomás, el jefe del puerto, subiendo los últimos escalones detrás de ella—. Tratar de arreglar seis cosas a la vez en lugar de encender la luz.

—¿Pero y si la luz no basta? ¿Y si también necesito arreglar el—

—Mara. —Puso una mano firme en la baranda—. Un faro no despeja la niebla. Tampoco hace el resto de tu trabajo por ti. Hace exactamente una cosa: girar, a la misma velocidad, toda la noche, para que desde donde esté un barco, la luz lo alcance eventualmente.

Ella miró la lente, polvorienta pero funcional. No perfecta. Solo funcionando.

—No tengo que ser la luz más brillante de la costa esta noche —dijo lentamente.

—No —coincidió Tomás—. Tienes que ser la que está encendida, girando, previsible. Un barco allá afuera no espera un faro deslumbrante. Espera uno con el que pueda contar en diez minutos más.

Mara encendió la lámpara. No era deslumbrante: era constante, barriendo el mismo arco lento de siempre, cortando el gris en giros pacientes y parejos.

Esa noche no terminó el registro, ni limpió la lente, ni resolvió el horario. Solo mantuvo la luz girando, una rotación lenta tras otra, y para la mañana tres barcos habían llegado a salvo, guiados no por el brillo sino por el ritmo.

—¿Cómo sabías que sería suficiente? —le preguntó a Tomás cuando por fin se levantó la niebla.

—No lo sabía —dijo—. Pero entrar en pánico por todo a la vez nunca ha encendido una luz más rápido que simplemente encenderla.`,
    },
  },
  {
    title: 'The Mirror Pond',
    emoji: '🪞',
    description: 'A young heron keeps comparing her reflection to every other bird on the pond, until she learns what the water is actually for.',
    readTime: '5 min',
    color: '#8B5CF6',
    bg: '#F0EDFF',
    anim: 'calm-river',
    audio: null,
    genre: 'Confidence',
    ageGroup: 'Teen (13-17)',
    content: `Every evening, Wren the heron stood at the edge of the pond and studied the water. Not to drink. Not to fish. To compare.

"The egret's feathers are so much whiter," she'd mutter, tilting her head at her own grey reflection. "The crane's neck curves so much more gracefully." By the time the sun set, she'd found forty small ways she came up short, all from a single glance at a pond she'd never once used for actually seeing herself — only for measuring herself against everyone else's reflection that happened to ripple past.

An old turtle named Bram, who'd lived at the pond longer than any bird could remember, surfaced beside her one evening.

"You've been standing here an hour," he said. "Long time to look at water."

"I'm just seeing how I compare," Wren said.

"To what?"

"Everyone. Everything. All of it, at once."

Bram blinked slowly. "The pond only ever shows you one reflection at a time — yours, when you look at yourself, theirs, when you look at them. It never shows a comparison. You're the one doing that part, after the water's already done its job."

Wren frowned at her reflection. It hadn't changed. Same grey feathers, same reflection it had always been.

"So what's it for, then? If not comparing?"

"Same thing it's always been for," Bram said. "Showing you exactly what's there. Nothing more, nothing less. Whether that's useful to you depends entirely on what you came looking for."

Wren looked down again — really looked, this time, instead of measuring. The grey wasn't dull. It caught the last orange light of sunset in a way the egret's white feathers didn't, and her long neck, not curved like the crane's, held itself with a stillness that was, she realized, entirely her own.

"I don't think I've ever actually looked at just me," she admitted.

"Most don't," Bram said, sinking back beneath the surface. "The pond's patient, though. It'll still be here tomorrow, showing you exactly what's there, whenever you're ready to actually look instead of compare."`,
    es: {
      title: 'El Estanque Espejo',
      description: 'Una joven garza no deja de comparar su reflejo con el de cada otra ave del estanque, hasta que aprende para qué sirve realmente el agua.',
      readTime: '5 min',
      content: `Cada noche, Wren la garza se paraba a la orilla del estanque y estudiaba el agua. No para beber. No para pescar. Para comparar.

—Las plumas de la garceta son tan blancas —murmuraba, ladeando la cabeza hacia su propio reflejo gris—. El cuello de la grulla se curva con tanta más gracia. Para cuando se ponía el sol, había encontrado cuarenta pequeñas formas en las que se quedaba corta, todo de un solo vistazo a un estanque que nunca había usado en realidad para verse a sí misma, solo para medirse contra el reflejo de cualquier otro que pasara ondeando.

Una vieja tortuga llamada Bram, que había vivido en el estanque más tiempo del que cualquier ave podía recordar, salió a la superficie junto a ella una noche.

—Llevas una hora aquí parada —dijo—. Mucho tiempo para mirar agua.

—Solo estoy viendo cómo me comparo —dijo Wren.

—¿Con qué?

—Con todos. Con todo. Todo a la vez.

Bram parpadeó despacio. —El estanque solo te muestra un reflejo a la vez: el tuyo, cuando te miras a ti misma, el de ellos, cuando los miras a ellos. Nunca muestra una comparación. Esa parte la haces tú, después de que el agua ya hizo su trabajo.

Wren frunció el ceño ante su reflejo. No había cambiado. Las mismas plumas grises, el mismo reflejo de siempre.

—Entonces, ¿para qué sirve, si no es para comparar?

—Para lo mismo de siempre —dijo Bram—. Para mostrarte exactamente lo que hay. Ni más, ni menos. Que te sea útil o no depende enteramente de lo que hayas venido a buscar.

Wren volvió a mirar hacia abajo, esta vez de verdad, en lugar de medir. El gris no era apagado. Atrapaba la última luz naranja del atardecer de una forma que las plumas blancas de la garceta no lograban, y su largo cuello, no curvado como el de la grulla, se sostenía con una quietud que, se dio cuenta, era enteramente suya.

—Creo que nunca había mirado solo a mí —admitió.

—La mayoría no lo hace —dijo Bram, hundiéndose de nuevo bajo la superficie—. El estanque es paciente, eso sí. Seguirá aquí mañana, mostrando exactamente lo que hay, cuando estés lista para mirar de verdad en lugar de comparar.`,
    },
  },
  {
    title: 'Weather, Not Forecast',
    emoji: '🌦️',
    description: 'A storm cloud convinced she\'ll rain forever learns the difference between a mood passing through and a mood moving in.',
    readTime: '5 min',
    color: '#748FFC',
    bg: '#EEF0FF',
    anim: 'weather-mood',
    audio: null,
    genre: 'Emotions',
    ageGroup: 'Teen (13-17)',
    content: `Nimbus had been raining for two days straight, and she was starting to believe it was simply who she was now.

"I'm just a rain cloud," she told the wind, who kept trying to push her along. "This is my whole personality. I don't think I stop."

The wind, who moved through a hundred kinds of weather a day and had opinions about all of them, didn't push harder. She just slowed down enough to talk.

"You rained yesterday too," the wind said. "And the day before. What happened right before you started?"

Nimbus thought back. "I collided with that cold front over the mountains. It knocked something loose in me."

"And before that?"

"I was... fine. Sunny, even. Practically clear sky."

"So," the wind said, "you weren't always a rain cloud. Something happened, and now you're a rain cloud raining. That's different from 'rain cloud' being the whole forecast forever."

Nimbus felt her edges shift, uncertain. "But it's been two days. Doesn't that make it permanent?"

"Two days is weather," the wind said. "It's real while it's happening — I'm not telling you to pretend you're not raining. But weather is a thing passing through the sky, not the sky's whole personality. The sky was clear before this front came in. It'll be clear again after."

"How do you know?"

"Because I've watched every cloud that ever rained eventually run out of rain," the wind said. "Not because they tried hard to stop, or because someone told them to cheer up. They just... emptied out, the way clouds do, and what was underneath the rain — clear sky — was there the whole time, waiting."

Nimbus let herself keep raining a little longer. It didn't feel like weakness anymore, just weather — a real thing happening, moving through her the way weather moves through any sky, without being asked to be anything other than what it was, for exactly as long as it needed to be.

By the next afternoon, without any dramatic turn, she noticed she'd run light. Then clear. The mountains were still there. So was she — the same sky, having just finished some weather, not having become someone new.`,
    es: {
      title: 'Clima, No Pronóstico',
      description: 'Una nube de tormenta convencida de que lloverá para siempre aprende la diferencia entre un estado de ánimo que pasa y uno que se instala.',
      readTime: '5 min',
      content: `Nimbus llevaba lloviendo dos días seguidos, y empezaba a creer que eso era simplemente quien era ahora.

—Solo soy una nube de lluvia —le dijo al viento, que seguía intentando empujarla—. Esta es toda mi personalidad. No creo que vaya a parar.

El viento, que atravesaba cien tipos de clima al día y tenía opiniones sobre todos ellos, no empujó más fuerte. Solo bajó la velocidad lo suficiente para hablar.

—También lloviste ayer —dijo el viento—. Y el día anterior. ¿Qué pasó justo antes de que empezaras?

Nimbus pensó hacia atrás. —Choqué con ese frente frío sobre las montañas. Algo se soltó dentro de mí.

—¿Y antes de eso?

—Estaba... bien. Soleada, incluso. Prácticamente cielo despejado.

—Entonces —dijo el viento—, no siempre fuiste una nube de lluvia. Algo pasó, y ahora eres una nube de lluvia lloviendo. Eso es distinto a que "nube de lluvia" sea todo el pronóstico para siempre.

Nimbus sintió que sus bordes se movían, inseguros. —Pero ya llevo dos días. ¿Eso no lo hace permanente?

—Dos días es clima —dijo el viento—. Es real mientras sucede, no te estoy diciendo que finjas que no está lloviendo. Pero el clima es algo que pasa por el cielo, no toda la personalidad del cielo. El cielo estaba despejado antes de que llegara este frente. Volverá a estar despejado después.

—¿Cómo lo sabes?

—Porque he visto a cada nube que alguna vez llovió quedarse eventualmente sin lluvia —dijo el viento—. No porque se esforzaran mucho por parar, ni porque alguien les dijera que se animaran. Simplemente... se vaciaron, como hacen las nubes, y lo que había debajo de la lluvia (cielo despejado) estuvo ahí todo el tiempo, esperando.

Nimbus se dejó seguir lloviendo un poco más. Ya no se sentía como debilidad, solo como clima: algo real sucediendo, pasando a través de ella como el clima pasa por cualquier cielo, sin que se le pidiera ser otra cosa que lo que era, durante exactamente el tiempo que necesitaba ser.

Para la tarde siguiente, sin ningún giro dramático, notó que había aligerado. Luego, despejado. Las montañas seguían ahí. Ella también: el mismo cielo, que solo había terminado cierto clima, no que se hubiera convertido en alguien nuevo.`,
    },
  },
];

export default teenStories;
