const spinner = document.getElementById("spinner");
const startCityContainer = document.getElementById("startCityContainer");
const tourList = document.querySelector(".tour-list");
const contactForm = document.querySelector(".form-contrainer");
const catalog = document.querySelector(".catalog-container");
const searchButton = document.querySelector(".search-button");
const tourTypeSelect = document.querySelector("#tour-type");
const countrySelect = document.querySelector("#tour-country");
numChildrenSelect = document.getElementById("numChildren");
const birthdatesContainer = document.getElementById("birthdatesContainer");
const startDateContainer = document.getElementById("startDateContainer");
const hotelContainer = document.getElementById("hotelContainer");
const tourTitle = document.getElementById("tourTitle");
const tourDescription = document.getElementById("tourDescription");
const tourIncluded = document.getElementById("tourIncluded");
const tourExcluded = document.getElementById("tourExcluded");
const tourDays = document.getElementById("tourDays");
const busStops = document.getElementById("busStops");
const daysCounter = document.getElementById("daysCounter");
const additionalInfo = document.getElementById("additionalInfo");
const importantInfo = document.getElementById("importantInfo");
const tourDates = document.getElementById("tourDates");
const tourImage = document.getElementById("tourImage");
const today = new Date().toISOString().split("T")[0];
const dateFromInput = document.getElementById("date-from");
const dateToInput = document.getElementById("date-to");
const numChildrenInput = document.getElementById("numChildren");
const numTouristsInput = document.getElementById("numTourists");
const startCityDropdown = document.getElementById("startCity");
const infoTextContainer = document.getElementById("info-text-container");
const datenschutzBtn = document.getElementById("datenschutz-btn");
const impressumBtn = document.getElementById("impressum-btn");
const agbBtn = document.getElementById("agb-btn");
const wiederrufBtn = document.getElementById("wiederruf-btn");
const datenschutzVermittlerBtn = document.getElementById(
  "datenschutz-vermittler-btn"
);

dateFromInput.value = today;
dateToInput.value = today;

//value mapping
if (startCityDropdown) {
  Array.from(startCityDropdown.options).forEach((opt) => {
    if (opt.value !== "all") {
      const normalizedValue = opt.textContent
        .trim()
        .toLowerCase()
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/ß/g, "ss")
        .replace(/[\s/]/g, "_");
      opt.value = normalizedValue;
    }
  });
}

// Datum validieren
dateFromInput.addEventListener("change", () => {
  const fromDate = new Date(dateFromInput.value);
  const toDate = new Date(dateToInput.value);

  if (fromDate > toDate) dateToInput.value = dateFromInput.value;
  dateToInput.min = dateFromInput.value;
});

dateToInput.addEventListener("change", () => {
  const fromDate = new Date(dateFromInput.value);
  const toDate = new Date(dateToInput.value);

  if (toDate < fromDate) dateFromInput.value = dateToInput.value;
  dateFromInput.max = dateToInput.value;
});

// TourId initialisieren
let tourId = 0;

// Spinner aktivieren
spinner.classList.add("active");

// Startstädte Dropdown rendern
function renderCityDropdown(startCities) {
  startCityContainer.innerHTML = "";

  const label = document.createElement("label");
  label.textContent = "Город отправления*: ";
  label.htmlFor = "start-city-select";

  const select = document.createElement("select");
  select.id = "start-city-select";
  select.name = "start-city";
  select.required = true;

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Выберите место отправления:";
  select.appendChild(defaultOption);

  startCities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[\s/]/g, "_");
    option.textContent = city;
    select.appendChild(option);
  });

  startCityContainer.appendChild(label);
  startCityContainer.appendChild(select);
}

// Load CSV laden
const sheetUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRNfC967UzQ8Lu5SN7rrpETre-ILwsnKZ4K6bbmMz_fHvEyrLyFQy-5ixxn278r6FLo_fHdXVvqZBIH/pub?gid=0&single=true&output=csv";

let tours = [];
const BUS_STOPS = [
  {
    key: "dortmund",
    address: "Dortmund Hbf, ZOB, Steinstr. 48, Nordausgang",
  },
  {
    key: "bochum",
    address: "44791 Bochum, Stadionring 20",
  },
  {
    key: "essen",
    address: "Essen Hbf, ZOB-Südseite, Freiheit, Bushaltestelle",
  },
  {
    key: "duesseldorf",
    address: "Düsseldorf Hbf, Worringerstr. 109, Bushaltestelle",
  },
  {
    key: "koeln",
    address:
      "Köln Hbf, Goldgasse, Ecke Breslauer Platz/Johannisstraße 34 bei Kommerz Hotel",
  },
  {
    key: "bonn",
    address: "Bonn Hbf, Quantiusstr. 1",
  },
  {
    key: "siegen",
    address: "Siegen, Koblenzerstr. 151, Siegerlandhalle",
  },
  {
    key: "montabaur",
    address: "ICE Montabaur Bf, Haupteingang, Autobahnseite",
  },
  {
    key: "limburg",
    address: "Limburg ICE Bf, HEM Tankstelle, Brüsselerstr. 2, 65552, Abf. SÜD",
  },
  {
    key: "frankfurt",
    address: "Frankfurt Hbf, Stuttgarterstr. 26, Busterminal",
  },
  {
    key: "darmstadt",
    address: "Darmstadt Hbf, Zweifalltorweg",
  },
  {
    key: "mannheim",
    address: "Mannheim Hbf, Heinrich-von-Stefan-Str.",
  },
  {
    key: "karlsruhe",
    address: "Karlsruhe Hbf, Hintern Bahnhof",
  },
  {
    key: "offenburg",
    address: "Offenburg, Parkplatz im Kreisverkehr 33a, Ausfahrt 55",
  },
  {
    key: "lahr_schwarzwald",
    address: "A5 Ausfahrt 56 Lahr/Schwarzwald, Einsteinallee 2, Tankstelle",
  },
  {
    key: "freiburg",
    address: "Freiburg Hbf, ZOB, Bismarckallee",
  },
  {
    key: "stuttgart",
    address: "70629 Stuttgart, Flughafenstr. 70, OMV Tankstelle",
  },
  {
    key: "ulm",
    address: "89073 Ulm Hbf, Bahnhof Platz",
  },
  {
    key: "aachen",
    address:
      "52078 Aachen Brand, Eckenerstr. 2, Shell Tankstelle, gegen Ausfahrt A44",
  },
];

