import { StatusResponse } from "../src/components/status-response"

describe("Test Status Response", () => {
    it("Create StatusResponse from parsedData", () => {
        const parsedData = {
            reference: 'd776497b-d1ef-49c3-bd50-3951ce2795d0',
            paynowreference: '20562970',
            amount: '30.00',
            status: 'Cancelled',
            pollurl: 'https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9328-4938-801a-e5970b12212a',
            hash: "40AA3EF664B91FC288879BF405BC250E36B56509ECFAD9D435AE5FE16D2FC85BAEAB52C2C43BDD969FA30820F7BEA97B3CCBC43C599D77B3DF956A3D965DA589"
        }

        const statusRes = new StatusResponse(parsedData)

        expect(statusRes.status).toEqual(parsedData.status)
        expect(statusRes.reference).toEqual(parsedData.reference)
        expect(statusRes.paynowReference).toEqual(parsedData.paynowreference)
        expect(statusRes.amount).toEqual(parsedData.amount)
        expect(statusRes.pollUrl).toEqual(parsedData.pollurl)
        expect(statusRes.paid()).toBe(false)
    })

    it("Create StatusResponse from parsedData (with a 'paidy' status)", () => {
        const parsedData = {
            reference: 'd776497b-d1ef-49c3-bd50-3951ce2795d0',
            paynowreference: '20562970',
            amount: '30.00',
            status: 'Awaiting Delivery',
            pollurl: 'https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9328-4938-801a-e5970b12212a',
            hash: "40AA3EF664B91FC288879BF405BC250E36B56509ECFAD9D435AE5FE16D2FC85BAEAB52C2C43BDD969FA30820F7BEA97B3CCBC43C599D77B3DF956A3D965DA589"
        }

        const statusRes = new StatusResponse(parsedData)

        expect(statusRes.paid()).toBe(true)
    })

    it("Create StatusResponse from parsedData (with another 'paidy' status)", () => {
        const parsedData = {
            reference: 'd776497b-d1ef-49c3-bd50-3951ce2795d0',
            paynowreference: '20562970',
            amount: '30.00',
            status: 'Paid',
            pollurl: 'https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9328-4938-801a-e5970b12212a',
            hash: "40AA3EF664B91FC288879BF405BC250E36B56509ECFAD9D435AE5FE16D2FC85BAEAB52C2C43BDD969FA30820F7BEA97B3CCBC43C599D77B3DF956A3D965DA589"
        }

        const statusRes = new StatusResponse(parsedData)

        expect(statusRes.paid()).toBe(true)
    })

    it("Create StatusResponse from parsedData (with third 'paidy' status)", () => {
        const parsedData = {
            reference: 'd776497b-d1ef-49c3-bd50-3951ce2795d0',
            paynowreference: '20562970',
            amount: '30.00',
            status: 'Delivered',
            pollurl: 'https://www.paynow.co.zw/Interface/CheckPayment/?guid=b56e63e3-9328-4938-801a-e5970b12212a',
            hash: "40AA3EF664B91FC288879BF405BC250E36B56509ECFAD9D435AE5FE16D2FC85BAEAB52C2C43BDD969FA30820F7BEA97B3CCBC43C599D77B3DF956A3D965DA589"
        }

        const statusRes = new StatusResponse(parsedData)

        expect(statusRes.paid()).toBe(true)
    })
})