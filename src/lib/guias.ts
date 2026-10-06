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