Papa.parse(sheetUrl, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: (results) => {
    tours = results.data
      .map((tour) => {
        const isActive = String(tour.active).trim().toLowerCase() === "true";

        const busSchedule = BUS_STOPS.map((stop) => {
          const time = tour[stop.key];

          if (!time || !time.trim()) return null;

          return {
            address: stop.address,
            time: time.trim(),
          };
        }).filter(Boolean);

        const startCities = tour.startCities
          ? tour.startCities.split(";").map((c) => c.trim())
          : [];

        const startDates = tour.startDates
          ? tour.startDates
              .split(";")
              .map((d) => {
                const [day, month, year] = d.trim().split(".");
                return new Date(year, month - 1, day);
              })
              .filter((dateObj) => dateObj >= new Date())
          : [];

        if (startDates.length === 0) return null;

        const endDates = tour.endDates
          ? tour.endDates.split(";").map((d) => {
              const [day, month, year] = d.trim().split(".");
              return new Date(`${year}-${month}-${day}`);
            })
          : [];
        const countries = tour.countries
          ? tour.countries.split(";").map((d) => d.trim())
          : [];

        const included = tour.included
          ? tour.included.split(";").map((d) => d.trim())
          : [];
        const excluded = tour.excluded
          ? tour.excluded.split(";").map((d) => d.trim())
          : [];
        const startPrice = tour.startPrice
          ? tour.startPrice.split(";").map((d) => d.trim())
          : [];
        const durationDays = tour.durationDays;

        return {
          ...tour,
          description: tour.description,
          additionalInfo: tour.additionalDescription,
          importantInfo: tour.importantInfo,
          durationDays: tour.durationDays,
          durationNights: tour.durationNights,
          accommodationNights: tour.accommodationDurationNights,
          hotel: tour.hotelType,
          active: isActive,
          startCities,
          startDates,
          endDates,
          included,
          excluded,
          startPrice,
          durationDays,
          countries,
          firstDayDescription: tour.firstDayDescription?.trim() || "",
          secondDayDescription: tour.secondDayDescription?.trim() || "",
          thirdDayDescription: tour.thirdDayDescription?.trim() || "",
          fourthDayDescription: tour.fourthDayDescription?.trim() || "",
          fifthDayDescription: tour.fifthDayDescription?.trim() || "",
          sixthDayDescription: tour.sixthDayDescription?.trim() || "",
          seventhDayDescription: tour.seventhDayDescription?.trim() || "",
          eighthDayDescription: tour.eighthDayDescription?.trim() || "",
          busSchedule,
        };
      })
      .filter((tour) => tour && tour.active);

    tours.sort((a, b) => {
      const firstA = a.startDates[0] || new Date(9999, 0, 1);
      const firstB = b.startDates[0] || new Date(9999, 0, 1);
      return firstA - firstB;
    });

    spinner.classList.remove("active");
    renderTourCards(tours);
  },
});
function openTourDetails(tour) {
  if (tourImage) {
    tourImage.src = tour.imgUrl;
    tourImage.alt = tour.title || "Tour Image";
  }

  tourId = tour.id;
  tourTitle.textContent = tour.title;
  tourDescription.textContent = tour.description;
  tourDates.innerHTML = renderTourDates(tour);

  catalog.style.display = "none";
  contactForm.style.display = "flex";

  renderCityDropdown(tour.startCities);
  renderDatesFields(tour.startDates);
  renderHotelFields(tour.durationDays);
}

//Render Buszeitplan
function renderBusSchedule(tour) {
  if (!tour.busSchedule?.length) return "";

  return `
    <ul class="bus-schedule">
      ${tour.busSchedule
        .map(
          (stop) => `<li><strong>${stop.time}</strong> - ${stop.address}</li>`
        )
        .join("")}
    </ul>
  `;
}

//Render Additional Info
function renderAdditionalInfo(tour) {
  if (!tour.additionalInfo || tour.additionalInfo.length.trim === "") return "";
  return `
</br>
<h1>Дополнительная информация: </h1>
<p style="text-align: start">${tour.additionalInfo} </p>
`;
}

//Render Important Info
function renderImportantInfo(tour) {
  if (!tour.importantInfo || tour.importantInfo.trim() === "") return "";
  return `
<br>
<h1>ВАЖНО!: </h1>
<p style="text-align: start">${tour.importantInfo}</p>
`;
}

//Render Days Counter
function renderDaysCounter(tour) {
  return `
  <br>
  <p>
    ${tour.durationDays} ${
    tour.durationDays == 1
      ? "день"
      : tour.durationDays >= 2 && tour.durationDays <= 4
      ? "дня"
      : "дней"
  }; 
    ${tour.durationNights} ${
    tour.durationNights == 1
      ? "ночь"
      : tour.durationNights >= 2 && tour.durationNights <= 4
      ? "ночи"
      : "ночей"
  }; 
    ${tour.accommodationNights} ${
    tour.accommodationNights == 1
      ? "ночь"
      : tour.accommodationNights >= 2 && tour.accommodationNights <= 4
      ? "ночи"
      : "ночей"
  } в отеле
  </p>
  `;
}

//Tagesplan Rendern
function renderDaysDescription(tour) {
  const dayMap = [
    { key: "firstDayDescription", label: "Первый день" },
    { key: "secondDayDescription", label: "Второй день" },
    { key: "thirdDayDescription", label: "Третий день" },
    { key: "fourthDayDescription", label: "Четвертый день" },
    { key: "fifthDayDescription", label: "Пятый день" },
    { key: "sixthDayDescription", label: "Шестой день" },
    { key: "seventhDayDescription", label: "Седьмой день" },
    { key: "eighthDayDescription", label: "Восьмой день" },
  ];

  return dayMap
    .map(({ key, label }) => {
      const text = tour[key];

      if (!text || !text.trim()) return "";

      return `
  <div class="tour-day">
    <span style="font-weight: bold">${label}:</span>
    <span>${text}</span>
  </div>
`;
    })
    .join("");
}

//Tour Daten Rendern
function renderTourDates(tour) {
  return tour.startDates
    .map((start, i) => {
      const startDay = String(start.getDate()).padStart(2, "0");
      const startMonth = String(start.getMonth() + 1).padStart(2, "0");
      const startYear = start.getFullYear();

      // Mehrtägige Tour
      if (Number(tour.durationDays) > 1 && tour.endDates && tour.endDates[i]) {
        const end = tour.endDates[i];
        const endDay = String(end.getDate()).padStart(2, "0");
        const endMonth = String(end.getMonth() + 1).padStart(2, "0");
        const endYear = end.getFullYear();

        return `<p>с ${startDay}.${startMonth}.${startYear} по ${endDay}.${endMonth}.${endYear}</p>`;
      }

      // Eintägige Tour
      return `<p>${startDay}.${startMonth}.${startYear}</p>`;
    })
    .join("");
}

//Render Included
function renderTourIncluded(tour) {
  if (!Array.isArray(tour.included) || tour.included.length === 0) return "";
  return `
    <br />
    <h1 style="text-align: center">Для ВАС:</h1>
     <ul">
      ${tour.included.map((item) => `<li class="check"> ${item}</li>`).join("")}
    </ul>
  `;
}

//Render Excluded
function renderTourExcluded(tour) {
  if (!Array.isArray(tour.excluded) || tour.excluded.length === 0) return "";

  return `
    <br />  
    <h1 style="text-align: center">Дополнительно оплачивается:</h1>
    <ul">
      ${tour.excluded.map((item) => `<li class="ex"> ${item}</li>`).join("")}
    </ul>
  `;
}

