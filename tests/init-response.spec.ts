import { InitResponse } from "../src/components/init-response"

describe("Test InitResponse", () => {
    it("Create InitResponse for successful mobile init", () => {
        const parsedData = {
            status: 'Ok',
            paynowreference: "20562970",
            pollurl: 'https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9328-4938-801a-e5970b12212a',
            instructions: 'Dial *151*2*7# and enter your EcoCash PIN. Once you have authorized the payment via your handset, please click Check For Payment below to conclude this transaction',
            hash: "FA79DEA06391E68B31A62F60E5AEB4C29D5E43FD6165367F4A2AF9EE938361044A90B3CE008F0390CC808FFD9CE1403F5C4A463DE6B9CB3BC67D78F0C0CABC5F"
        }

        const initRes = new InitResponse(parsedData)

        expect(initRes.success).toBe(true)
        expect(initRes.isInnbucks).toBe(false)
        expect(initRes.status).toBe("Ok")
        expect(initRes.pollUrl).toEqual(parsedData.pollurl)
        expect(initRes.paynowReference).toEqual(parsedData.paynowreference)
        expect(initRes.instructions).toEqual(parsedData.instructions)
    })

    it("Create InitResponse for error", () => {
        const parsedData = {
            status: 'Error',
            error: "The integration ID is in test mode so if authemail is specified then it must match the merchants registered email address"
        }

        const initRes = new InitResponse(parsedData)

        expect(initRes.success).toBe(false)
        expect(initRes.isInnbucks).toBe(false)
        expect(initRes.status).toBe("Error")
        expect(initRes.error).toEqual(parsedData.error)
    })
})