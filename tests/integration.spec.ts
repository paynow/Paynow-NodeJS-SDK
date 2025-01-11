import { InitResponse, Paynow, StatusResponse } from "../src"

describe("Test integrated functionality", () => {
    it("should initialise mobile", async () => {
        // mock fetch
        jest.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue("status=Ok&instructions=Dial+*151*2*7%23+and+enter+your+EcoCash+PIN.+Once+you+have+authorized+the+payment+via+your+handset%2c+please+click+Check+For+Payment+below+to+conclude+this+transaction&paynowreference=10562872&pollurl=https%3a%2f%2fwww.paynow.co.zw%2fInterface%2fCheckPayment%2f%3fguid%3db56e63e3-9399-4938-801a-e5970b12212a&hash=195689793C3613E40EBBB53982AE226D45A7E0D6B337BC78BBCA0C268EF8FB71928E295DF94487B00F1B9C846EDB228C592D31F6AC0AC258AB567CCF810B1CAA")
        } as unknown as Response)

        process.env.PAYNOW_INTEGRATION_ID = "98765"
        process.env.PAYNOW_INTEGRATION_KEY = "635b5c62-3c79-4b1e-95e9-9ce50a95b264"

        const paynow = new Paynow()

        const payment = paynow.createPayment("some-unique-id", "tpp@pfitz.co.zw")

        payment.add("mushroom", 15)

        let testInitResponse: InitResponse

        try {
            const initResponse = await paynow.sendMobile(
                payment,
                "0775409679",
                "ecocash"
            )

            testInitResponse = initResponse


        } catch (error) {
            console.log(error)
            expect(true).toBe(false)
        }

        expect(testInitResponse?.success).toBe(true)
        expect(testInitResponse?.status).toEqual("Ok")
        expect(testInitResponse?.paynowReference).toEqual("10562872")
        expect(testInitResponse?.pollUrl).toEqual("https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9399-4938-801a-e5970b12212a")
        expect(fetch).toHaveBeenCalledTimes(1)
        expect(fetch).toHaveBeenCalledWith(
            "https://www.paynow.co.zw/interface/remotetransaction",
            {
                body: "resulturl=&returnurl=&reference=some-unique-id&amount=15&id=98765&additionalinfo=mushroom&authemail=tpp%40pfitz.co.zw&phone=0775409679&method=ecocash&status=Message&hash=8ED024D85A68B3FC44197E9E18C1EDBC75F093F7F1FEDD5493B25CD7238776BBE5AC6B9E0E186AF20CEFE447B19E7A9D054857315D05219833AD6986CE89B863",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            }
        )
    })

    it("should poll status update", async() => {
        jest.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue("reference=d776497b-d1ef-49c3-bd50-3951ce2795d0&paynowreference=20562788&amount=30.00&status=Cancelled&pollurl=https%3a%2f%2fwww.paynow.co.zw%2fInterface%2fCheckPayment%2f%3fguid%3db56e63e3-9328-4938-801a-e5970b12212a&hash=75BCE01DE667A6BB20FEC70786877EEAA6B2EC6E083F5D79E61B9F9350035CCCD32FAC5421D9C2C75D923163CEF5445EC1CEEB8311C4E6C423FEE300867B4173")
        } as unknown as Response)

        process.env.PAYNOW_INTEGRATION_ID = "98765"
        process.env.PAYNOW_INTEGRATION_KEY = "635b5c62-3c79-4b1e-95e9-9ce50a95b264"

        const paynow = new Paynow()

        let testStatusRes: StatusResponse

        try {
            const statusRes = await paynow.pollTransaction("the-poll-url")

            testStatusRes = statusRes
        } catch (error) {
            console.log(error)
            expect(true).toBe(false)
        }

        expect(testStatusRes.paid()).toBe(false)
        expect(testStatusRes.status).toEqual("Cancelled")
        expect(testStatusRes.amount).toEqual("30.00")
        expect(testStatusRes.pollUrl).toEqual("https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9328-4938-801a-e5970b12212a")
        expect(testStatusRes.reference).toEqual("d776497b-d1ef-49c3-bd50-3951ce2795d0")
    })

    it("should parse status update", async() => {
        const paynow = new Paynow()

        let testStatusRes: StatusResponse

        try {
            const statusRes = await paynow.parseStatusUpdate("reference=d776497b-d1ef-49c3-bd50-3951ce2795d0&paynowreference=20562788&amount=30.00&status=Cancelled&pollurl=https%3a%2f%2fwww.paynow.co.zw%2fInterface%2fCheckPayment%2f%3fguid%3db56e63e3-9328-4938-801a-e5970b12212a&hash=75BCE01DE667A6BB20FEC70786877EEAA6B2EC6E083F5D79E61B9F9350035CCCD32FAC5421D9C2C75D923163CEF5445EC1CEEB8311C4E6C423FEE300867B4173")

            testStatusRes = statusRes
        } catch (error) {
            console.log(error)
            expect(true).toBe(false)
        }

        expect(testStatusRes.paid()).toBe(false)
        expect(testStatusRes.status).toEqual("Cancelled")
        expect(testStatusRes.amount).toEqual("30.00")
        expect(testStatusRes.pollUrl).toEqual("https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9328-4938-801a-e5970b12212a")
        expect(testStatusRes.reference).toEqual("d776497b-d1ef-49c3-bd50-3951ce2795d0")
    })
})