// =========================
// BOOKING SUMMARY
// =========================

const serviceOptions =
    document.querySelectorAll('input[name="service"]');

const barberOptions =
    document.querySelectorAll('input[name="barber"]');

const summaryService =
    document.getElementById('summaryService');

const summaryBarber =
    document.getElementById('summaryBarber');

const summaryDuration =
    document.getElementById('summaryDuration');

const summaryPrice =
    document.getElementById('summaryPrice');

const summaryEndTime =
    document.getElementById('summaryEndTime');


// =========================
// DATE & TIME ELEMENTS
// =========================

const bookingDate =
    document.getElementById('bookingDate');

const bookingTime =
    document.getElementById('bookingTime');

const summaryDate =
    document.getElementById('summaryDate');

const summaryTime =
    document.getElementById('summaryTime');


// =========================
// BOOKING FORM
// =========================

const bookingForm =
    document.getElementById('bookingForm');


// =========================
// BOOKING CONFIRMATION
// =========================

const bookingConfirmation =
    document.getElementById('bookingConfirmation');

const confirmationService =
    document.getElementById('confirmationService');

const confirmationBarber =
    document.getElementById('confirmationBarber');

const confirmationDate =
    document.getElementById('confirmationDate');

const confirmationTime =
    document.getElementById('confirmationTime');

const confirmationEndTime =
    document.getElementById('confirmationEndTime');


// =========================
// CALENDAR BUTTONS
// =========================

const googleCalendarButton =
    document.getElementById('googleCalendarButton');

const downloadCalendarButton =
    document.getElementById('downloadCalendarButton');


// =========================
// CUSTOMER DETAILS
// =========================

const customerName =
    document.getElementById('customerName');

const customerEmail =
    document.getElementById('customerEmail');

const customerPhone =
    document.getElementById('customerPhone');


// =========================
// SHOP HOURS
// =========================

const shopClosingTime = "18:00";


// =========================
// GOOGLE CALENDAR DATE FORMAT
// =========================

function formatCalendarDate(date, time) {

    const cleanDate =
        date.replace(/-/g, "");

    const cleanTime =
        time.replace(":", "") + "00";

    return cleanDate + "T" + cleanTime;

}


// =========================
// CREATE GOOGLE CALENDAR LINK
// =========================

function createGoogleCalendarLink(endTime) {

    const selectedService =
        document.querySelector(
            'input[name="service"]:checked'
        );

    const selectedBarber =
        document.querySelector(
            'input[name="barber"]:checked'
        );

    const startDateTime =
        formatCalendarDate(
            bookingDate.value,
            bookingTime.value
        );

    const endDateTime =
        formatCalendarDate(
            bookingDate.value,
            endTime
        );

    const eventTitle =
        "Black & Blade - " +
        selectedService.dataset.name;

    const eventDetails =
        "Barber: " +
        selectedBarber.dataset.name +
        "\nCustomer: " +
        customerName.value +
        "\nPhone: " +
        customerPhone.value;

    const location =
        "Black & Blade, Durban, KwaZulu-Natal";

    const googleCalendarUrl =
        "https://calendar.google.com/calendar/render" +
        "?action=TEMPLATE" +
        "&text=" +
        encodeURIComponent(eventTitle) +
        "&dates=" +
        startDateTime +
        "/" +
        endDateTime +
        "&details=" +
        encodeURIComponent(eventDetails) +
        "&location=" +
        encodeURIComponent(location) +
        "&ctz=Africa/Johannesburg";

    if (googleCalendarButton) {

        googleCalendarButton.href =
            googleCalendarUrl;

    }

}


// =========================
// CREATE ICS CALENDAR FILE
// =========================

function createCalendarFile(endTime) {

    const selectedService =
        document.querySelector(
            'input[name="service"]:checked'
        );

    const selectedBarber =
        document.querySelector(
            'input[name="barber"]:checked'
        );

    const startDateTime =
        formatCalendarDate(
            bookingDate.value,
            bookingTime.value
        );

    const endDateTime =
        formatCalendarDate(
            bookingDate.value,
            endTime
        );

    const eventTitle =
        "Black & Blade - " +
        selectedService.dataset.name;

    const eventDescription =
        "Barber: " +
        selectedBarber.dataset.name +
        "\\nCustomer: " +
        customerName.value +
        "\\nPhone: " +
        customerPhone.value;

    const icsContent =
        "BEGIN:VCALENDAR\r\n" +
        "VERSION:2.0\r\n" +
        "PRODID:-//Black & Blade//Booking//EN\r\n" +
        "CALSCALE:GREGORIAN\r\n" +
        "BEGIN:VEVENT\r\n" +
        "UID:" +
        Date.now() +
        "@blackandblade.co.za\r\n" +
        "DTSTAMP:" +
        startDateTime +
        "\r\n" +
        "DTSTART;TZID=Africa/Johannesburg:" +
        startDateTime.substring(0, 8) +
        "T" +
        startDateTime.substring(9, 15) +
        "\r\n" +
        "DTEND;TZID=Africa/Johannesburg:" +
        endDateTime.substring(0, 8) +
        "T" +
        endDateTime.substring(9, 15) +
        "\r\n" +
        "SUMMARY:" +
        eventTitle +
        "\r\n" +
        "DESCRIPTION:" +
        eventDescription +
        "\r\n" +
        "LOCATION:Black & Blade, Durban, KwaZulu-Natal\r\n" +
        "END:VEVENT\r\n" +
        "END:VCALENDAR";

    const blob =
        new Blob(
            [icsContent],
            {
                type: "text/calendar;charset=utf-8"
            }
        );

    const downloadUrl =
        URL.createObjectURL(blob);


    // =========================
    // DOWNLOAD ICS FILE
    // =========================

    if (downloadCalendarButton) {

        downloadCalendarButton.onclick =
            function () {

                const temporaryLink =
                    document.createElement("a");

                temporaryLink.href =
                    downloadUrl;

                temporaryLink.download =
                    "black-and-blade-booking.ics";

                document.body.appendChild(
                    temporaryLink
                );

                temporaryLink.click();

                document.body.removeChild(
                    temporaryLink
                );

            };

    }

}