function openTourDetails(tour) {
  if (tourImage) {
    tourImage.src = tour.imgUrl;
    tourImage.alt = tour.title || "Tour Image";
  }

  tourId = tour.id;
  tourTitle.textContent = tour.title;
  tourDescription.textContent = tour.description;
  tourDays.innerHTML = renderDaysDescription(tour);
  tourIncluded.innerHTML = renderTourIncluded(tour);
  tourExcluded.innerHTML = renderTourExcluded(tour);
  busStops.innerHTML = renderBusSchedule(tour);
  tourDates.innerHTML = renderTourDates(tour);
  daysCounter.innerHTML = renderDaysCounter(tour);
  additionalInfo.innerHTML = renderAdditionalInfo(tour);
  importantInfo.innerHTML = renderImportantInfo(tour);

  catalog.style.display = "none";
  contactForm.style.display = "flex";

  renderCityDropdown(tour.startCities);
  renderDatesFields(tour.startDates);
  renderHotelFields(tour.durationDays);
}

// Tours rendern
function renderTourCards(tours) {
  tourList.innerHTML = "";
  tours.forEach((tour) => {
    const newTourCard = document.createElement("div");
    newTourCard.className = "tour-card";

    newTourCard.innerHTML = `
      <div class="tour-img">
        <img src="${tour.imgUrl}" alt="${tour.title} image" />
        <div class="overlay">
        <div class="overlay-text">
              ${tour.countries}
            <p class="spartPrice">${tour.price ? tour.price + "€" : ""}</p>
          </div>  
        </div>
      </div>
      <div class="description">
        <p style="font-weight: bold">${tour.title || ""}</p>
        <p>${tour.summary || ""}</p>
        
      </div>
             <div class="price" style="align-self: center; padding: 15px">
                ${
                  tour.startPrice
                    ? tour.startPrice.map((price) => price).join("<br>")
                    : ""
                }
              </div>
           

           <div class="tour-dates">
  ${renderTourDates(tour)}
  
</div>

           
      <div class="btn-container">
      <button class="order-btn">Больше дат</button>
      </div>
    `;
    const previewArea = newTourCard.querySelector(".tour-img");
    previewArea.addEventListener("click", () => {
      openTourDetails(tour);
    });

    const orderBtn = newTourCard.querySelector(".order-btn");

    orderBtn.addEventListener("click", () => {
      openTourDetails(tour);
    });

    tourList.appendChild(newTourCard);
  });
}

function renderHotelFields(durationDays) {
  hotelContainer.innerHTML = "";

  if (durationDays > 1) {
    const label = document.createElement("label");
    label.textContent = "Размещение в гостинице*:";
    label.htmlFor = "hotel-room-select";

    const select = document.createElement("select");
    select.id = "hotel-room-select";
    select.name = "hotel-room-select";
    select.required = true;

    // ❗ Ungültige Platzhalter-Option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Выберите тип комнаты в гостинице:";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.hidden = true;
    select.appendChild(defaultOption);

    const roomTypes = [
      "Одноместный",
      "Двухместный с одной кроватью",
      "Двухместный с раздельными кроватями",
      "Трехместный",
      "Двухместный + кровать для ребёнка",
    ];

    roomTypes.forEach((type) => {
      const opt = document.createElement("option");
      opt.value = type;
      opt.textContent = type;
      select.appendChild(opt);
    });

    hotelContainer.appendChild(label);
    hotelContainer.appendChild(select);
  }
}

// Geburtsdaten Felder rendern

numChildrenInput.addEventListener("input", () => {
  let count = parseInt(numChildrenInput.value, 10);

  if (isNaN(count) || count < 0) {
    count = 0;
  }

  if (count > 10) {
    count = 10;
  }

  numChildrenInput.value = count;

  renderBirthdateFields(count);
});

numTouristsInput.addEventListener("input", () => {
  let count = parseInt(numTouristsInput.value);
  if (isNaN(count) || count < 1) {
    count = 1;
  }
  numTouristsInput.value = count;
});

function renderBirthdateFields(count) {
  birthdatesContainer.innerHTML = "";

  if (count > 0 && count <= 10) {
    for (let i = 1; i <= count; i++) {
      const row = document.createElement("div");
      row.className = "input-row";

      const label = document.createElement("label");
      label.textContent = `Дата рождения ребёнка ${i}:`;
      label.htmlFor = `child_birthdate_${i}`;

      const input = document.createElement("input");
      input.type = "date";
      input.name = `child_birthdate_${i}`;
      input.id = `child_birthdate_${i}`;
      input.required = true;

      row.appendChild(label);
      row.appendChild(input);

      birthdatesContainer.appendChild(row);
    }
  }
}

// reagiert dynamisch, wenn sich die Kinderanzahl ändert
numChildrenInput.addEventListener("input", () => {
  const count = parseInt(numChildrenInput.value, 10);
  renderBirthdateFields(isNaN(count) ? 0 : Math.max(0, count));
});

// beim Laden keine Kinderfelder anzeigen
renderBirthdateFields(0);

// Start Date Felder rendern
function renderDatesFields(startDates) {
  startDateContainer.innerHTML = "";

  const label = document.createElement("label");
  label.textContent = "Дата отправления*: ";
  label.htmlFor = "start-date-select";

  const select = document.createElement("select");
  select.id = "start-date-select";
  select.name = "start-date";
  select.required = true;

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Выберите дату отправления:";
  select.appendChild(defaultOption);

  startDates.forEach((dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const formatted = `${day}.${month}.${year}`;

    const option = document.createElement("option");
    option.value = formatted;
    option.textContent = formatted;
    select.appendChild(option);
  });

  startDateContainer.appendChild(label);
  startDateContainer.appendChild(select);
}

numChildrenSelect.addEventListener("change", () => {
  renderBirthdateFields(parseInt(numChildrenSelect.value, 10));
});

//render Datenschutzhinweise für nebenberufliche Vermittler

