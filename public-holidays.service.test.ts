import axios from "axios";
import publicHolidaysService, { BASE_API } from "./public-holidays.service";

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

// SAMPLE DATA FOR MOCK
const FRANCE_CURRENT_YEAR: IHoliday[] = [
    {
        "date": "2023-01-01",
        "localName": "Jour de l'an",
        "name": "New Year's Day",
        "countryCode": "FR",
        "fixed": true,
        "global": true,
        "counties": null,
        "launchYear": 1967,
        "types": [
            "Public"
        ]
    },
    {
        "date": "2023-04-10",
        "localName": "Lundi de Pâques",
        "name": "Easter Monday",
        "countryCode": "FR",
        "fixed": false,
        "global": true,
        "counties": null,
        "launchYear": 1642,
        "types": [
            "Public"
        ]
    },
    {
        "date": "2023-05-01",
        "localName": "Fête du Travail",
        "name": "Labour Day",
        "countryCode": "FR",
        "fixed": true,
        "global": true,
        "counties": null,
        "launchYear": null,
        "types": [
            "Public"
        ]
    },
    {
        "date": "2023-05-08",
        "localName": "Victoire 1945",
        "name": "Victory in Europe Day",
        "countryCode": "FR",
        "fixed": true,
        "global": true,
        "counties": null,
        "launchYear": null,
        "types": [
            "Public"
        ]
    },
    {
        "date": "2023-05-18",
        "localName": "Ascension",
        "name": "Ascension Day",
        "countryCode": "FR",
        "fixed": false,
        "global": true,
        "counties": null,
        "launchYear": null,
        "types": [
            "Public"
        ]
    },
    {
        "date": "2023-05-29",
        "localName": "Lundi de Pentecôte",
        "name": "Whit Monday",
        "countryCode": "FR",
        "fixed": false,
        "global": true,
        "counties": null,
        "launchYear": null,
        "types": [
            "Public"
        ]
    },
    {
        "date": "2023-07-14",
        "localName": "Fête nationale",
        "name": "Bastille Day",
        "countryCode": "FR",
        "fixed": true,
        "global": true,
        "counties": null,
        "launchYear": null,
        "types": [
            "Public"
        ]
    },
    {
        "date": "2023-08-15",
        "localName": "Assomption",
        "name": "Assumption Day",
        "countryCode": "FR",
        "fixed": true,
        "global": true,
        "counties": null,
        "launchYear": null,
        "types": [
            "Public"
        ]
    },
    {
        "date": "2023-11-01",
        "localName": "Toussaint",
        "name": "All Saints' Day",
        "countryCode": "FR",
        "fixed": true,
        "global": true,
        "counties": null,
        "launchYear": null,
        "types": [
            "Public"
        ]
    },
    {
        "date": "2023-11-11",
        "localName": "Armistice 1918",
        "name": "Armistice Day",
        "countryCode": "FR",
        "fixed": true,
        "global": true,
        "counties": null,
        "launchYear": null,
        "types": [
            "Public"
        ]
    },
    {
        "date": "2023-12-25",
        "localName": "Noël",
        "name": "Christmas Day",
        "countryCode": "FR",
        "fixed": true,
        "global": true,
        "counties": null,
        "launchYear": null,
        "types": [
            "Public"
        ]
    }
];

// NEXT HOLIDAY IN GERMANY
const GERMANY_NEXT_HOLIDAY: IHoliday[] = [{
    "date": "2023-12-25",
    "localName": "Erster Weihnachtstag",
    "name": "Christmas Day",
    "countryCode": "DE",
    "fixed": true,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": [
        "Public"
    ]
}];