// =========================
// CHECK SHOP CLOSING TIME
// =========================

function isWithinShopHours(endTime) {

    return endTime <= shopClosingTime;

}


// =========================
// CALCULATE END TIME
// =========================

function calculateEndTime() {

    const selectedService =
        document.querySelector(
            'input[name="service"]:checked'
        );

    if (!bookingTime) {
        return;
    }

    const selectedTime =
        bookingTime.value;

    if (!selectedService || !selectedTime) {
        return;
    }

    const duration =
        Number(
            selectedService.dataset.duration
        );

    const [hours, minutes] =
        selectedTime
            .split(":")
            .map(Number);

    const startTime =
        new Date();

    startTime.setHours(hours);
    startTime.setMinutes(minutes);

    startTime.setMinutes(
        startTime.getMinutes() + duration
    );

    const endHours =
        String(
            startTime.getHours()
        ).padStart(2, "0");

    const endMinutes =
        String(
            startTime.getMinutes()
        ).padStart(2, "0");

    const endTime =
        `${endHours}:${endMinutes}`;

    if (summaryEndTime) {

        summaryEndTime.textContent =
            endTime;

        if (!isWithinShopHours(endTime)) {

            summaryEndTime.textContent =
                "After closing";

        }

    }

    return endTime;

}


// =========================
// DISABLE INVALID TIMES
// =========================

function updateAvailableTimes() {

    const selectedService =
        document.querySelector(
            'input[name="service"]:checked'
        );

    if (!selectedService || !bookingTime) {
        return;
    }

    const duration =
        Number(
            selectedService.dataset.duration
        );

    const timeOptions =
        bookingTime.querySelectorAll('option');

    timeOptions.forEach(function (option) {

        if (!option.value) {
            return;
        }

        const [hours, minutes] =
            option.value
                .split(":")
                .map(Number);

        const startTime =
            new Date();

        startTime.setHours(hours);
        startTime.setMinutes(minutes);

        startTime.setMinutes(
            startTime.getMinutes() + duration
        );

        const endHours =
            String(
                startTime.getHours()
            ).padStart(2, "0");

        const endMinutes =
            String(
                startTime.getMinutes()
            ).padStart(2, "0");

        const endTime =
            `${endHours}:${endMinutes}`;

        option.disabled =
            endTime > shopClosingTime;

    });


    // Clear selected time if invalid

    if (
        bookingTime.value &&
        bookingTime.selectedOptions[0].disabled
    ) {

        bookingTime.value = "";

        if (summaryTime) {

            summaryTime.textContent =
                "Not selected";

        }

        if (summaryEndTime) {

            summaryEndTime.textContent =
                "—";

        }

    }

}


// =========================
// SERVICE SELECTION
// =========================

serviceOptions.forEach(function (service) {

    service.addEventListener(
        'change',
        function () {

            if (summaryService) {

                summaryService.textContent =
                    service.dataset.name;

            }

            if (summaryDuration) {

                summaryDuration.textContent =
                    service.dataset.duration +
                    " min";

            }

            if (summaryPrice) {

                summaryPrice.textContent =
                    "R" +
                    service.dataset.price;

            }

            updateAvailableTimes();

            calculateEndTime();

        }
    );

});


// =========================
// BARBER SELECTION
// =========================

barberOptions.forEach(function (barber) {

    barber.addEventListener(
        'change',
        function () {

            if (summaryBarber) {

                summaryBarber.textContent =
                    barber.dataset.name;

            }

        }
    );

});


// =========================
// URL PARAMETERS
// =========================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


// =========================
// PRESELECT SERVICE FROM URL
// =========================

const selectedServiceFromUrl =
    urlParams.get("service");

