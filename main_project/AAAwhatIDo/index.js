// Create root element
var root = am5.Root.new("chartdiv");

// Set themes
root.setThemes([am5themes_Animated.new(root)]);

// Create the map chart
var chart = root.container.children.push(am5map.MapChart.new(root, {
  panX: "translateX",
  panY: "translateY",
  projection: am5map.geoMercator()
}));

// Create main polygon series for countries
var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
  geoJSON: am5geodata_worldLow
}));

// Arrays to manage country codes
var redCountries = ["PL"];
var greenCountries = ["EE", "HR", "GB", "HR", "NO", "CZ", "DK", "DE", "NL", "CH", "FR", "LI", "AT"];  // Countries you've been to
var cyanCountries = ["IS","NZ", "AU", "CA", "US","RS", "SK", "AE", "RW"];   // Countries you're planning to go to
var greyCountries = [];       // Default is grey, so no need to add here

// Set default properties for all countries
polygonSeries.mapPolygons.template.setAll({
  toggleKey: "active",
  interactive: false,         // Default to not interactive
  fill: am5.color(0xcccccc),  // Default grey
  stroke: am5.color(0x000000), // Default border color (black)
  strokeWidth: 0.5              // Default border width
});

// Use "datavalidated" event to set specific properties for each country
polygonSeries.events.on("datavalidated", function () {
  polygonSeries.mapPolygons.each(function (polygon) {
    const countryId = polygon.dataItem.get("id");

    // Set colors and interactivity based on country ID
    if (redCountries.includes(countryId)) {
      polygon.set("fill", am5.color(0xFF0000));  // Red
      polygon.set("interactive", true);          // Make clickable
    } else if (greenCountries.includes(countryId)) {
      polygon.set("fill", am5.color(0x00ff00));  // Green
      polygon.set("interactive", true);          // Make clickable
    } else if (cyanCountries.includes(countryId)) {
      polygon.set("fill", am5.color(0x00ffff));  // Cyan
      polygon.set("interactive", false);         // Non-clickable
    } else {
      polygon.set("fill", am5.color(0xcccccc));  // Grey
      polygon.set("interactive", false);         // Non-clickable
    }

    // Set tooltip text based on country ID
    if (redCountries.includes(countryId)) {
      polygon.set("tooltipText", "{name}\nBorn here");
    } else if (greenCountries.includes(countryId)) {
      polygon.set("tooltipText", "{name}\nAlready visited");
    } else if (cyanCountries.includes(countryId)) {
      polygon.set("tooltipText", "{name}\nPlanning to go soon");
    } else {
      polygon.set("tooltipText", "{name}\nHaven't been to yet");
    }
  });
});

// Handle country click events to redirect
polygonSeries.mapPolygons.template.events.on("click", function (ev) {
  const target = ev.target;
  const countryId = target.dataItem.get("id");

  // Redirect only if country is in the list
  const redirectCountries = [...redCountries, ...greenCountries];
  if (!redirectCountries.includes(countryId)) {
    return;  // Ignore clicks on grey or cyan countries
  }

  console.log("Country clicked:", countryId); // Debugging line

  // Define redirection URL based on country ID
  const urlMap = {
    "PL": "Poland country/test.html",
    "EE": "estonia.html",
    "HR": "croatia.html",
    "GB": "uk.html",
    "NO": "norway.html",
    "CZ": "czech-republic.html",
    "DK": "denmark.html",
    "DE": "germany.html",
    "NL": "netherlands.html",
    "BE": "belgium.html",
    "CH": "switzerland.html",
    "FR": "france.html",
    "LI": "liechtenstein.html",
    "IS": "iceland.html",
    "AT": "austria.html"
    // Add more mappings as needed
  };
  
  const redirectUrl = urlMap[countryId] || null;  // Use null if no URL is defined
  if (redirectUrl) {
    console.log("Redirecting to:", redirectUrl); // Debugging line
    window.location.href = redirectUrl;           // Redirect to the URL
  }
});

// Add zoom control
var zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
zoomControl.homeButton.set("visible", true);

// Set clicking on "water" to zoom out
chart.chartContainer.get("background").events.on("click", function () {
  chart.goHome();
});
