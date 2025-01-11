import { Paynow } from "../src"

describe("Test Paynow", () => {
    it("should create Paynow instance", () => {
        const paynow = new Paynow("PAYNOW_INTEGRATION_ID", "PAYNOW_INTEGRATION_KEY")

        expect(paynow).toBeInstanceOf(Paynow)
        expect(paynow.integrationId).toEqual("PAYNOW_INTEGRATION_ID")
        expect(paynow.integrationKey).toEqual("PAYNOW_INTEGRATION_KEY")
    })

    it("should create Paynow instance with ENV variables", () => {
        process.env.PAYNOW_INTEGRATION_ID = "PAYNOW_INTEGRATION_ID"
        process.env.PAYNOW_INTEGRATION_KEY = "PAYNOW_INTEGRATION_KEY"

        const paynow = new Paynow()

        expect(paynow).toBeInstanceOf(Paynow)
        expect(paynow.integrationId).toEqual("PAYNOW_INTEGRATION_ID")
        expect(paynow.integrationKey).toEqual("PAYNOW_INTEGRATION_KEY")
    })

    it("should parse querystring", () => {
        const paynow = new Paynow("PAYNOW_INTEGRATION_ID", "PAYNOW_INTEGRATION_KEY")

        const expectedParsedData = {
            status: 'Ok',
            paynowreference: "20562970",
            pollurl: 'https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9328-4938-801a-e5970b12212a',
            instructions: 'Dial *151*2*7# and enter your EcoCash PIN. Once you have authorized the payment via your handset, please click Check For Payment below to conclude this transaction',
            hash: "FA79DEA06391E68B31A62F60E5AEB4C29D5E43FD6165367F4A2AF9EE938361044A90B3CE008F0390CC808FFD9CE1403F5C4A463DE6B9CB3BC67D78F0C0CABC5F"
        }

        const querystring = "status=Ok&instructions=Dial+*151*2*7%23+and+enter+your+EcoCash+PIN.+Once+you+have+authorized+the+payment+via+your+handset%2c+please+click+Check+For+Payment+below+to+conclude+this+transaction&paynowreference=20562970&pollurl=https%3a%2f%2fwww.paynow.co.zw%2fInterface%2fCheckPayment%2f%3fguid%3db56e63e3-9328-4938-801a-e5970b12212a&hash=FA79DEA06391E68B31A62F60E5AEB4C29D5E43FD6165367F4A2AF9EE938361044A90B3CE008F0390CC808FFD9CE1403F5C4A463DE6B9CB3BC67D78F0C0CABC5F"

        expect(paynow.parseQuery(querystring)).toEqual(expectedParsedData)
    })

    it("should validate email", () => {
        const paynow = new Paynow("PAYNOW_INTEGRATION_ID", "PAYNOW_INTEGRATION_KEY")

        const email1 = "tpp@pfitz.co.zw"
        const email2 = "notAnEmailAddress"

        expect(paynow.isValidEmail(email1)).toBe(true)
        expect(paynow.isValidEmail(email2)).toBe(false)
    })

    it("should validate payment", () => {
        const paynow = new Paynow("PAYNOW_INTEGRATION_ID", "PAYNOW_INTEGRATION_KEY")
        const payment = paynow.createPayment("some-unique-id", "tpp@pfitz.co.zw")
        expect(() => paynow.validate(payment)).toThrow()
        payment.add("noodles", 10)
        expect(paynow.validate(payment)).toBe(undefined)
    })

    it("should verify hash", () => {
        process.env.PAYNOW_INTEGRATION_ID = "98765"
        process.env.PAYNOW_INTEGRATION_KEY = "635b5c62-3c79-4b1e-95e9-9ce50a95b264"

        const parsedData: {[key: string]: string } = {
            status: 'Ok',
            instructions: 'Dial *151*2*7# and enter your EcoCash PIN. Once you have authorized the payment via your handset, please click Check For Payment below to conclude this transaction',
            paynowreference: "10562872",
            pollurl: 'https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9399-4938-801a-e5970b12212a',
            hash: "195689793C3613E40EBBB53982AE226D45A7E0D6B337BC78BBCA0C268EF8FB71928E295DF94487B00F1B9C846EDB228C592D31F6AC0AC258AB567CCF810B1CAA"
        }
        
        const paynow = new Paynow()

        // real hash
        expect(paynow.verifyHash(parsedData)).toBe(true)
        // random hash
        parsedData.hash = "WRONGHASHB3F770AB4BCD11D9061A7DBD69E22200329713A225DE168DE2CE776B88599F3A3C1AC9100BCE3A44C8ED68E2B0B74476139286AC8F511EFC450B921"
        expect(paynow.verifyHash(parsedData)).toBe(false)
    })

    it("should generate and verify hash", () => {
        process.env.PAYNOW_INTEGRATION_ID = "98765"
        process.env.PAYNOW_INTEGRATION_KEY = "635b5c62-3c79-4b1e-95e9-9ce50a95b264"

        const parsedData: {[key: string]: string } = {
            status: 'Ok',
            instructions: 'Dial *151*2*7# and enter your EcoCash PIN. Once you have authorized the payment via your handset, please click Check For Payment below to conclude this transaction',
            paynowreference: "10562872",
            pollurl: 'https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9399-4938-801a-e5970b12212a',
        }
        
        const paynow = new Paynow()

        parsedData["hash"] = paynow.generateHash(parsedData, paynow.integrationKey)

        // generate hash
        expect(paynow.verifyHash(parsedData)).toBe(true)
        // random hash
        parsedData.hash = "WRONGHASHB3F770AB4BCD11D9061A7DBD69E22200329713A225DE168DE2CE776B88599F3A3C1AC9100BCE3A44C8ED68E2B0B74476139286AC8F511EFC450B921"
        expect(paynow.verifyHash(parsedData)).toBe(false)
    })

    // it("Generate Hash", () => {
    //     process.env.PAYNOW_INTEGRATION_ID = "98765"
    //     process.env.PAYNOW_INTEGRATION_KEY = "635b5c62-3c79-4b1e-95e9-9ce50a95b264"

    //     const parsedData: {[key: string]: string } = {
    //         reference: "d776497b-d1ef-49c3-bd50-3951ce2795d0",
    //         paynowreference: "20562788",
    //         amount: "30.00",
    //         status: "Cancelled",
    //         pollurl: 'https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9328-4938-801a-e5970b12212a'
    //     }
        
    //     const paynow = new Paynow()

    //     console.log(paynow.generateHash(parsedData, paynow.integrationKey))
    // })
})