datenschutzVermittlerBtn.addEventListener("click", () => {
  infoTextContainer.innerHTML = `<section id="datenschutz-vermittler">
  <h1>Datenschutzhinweise für nebenberufliche Vermittler</h1>
  <p><strong>Informationsblatt zur Datenverarbeitung (§ 34d Abs. 8 GewO)</strong><br>Stand: 2026</p>

  <h2>1. Verantwortlicher und Kontakt Datenschutzbeauftragter</h2>
  <p>
    Verantwortlich für die Datenverarbeitung ist:<br>
    <strong>Alexander Kaul – IN-SEEL Tourservice</strong><br>
    Sebastianstr. 97<br>
    DE-50735 Köln<br>
    Telefon: +49 221 778 98 702<br>
    E-Mail: <a href="mailto:info@in-seel.de">info@in-seel.de</a><br><br>
    Den Datenschutzbeauftragten erreichen Sie unter derselben Adresse oder per E-Mail.
  </p>

  <h2>2. Verarbeitete Datenkategorien</h2>
  <ul>
    <li>Personenstammdaten (Vorname, Nachname, Namenszusätze, Vermittler- bzw. Agenturnummer)</li>
    <li>Bankverbindungsdaten</li>
    <li>Kommunikationsdaten (geschäftliche Anschrift, Telefon, E-Mail)</li>
    <li>IHK-Registrierung / Vermittlerregisternummer</li>
    <li>Steueridentifikationsnummer</li>
    <li>Produktions- / Provisionsdaten</li>
  </ul>
  <p>Gegebenenfalls werden auch Daten von Untervermittlern oder Mitarbeitern verarbeitet.</p>

  <h2>3. Zweck und Rechtsgrundlage der Datenverarbeitung</h2>
  <p>
    Wir verarbeiten Ihre Daten zur Vertragsdurchführung, Abrechnung, Weiterbildungszwecken,
    Produktionsstatistiken und zur Bereitstellung digitaler Präsenzen.
    Rechtsgrundlage ist Art. 6 Abs. 1 a) oder b) DSGVO. Einwilligungen können jederzeit widerrufen werden.
    In Einzelfällen verarbeiten wir Daten zur Wahrung berechtigter Interessen (Art. 6 Abs. 1 f) DSGVO).
  </p>

  <h2>4. Empfänger der Daten</h2>
  <p>
    Daten werden nur an Personen oder Dienstleister weitergegeben, die diese
    zur Erfüllung unserer vertraglichen oder gesetzlichen Pflichten benötigen:
  </p>
  <ul>
    <li>Bankpartner (SEPA Zahlungsträger)</li>
    <li>Kooperationspartner und Produktgeber</li>
    <li>BaFin (Meldepflichten, z. B. Solvency II)</li>
    <li>Gerichte oder Behörden</li>
    <li>Drittschuldner bei Pfändungen</li>
    <li>Insolvenzverwalter</li>
  </ul>

  <h2>5. Speicherdauer</h2>
  <p>
    Wir löschen personenbezogene Daten, sobald sie nicht mehr erforderlich sind,
    und speichern sie, solange gesetzliche Nachweis- und Aufbewahrungspflichten bestehen
    (bis zu 10 Jahre, ggf. bis 30 Jahre bei titulierten Ansprüchen).
  </p>

  <h2>6. Betroffenenrechte</h2>
  <ul>
    <li>Auskunft über gespeicherte Daten</li>
    <li>Berichtigung unrichtiger Daten</li>
    <li>Löschung der Daten</li>
    <li>Einschränkung der Verarbeitung</li>
    <li>Widerspruch gegen die Verarbeitung</li>
    <li>Herausgabe der bereitgestellten Daten in maschinenlesbarem Format</li>
  </ul>

  <h2>7. Datenschutzaufsichtsbehörde</h2>
  <p>
    Landesbeauftragte für Datenschutz und Informationsfreiheit NRW<br>
    Postfach 20 04 44, 40102 Düsseldorf<br>
    E-Mail: <a href="mailto:poststelle@ldi.nrw.de">poststelle@ldi.nrw.de</a>
  </p>

  <h2>8. Bereitstellung der Daten</h2>
  <p>
    Die Bereitstellung Ihrer Daten ist erforderlich, um einen Vermittlervertrag
    abzuschließen und zu erfüllen.
  </p>

  <h2>9. Datenübermittlung in Drittländer</h2>
  <p>
    Sofern Daten an Dienstleister außerhalb des EWR übermittelt werden,
    erfolgt dies nur bei angemessenem Datenschutzniveau oder geeigneten
    Garantien (z. B. EU-Standardvertragsklauseln).
  </p>

  <h2>10. Automatisierte Entscheidungen / Profiling</h2>
  <p>
    Es finden keine automatisierten Einzelfallentscheidungen oder Profiling-Maßnahmen statt.
  </p>
  <hr><br>
  <h1>Политика конфиденциальности для внештатных посредников</h1>
  <p><strong>Информационный лист по обработке данных (§ 34d Abs. 8 GewO)</strong><br>Дата: 2026</p>

  <h2>1. Ответственный и контакт</h2>
  <p>
    Ответственный за обработку данных:<br>
    <strong>Alexander Kaul – IN-SEEL Tourservice</strong><br>
    Sebastianstr. 97<br>
    DE-50735 Кёльн<br>
    Тел.: +49 221 778 98 702<br>
    E-Mail: <a href="mailto:info@in-seel.de">info@in-seel.de</a><br>
    Контакт с ответственным по защите данных возможен по тому же адресу или по e-mail.
  </p>

  <h2>2. Обрабатываемые категории данных</h2>
  <ul>
    <li>Персональные данные (имя, фамилия, добавочные данные, номер посредника или агентства)</li>
    <li>Банковские реквизиты</li>
    <li>Контактные данные (адрес, телефон, e-mail)</li>
    <li>Регистрация в IHK / номер реестра посредников</li>
    <li>Идентификационный номер налогоплательщика</li>
    <li>Данные о продажах / комиссиях</li>
  </ul>
  <p>При необходимости также обрабатываются данные суб-посредников или сотрудников.</p>

  <h2>3. Цель и правовая основа обработки</h2>
  <p>
    Данные обрабатываются для выполнения договора, расчёта комиссий,
    образовательных целей, статистики и управления продажами,
    а также для предоставления цифровых ресурсов.
    Правовая основа: Art. 6 Abs. 1 a) или b) DSGVO. Согласие может быть отозвано в любое время.
  </p>

  <h2>4. Получатели данных</h2>
  <p>
    Данные передаются только тем лицам или подрядчикам, которым они
    необходимы для выполнения законных или договорных обязанностей:
  </p>
  <ul>
    <li>Банковские партнёры (SEPA)</li>
    <li>Партнёры и поставщики продукции</li>
    <li>BaFin (отчётность, Solvency II)</li>
    <li>Суды или органы власти</li>
    <li>Должники при взыскании</li>
    <li>Конкурсные управляющие</li>
  </ul>

  <h2>5. Срок хранения</h2>
  <p>
    Данные удаляются, когда они больше не нужны, и хранятся
    в рамках законных сроков (до 10 лет, при судебных решениях – до 30 лет).
  </p>

  <h2>6. Права субъекта данных</h2>
  <ul>
    <li>Получение информации о своих данных</li>
    <li>Исправление неверных данных</li>
    <li>Удаление данных</li>
    <li>Ограничение обработки</li>
    <li>Возражение против обработки</li>
    <li>Получение данных в машиночитаемом формате</li>
  </ul>

  <h2>7. Контактный орган по защите данных</h2>
  <p>
    Landesbeauftragte für Datenschutz und Informationsfreiheit NRW<br>
    Postfach 20 04 44, 40102 Düsseldorf<br>
    E-Mail: <a href="mailto:poststelle@ldi.nrw.de">poststelle@ldi.nrw.de</a>
  </p>

  <h2>8. Обязательная передача данных</h2>
  <p>
    Передача данных необходима для заключения и выполнения договора посредника.
  </p>

  <h2>9. Передача данных в третьи страны</h2>
  <p>
    При передаче данных в страны за пределами ЕЭЗ осуществляется
    только при подтверждённом уровне защиты данных или с соответствующими гарантиями
    (например, стандартные договорные положения ЕС).
  </p>

  <h2>10. Автоматизированные решения / профилирование</h2>
  <p>
    Автоматизированные индивидуальные решения и профилирование не применяются.
  </p>

</section>
`;
});

