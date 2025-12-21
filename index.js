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
      ${tour.included
        .map((item) => `<li class="check">✅ ${item}</li>`)
        .join("")}
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
      ${tour.excluded.map((item) => `<li class="ex">✅ ${item}</li>`).join("")}
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
        <button id="backToCatalog" class="back-button">Вернуться к турам</button>
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
