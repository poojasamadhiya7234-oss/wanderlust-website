
    async function loadMap() {
        let location = "<%= listingdata.location %>";

        // 1. Location → Lat/Lng (automatically)
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
        let res = await fetch(url);
        let data = await res.json();

        let lat = data[0].lat;
        let lon = data[0].lon;

        // 2. Show map
        var map = L.map('map').setView([lat, lon], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        L.marker([lat, lon]).addTo(map).bindPopup(location).openPopup();
    }

    loadMap();
