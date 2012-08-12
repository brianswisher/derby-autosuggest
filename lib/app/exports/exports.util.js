
function util() {    
    var self=this;

/* As mongo doesn't support full text search we need to implement our own by 
 * extracting an array of all possible search matches for each string and 
 * query against those. As queries are case sensitive, we're going to lower
 * case all keywords and rely on a reactive function to lower-case the query
 * string before passing it to Mongo. It's recommended to index the keywords.
 * This approach has a much lower overhead than using regex within the actual
 * query as any indexing won't be utilized.
 * The function is used in getCountryData() and resulting array is appended to 
 * the data prior to storing it in Mongo to minimize the number of hits to the 
 * database.
 * 
*/
    this.extractUniqueMatches = function(string) {
        var words = string.split(" "),
            word,
            len,
            match,
            matches= new Array();

        // loop through string words
        for (var w=0;w<words.length;w++) {
            word = words[w].replace(/\s/g, ""); // remove white spaces
            len = word.length;

            // loop through string and extract all possible matches, example, "Hello"
            // would produce: "hello", "ello", "llo", "lo" and "o"
            for (var l=0;l<len;l++)     {
                for (var i=len;i-l>=1;i--) {
                    match = word.substring(l, i).toLowerCase();
                    // make sure match is not already in the array
                    if (matches.indexOf(match) === -1) {
                        matches.push(match);
                    }
                }    
            }
        }
        return matches;    
    }

// Returns if object is empty
    this.isEmptyObj = function(obj) {
        return Object.keys(obj).length === 0
    }

// Returns an array of keys from a collection
    this.getCollectionKeys = function(data) {
        var scs = new Array();
        Object.keys(data).forEach(function(key) {
            scs.push(key);
        });    
        return scs;
    };
    
// Returns default country data, stored in collection if empty
    this.getCountryData = function() {
        var keywords,
            obj,
            data = [
            {text: "Afghanistan",sc: "AF",cc: "004"},
            {text: "Åland Islands",sc: "AX",cc: "248"},
            {text: "Albania",sc: "AL",cc: "008"},
            {text: "Algeria",sc: "DZ",cc: "012"},
            {text: "American Samoa",sc: "AS",cc: "016"},
            {text: "Andorra",sc: "AD",cc: "020"},
            {text: "Angola",sc: "AO",cc: "024"},
            {text: "Anguilla",sc: "AI",cc: "660"},
            {text: "Antarctica",sc: "AQ",cc: "010"},
            {text: "Antigua and Barbuda",sc: "AG",cc: "028"},
            {text: "Argentina",sc: "AR",cc: "032"},
            {text: "Armenia",sc: "AM",cc: "051"},
            {text: "Aruba",sc: "AW",cc: "533"},
            {text: "Australia",sc: "AU",cc: "036"},
            {text: "Austria",sc: "AT",cc: "040"},
            {text: "Azerbaijan",sc: "AZ",cc: "031"},
            {text: "Bahamas",sc: "BS",cc: "044"},
            {text: "Bahrain",sc: "BH",cc: "048"},
            {text: "Bangladesh",sc: "BD",cc: "050"},
            {text: "Barbados",sc: "BB",cc: "052"},
            {text: "Belarus",sc: "BY",cc: "112"},
            {text: "Belgium",sc: "BE",cc: "056"},
            {text: "Belize",sc: "BZ",cc: "084"},
            {text: "Benin",sc: "BJ",cc: "204"},
            {text: "Bermuda",sc: "BM",cc: "060"},
            {text: "Bhutan",sc: "BT",cc: "064"},
            {text: "Bolivia, Plurinational State of",sc: "BO",cc: "068"},
            {text: "Bonaire, Sint Eustatius and Saba",sc: "BQ",cc: "535"},
            {text: "Bosnia and Herzegovina",sc: "BA",cc: "070"},
            {text: "Botswana",sc: "BW",cc: "072"},
            {text: "Bouvet Island",sc: "BV",cc: "074"},
            {text: "Brazil",sc: "BR",cc: "076"},
            {text: "British Indian Ocean Territory",sc: "IO",cc: "086"},
            {text: "Brunei Darussalam",sc: "BN",cc: "096"},
            {text: "Bulgaria",sc: "BG",cc: "100"},
            {text: "Burkina Faso",sc: "BF",cc: "854"},
            {text: "Burundi",sc: "BI",cc: "108"},
            {text: "Cambodia",sc: "KH",cc: "116"},
            {text: "Cameroon",sc: "CM",cc: "120"},
            {text: "Canada",sc: "CA",cc: "124"},
            {text: "Cape Verde",sc: "CV",cc: "132"},
            {text: "Cayman Islands",sc: "KY",cc: "136"},
            {text: "Central African Republic",sc: "CF",cc: "140"},
            {text: "Chad",sc: "TD",cc: "148"},
            {text: "Chile",sc: "CL",cc: "152"},
            {text: "China",sc: "CN",cc: "156"},
            {text: "Christmas Island",sc: "CX",cc: "162"},
            {text: "Cocos (Keeling) Islands",sc: "CC",cc: "166"},
            {text: "Colombia",sc: "CO",cc: "170"},
            {text: "Comoros",sc: "KM",cc: "174"},
            {text: "Congo",sc: "CG",cc: "178"},
            {text: "Congo, the Democratic Republic of the",sc: "CD",cc: "180"},
            {text: "Cook Islands",sc: "CK",cc: "184"},
            {text: "Costa Rica",sc: "CR",cc: "188"},
            {text: "Côte d'Ivoire",sc: "CI",cc: "384"},
            {text: "Croatia",sc: "HR",cc: "191"},
            {text: "Cuba",sc: "CU",cc: "192"},
            {text: "Curaçao",sc: "CW",cc: "531"},
            {text: "Cyprus",sc: "CY",cc: "196"},
            {text: "Czech Republic",sc: "CZ",cc: "203"},
            {text: "Denmark",sc: "DK",cc: "208"},
            {text: "Djibouti",sc: "DJ",cc: "262"},
            {text: "Dominica",sc: "DM",cc: "212"},
            {text: "Dominican Republic",sc: "DO",cc: "214"},
            {text: "Ecuador",sc: "EC",cc: "218"},
            {text: "Egypt",sc: "EG",cc: "818"},
            {text: "El Salvador",sc: "SV",cc: "222"},
            {text: "Equatorial Guinea",sc: "GQ",cc: "226"},
            {text: "Eritrea",sc: "ER",cc: "232"},
            {text: "Estonia",sc: "EE",cc: "233"},
            {text: "Ethiopia",sc: "ET",cc: "231"},
            {text: "Falkland Islands (Malvinas)",sc: "FK",cc: "238"},
            {text: "Faroe Islands",sc: "FO",cc: "234"},
            {text: "Fiji",sc: "FJ",cc: "242"},
            {text: "Finland",sc: "FI",cc: "246"},
            {text: "France",sc: "FR",cc: "250"},
            {text: "French Guiana",sc: "GF",cc: "254"},
            {text: "French Polynesia",sc: "PF",cc: "258"},
            {text: "French Southern Territories",sc: "TF",cc: "260"},
            {text: "Gabon",sc: "GA",cc: "266"},
            {text: "Gambia",sc: "GM",cc: "270"},
            {text: "Georgia",sc: "GE",cc: "268"},
            {text: "Germany",sc: "DE",cc: "276"},
            {text: "Ghana",sc: "GH",cc: "288"},
            {text: "Gibraltar",sc: "GI",cc: "292"},
            {text: "Greece",sc: "GR",cc: "300"},
            {text: "Greenland",sc: "GL",cc: "304"},
            {text: "Grenada",sc: "GD",cc: "308"},
            {text: "Guadeloupe",sc: "GP",cc: "312"},
            {text: "Guam",sc: "GU",cc: "316"},
            {text: "Guatemala",sc: "GT",cc: "320"},
            {text: "Guernsey",sc: "GG",cc: "831"},
            {text: "Guinea",sc: "GN",cc: "324"},
            {text: "Guinea-Bissau",sc: "GW",cc: "624"},
            {text: "Guyana",sc: "GY",cc: "328"},
            {text: "Haiti",sc: "HT",cc: "332"},
            {text: "Heard Island and McDonald Islands",sc: "HM",cc: "334"},
            {text: "Holy See (Vatican City State)",sc: "VA",cc: "336"},
            {text: "Honduras",sc: "HN",cc: "340"},
            {text: "Hong Kong",sc: "HK",cc: "344"},
            {text: "Hungary",sc: "HU",cc: "348"},
            {text: "Iceland",sc: "IS",cc: "352"},
            {text: "India",sc: "IN",cc: "356"},
            {text: "Indonesia",sc: "sc",cc: "360"},
            {text: "Iran, Islamic Republic of",sc: "IR",cc: "364"},
            {text: "Iraq",sc: "IQ",cc: "368"},
            {text: "Ireland",sc: "IE",cc: "372"},
            {text: "Isle of Man",sc: "IM",cc: "833"},
            {text: "Israel",sc: "IL",cc: "376"},
            {text: "Italy",sc: "IT",cc: "380"},
            {text: "Jamaica",sc: "JM",cc: "388"},
            {text: "Japan",sc: "JP",cc: "392"},
            {text: "Jersey",sc: "JE",cc: "832"},
            {text: "Jordan",sc: "JO",cc: "400"},
            {text: "Kazakhstan",sc: "KZ",cc: "398"},
            {text: "Kenya",sc: "KE",cc: "404"},
            {text: "Kiribati",sc: "KI",cc: "296"},
            {text: "Korea, Democratic People's Republic of",sc: "KP",cc: "408"},
            {text: "Korea, Republic of",sc: "KR",cc: "410"},
            {text: "Kuwait",sc: "KW",cc: "414"},
            {text: "Kyrgyzstan",sc: "KG",cc: "417"},
            {text: "Lao People's Democratic Republic",sc: "LA",cc: "418"},
            {text: "Latvia",sc: "LV",cc: "428"},
            {text: "Lebanon",sc: "LB",cc: "422"},
            {text: "Lesotho",sc: "LS",cc: "426"},
            {text: "Liberia",sc: "LR",cc: "430"},
            {text: "Libya",sc: "LY",cc: "434"},
            {text: "Liechtenstein",sc: "LI",cc: "438"},
            {text: "Lithuania",sc: "LT",cc: "440"},
            {text: "Luxembourg",sc: "LU",cc: "442"},
            {text: "Macao",sc: "MO",cc: "446"},
            {text: "Macedonia, the former Yugoslav Republic of",sc: "MK",cc: "807"},
            {text: "Madagascar",sc: "MG",cc: "450"},
            {text: "Malawi",sc: "MW",cc: "454"},
            {text: "Malaysia",sc: "MY",cc: "458"},
            {text: "Maldives",sc: "MV",cc: "462"},
            {text: "Mali",sc: "ML",cc: "466"},
            {text: "Malta",sc: "MT",cc: "470"},
            {text: "Marshall Islands",sc: "MH",cc: "584"},
            {text: "Martinique",sc: "MQ",cc: "474"},
            {text: "Mauritania",sc: "MR",cc: "478"},
            {text: "Mauritius",sc: "MU",cc: "480"},
            {text: "Mayotte",sc: "YT",cc: "175"},
            {text: "Mexico",sc: "MX",cc: "484"},
            {text: "Micronesia, Federated States of",sc: "FM",cc: "583"},
            {text: "Moldova, Republic of",sc: "MD",cc: "498"},
            {text: "Monaco",sc: "MC",cc: "492"},
            {text: "Mongolia",sc: "MN",cc: "496"},
            {text: "Montenegro",sc: "ME",cc: "499"},
            {text: "Montserrat",sc: "MS",cc: "500"},
            {text: "Morocco",sc: "MA",cc: "504"},
            {text: "Mozambique",sc: "MZ",cc: "508"},
            {text: "Myanmar",sc: "MM",cc: "104"},
            {text: "Namibia",sc: "NA",cc: "516"},
            {text: "Nauru",sc: "NR",cc: "520"},
            {text: "Nepal",sc: "NP",cc: "524"},
            {text: "Netherlands",sc: "NL",cc: "528"},
            {text: "New Caledonia",sc: "NC",cc: "540"},
            {text: "New Zealand",sc: "NZ",cc: "554"},
            {text: "Nicaragua",sc: "NI",cc: "558"},
            {text: "Niger",sc: "NE",cc: "562"},
            {text: "Nigeria",sc: "NG",cc: "566"},
            {text: "Niue",sc: "NU",cc: "570"},
            {text: "Norfolk Island",sc: "NF",cc: "574"},
            {text: "Northern Mariana Islands",sc: "MP",cc: "580"},
            {text: "Norway",sc: "NO",cc: "578"},
            {text: "Oman",sc: "OM",cc: "512"},
            {text: "Pakistan",sc: "PK",cc: "586"},
            {text: "Palau",sc: "PW",cc: "585"},
            {text: "Palestinian Territory, Occupied",sc: "PS",cc: "275"},
            {text: "Panama",sc: "PA",cc: "591"},
            {text: "Papua New Guinea",sc: "PG",cc: "598"},
            {text: "Paraguay",sc: "PY",cc: "600"},
            {text: "Peru",sc: "PE",cc: "604"},
            {text: "Philippines",sc: "PH",cc: "608"},
            {text: "Pitcairn",sc: "PN",cc: "612"},
            {text: "Poland",sc: "PL",cc: "616"},
            {text: "Portugal",sc: "PT",cc: "620"},
            {text: "Puerto Rico",sc: "PR",cc: "630"},
            {text: "Qatar",sc: "QA",cc: "634"},
            {text: "Réunion",sc: "RE",cc: "638"},
            {text: "Romania",sc: "RO",cc: "642"},
            {text: "Russian Federation",sc: "RU",cc: "643"},
            {text: "Rwanda",sc: "RW",cc: "646"},
            {text: "Saint Barthélemy",sc: "BL",cc: "652"},
            {text: "Saint Helena, Ascension and Tristan da Cunha",sc: "SH",cc: "654"},
            {text: "Saint Kitts and Nevis",sc: "KN",cc: "659"},
            {text: "Saint Lucia",sc: "LC",cc: "662"},
            {text: "Saint Martin (French part)",sc: "MF",cc: "663"},
            {text: "Saint Pierre and Miquelon",sc: "PM",cc: "666"},
            {text: "Saint Vincent and the Grenadines",sc: "VC",cc: "670"},
            {text: "Samoa",sc: "WS",cc: "882"},
            {text: "San Marino",sc: "SM",cc: "674"},
            {text: "Sao Tome and Principe",sc: "ST",cc: "678"},
            {text: "Saudi Arabia",sc: "SA",cc: "682"},
            {text: "Senegal",sc: "SN",cc: "686"},
            {text: "Serbia",sc: "RS",cc: "688"},
            {text: "Seychelles",sc: "SC",cc: "690"},
            {text: "Sierra Leone",sc: "SL",cc: "694"},
            {text: "Singapore",sc: "SG",cc: "702"},
            {text: "Sint Maarten (Dutch part)",sc: "SX",cc: "534"},
            {text: "Slovakia",sc: "SK",cc: "703"},
            {text: "Slovenia",sc: "SI",cc: "705"},
            {text: "Solomon Islands",sc: "SB",cc: "090"},
            {text: "Somalia",sc: "SO",cc: "706"},
            {text: "South Africa",sc: "ZA",cc: "710"},
            {text: "South Georgia and the South Sandwich Islands",sc: "GS",cc: "239"},
            {text: "South Sudan",sc: "SS",cc: "728"},
            {text: "Spain",sc: "ES",cc: "724"},
            {text: "Sri Lanka",sc: "LK",cc: "144"},
            {text: "Sudan",sc: "SD",cc: "729"},
            {text: "Suriname",sc: "SR",cc: "740"},
            {text: "Svalbard and Jan Mayen",sc: "SJ",cc: "744"},
            {text: "Swaziland",sc: "SZ",cc: "748"},
            {text: "Sweden",sc: "SE",cc: "752"},
            {text: "Switzerland",sc: "CH",cc: "756"},
            {text: "Syrian Arab Republic",sc: "SY",cc: "760"},
            {text: "Taiwan, Province of China",sc: "TW",cc: "158"},
            {text: "Tajikistan",sc: "TJ",cc: "762"},
            {text: "Tanzania, United Republic of",sc: "TZ",cc: "834"},
            {text: "Thailand",sc: "TH",cc: "764"},
            {text: "Timor-Leste",sc: "TL",cc: "626"},
            {text: "Togo",sc: "TG",cc: "768"},
            {text: "Tokelau",sc: "TK",cc: "772"},
            {text: "Tonga",sc: "TO",cc: "776"},
            {text: "Trinscad and Tobago",sc: "TT",cc: "780"},
            {text: "Tunisia",sc: "TN",cc: "788"},
            {text: "Turkey",sc: "TR",cc: "792"},
            {text: "Turkmenistan",sc: "TM",cc: "795"},
            {text: "Turks and Caicos Islands",sc: "TC",cc: "796"},
            {text: "Tuvalu",sc: "TV",cc: "798"},
            {text: "Uganda",sc: "UG",cc: "800"},
            {text: "Ukraine",sc: "UA",cc: "804"},
            {text: "United Arab Emirates",sc: "AE",cc: "784"},
            {text: "United Kingdom",sc: "GB",cc: "826"},
            {text: "United States",sc: "US",cc: "840"},
            {text: "United States Minor Outlying Islands",sc: "UM",cc: "581"},
            {text: "Uruguay",sc: "UY",cc: "858"},
            {text: "Uzbekistan",sc: "UZ",cc: "860"},
            {text: "Vanuatu",sc: "VU",cc: "548"},
            {text: "Venezuela, Bolivarian Republic of",sc: "VE",cc: "862"},
            {text: "Viet Nam",sc: "VN",cc: "704"},
            {text: "Virgin Islands, British",sc: "VG",cc: "092"},
            {text: "Virgin Islands, U.S.",sc: "VI",cc: "850"},
            {text: "Wallis and Futuna",sc: "WF",cc: "876"},
            {text: "Western Sahara",sc: "EH",cc: "732"},
            {text: "Yemen",sc: "YE",cc: "887"},
            {text: "Zambia",sc: "ZM",cc: "894"},
            {text: "Zimbabwe",sc: "ZW",cc: "716"}
            ];      
        
        // loop through items and populate search keywords
        for (var i=0;i<data.length;i++) {                
            obj = data[i];
            keywords = self.extractUniqueMatches(obj.text);
            obj.keywords = keywords;            
        }
                
        return data;
    }
    
    // Trim whitespaces
    this.trim = function(s) {
        return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');        
    }
    
} // util

exports.util = new util();