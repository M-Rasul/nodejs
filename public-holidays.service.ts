import axios from "axios";

// BASE_API
export const BASE_API = "https://date.nager.at/api/v3";

// COUNTRIES
const countries: string[] = ["GB", "FR", "DE", "NL"];

// IS COUNTRY SUPPORTED?
const isCountrySupported = function (country: string): void {
    // IF COUNTRY IS NOT IN THE LIST
    if (!countries.includes(country)) {
        throw new Error("This country is not supported");
    }
}

// INTERFACE FOR THE OBJECT
interface IHoliday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
    counties: string[] | null;
    launchYear: number | null;
    types: string[];
};

// SERVICE
const publicHolidaysService = {

    // SHOW THE LIST OF HOLIDAYS IN SPECIFIC COUNTRY THIS YEAR
    async showHolidaysSpecificCountryCurrentYear(country: string): Promise<IHoliday[]> {

        // CALLING THE VALIDATION OF A COUNTRY
        isCountrySupported(country);

        // MAKING A REQUEST TO GET HOLIDAYS
        const {data} = await axios.get(`${BASE_API}/PublicHolidays/${new Date().getFullYear()}/${country}`);

        // RETURNING RESULT
        return data;
    },

    // SHOW NEXT HOLIDAY FOR SPECIFIC COUNTRY
    async showNextHolidaySpecificCountry(country: string): Promise<IHoliday[]> {

        // VALIDATING COUNTRY
        isCountrySupported(country);

        // MAKING A REQUEST
        const {data} = await axios.get(`${BASE_API}/NextPublicHolidays/${country}`);
        
        // RETURNING LIST OF HOLIDAYS
        return data;
    },

    // SHOW IF TODAY IS PUBLIC HOLIDAY IN SPECIFIC COUNTRY
    async isHolidayToday(country: string):Promise<boolean> {

        // VALIDATING COUNTRY
        isCountrySupported(country);

        // MAKING A REQUEST
        const {status} = await axios.get(`${BASE_API}/IsTodayPublicHoliday/${country}`);

        // CHECKING THE STATUS
        if(status === 204) {
            return false;
        } else if(status === 400) {
            throw new Error("Validation failure");
        }
        return true;
    }
};

// EXPORT
export default publicHolidaysService;