// UNIT TESTS
describe("Unit tests", () => {

    // GET HOLIDAYS IN CURRENT YEAR
    describe("Get holidays in current year in specific country", () => {

        // TESTING RETURN VALUES
        test("should return the list of holidays", async () => {

            // MOCK RESPONSE
            const mockAxios = jest.spyOn(axios, "get").mockImplementation(() => Promise.resolve({ data: FRANCE_CURRENT_YEAR }));

            // MAKING A REQUEST
            const holidaysResponse = await publicHolidaysService.showHolidaysSpecificCountryCurrentYear("FR");

            // EXPECT FIRST ELEMENT BE EQUAL TO FRANCE FIRST HOLIDAY
            expect(holidaysResponse[0].name).toEqual(FRANCE_CURRENT_YEAR[0].name);
        });

        // TESTING ARGUMENTS PASSED
        test("should be called with proper arguments", async () => {

            // MOCKING THE CALL TO API
            const mockedRequest = jest.spyOn(axios, "get").mockImplementation(() => Promise.resolve({ data: FRANCE_CURRENT_YEAR }));

            // CALLING API
            await publicHolidaysService.showHolidaysSpecificCountryCurrentYear("FR");

            // EXPECT CORRECT ARGUMENTS
            expect(mockedRequest).toHaveBeenCalledWith(`https://date.nager.at/api/v3/PublicHolidays/2023/FR`);
        });

        // TESTING ERROR
        test("should throw error if wrong country provided", async () => {

            // COUNTRY CODE
            const countryCode: string = "UZ";

            // EXPECTING AN ERROR
            await expect(publicHolidaysService.showHolidaysSpecificCountryCurrentYear(countryCode)).rejects.toThrow(new Error("This country is not supported"));
        });

        // CLEARING MOCKS AFTER EACH OPERATION
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    // SHOW NEXT HOLIDAY
    describe("Show next holiday in specific country", () => {

        // SHOULD GET CORRECT NEXT HOLIDAY
        test("should return next holiday", async () => {

            const mockAxios = jest.spyOn(axios, "get").mockImplementation(() => Promise.resolve({data: GERMANY_NEXT_HOLIDAY}));

            // MAKING REQUEST
            const holidaysResponse = await publicHolidaysService.showNextHolidaySpecificCountry("DE");

            // EXPECTING RESULT TO BE CORRECT
            expect(holidaysResponse).toEqual(GERMANY_NEXT_HOLIDAY);
        });

        // CLEARING MOCKS AFTER EACH OPERATION
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    // CHECKING IF TODAY IS HOLIDAY
    describe("Show if today is holiday", () => {

        // CHECK IF TODAY IS HOLIDAY
        test("should return true or false based on holiday today", async () => {

            // MOCKING API CALL
            const mockAxios = jest.spyOn(axios, "get").mockImplementation(() => Promise.resolve({status: 204}));

            // MAKING A CALL TO API
            const isTodayHolidayResponse = await publicHolidaysService.isHolidayToday("DE");

            // EXPECTING TO RECEIVE FALSE
            expect(isTodayHolidayResponse).toEqual(false);
        });

        // CLEARING MOCKS AFTER EACH OPERATION
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });
});

// INTEGRATION TESTS
describe("Integration tests", () => {

    // GET HOLIDAYS IN CURRENT YEAR
    describe("Get holidays of specific country in current year", () => {

        // GET HOLIDAYS IN CURRENT YEAR
        test("should return correct holidays in France this year", async () => {

            // MAKING REQUEST
            const {data} = await axios.get(`${BASE_API}/PublicHolidays/${new Date().getFullYear()}/FR`);
            
            // EXPECT CORRECT RESULT
            expect(data).toEqual(FRANCE_CURRENT_YEAR);
        });
    });
    
    // GET NEXT HOLIDAY IN SPECIFIC COUNTRY
    describe("Get next holiday in specific country", () => {

        // GET NEXT HOLIDAY IN GERMANY
        test("should return correct next holiday in Germany", async () => {

            // MAKING REQUEST
            const {data} = await axios.get(`${BASE_API}/NextPublicHolidays/DE`);

            // EXPECTING NEXT HOLIDAY IN GERMANY BE CORRECT
            expect(data[0]).toEqual(GERMANY_NEXT_HOLIDAY[0]);
        });
    });

    // IS TODAY HOLIDAY
    describe("Get whether today is holiday or not", () => {

        // IS TODAY HOLIDAY IN NETHERLANDS
        test("should return whether it is holiday in Netherlands today or not", async () => {

            // MAKING A REQUEST
            const {status} = await axios.get(`${BASE_API}/IsTodayPublicHoliday/NL`);

            // EXPECTING TO RECEIVE 204 AS A STATUS CODE
            expect(status).toEqual(204);
        });
    });
});

// E2E TESTS
describe("E2E tests", () => {

    // GET HOLIDAYS FOR CURRENT YEAR
    describe("/PublicHolidaysCurrentYear", () => {

        test("should return status 200 on holidays GET", async () => {

            // REQUEST
            const {status} = await axios.get(`${BASE_API}/PublicHolidays/${new Date().getFullYear()}/FR`);

            expect(status).toEqual(200);
        });
    });

    // IS TODAY HOLIDAY
    describe("/IsTodayHoliday", () => {

        test("should return status based on information about today's holiday", async () => {

            const {status} = await axios.get(`${BASE_API}/IsTodayPublicHoliday/GB`);

            expect(status).toEqual(204);
        });
    });
});