//render Widerrufsbelehrung
wiederrufBtn.addEventListener("click", () => {
  infoTextContainer.innerHTML = `<section id="widerruf">
  <h1>Widerrufsbelehrung</h1>

  <p>Verbraucher haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>

  <h3>Widerrufsfrist</h3>
  <p>
    Die Widerrufsfrist beträgt 14 Tage ab dem Tag des Vertragsabschlusses
    per E-Mail.
  </p>

  <h3>Widerrufsfolgen</h3>
  <p>
    Wenn Sie den Vertrag widerrufen, sind etwaige empfangene Leistungen
    zurückzugewähren. Für übermittelte personenbezogene Daten erfolgt
    keine automatische Löschung, diese können jedoch auf Wunsch gelöscht werden.
  </p>

  <h3>Widerrufsrecht ausüben</h3>
  <p>
    Um Ihr Widerrufsrecht auszuüben, senden Sie bitte eine eindeutige
    Erklärung per E-Mail an:
    <a href="mailto:info@in-seel.de">info@in-seel.de</a>
  </p>

  <h3>Besondere Hinweise</h3>
  <p>
    Das Widerrufsrecht gilt nicht für Verträge zur Erbringung von
    Dienstleistungen, wenn diese vollständig erbracht wurden und
    mit Ihrer ausdrücklichen Zustimmung begonnen haben, bevor Sie
    Ihr Widerrufsrecht ausgeübt haben.
  </p>

  <hr>

  <h1>Информация о праве на отмену</h1>
  <p>
    Потребители имеют право в течение четырнадцати дней без объяснения
    причин отменить этот договор.
  </p>

  <h3>Срок отмены</h3>
  <p>
    Срок отмены составляет 14 дней с момента заключения договора
    по электронной почте.
  </p>

  <h3>Последствия отмены</h3>
  <p>
    В случае отмены договора необходимо вернуть полученные услуги.
    Переданные персональные данные не удаляются автоматически, но
    могут быть удалены по вашему запросу.
  </p>

  <h3>Реализация права на отмену</h3>
  <p>
    Чтобы воспользоваться правом на отмену, отправьте
    однозначное заявление по электронной почте на адрес:
    <a href="mailto:info@in-seel.de">info@in-seel.de</a>
  </p>

  <h3>Особые замечания</h3>
  <p>
    Право на отмену не распространяется на договоры по оказанию
    услуг, которые были полностью выполнены с вашего явного
    согласия до использования права на отмену.
  </p>

  <p><strong>Stand / Дата: 2026</strong></p>
</section>
`;
});
//render AGB
agbBtn.addEventListener("click", () => {
  infoTextContainer.innerHTML = `<section id="agb">
  <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>

  <h3>1. Geltungsbereich</h3>
  <p>
    Diese Allgemeinen Geschäftsbedingungen gelten für alle Anfragen,
    Vermittlungen und Leistungen zwischen
    <strong>Alexander Kaul – IN-SEEL Tourservice</strong>
    (nachfolgend „Anbieter“) und seinen Kunden.
  </p>

  <h3>2. Leistungen</h3>
  <p>
    Der Anbieter erbringt touristische Dienstleistungen und
    Vermittlungsleistungen. Die Website dient ausschließlich der
    Information. Ein Vertragsabschluss erfolgt nicht über die Website,
    sondern ausschließlich über individuelle Kommunikation,
    insbesondere per E-Mail.
  </p>

  <h3>3. Vertragsschluss</h3>
  <p>
    Ein Vertrag kommt erst zustande, wenn ein individuelles Angebot
    vom Anbieter erstellt und vom Kunden ausdrücklich
    (z. B. per E-Mail) bestätigt wird.
  </p>

  <h3>4. Preise und Zahlungsbedingungen</h3>
  <p>
    Preise werden individuell vereinbart und dem Kunden im Angebot
    mitgeteilt. Über diese Website erfolgen keine Zahlungen.
  </p>

  <h3>5. Mitwirkungspflichten des Kunden</h3>
  <p>
    Der Kunde verpflichtet sich, alle für die Leistungserbringung
    erforderlichen Angaben vollständig und wahrheitsgemäß zu machen.
  </p>

  <h3>6. Haftung</h3>
  <p>
    Der Anbieter haftet nur für Schäden, die auf vorsätzlicher oder
    grob fahrlässiger Pflichtverletzung beruhen.
    Bei einfacher Fahrlässigkeit haftet der Anbieter nur bei Verletzung
    wesentlicher Vertragspflichten.
  </p>

  <p>
    Eine Haftung für Leistungen Dritter oder vermittelter Leistungsträger
    ist – soweit gesetzlich zulässig – ausgeschlossen.
  </p>

  <h3>7. Haftung für Inhalte und Links</h3>
  <p>
    Die Inhalte dieser Website werden mit größter Sorgfalt erstellt.
    Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
    wird jedoch keine Gewähr übernommen.
  </p>

  <p>
    Diese Website kann Links zu externen Websites Dritter enthalten.
    Auf deren Inhalte hat der Anbieter keinen Einfluss und übernimmt
    hierfür keine Haftung.
  </p>

  <h3>8. Datenschutz</h3>
  <p>
    Die Verarbeitung personenbezogener Daten erfolgt gemäß den
    geltenden Datenschutzbestimmungen. Einzelheiten sind der
    <a href="#datenschutz">Datenschutzerklärung</a> zu entnehmen.
  </p>

  <h3>9. Schlussbestimmungen</h3>
  <p>
    Es gilt das Recht der Bundesrepublik Deutschland.
    Gerichtsstand ist – soweit gesetzlich zulässig – der Sitz des Anbieters.
  </p>

  <p>
    Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden,
    bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
  </p>

  <hr>

  <h3>1. Область применения</h3>
  <p>
    Настоящие Общие условия ведения деятельности применяются ко всем
    запросам, посредническим услугам и договорам между
    <strong>Alexander Kaul – IN-SEEL Tourservice</strong>
    (далее — «Исполнитель») и клиентами.
  </p>

  <h3>2. Услуги</h3>
  <p>
    Исполнитель оказывает туристические и посреднические услуги.
    Сайт носит исключительно информационный характер.
    Заключение договора через сайт не осуществляется.
    Договор заключается только посредством индивидуального общения,
    в частности по электронной почте.
  </p>

  <h3>3. Заключение договора</h3>
  <p>
    Договор считается заключённым только после направления
    индивидуального предложения Исполнителем и его
    подтверждения Клиентом (например, по электронной почте).
  </p>

  <h3>4. Цены и условия оплаты</h3>
  <p>
    Цены согласовываются индивидуально и указываются в предложении.
    Оплата через данный сайт не производится.
  </p>

  <h3>5. Обязанности клиента</h3>
  <p>
    Клиент обязуется предоставлять всю необходимую информацию
    для оказания услуг в полном и достоверном объёме.
  </p>

  <h3>6. Ответственность</h3>
  <p>
    Исполнитель несёт ответственность только за ущерб,
    причинённый умышленно или вследствие грубой неосторожности.
    При простой неосторожности ответственность возможна
    только при нарушении существенных договорных обязательств.
  </p>

  <p>
    Ответственность за услуги третьих лиц или посредников
    исключается в рамках, допустимых законодательством.
  </p>

  <h3>7. Ответственность за содержание и ссылки</h3>
  <p>
    Содержание сайта создаётся с максимальной тщательностью,
    однако Исполнитель не гарантирует его актуальность,
    точность и полноту.
  </p>

  <p>
    Сайт может содержать ссылки на сторонние ресурсы,
    за содержание которых Исполнитель ответственности не несёт.
  </p>

  <h3>8. Защита данных</h3>
  <p>
    Обработка персональных данных осуществляется в соответствии
    с действующим законодательством о защите данных.
    Подробности указаны в разделе
    <a href="#datenschutz">Политика конфиденциальности</a>.
  </p>

  <h3>9. Заключительные положения</h3>
  <p>
    Применяется право Федеративной Республики Германия.
    Место судебной подсудности — по месту нахождения Исполнителя,
    если это допустимо законом.
  </p>

  <p>
    Если отдельные положения данных условий окажутся недействительными,
    это не влияет на действительность остальных положений.
  </p>

  <p><strong>Stand / Дата: 2026</strong></p>
</section>
`;
});

