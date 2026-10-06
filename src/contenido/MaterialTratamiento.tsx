import Link from "next/link";

export function MaterialTratamiento() {
  return (
    <>
      <p className="entrada">
        En el taller donde nació esta herramienta, la gran mayoría de los piñones y engranajes se hacen en <b>SAE 1045</b> o{" "}
        <b>SAE 4140</b>, con los dientes templados. Pero no es la única opción. Esta guía resume los materiales y tratamientos más
        comunes y cuándo conviene cada uno.
      </p>

      <h2>Los materiales más usados</h2>
      <div className="tabla-wrap">
        <table className="tabla tabla-texto">
          <thead><tr><th>Material</th><th>Para qué sirve</th><th>Tratamiento habitual</th><th>Dureza típica</th></tr></thead>
          <tbody>
            <tr><td>SAE 1020</td><td>Piezas económicas, baja carga, transportadores lentos</td><td>Sin tratamiento, o cementado</td><td>120–140 HB (sin tratar)</td></tr>
            <tr><td><b>SAE 1045</b></td><td>El caballo de batalla: piñones y engranajes de uso general</td><td>Temple por inducción en los dientes</td><td>48–55 HRC en dientes</td></tr>
            <tr><td><b>SAE 4140</b></td><td>Cargas altas, golpes, ejes con piñón incorporado</td><td>Bonificado (temple y revenido) y opcionalmente inducción en dientes, o nitrurado</td><td>28–34 HRC bonificado; 50–55 HRC con inducción</td></tr>
            <tr><td>SAE 8620</td><td>Engranajes muy exigidos: superficie dura y núcleo tenaz</td><td>Cementado y temple</td><td>58–62 HRC superficie</td></tr>
            <tr><td>SAE 4340</td><td>Servicio pesado con impacto (minería, laminación)</td><td>Bonificado</td><td>30–40 HRC</td></tr>
            <tr><td>Fundición gris o nodular</td><td>Ruedas y coronas grandes, de baja velocidad</td><td>Sin tratamiento (pieza fundida)</td><td>180–250 HB</td></tr>
            <tr><td>Inoxidable AISI 304 / 316</td><td>Industria de alimentos, humedad, químicos</td><td>No se templa</td><td>~200 HB</td></tr>
            <tr><td>Plásticos (nylon, UHMW, acetal)</td><td>Bajo ruido, sin lubricación, cargas bajas</td><td>—</td><td>—</td></tr>
          </tbody>
        </table>
      </div>
      <p className="nota-tabla">Valores orientativos. La dureza real depende del proceso, la sección de la pieza y el proveedor del tratamiento.</p>

      <h2>Los tratamientos térmicos, en simple</h2>
      <h3>Temple por inducción de los dientes</h3>
      <p>
        Una bobina calienta solo la zona de los dientes y se enfría de inmediato. Queda una capa dura donde trabaja la cadena o el
        engranaje compañero, y el resto de la pieza (cubo, agujero) queda blando. Es la opción más usada para piñones de cadena en 1045
        y 4140: dientes resistentes al desgaste y un cubo que se puede seguir mecanizando.
      </p>
      <h3>Bonificado (temple y revenido completo)</h3>
      <p>
        Toda la pieza se templa y luego se revine para ganar tenacidad. No queda tan dura como un temple superficial, pero resiste bien
        los golpes en toda la sección. En 4140 muchas veces se compra la barra ya bonificada, lo que ahorra un paso.
      </p>
      <h3>Cementado y temple</h3>
      <p>
        Se agrega carbono a la superficie de un acero de bajo carbono (8620, 1020) y luego se templa. Resultado: superficie muy dura y
        núcleo tenaz. Es el tratamiento de los engranajes de cajas reductoras exigidas. Requiere más control y suele deformar la pieza,
        por lo que los agujeros se rectifican después.
      </p>
      <h3>Nitrurado</h3>
      <p>
        Endurece una capa delgada sin calentar al punto de temple, por lo que casi no deforma. Va bien en 4140 bonificado cuando se
        necesita precisión.
      </p>

      <h2>Cómo elegir</h2>
      <ul>
        <li><b>Uso general, carga media:</b> SAE 1045 con dientes templados por inducción.</li>
        <li><b>Carga alta, golpes, o piñón tallado en el mismo eje:</b> SAE 4140 bonificado, con inducción en los dientes si hay mucho desgaste.</li>
        <li><b>Reductores y engranajes muy exigidos:</b> SAE 8620 cementado.</li>
        <li><b>Coronas grandes y lentas:</b> fundición, o plancha de acero cortada (ver el <Link href="/">DXF para corte</Link>).</li>
        <li><b>Alimentos o corrosión:</b> inoxidable (sin temple) o plásticos técnicos.</li>
        <li><b>Regla de oro:</b> en una pareja, el piñón chico trabaja más vueltas, así que debe ser <b>igual o más duro</b> que el grande.</li>
      </ul>

      <h2>Errores comunes que vemos en reparaciones</h2>
      <ol>
        <li><b>Templar la pieza entera y después querer hacerle el chavetero.</b> Primero el mecanizado del agujero y chavetero, o templar solo los dientes.</li>
        <li><b>Usar acero sin tratamiento en una transmisión con carga.</b> Los dientes se gastan en forma de gancho en pocas semanas.</li>
        <li><b>Cambiar solo la cadena o solo el piñón.</b> Una cadena estirada destruye un piñón nuevo, y un piñón gastado destruye una cadena nueva.</li>
        <li><b>Templar sin revenir.</b> La pieza queda frágil y puede fisurarse en el pie del diente con el primer golpe.</li>
        <li><b>No considerar la deformación del temple.</b> En piezas cementadas o bonificadas después del mecanizado, deja creces para rectificar el agujero.</li>
      </ol>

      <h2>Del material a la pieza</h2>
      <p>
        Cuando tengas el material definido, la <Link href="/">calculadora de piñones</Link> y la de{" "}
        <Link href="/engranajes/">engranajes</Link> te entregan el diámetro de corte de la barra y el peso aproximado, útiles para pedir
        el material y cotizar el tratamiento.
      </p>
    </>
  );
}
