# reestructuramos — Propuesta institucional

**La planilla oficial venezolana de Evaluación Rápida de Daños en Edificaciones (FUNVISIS / IMME-UCV), convertida en herramienta digital gratuita que funciona sin internet.**
Dirigida a FUNVISIS, Protección Civil, Colegios de Ingenieros, universidades, cuerpos de bomberos y organizaciones de respuesta.

---

## El problema

Tras los sismos **M7.2 y M7.5 del 24 de junio de 2026**, hay que evaluar **miles de edificaciones** en poco tiempo para decidir cuáles son seguras de habitar. Ese triaje se hace hoy con la planilla en papel, de forma dispersa y sin conectividad (la red celular colapsa tras un evento mayor), lo que genera:

- Datos que no se consolidan en un panorama común para coordinar la respuesta.
- Evidencia (fotos, ubicación, firmas) separada de la planilla y difícil de rastrear.
- Doble trabajo: llenar en campo y transcribir después.

## La solución

**reestructuramos** es una aplicación web instalable (PWA) que implementa **1:1 la metodología oficial venezolana** — la planilla **«Evaluación Rápida de Daños en Edificaciones»** de FUNVISIS y el IMME-UCV (López, Coronel, Ginés, Fierro, Marinilli y Urich, Boletín de la Academia Nacional de la Ingeniería y el Hábitat N.º 61, 2023) — y guía al inspector **sección por sección, con las mismas reglas de la planilla**:

- Las 7 secciones oficiales: información general, inspección externa, piso crítico y daño Severo/Completo, daño Moderado, componentes no estructurales, riesgo global y acciones recomendadas.
- Los criterios exactos: umbrales 10 %–30 % de daño Moderado, plomada de 2 cm/60 cm, asentamiento de 20 cm, reglas de corte con salto directo a etiqueta roja, tabla oficial de criterios de daño por ancho de grieta.
- La calificación A/B/C y las **etiquetas oficiales**: acceso permitido (verde), restringido (amarilla) y no permitido (roja). La app *sugiere*; **la decisión final siempre es del inspector** (endurecer es libre; suavizar exige justificación).

### Qué produce cada inspección

- **La planilla oficial en PDF** (2 páginas, con croquis del piso crítico y firmas de hasta 4 inspectores con cédula), generada en el propio teléfono, sin internet.
- **La etiqueta imprimible** (verde/amarilla/roja) con N.º de planilla, edificación e inspectores.
- Evidencia trazable: fotos con GPS y fecha/hora embebidos, fisurómetro (ancho de grietas con los criterios oficiales), inclinómetro con los sensores del teléfono.

### Qué obtiene la institución

- **Funciona 100 % sin conexión**: todo se guarda en el dispositivo y se sincroniza solo cuando vuelve la señal. Diseñada para el escenario post-sismo real.
- **Dashboard de coordinación**: mapa semáforo de la zona, filtros por evento/municipio/fecha y **exportación CSV y GeoJSON** (compatible con QGIS y sistemas de las entidades).
- **Historial por edificio** (código QR en la etiqueta): las re-inspecciones tras réplicas se acumulan; nunca se sobrescribe el registro anterior.
- **Importador de QuickCheck Damage**: las inspecciones ya levantadas con la app ESRE se pueden incorporar al mismo mapa.
- **Formación integrada**: inducción con mini-examen, guía de campo offline con los patrones de daño y **los documentos oficiales de la metodología** (planilla, paper y manual de entrenamiento) descargables dentro de la app.

## Por qué es confiable

- **Es la metodología oficial venezolana**, no una adaptación extranjera: el motor de cálculo replica las reglas de la planilla FUNVISIS/IMME-UCV y está verificado contra el documento fuente con una batería de pruebas automatizadas. (Se mantiene el mapeo a ATC-20 para interoperabilidad internacional.)
- **Antifraude:** GPS + marca de tiempo en cada inspección y foto; sello de proveniencia en la imagen; firmas capturadas en pantalla.
- **Privacidad:** los datos personales del inspector no son públicos; el mapa expone solo lo necesario.
- **Código abierto (licencia MIT)** y auditable: cualquier institución puede revisarlo o adaptarlo.
- **Acceso libre y anónimo:** cualquiera puede usarla de inmediato, sin crear cuenta. **Gratuita, sin fines comerciales.**

## Qué ofrecemos a su institución

1. Uso **gratuito** e ilimitado de la herramienta, lista para operar hoy.
2. Acompañamiento para un **piloto con una brigada** (capacitación express incluida en la app).
3. **Panel y exportación de datos** (CSV/GeoJSON/mapa) para reportar a autoridades.
4. Apertura a **adaptar el instrumento** a sus procesos y a un proceso de **aval** técnico de FUNVISIS/IMME-UCV.

## Qué pedimos

- **Revisión técnica** de los autores/custodios de la metodología: queremos que el instrumento digital sea fiel y, de ser posible, avalado.
- Un **respaldo o piloto** con una brigada de inspección (voluntarios, estudiantes de ingeniería o personal técnico).
- **Difusión** a colegiados, estudiantes y comunidades.

## Probarla ahora

- **App:** https://app.reestructuramos.com  (instálala: «Agregar a pantalla de inicio»)
- **Demo (video, 70 s):** https://app.reestructuramos.com/demo-funvisis.mp4
- **Código abierto:** https://github.com/comandoconstrucciones/reestructuramos-pwa

---

*Iniciativa sin fines de lucro desarrollada en el marco de Build4Venezuela. Contacto: Claudio Palacios · 0422 1636113 · claudio@comandoconstrucciones.com*

> Nota: reestructuramos es un instrumento de **apoyo al criterio** para triaje rápido; no sustituye una evaluación de ingeniería detallada ni un dictamen oficial. La planilla y la metodología son obra de sus autores (FUNVISIS / IMME-UCV); esta app es una implementación digital independiente que los cita y enlaza.