//render Impressum
impressumBtn.addEventListener("click", () => {
  infoTextContainer.innerHTML = `<section id="impressum">
  <h1>Impressum</h1>

  <p>
    <strong>Alexander Kaul – IN-SEEL Tourservice</strong><br>
    Sebastianstr. 97<br>
    DE-50735 Köln<br>
    Deutschland
  </p>

  <p>
    Telefon (Köln): +49 (0) 221 778 98 -701/-702<br>
    Telefon (Bonn): +49 (0) 228 854 490<br>
    Telefon (Düsseldorf): +49 (0) 155 656 167 20<br>
    Telefon (Dortmund): +49 (0) 176 471 835 99<br>
    Telefon (Frankfurt): +49 (0) 698 241 99 / +49 (0) 152 536 425 29<br>
    Telefon (Karlsruhe): +49 (0) 721 830 126 7 / +49 (0) 152 026 593 99<br>
    Telefon (Wuppertal): +49 (0) 176 840 844 75<br>


    E-Mail: <a href="mailto:info@in-seel.de">info@in-seel.de</a><br>
    Internet: <a href="https://www.in-seel.de" target="_blank" rel="noopener noreferrer">www.in-seel.de</a>
  </p>

  <h2>Bankverbindung</h2>
  <p>
    Kreditinstitut: Kreissparkasse Köln<br>
    IBAN: DE 70 3705 0299 0311 5534 53
  </p>

  <p>
    Steuer-ID: DE 421904323<br>
    Steuernummer: 204/5157/2973
  </p>

  <h2>Haftungsausschluss</h2>
  <p>
    Der Betreiber dieser Website übernimmt keine Haftung für die Inhalte der
    bereitgestellten Informationen. Es wird keine Gewähr für die Richtigkeit,
    Vollständigkeit und Aktualität der Inhalte übernommen.
  </p>

  <p>
    Haftungsansprüche gegen den Betreiber, welche sich auf Schäden materieller
    oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der
    dargebotenen Informationen verursacht wurden, sind grundsätzlich ausgeschlossen,
    sofern kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt.
  </p>

  <h2>Haftung für Links</h2>
  <p>
    Diese Website enthält Verlinkungen zu externen Websites Dritter, auf deren
    Inhalte kein Einfluss besteht. Deshalb kann für diese fremden Inhalte keine
    Gewähr übernommen werden.
  </p>

  <p>
    Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
    Betreiber der Seiten verantwortlich. Zum Zeitpunkt der Verlinkung wurden
    die verlinkten Seiten auf mögliche Rechtsverstöße überprüft.
  </p>

  <p>
    Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete
    Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
    Rechtsverletzungen werden derartige Links umgehend entfernt.
  </p>

  <p><strong>Stand: 2026</strong></p>
</section>
`;
});
//render Datenschutzerklärung
datenschutzBtn.addEventListener("click", () => {
  infoTextContainer.innerHTML = `
    <section id="datenschutz">
      <h1>Datenschutzerklärung</h1>

  <p>
    Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen.
    Nachfolgend informieren wir Sie darüber, wie personenbezogene Daten auf
    dieser Website verarbeitet werden.
  </p>

  <h2>1. Verantwortlicher</h2>
  <p>
    Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br><br>

    <strong>Alexander Kaul – IN-SEEL Tourservice</strong><br>
    Sebastianstr. 97<br>
    DE-50735 Köln<br><br>

    Telefon: +49 (0) 221 778 98 702<br>
    E-Mail: <a href="mailto:info@in-seel.de">info@in-seel.de</a>
  </p>

  <h2>2. Hosting und Bereitstellung der Website</h2>
  <p>
    Diese Website wird über <strong>GitHub Pages</strong> bereitgestellt.
    Beim Aufruf der Website werden durch GitHub automatisch Informationen
    in sogenannten Server-Logfiles erhoben und gespeichert.
  </p>

  <p>
    Zu diesen Daten können gehören:
  </p>
  <ul>
    <li>IP-Adresse</li>
    <li>Datum und Uhrzeit der Anfrage</li>
    <li>Browsertyp und -version</li>
    <li>Betriebssystem</li>
    <li>Referrer-URL</li>
  </ul>

  <p>
    Die Verarbeitung erfolgt zur technischen Bereitstellung und Sicherheit
    der Website gemäß Art. 6 Abs. 1 lit. f DSGVO.
  </p>

  <p>
    Da GitHub Pages ein Dienst der GitHub Inc., USA ist, kann es zu einer
    Übermittlung von Daten in ein Drittland kommen. GitHub verpflichtet sich,
    geeignete Datenschutzgarantien gemäß Art. 44 ff. DSGVO einzuhalten.
  </p>

  <h2>3. Domain- und DNS-Verwaltung</h2>
  <p>
    Die Domain dieser Website wird über die STRATO AG verwaltet.
    STRATO verarbeitet personenbezogene Daten ausschließlich im Rahmen
    der Domain- und DNS-Verwaltung.
  </p>

  <h2>4. Nutzung von Google-Diensten (Google Sheets & Scripts)</h2>
  <p>
    Für die technische Pflege und Verwaltung von Website-Inhalten werden
    Google Sheets und Google Scripts verwendet.
  </p>

  <p>
    <strong>Es werden hierbei keine personenbezogenen Daten von Website-Besuchern
    gespeichert oder verarbeitet.</strong> Die Nutzung dient ausschließlich
    der inhaltlichen Verwaltung der Website.
  </p>

  <p>
    Der Zugriff auf diese Dienste erfolgt über ein Google-Konto
    (<a href="mailto:inseleuropa@gmail.com">inseleuropa@gmail.com</a>).
  </p>

  <h2>5. Kontaktaufnahme per E-Mail</h2>
  <p>
    Wenn Sie uns per E-Mail kontaktieren, werden die von Ihnen übermittelten
    personenbezogenen Daten (z. B. Name, E-Mail-Adresse, Inhalt der Nachricht)
    ausschließlich zur Bearbeitung Ihrer Anfrage verarbeitet.
  </p>

  <p>
    Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b DSGVO
    (vorvertragliche Maßnahmen) oder Art. 6 Abs. 1 lit. f DSGVO
    (berechtigtes Interesse an der Kommunikation).
  </p>

  <p>
    Nach erfolgreicher Übermittlung Ihrer Daten erhalten Sie eine
    Bestätigung per E-Mail.
  </p>

  <h2>6. Weitergabe von Daten</h2>
  <p>
    Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nicht,
    sofern keine gesetzliche Verpflichtung hierzu besteht.
  </p>

  <h2>7. Speicherdauer</h2>
  <p>
    Personenbezogene Daten werden nur so lange gespeichert, wie dies für
    die Bearbeitung Ihrer Anfrage erforderlich ist oder gesetzliche
    Aufbewahrungsfristen bestehen.
  </p>

  <h2>8. Ihre Rechte</h2>
  <p>
    Sie haben das Recht:
  </p>
  <ul>
    <li>Auskunft über Ihre gespeicherten Daten zu erhalten</li>
    <li>Berichtigung unrichtiger Daten zu verlangen</li>
    <li>Löschung Ihrer Daten zu verlangen</li>
    <li>Einschränkung der Verarbeitung zu verlangen</li>
    <li>Widerspruch gegen die Verarbeitung einzulegen</li>
    <li>Datenübertragbarkeit zu verlangen</li>
  </ul>

  <h2>9. Beschwerderecht</h2>
  <p>
    Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu
    beschweren. Zuständig ist:
  </p>

  <p>
    <strong>Landesbeauftragte für Datenschutz und Informationsfreiheit
    Nordrhein-Westfalen</strong><br>
    Postfach 20 04 44<br>
    40102 Düsseldorf<br>
    E-Mail:
    <a href="mailto:poststelle@ldi.nrw.de">poststelle@ldi.nrw.de</a>
  </p>

 <h2>10. SSL- bzw. TLS-Verschlüsselung</h2>
<p>
  Diese Website wird über GitHub Pages bereitgestellt und nutzt
  eine SSL- bzw. TLS-Verschlüsselung, um eine sichere Übertragung
  der Inhalte zwischen dem Browser des Nutzers und dem Server zu gewährleisten.
</p>

<p>
  Die Verschlüsselung dient dem Schutz der übertragenen Daten
  vor dem Zugriff durch unbefugte Dritte.
</p>

  <h2>11. Änderungen dieser Datenschutzerklärung</h2>
  <p>
    Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie
    an rechtliche Anforderungen oder technische Änderungen anzupassen.
  </p>

  <p><strong>Stand: 2026</strong></p><br><br>

  <hr>

  <h1>Политика конфиденциальности</h1>

  <p>
    Защита ваших персональных данных для нас очень важна.
    Ниже мы информируем вас о том, как обрабатываются персональные данные
    на этом веб-сайте.
  </p>

  <h2>1. Ответственный за обработку данных</h2>
  <p>
    Ответственным за обработку данных на этом сайте является:<br><br>

    <strong>Alexander Kaul – IN-SEEL Tourservice</strong><br>
    Sebastianstr. 97<br>
    DE-50735 Кёльн<br><br>

    Телефон: +49 (0) 221 778 98 702<br>
    E-Mail: <a href="mailto:info@in-seel.de">info@in-seel.de</a>
  </p>

  <h2>2. Хостинг и предоставление сайта</h2>
  <p>
    Этот сайт размещён на <strong>GitHub Pages</strong>.
    При обращении к сайту GitHub автоматически собирает
    информацию в так называемых лог-файлах сервера.
  </p>

  <p>Эти данные могут включать:</p>
  <ul>
    <li>IP-адрес</li>
    <li>Дата и время запроса</li>
    <li>Тип и версия браузера</li>
    <li>Операционная система</li>
    <li>Referrer-URL</li>
  </ul>

  <p>
    Обработка данных необходима для технического предоставления
    сайта и обеспечения его безопасности согласно Art. 6 Abs. 1 lit. f DSGVO.
  </p>

  <p>
    Поскольку GitHub Pages — это сервис компании GitHub Inc., США,
    данные могут передаваться в третьи страны. GitHub обязуется
    соблюдать соответствующие гарантии защиты данных
    согласно Art. 44 ff. DSGVO.
  </p>

  <h2>3. Управление доменом и DNS</h2>
  <p>
    Домен этого сайта управляется компанией STRATO AG.
    STRATO обрабатывает персональные данные исключительно
    в рамках управления доменом и DNS.
  </p>

  <h2>4. Использование сервисов Google (Google Sheets & Scripts)</h2>
  <p>
    Для технического обслуживания и управления контентом сайта
    используются Google Sheets и Google Scripts.
  </p>

  <p>
    <strong>Персональные данные посетителей сайта не сохраняются и не обрабатываются.</strong>
    Использование сервисов исключительно для управления содержимым сайта.
  </p>

  <p>
    Доступ к этим сервисам осуществляется через Google-аккаунт
    (<a href="mailto:inseleuropa@gmail.com">inseleuropa@gmail.com</a>).
  </p>

  <h2>5. Связь по электронной почте</h2>
  <p>
    Если вы связываетесь с нами по электронной почте,
    предоставленные вами персональные данные
    (например, имя, адрес электронной почты, содержание сообщения)
    используются исключительно для обработки вашего запроса.
  </p>

  <p>
    Правовая основа: Art. 6 Abs. 1 lit. b DSGVO
    (договорные / предварительные меры) или
    Art. 6 Abs. 1 lit. f DSGVO (законный интерес коммуникации).
  </p>

  <p>
    После успешной отправки данных вы получите подтверждение по электронной почте.
  </p>

  <h2>6. Передача данных</h2>
  <p>
    Передача ваших персональных данных третьим лицам не осуществляется,
    если нет юридического обязательства.
  </p>

  <h2>7. Срок хранения</h2>
  <p>
    Персональные данные хранятся только столько,
    сколько необходимо для обработки вашего запроса
    или в рамках законных сроков хранения.
  </p>

  <h2>8. Ваши права</h2>
  <p>Вы имеете право:</p>
  <ul>
    <li>Получить информацию о сохранённых данных</li>
    <li>Исправить некорректные данные</li>
    <li>Запросить удаление данных</li>
    <li>Ограничить обработку данных</li>
    <li>Возразить против обработки</li>
    <li>Получить данные в машиночитаемом формате</li>
  </ul>

  <h2>9. Право на жалобу</h2>
  <p>
    Вы имеете право подать жалобу в орган по защите данных:
  </p>

  <p>
    <strong>Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen</strong><br>
    Postfach 20 04 44<br>
    40102 Дюссельдорф<br>
    E-Mail:
    <a href="mailto:poststelle@ldi.nrw.de">poststelle@ldi.nrw.de</a>
  </p>

  <h2>10. SSL / TLS шифрование</h2>
<p>
  Данный сайт размещён на платформе GitHub Pages и использует
  SSL/TLS шифрование для обеспечения безопасной передачи данных
  между браузером пользователя и сервером.
</p>

<p>
  SSL/TLS шифрование позволяет защитить передаваемые данные
  от несанкционированного доступа третьих лиц.
</p>

  <h2>11. Изменения политики конфиденциальности</h2>
  <p>
    Мы оставляем за собой право адаптировать эту политику
    конфиденциальности в соответствии с изменениями законодательства
    или техническими изменениями.
  </p>

  <p><strong>Stand / Дата: 2026</strong></p>
    </section>
  `;
});

