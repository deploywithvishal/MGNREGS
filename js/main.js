const API_BASE = "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
const API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const nextBtn = document.getElementById("nextBtn");

// Fetch distinct states
async function fetchStates() {
  try {
    const url = `${API_BASE}?api-key=${API_KEY}&format=json&limit=100`;
    const res = await fetch(url);
    const data = await res.json();

    // Extract unique state names
    const states = [...new Set(data.records.map(r => r.state_name))].sort();

    states.forEach(state => {
      const opt = document.createElement("option");
      opt.value = state;
      opt.textContent = state;
      stateSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Error fetching states:", err);
  }
}

// Fetch districts based on selected state
async function fetchDistricts(stateName) {
  try {
    const url = `${API_BASE}?api-key=${API_KEY}&format=json&limit=100&filters[state_name]=${encodeURIComponent(stateName)}`;
    const res = await fetch(url);
    const data = await res.json();

    // Extract unique district names
    const districts = [...new Set(data.records.map(r => r.district_name))].sort();

    // Reset district dropdown
    districtSelect.innerHTML = '<option value="">-- Select District --</option>';
    districts.forEach(district => {
      const opt = document.createElement("option");
      opt.value = district;
      opt.textContent = district;
      districtSelect.appendChild(opt);
    });

    districtSelect.disabled = false;
  } catch (err) {
    console.error("Error fetching districts:", err);
  }
}

// Event Listeners
stateSelect.addEventListener("change", () => {
  const selectedState = stateSelect.value;
  if (selectedState) {
    fetchDistricts(selectedState);
  } else {
    districtSelect.disabled = true;
    districtSelect.innerHTML = '<option value="">-- Select District --</option>';
    nextBtn.disabled = true;
  }
});

districtSelect.addEventListener("change", () => {
  nextBtn.disabled = !districtSelect.value;
});

nextBtn.addEventListener("click", () => {
  const state = stateSelect.value;
  const district = districtSelect.value;

  if (state && district) {
    // Save selection for later use (optional)
    localStorage.setItem("selectedState", state);
    localStorage.setItem("selectedDistrict", district);

    // alert(`Selected:\nState: ${state}\nDistrict: ${district}`);
    // window.location.href = "nextpage.html"; // Uncomment for navigation
  }
});

// Load initial state data
fetchStates();

nextBtn.addEventListener("click", () => {
  const state = stateSelect.value;
  const district = districtSelect.value;

  if (state && district) {
    // ✅ Save selection for later use
    localStorage.setItem("selectedState", state);
    localStorage.setItem("selectedDistrict", district);

    // ✅ Go to the next page
    window.location.href = "report.html";
  }
});
