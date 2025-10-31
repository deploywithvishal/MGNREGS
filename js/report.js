// ==============================
// 🌐 API CONFIG
// ==============================
const API_BASE = "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
const API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

// ==============================
// 📦 LOCAL STORAGE DATA
// ==============================
const state = localStorage.getItem("selectedState");
const district = localStorage.getItem("selectedDistrict");

// ==============================
// 🎯 DOM ELEMENTS
// ==============================
const locationEl = document.getElementById("location");
const yearDropdown = document.getElementById("year");
const cardContainer = document.getElementById("cardContainer");

// ==============================
// 🏷️ SHOW SELECTED LOCATION
// ==============================
locationEl.innerText = `${district}, ${state}`;

// ==============================
// 🧩 1️⃣ FETCH FINANCIAL YEARS
// ==============================
async function fetchFinancialYears() {
  try {
    const url = `${API_BASE}?api-key=${API_KEY}&format=json&limit=500`;
    const res = await fetch(url);
    const data = await res.json();

    const years = [...new Set(data.records.map(r => r.fin_year))].sort().reverse();

    yearDropdown.innerHTML = '<option value="">2024 - 2025</option>';
    years.forEach(year => {
      const opt = document.createElement("option");
      opt.value = year;
      opt.textContent = year;
      yearDropdown.appendChild(opt);
    });
  } catch (err) {
    console.error("Error fetching years:", err);
  }
}

// ==============================
// 🧩 2️⃣ FETCH REPORT DATA
// ==============================
async function fetchReport(finYear = "") {
  if (!state || !district) {
    alert("Please select State and District first!");
    window.location.href = "index.html";
    return;
  }

  try {
    cardContainer.innerHTML = "<p>⏳ Loading data...</p>";

    // Build URL
    let url = `${API_BASE}?api-key=${API_KEY}&format=json&filters[state_name]=${encodeURIComponent(state)}&filters[district_name]=${encodeURIComponent(district)}`;
    if (finYear) {
      url += `&filters[Fin_Year]=${encodeURIComponent(finYear)}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!data.records || data.records.length === 0) {
      cardContainer.innerHTML = "<p>📭 No data found for this selection.</p>";
      return;
    }

    const record = data.records[0];

    // Dashboard Cards
    const cards = [
      { icon: "agriculture", label: "कुल घरों को रोजगार मिला", value: record.Total_Households_Worked, bg: "bg-green-100", color: "text-green-700" },
      { icon: "account_balance_wallet", label: "कुल खर्चा (₹ करोड़ में)", value: "₹" + (record.Total_Exp / 100).toFixed(2) + " Cr", bg: "bg-blue-100", color: "text-blue-700" },
      { icon: "calendar_month", label: "औसत काम के दिन", value: record.Average_days_of_employment_provided_per_Household + " दिन", bg: "bg-indigo-100", color: "text-indigo-700" },
      { icon: "female", label: "महिलाओं की भागीदारी (%)", value: record.percent_of_Category_B_Works + "%", bg: "bg-pink-100", color: "text-pink-700" },
      { icon: "construction", label: "पूरा हुए काम", value: record.Number_of_Completed_Works, bg: "bg-yellow-100", color: "text-yellow-700" },
      { icon: "payments", label: "भुगतान 15 दिन में (%)", value: record.percentage_payments_gererated_within_15_days + "%", bg: "bg-purple-100", color: "text-purple-700" },
    ];

    // ==============================
    // 🎨 RENDER DASHBOARD CARDS
    // ==============================
    cardContainer.innerHTML = "";
    cards.forEach(c => {
      const div = document.createElement("div");
      div.className = `
        bg-white border border-gray-200 rounded-xl overflow-hidden 
        flex items-stretch shadow-sm hover:shadow-md transition duration-300
      `;

      div.innerHTML = `
        <!-- Left light background icon section -->
        <div class="flex justify-center items-center ${c.bg} ${c.color} w-24">
          <span class="material-icons text-[10em]">${c.icon}</span>
        </div>

        <!-- Right text section -->
        <div class="flex flex-col justify-center flex-1 px-6 py-5">
          <p class="text-gray-600 text-sm font-medium">${c.label}</p>
          <h3 class="text-2xl font-bold text-gray-800 mt-1">${c.value || "N/A"}</h3>
        </div>
      `;

      cardContainer.appendChild(div);
    });

  } catch (err) {
    console.error("Error fetching report:", err);
    cardContainer.innerHTML = "<p>⚠️ Failed to load data.</p>";
  }
}

// ==============================
// 🧩 3️⃣ EVENT HANDLER
// ==============================
yearDropdown.addEventListener("change", e => {
  fetchReport(e.target.value);
});

// ==============================
// 🚀 4️⃣ INITIALIZE
// ==============================
fetchFinancialYears().then(() => {
  fetchReport(); // Default load (no filter)
});