// Filters
searchButton.addEventListener("click", () => {
  let filteredTours = [...tours];

  const startCitySelect = document.getElementById("startCity");

  const fromDateValue = dateFromInput.value
    ? new Date(dateFromInput.value)
    : null;
  const toDateValue = dateToInput.value ? new Date(dateToInput.value) : null;

  // Datum-Filter
  if (fromDateValue && toDateValue) {
    if (fromDateValue.getTime() === toDateValue.getTime()) {
      filteredTours = filteredTours.filter((t) =>
        t.startDates.some((d) => d >= fromDateValue)
      );
    } else {
      filteredTours = filteredTours.filter((t) =>
        t.startDates.some((d) => d >= fromDateValue && d <= toDateValue)
      );
    }
  } else if (fromDateValue) {
    filteredTours = filteredTours.filter((t) =>
      t.startDates.some((d) => d >= fromDateValue)
    );
  } else if (toDateValue) {
    filteredTours = filteredTours.filter((t) =>
      t.startDates.some((d) => d <= toDateValue)
    );
  }
  // Länder-Filte
  if (countrySelect && countrySelect.value !== "all") {
    const selectedCountry = countrySelect.value.trim();

    filteredTours = filteredTours.filter(
      (tour) =>
        Array.isArray(tour.countries) &&
        tour.countries.includes(selectedCountry)
    );
  }
  // Tourtyp-Filter
  if (tourTypeSelect.value && tourTypeSelect.value !== "all") {
    filteredTours = filteredTours.filter((tour) => {
      const starts = Array.isArray(tour.startDates) ? tour.startDates : [];
      const ends = Array.isArray(tour.endDates) ? tour.endDates : [];
      let isMulti = false;
      for (let i = 0; i < Math.max(starts.length, ends.length); i++) {
        const start = starts[i];
        const end = ends[i];

        if (start && end && end.getTime() > start.getTime()) {
          isMulti = true;
          break;
        }
      }

      if (tourTypeSelect.value === "multipledays") return isMulti;
      if (tourTypeSelect.value === "oneday") return !isMulti;

      return true;
    });
  }

  //  Startstadt-Filter
  if (startCitySelect && startCitySelect.value !== "all") {
    const selectedCity = startCitySelect.value.trim().toLowerCase();

    filteredTours = filteredTours.filter((t) =>
      t.startCities.some(
        (city) =>
          city
            .trim()
            .toLowerCase()
            .replace(/ä/g, "ae")
            .replace(/ö/g, "oe")
            .replace(/ü/g, "ue")
            .replace(/ß/g, "ss")
            .replace(/[\s/]/g, "_") === selectedCity
      )
    );
  }

  renderTourCards(filteredTours);

  if (filteredTours.length === 0) {
    tourList.innerHTML = "<p>Ничего не найдено!</p>";
  }
});

