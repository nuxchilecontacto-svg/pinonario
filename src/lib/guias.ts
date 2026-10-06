/** Índice de guías: se usa en el listado, el sitemap y los enlaces entre guías. */
export type Guia = { slug: string; titulo: string; tituloSeo: string; descripcion: string; resumen: string; minutos: number; foto: string };

export const GUIAS: Guia[] = [
  {
    slug: "como-medir-un-pinon",
    titulo: "Cómo medir un piñón con pie de metro",
    tituloSeo: "Cómo Medir un Piñón con Pie de Metro (Paso a Paso, con Z Impar)",
    descripcion:
      "La forma correcta de medir un piñón de cadena: contar dientes, medir puntas y fondo (también con Z impar), sacar el paso y reconocer el desgaste. Con ejemplos reales.",
    resumen: "Contar dientes, medir puntas y fondo, el truco del Z impar y cómo reconocer un diente gastado.",
    minutos: 6,
    foto: "taller-pinon-simple.jpg",
  },
  {
    slug: "08b-vs-asa-40",
    titulo: "08B vs ASA 40: cadena europea o americana",
    tituloSeo: "08B vs ASA 40: Diferencias entre Cadena Europea y Americana",
    descripcion:
      "Mismo paso de 1/2\", pero no son iguales. Qué cambia entre la cadena ISO serie B (08B) y la ANSI (ASA 40), si se pueden mezclar y cómo distinguirlas en 1 minuto.",
    resumen: "Mismo paso, distinto rodillo. Qué cambia, si se pueden mezclar y cómo distinguirlas.",
    minutos: 5,
    foto: "taller-pinones-eje.jpg",
  },
  {
    slug: "como-elegir-numero-de-dientes",
    titulo: "Cómo elegir el número de dientes de un piñón",
    tituloSeo: "Cuántos Dientes Debe Tener un Piñón: Guía para Elegir Z",
    descripcion:
      "Por qué 17 dientes es el mínimo recomendado, el efecto poligonal en números, la relación máxima, Z impar con eslabones pares y un ejemplo completo de selección.",
    resumen: "El mínimo de 17 dientes explicado con números, relación máxima y un ejemplo completo.",
    minutos: 6,
    foto: "taller-eje-pinones.jpg",
  },
  {
    slug: "material-y-tratamiento-termico",
    titulo: "Material y tratamiento térmico para piñones y engranajes",
    tituloSeo: "Qué Acero Usar para Piñones y Engranajes (1045, 4140, 8620) y Cómo Templarlos",
    descripcion:
      "SAE 1045, 4140, 8620, fundición, inoxidable o plástico: cuándo usar cada uno, qué tratamiento térmico conviene (inducción, bonificado, cementado) y los errores más comunes.",
    resumen: "1045, 4140, 8620 y otros: cuándo usar cada uno, cómo templar y los errores típicos.",
    minutos: 7,
    foto: "taller-torneado.jpg",
  },
];

export const guiaPorSlug = (s: string) => GUIAS.find((g) => g.slug === s);

/** Guías en inglés (mismas fotos; slugs en lib/idioma.ts → GUIAS_SLUG). */
export const GUIAS_EN: Guia[] = [
  {
    slug: "how-to-measure-a-sprocket",
    titulo: "How to measure a sprocket with a caliper",
    tituloSeo: "How to Measure a Sprocket with a Caliper (Step by Step, Odd Tooth Counts Too)",
    descripcion:
      "The right way to measure a roller chain sprocket: count teeth, measure over the tips and root to root (odd tooth counts too), find the pitch and spot wear. With real numbers.",
    resumen: "Count teeth, measure tips and root, the odd-tooth trick and how to spot a hooked tooth.",
    minutos: 6,
    foto: "taller-pinon-simple.jpg",
  },
  {
    slug: "08b-vs-ansi-40",
    titulo: "08B vs ANSI 40: European or American chain",
    tituloSeo: "08B vs ANSI 40 (#40) Chain: Differences Between European and American Roller Chain",
    descripcion:
      "Same 1/2\" pitch, but not the same chain. What changes between ISO B series (08B) and ANSI (#40), whether you can mix them and how to tell them apart in a minute.",
    resumen: "Same pitch, different roller. What changes, can you mix them, and how to tell them apart.",
    minutos: 5,
    foto: "taller-pinones-eje.jpg",
  },
  {
    slug: "how-many-teeth-sprocket",
    titulo: "How many teeth should a sprocket have",
    tituloSeo: "How Many Teeth Should a Sprocket Have? Choosing the Tooth Count",
    descripcion:
      "Why 17 teeth is the recommended minimum, chordal action in numbers, the maximum ratio, odd tooth counts with even links, and a full selection example.",
    resumen: "The 17-tooth minimum explained with numbers, maximum ratio and a complete example.",
    minutos: 6,
    foto: "taller-eje-pinones.jpg",
  },
  {
    slug: "sprocket-gear-material-heat-treatment",
    titulo: "Material and heat treatment for sprockets and gears",
    tituloSeo: "Best Steel for Sprockets and Gears (1045, 4140, 8620) and How to Harden Them",
    descripcion:
      "1045, 4140, 8620, cast iron, stainless or plastic: when to use each, which heat treatment fits (induction, through hardening, carburizing) and the most common mistakes.",
    resumen: "1045, 4140, 8620 and more: when to use each, how to harden and typical mistakes.",
    minutos: 7,
    foto: "taller-torneado.jpg",
  },
];

export const guiaEnPorSlug = (s: string) => GUIAS_EN.find((g) => g.slug === s);
