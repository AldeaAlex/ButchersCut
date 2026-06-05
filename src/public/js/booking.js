const serviceSelect = document.querySelector("#serviceId");
const dateInput = document.querySelector("#appointmentDate");
const timeSelect = document.querySelector("#startTime");
const slotsMessage = document.querySelector("#slotsMessage");

async function loadAvailableSlots() {
  const serviceId = serviceSelect.value;
  const appointmentDate = dateInput.value;

  timeSelect.innerHTML = "";
  timeSelect.disabled = true;

  if (!serviceId || !appointmentDate) {
    timeSelect.innerHTML = `<option value="">Alege mai întâi serviciul și data</option>`;
    slotsMessage.textContent = "";
    return;
  }

  timeSelect.innerHTML = `<option value="">Se încarcă orele disponibile...</option>`;

  try {
    const response = await fetch(
      `/api/available-slots?serviceId=${serviceId}&date=${appointmentDate}`
    );

    const data = await response.json();

    timeSelect.innerHTML = "";

    if (!data.slots.length) {
      timeSelect.innerHTML = `<option value="">Nu există ore disponibile</option>`;
      slotsMessage.textContent = data.message;
      return;
    }

    timeSelect.disabled = false;
    timeSelect.innerHTML = `<option value="">Alege o oră</option>`;

    data.slots.forEach((slot) => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      timeSelect.appendChild(option);
    });

    slotsMessage.textContent = data.message;
  } catch (error) {
    console.error(error);

    timeSelect.innerHTML = `<option value="">Eroare la încărcarea orelor</option>`;
    slotsMessage.textContent = "A apărut o eroare la încărcarea orelor disponibile.";
  }
}

serviceSelect.addEventListener("change", loadAvailableSlots);
dateInput.addEventListener("change", loadAvailableSlots);