// Formular-Submit-Handler
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const formContainer = document.querySelector(".form-contrainer");
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Отправка...";

    const formData = new FormData();
    formData.append("fname", document.getElementById("fname").value);
    formData.append("lname", document.getElementById("lname").value);
    formData.append("agency", document.getElementById("agency").value);

    formData.append("email", document.getElementById("email").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append(
      "numTourists",
      document.getElementById("numTourists").value
    );
    formData.append(
      "numChildren",
      document.getElementById("numChildren").value
    );
    formData.append(
      "startDate",
      document.getElementById("start-date-select")?.value || ""
    );
    formData.append(
      "startCity",
      document.getElementById("start-city-select")?.value || ""
    );
    formData.append("comments", document.getElementById("comments").value);
    formData.append(
      "tourTitle",
      document.getElementById("tourTitle").textContent
    );
    formData.append(
      "userAddress",
      `${document.getElementById("addressStreet")?.value || ""} ${
        document.getElementById("addressCity")?.value || ""
      }`
    );
    const hotelSelect = document.getElementById("hotel-room-select");
    formData.append("hotelRoomType", hotelSelect ? hotelSelect.value : "");

    const childInputs = document.querySelectorAll("#birthdatesContainer input");
    childInputs.forEach((input, index) => {
      formData.append(`child_birthdate_${index + 1}`, input.value);
    });

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbxaF82txqsJY4iqI2EdkNxyQj_UplwiQjNx7J4r08BWp1AB6WK5iEVMnS91Rc0ABNfb/exec";

    try {
      await fetch(scriptURL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      console.log("✅ Запрос успешно отправлен!");

      form.style.display = "none";

      const thankYouMsg = document.createElement("div");
      thankYouMsg.className = "thank-you-message";
      thankYouMsg.innerHTML = `
        <h2>✅ Спасибо!</h2>
        <p>Ваша заявка успешно отправлена.</p>
        <p>Наши специалисты свяжутся с вами в ближайшее время.</p>
      
        <button id="backToCatalog" class="order-btn">Вернуться к турам</button>
      `;
      formContainer.appendChild(thankYouMsg);

      // Button zum Zurückkehren zum Katalog
      const backButton = document.getElementById("backToCatalog");
      backButton.addEventListener("click", () => {
        document.querySelector(".catalog-container").style.display = "block";
        formContainer.style.display = "none";
        form.reset();
        thankYouMsg.remove();
        form.style.display = "block";
        // ✅ Button wieder aktivieren
        submitButton.disabled = false;
        submitButton.textContent = "Отправить";
      });
    } catch (err) {
      console.error("❌ Ошибка соединения:", err);
      const errorMsg = document.createElement("p");
      errorMsg.style.color = "red";
      errorMsg.textContent = "❌ Ошибка соединения! Попробуйте позже.";
      form.appendChild(errorMsg);
      // Button wieder aktivieren
      submitButton.disabled = false;
      submitButton.textContent = "Отправить";
    }
  });
});