if (selectedServiceFromUrl) {

    const serviceToSelect =
        document.querySelector(
            `input[name="service"][value="${selectedServiceFromUrl}"]`
        );

    if (serviceToSelect) {

        serviceToSelect.checked =
            true;

        serviceToSelect.dispatchEvent(
            new Event("change")
        );

    }

}


// =========================
// PRESELECT BARBER FROM URL
// =========================

const selectedBarberFromUrl =
    urlParams.get("barber");

if (selectedBarberFromUrl) {

    const barberToSelect =
        document.querySelector(
            `input[name="barber"][value="${selectedBarberFromUrl}"]`
        );

    if (barberToSelect) {

        barberToSelect.checked =
            true;

        barberToSelect.dispatchEvent(
            new Event("change")
        );

    }

}


// =========================
// PREVENT PAST DATES
// =========================

if (bookingDate) {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    bookingDate.min =
        `${year}-${month}-${day}`;

}


// =========================
// DATE SELECTION
// =========================

if (bookingDate) {

    bookingDate.addEventListener(
        "change",
        function () {

            const selectedDate =
                new Date(
                    bookingDate.value +
                    "T00:00:00"
                );


            // =========================
            // BLOCK SUNDAYS
            // =========================

            if (
                selectedDate.getDay() === 0
            ) {

                alert(
                    "Black & Blade is closed on Sundays. Please choose another date."
                );

                bookingDate.value =
                    "";

                if (summaryDate) {

                    summaryDate.textContent =
                        "Not selected";

                }

                return;

            }


            // =========================
            // UPDATE DATE SUMMARY
            // =========================

            const formattedDate =
                selectedDate.toLocaleDateString(
                    'en-ZA',
                    {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }
                );

            if (summaryDate) {

                summaryDate.textContent =
                    formattedDate;

            }

        }
    );

}


// =========================
// TIME SELECTION
// =========================

if (bookingTime) {

    bookingTime.addEventListener(
        'change',
        function () {

            if (summaryTime) {

                summaryTime.textContent =
                    bookingTime.value;

            }

            calculateEndTime();

        }
    );

}


// =========================
// BOOKING FORM SUBMISSION
// =========================

if (bookingForm) {

    bookingForm.addEventListener(
        'submit',
        function (event) {

            event.preventDefault();

            const endTime =
                calculateEndTime();

            const selectedService =
                document.querySelector(
                    'input[name="service"]:checked'
                );

            const selectedBarber =
                document.querySelector(
                    'input[name="barber"]:checked'
                );


            // =========================
            // CHECK CLOSING TIME
            // =========================

            if (!endTime || !isWithinShopHours(endTime)) {

                alert(
                    "This appointment would finish after the shop closes at 18:00. Please choose an earlier time."
                );

                return;

            }


            // =========================
            // POPULATE CONFIRMATION
            // =========================

            confirmationService.textContent =
                selectedService.dataset.name;

            confirmationBarber.textContent =
                selectedBarber.dataset.name;

            confirmationTime.textContent =
                bookingTime.value;

            confirmationEndTime.textContent =
                endTime;


            // =========================
            // FORMAT CONFIRMATION DATE
            // =========================

            const selectedDate =
                new Date(
                    bookingDate.value +
                    "T00:00:00"
                );

            const formattedConfirmationDate =
                selectedDate.toLocaleDateString(
                    'en-ZA',
                    {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }
                );

            confirmationDate.textContent =
                formattedConfirmationDate;


            // =========================
            // CREATE CALENDAR OPTIONS
            // =========================

            createGoogleCalendarLink(
                endTime
            );

            createCalendarFile(
                endTime
            );


            // =========================
            // SHOW CONFIRMATION
            // =========================

            bookingConfirmation.hidden =
                false;

            bookingConfirmation.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


// =========================
// CONTACT FORM
// =========================

const contactForm =
    document.getElementById('contactForm');

if (contactForm) {

    contactForm.addEventListener(
        'submit',
        function (event) {

            event.preventDefault();

            alert(
                "Thank you for contacting Black & Blade. We'll get back to you soon."
            );

            contactForm.reset();

        }
    );

}

// =========================
// FIRST VISIT POPUP
// =========================

const firstVisitPopup =
    document.getElementById('firstVisitPopup');

const popupClose =
    document.getElementById('popupClose');

if (firstVisitPopup && popupClose) {

    const popupShown =
        sessionStorage.getItem('blackBladePopupShown');

    if (!popupShown) {

        firstVisitPopup.hidden = false;

    }

    // Close popup with X
    popupClose.addEventListener(
        'click',
        function () {

            firstVisitPopup.hidden = true;

            sessionStorage.setItem(
                'blackBladePopupShown',
                'true'
            );

        }
    );

    // Continue to booking
    const popupBookingButton =
        firstVisitPopup.querySelector('a');

    if (popupBookingButton) {

        popupBookingButton.addEventListener(
            'click',
            function () {

                sessionStorage.setItem(
                    'blackBladePopupShown',
                    'true'
                );

            }
        );

    }

}