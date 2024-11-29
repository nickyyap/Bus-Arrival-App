const busStopIdInput = document.getElementById('busStopId');
const arrivalInfo = document.getElementById('arrivalInfo');

async function fetchBusArrival(busStopId) {
  const response = await fetch(
    `https://sg-bus-arrivals.vercel.app/?id=${busStopId}`
  );

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('Error fetching bus arrrival data.');
  }
}

function formatArrivalData(arrivalData) {
  if (
    !arrivalData ||
    !arrivalData.services ||
    !Array.isArray(arrivalData.services)
  ) {
    return `<p class="text-danger">No buses available or invalid data format.</p>`;
  }

  const buses = arrivalData.services;

  // Check if there are buses available
  if (buses.length === 0) {
    return `<p class="text-danger">No buses available at this stop.</p>`;
  }

  let tableHTML = `<table class="table-responsive">
  <thead>
  <tr>
  <th>Bus No.</th>
  <th>Operator</th>
  <th>Next Arrival</th>
  </tr>
  </thead>
  <tbody>
  `;

  for (const bus of buses) {
    const arrivalTimeString =
      bus.next_bus_mins <= 0 ? 'Arriving' : `${bus.next_bus_mins} min(s)`;

    tableHTML += `<tr>
  <td>${bus.bus_no}</td>
  <td>${bus.operator}</td>
  <td>${arrivalTimeString}</td>
  </tr>
  `;
  }

  tableHTML += `</tbody></table>`;
  return tableHTML;
}

let intervalId = null;

function displayBusArrival(busStopId) {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  const updateArrivalData = () => {
    arrivalInfo.innerHTML = '<p>Loading...</p>';
    fetchBusArrival(busStopId)
      .then((arrivalData) => {
        const formattedArrivalData = formatArrivalData(arrivalData);
        arrivalInfo.innerHTML = formattedArrivalData;
      })
      .catch((error) => {
        console.error('Error:', error);
        arrivalInfo.innerHTML = `<p class="text-danger text-center">Failed to fetch data. Please try again later.</p>`;
      });
  };

  updateArrivalData();
  intervalId = setInterval(updateArrivalData, 5000);
}

function showArrival() {
  const busStopId = busStopIdInput.value.trim();

  if (!busStopId) {
    alert('Please enter a valid Bus Stop ID.');
    return;
  }

  displayBusArrival(busStopId);
}
