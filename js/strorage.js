// JSONBin configuration
const JSONBIN_API_KEY = '$2a$10$euwDhEgv13d2/nspRFrvZ.Tja.F8.KJAKS59QObmCff3vDS6HAYr.';
const JSONBIN_BIN_ID = '695023e903998b11ea8dafb4';

// method
async function insert() {
  const form = $("#formMessage").serializeArray();
  let dataMessage = await getDataFromJSONBin();

  let newData = {};
  form.forEach(function (item, index) {
    let name = item["name"];
    let value = name === "id" || name === "" ? Number(item["value"]) : item["value"];
    newData[name] = value;
  });

  dataMessage.push(newData);
  await saveDataToJSONBin(dataMessage);
  return newData;
}

async function getDataFromJSONBin() {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data.record || [];
  } catch (error) {
    console.error('Error fetching data from JSONBin:', error);
    return [];
  }
}

async function saveDataToJSONBin(data) {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving data to JSONBin:', error);
  }
}

function showData(dataMessage) {
  let row = "";

  if (dataMessage.length == 0) {
    return (row = `<h1 class="title" style="text-align : center">Belum Ada Pesan Masuk</h1>`);
  }

  dataMessage.forEach(function (item, index) {
    row += `<h1 class="title">${item["nama"]}</h1>`;
    row += `<h4>- ${item["hubungan"]}</h4>`;
    row += `<p>${item["pesan"]}</p>`;
  });
  return row;
}

let dataMessage;
$(async function () {
  // initialize
  dataMessage = await getDataFromJSONBin();

  $(".card-message").html(showData(dataMessage));
  // events
  $("#formMessage").on("submit", async function (e) {
    e.preventDefault();
    const newMessage = await insert();
    dataMessage.push(newMessage);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Terima Kasih Atas Ucapan & Doanya ",
      showConfirmButton: false,
      timer: 2000,
    });
    $(".card-message").html(showData(dataMessage));
  });
});
