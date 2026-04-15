import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express.Router();
const port = 3000;

const db = new pg.Client({
  connectionString:process.env.PG_CONNECTION_STRING || "postgresql://main:ZJPFb7FKnVL5JsK13DuavZc54VBeoyF1@dpg-d7fv57reo5us73b9hdo0-a.oregon-postgres.render.com/webdev_vsyb",
  ssl:{
    rejectUnauthorized: false
  }
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

const countries = [
  {id: 1, code: "AF", name: "Afghanistan"},
  {id: 2, code: "AX", name: "Aland Islands"},
  {id: 3, code: "AL", name: "Albania"},
  {id: 4, code: "DZ", name: "Algeria"},
  {id: 5, code: "AS", name: "American Samoa"},
  {id: 6, code: "AD", name: "Andorra"},
  {id: 7, code: "AO", name: "Angola"},
  {id: 8, code: "AI", name: "Anguilla"},
  {id: 9, code: "AQ", name: "Antarctica"},
  {id: 10, code: "AG", name: "Antigua and Barbuda"},
  {id: 11, code: "AR", name: "Argentina"},
  {id: 12, code: "AM", name: "Armenia"},
  {id: 13, code: "AW", name: "Aruba"},
  {id: 14, code: "AU", name: "Australia"},
  {id: 15, code: "AT", name: "Austria"},
  {id: 16, code: "AZ", name: "Azerbaijan"},
  {id: 17, code: "ST", name: "Sao Tome and Principe"},
  {id: 18, code: "BS", name: "Bahamas"},
  {id: 19, code: "BH", name: "Bahrain"},
  {id: 20, code: "BD", name: "Bangladesh"},
  {id: 21, code: "BB", name: "Barbados"},
  {id: 22, code: "BY", name: "Belarus"},
  {id: 23, code: "BE", name: "Belgium"},
  {id: 24, code: "BZ", name: "Belize"},
  {id: 25, code: "BJ", name: "Benin"},
  {id: 26, code: "BT", name: "Bhutan"},
  {id: 27, code: "BO", name: "Bolivia"},
  {id: 28, code: "BA", name: "Bosnia and Herzegovina"},
  {id: 29, code: "BW", name: "Botswana"},
  {id: 30, code: "BV", name: "Bouvet Island"},
  {id: 31, code: "BR", name: "Brazil"},
  {id: 32, code: "VG", name: "British Virgin Islands"},
  {id: 33, code: "IO", name: "British Indian Ocean Territory"},
  {id: 34, code: "BN", name: "Brunei Darussalam"},
  {id: 35, code: "BG", name: "Bulgaria"},
  {id: 36, code: "BF", name: "Burkina Faso"},
  {id: 37, code: "BI", name: "Burundi"},
  {id: 38, code: "KH", name: "Cambodia"},
  {id: 39, code: "CM", name: "Cameroon"},
  {id: 40, code: "CA", name: "Canada"},
  {id: 41, code: "CV", name: "Cape Verde"},
  {id: 42, code: "KY", name: "Cayman Islands"},
  {id: 43, code: "CF", name: "Central African Republic"},
  {id: 44, code: "TD", name: "Chad"},
  {id: 45, code: "CL", name: "Chile"},
  {id: 46, code: "CN", name: "China"},
  {id: 47, code: "HK", name: "Hong Kong, SAR China"},
  {id: 48, code: "CR", name: "Costa Rica"},
  {id: 49, code: "MO", name: "Macao, SAR China"},
  {id: 50, code: "CX", name: "Christmas Island"},
  {id: 51, code: "CC", name: "Cocos (Keeling) Islands"},
  {id: 52, code: "CO", name: "Colombia"},
  {id: 53, code: "KM", name: "Comoros"},
  {id: 54, code: "CD", name: "Congo, (Kinshasa)"},
  {id: 55, code: "CK", name: "Cook Islands"},
  {id: 56, code: "CI", name: "Côte d'Ivoire"},
  {id: 57, code: "HR", name: "Croatia"},
  {id: 58, code: "CU", name: "Cuba"},
  {id: 59, code: "CY", name: "Cyprus"},
  {id: 60, code: "CZ", name: "Czech Republic"},
  {id: 61, code: "DK", name: "Denmark"},
  {id: 62, code: "DJ", name: "Djibouti"},
  {id: 63, code: "DM", name: "Dominica"},
  {id: 64, code: "DO", name: "Dominican Republic"},
  {id: 65, code: "EC", name: "Ecuador"},
  {id: 66, code: "EG", name: "Egypt"},
  {id: 67, code: "SV", name: "El Salvador"},
  {id: 68, code: "GQ", name: "Equatorial Guinea"},
  {id: 69, code: "ER", name: "Eritrea"},
  {id: 70, code: "EE", name: "Estonia"},
  {id: 71, code: "ET", name: "Ethiopia"},
  {id: 72, code: "FK", name: "Falkland Islands (Malvinas)"},
  {id: 73, code: "FO", name: "Faroe Islands"},
  {id: 74, code: "FJ", name: "Fiji"},
  {id: 75, code: "FI", name: "Finland"},
  {id: 76, code: "FR", name: "France"},
  {id: 77, code: "GF", name: "French Guiana"},
  {id: 78, code: "PF", name: "French Polynesia"},
  {id: 79, code: "TF", name: "French Southern Territories"},
  {id: 80, code: "GA", name: "Gabon"},
  {id: 81, code: "GM", name: "Gambia"},
  {id: 82, code: "GE", name: "Georgia"},
  {id: 83, code: "DE", name: "Germany"},
  {id: 84, code: "GH", name: "Ghana"},
  {id: 85, code: "GI", name: "Gibraltar"},
  {id: 86, code: "GR", name: "Greece"},
  {id: 87, code: "GL", name: "Greenland"},
  {id: 88, code: "GD", name: "Grenada"},
  {id: 89, code: "GP", name: "Guadeloupe"},
  {id: 90, code: "GU", name: "Guam"},
  {id: 91, code: "GT", name: "Guatemala"},
  {id: 92, code: "GG", name: "Guernsey"},
  {id: 93, code: "GN", name: "Guinea"},
  {id: 94, code: "GW", name: "Guinea-Bissau"},
  {id: 95, code: "GY", name: "Guyana"},
  {id: 96, code: "HT", name: "Haiti"},
  {id: 97, code: "HM", name: "Heard and Mcdonald Islands"},
  {id: 98, code: "VA", name: "Holy See (Vatican City State)"},
  {id: 99, code: "HN", name: "Honduras"},
  {id: 100, code: "HU", name: "Hungary"},
  {id: 101, code: "IS", name: "Iceland"},
  {id: 102, code: "FM", name: "Micronesia, Federated States of"},
  {id: 103, code: "RE", name: "Réunion"},
  {id: 104, code: "ID", name: "Indonesia"},
  {id: 105, code: "IR", name: "Iran, Islamic Republic of"},
  {id: 106, code: "IQ", name: "Iraq"},
  {id: 107, code: "IE", name: "Ireland"},
  {id: 108, code: "IM", name: "Isle of Man"},
  {id: 109, code: "IL", name: "Israel"},
  {id: 110, code: "IT", name: "Italy"},
  {id: 111, code: "JM", name: "Jamaica"},
  {id: 112, code: "JP", name: "Japan"},
  {id: 113, code: "JE", name: "Jersey"},
  {id: 114, code: "JO", name: "Jordan"},
  {id: 115, code: "MD", name: "Moldova"},
  {id: 116, code: "KZ", name: "Kazakhstan"},
  {id: 117, code: "KE", name: "Kenya"},
  {id: 118, code: "KI", name: "Kiribati"},
  {id: 119, code: "KP", name: "Korea (North)"},
  {id: 120, code: "KR", name: "Korea (South)"},
  {id: 121, code: "KW", name: "Kuwait"},
  {id: 122, code: "KG", name: "Kyrgyzstan"},
  {id: 123, code: "LA", name: "Lao PDR"},
  {id: 124, code: "LV", name: "Latvia"},
  {id: 125, code: "LB", name: "Lebanon"},
  {id: 126, code: "LS", name: "Lesotho"},
  {id: 127, code: "LR", name: "Liberia"},
  {id: 128, code: "LY", name: "Libya"},
  {id: 129, code: "LI", name: "Liechtenstein"},
  {id: 130, code: "LT", name: "Lithuania"},
  {id: 131, code: "LU", name: "Luxembourg"},
  {id: 132, code: "MK", name: "Macedonia, Republic of"},
  {id: 133, code: "MG", name: "Madagascar"},
  {id: 134, code: "MW", name: "Malawi"},
  {id: 135, code: "MY", name: "Malaysia"},
  {id: 136, code: "MV", name: "Maldives"},
  {id: 137, code: "BM", name: "Bermuda"},
  {id: 138, code: "ML", name: "Mali"},
  {id: 139, code: "MT", name: "Malta"},
  {id: 140, code: "MH", name: "Marshall Islands"},
  {id: 141, code: "MQ", name: "Martinique"},
  {id: 142, code: "MR", name: "Mauritania"},
  {id: 143, code: "MU", name: "Mauritius"},
  {id: 144, code: "YT", name: "Mayotte"},
  {id: 145, code: "MX", name: "Mexico"},
  {id: 146, code: "MC", name: "Monaco"},
  {id: 147, code: "MN", name: "Mongolia"},
  {id: 148, code: "ME", name: "Montenegro"},
  {id: 149, code: "MS", name: "Montserrat"},
  {id: 150, code: "MA", name: "Morocco"},
  {id: 151, code: "MZ", name: "Mozambique"},
  {id: 152, code: "MM", name: "Myanmar"},
  {id: 153, code: "NA", name: "Namibia"},
  {id: 154, code: "NR", name: "Nauru"},
  {id: 155, code: "NP", name: "Nepal"},
  {id: 156, code: "NL", name: "Netherlands"},
  {id: 157, code: "AN", name: "Netherlands Antilles"},
  {id: 158, code: "NC", name: "New Caledonia"},
  {id: 159, code: "NZ", name: "New Zealand"},
  {id: 160, code: "NI", name: "Nicaragua"},
  {id: 161, code: "NE", name: "Niger"},
  {id: 162, code: "NG", name: "Nigeria"},
  {id: 163, code: "NU", name: "Niue"},
  {id: 164, code: "NF", name: "Norfolk Island"},
  {id: 165, code: "MP", name: "Northern Mariana Islands"},
  {id: 166, code: "NO", name: "Norway"},
  {id: 167, code: "OM", name: "Oman"},
  {id: 168, code: "PK", name: "Pakistan"},
  {id: 169, code: "PW", name: "Palau"},
  {id: 170, code: "PS", name: "Palestinian Territory"},
  {id: 171, code: "PA", name: "Panama"},
  {id: 172, code: "PG", name: "Papua New Guinea"},
  {id: 173, code: "PY", name: "Paraguay"},
  {id: 174, code: "PE", name: "Peru"},
  {id: 175, code: "PH", name: "Philippines"},
  {id: 176, code: "PN", name: "Pitcairn"},
  {id: 177, code: "PT", name: "Portugal"},
  {id: 178, code: "PR", name: "Puerto Rico"},
  {id: 179, code: "QA", name: "Qatar"},
  {id: 180, code: "RO", name: "Romania"},
  {id: 181, code: "RU", name: "Russian Federation"},
  {id: 182, code: "RW", name: "Rwanda"},
  {id: 183, code: "BL", name: "Saint-Barthélemy"},
  {id: 184, code: "SH", name: "Saint Helena"},
  {id: 185, code: "KN", name: "Saint Kitts and Nevis"},
  {id: 186, code: "LC", name: "Saint Lucia"},
  {id: 187, code: "MF", name: "Saint-Martin (French part)"},
  {id: 188, code: "PM", name: "Saint Pierre and Miquelon"},
  {id: 189, code: "VC", name: "Saint Vincent and Grenadines"},
  {id: 190, code: "WS", name: "Samoa"},
  {id: 191, code: "SM", name: "San Marino"},
  {id: 192, code: "SA", name: "Saudi Arabia"},
  {id: 193, code: "SN", name: "Senegal"},
  {id: 194, code: "RS", name: "Serbia"},
  {id: 195, code: "SC", name: "Seychelles"},
  {id: 196, code: "SL", name: "Sierra Leone"},
  {id: 197, code: "SG", name: "Singapore"},
  {id: 198, code: "SK", name: "Slovakia"},
  {id: 199, code: "SI", name: "Slovenia"},
  {id: 200, code: "SB", name: "Solomon Islands"},
  {id: 201, code: "SO", name: "Somalia"},
  {id: 202, code: "ZA", name: "South Africa"},
  {id: 203, code: "GS", name: "South Georgia and the South Sandwich Islands"},
  {id: 204, code: "SS", name: "South Sudan"},
  {id: 205, code: "ES", name: "Spain"},
  {id: 206, code: "LK", name: "Sri Lanka"},
  {id: 207, code: "SD", name: "Sudan"},
  {id: 208, code: "SR", name: "Suriname"},
  {id: 209, code: "SJ", name: "Svalbard and Jan Mayen Islands"},
  {id: 210, code: "SZ", name: "Swaziland"},
  {id: 211, code: "SE", name: "Sweden"},
  {id: 212, code: "CH", name: "Switzerland"},
  {id: 213, code: "SY", name: "Syrian Arab Republic (Syria)"},
  {id: 214, code: "TW", name: "Taiwan, Republic of China"},
  {id: 215, code: "TJ", name: "Tajikistan"},
  {id: 216, code: "TZ", name: "Tanzania, United Republic of"},
  {id: 217, code: "TH", name: "Thailand"},
  {id: 218, code: "IN", name: "India"},
  {id: 219, code: "CG", name: "Congo (Brazzaville)"},
  {id: 220, code: "PL", name: "Poland"},
  {id: 221, code: "TL", name: "Timor-Leste"},
  {id: 222, code: "TG", name: "Togo"},
  {id: 223, code: "TK", name: "Tokelau"},
  {id: 224, code: "TO", name: "Tonga"},
  {id: 225, code: "TT", name: "Trinidad and Tobago"},
  {id: 226, code: "TN", name: "Tunisia"},
  {id: 227, code: "TR", name: "Turkey"},
  {id: 228, code: "TM", name: "Turkmenistan"},
  {id: 229, code: "TC", name: "Turks and Caicos Islands"},
  {id: 230, code: "TV", name: "Tuvalu"},
  {id: 231, code: "UG", name: "Uganda"},
  {id: 232, code: "UA", name: "Ukraine"},
  {id: 233, code: "AE", name: "United Arab Emirates"},
  {id: 234, code: "GB", name: "United Kingdom"},
  {id: 235, code: "US", name: "United States of America"},
  {id: 236, code: "UM", name: "US Minor Outlying Islands"},
  {id: 237, code: "UY", name: "Uruguay"},
  {id: 238, code: "UZ", name: "Uzbekistan"},
  {id: 239, code: "VU", name: "Vanuatu"},
  {id: 240, code: "VE", name: "Venezuela (Bolivarian Republic)"},
  {id: 241, code: "VN", name: "Viet Nam"},
  {id: 242, code: "VI", name: "Virgin Islands, US"},
  {id: 243, code: "WF", name: "Wallis and Futuna Islands"},
  {id: 244, code: "EH", name: "Western Sahara"},
  {id: 245, code: "YE", name: "Yemen"},
  {id: 246, code: "ZM", name: "Zambia"},
  {id: 247, code: "ZW", name: "Zimbabwe"}
];

async function dbInit(){
  await db.query("DROP TABLE IF EXISTS countries");
  await db.query("CREATE TABLE IF NOT EXISTS countries(id SERIAL PRIMARY KEY, country_code CHAR(2) NOT NULL UNIQUE, country_name VARCHAR(50) NOT NULL)");
  await db.query("CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name VARCHAR(15) NOT NULL UNIQUE, color VARCHAR(15) NOT NULL)");
  await db.query("CREATE TABLE IF NOT EXISTS visited_countries(id SERIAL PRIMARY KEY, country_code CHAR(2) NOT NULL, user_id INTEGER REFERENCES users(id))");
}

async function insertCountries() {
  try {
    await db.connect();
    console.log("Connected to database.");

    for (const item of countries) {
      // Mapping 'code' to country_code and 'name' to country_name 
      // based on your defined list format
      const query = `
        INSERT INTO countries (id, country_code, country_name) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (id) DO NOTHING;
      `;
      const values = [item.id, item.code, item.name];
      
      await db.query(query, values);
    }

    console.log("All values inserted successfully!");
  } catch (err) {
    console.error("Error during insertion:", err);
  } finally {
    await db.end();
  }
}

await dbInit;
await insertCountries();

function getUser(id) {
  return users.find((user) => user.id == id);
}

async function loadUsers() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
}

async function checkVisited(id) {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1", [id]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  loadUsers();
  const countries = await checkVisited(currentUserId);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: getUser(currentUserId).color
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const countries = await checkVisited(currentUserId);

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      if (countries.includes(countryCode)) {
        res.render("index.ejs", { countries: countries, total: countries.length, users: users, color: getUser(currentUserId).color, error: "Country already visited!" });
      }
      else {
        await db.query(
          "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
          [countryCode, currentUserId]
        );
        res.redirect("./");
      }
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    res.render("index.ejs", { countries: countries, total: countries.length, users: users, color: getUser(currentUserId).color, error: "Country not found!" });
  }
});
app.post("/user", async (req, res) => {
  if (req.body.add == undefined) {
    currentUserId = req.body.user;
    res.redirect("./");
  }
  else {
    res.render("new.ejs");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning
  try {
    const id = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id", [req.body.name, req.body.color]);
    users.push({ id: id.rows[0].id, name: req.body.name, color: req.body.color });
    currentUserId = id.rows[0].id;
    const countries = await checkVisited(currentUserId);
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: getUser(currentUserId).color
    });
  }
  catch (err) {
    currentUserId = 1;
    const countries = await checkVisited(currentUserId);
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: getUser(currentUserId).color
    });
    //alert("User Already Added!");
  }
});

export default app;