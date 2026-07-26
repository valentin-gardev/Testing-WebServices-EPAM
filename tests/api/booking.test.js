import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { BookingClient } from './helpers/bookingClient.js'

const URL_Base = 'https://restful-booker.herokuapp.com'

const bookingSetup = {
    "firstname" : "Val",
    "lastname" : "Ga",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2020-01-01"
    },
    "additionalneeds" : "Breakfast"
}
const bookingUpdate = {
    "firstname" : "Valentin",
    "lastname" : "Gardev",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2020-01-01"
    },
    "additionalneeds" : "Breakfast"
}


describe('Resetful Booker API Flow', () => {

    let client
    let bookingID

    before(() => {
        client = new BookingClient(URL_Base)
    })
    it('POST: Login and save token', async() => {
        const {status, headers, body} = await client.createToken('admin', 'password123')

        assert.equal(status, 200)
        assert.ok(body.token, 'Token exists')

        client.setToken(body.token)
    })


    it('POST: Create new booking', async() => {
        const { status, headers, body } = await client.createNewBooking(bookingSetup)

        assert.strictEqual(status, 200, 'Booking status should be 200')

        assert.ok(
            headers.get('content-type').includes('application/json'),
            'content-type should be application/json'
        )

        assert.ok(body.bookingid, 'Response should contain bookingid')

        bookingID = body.bookingid
    })


    it('GET: Get booking by ID', async() => {
        const { status, headers, body } = await client.getNewBooking(bookingID)

        assert.strictEqual(status, 200, 'Getting booking should be 200')
        assert.strictEqual(body.firstname, bookingSetup.firstname, 'First names should match')
    })


    it('PUT: Update booking name', async() => {
        const { status, headers, body } = await client.updateBooking(bookingID, bookingUpdate)

        assert.strictEqual(status, 200, 'Update booking should be 200')
        assert.strictEqual(body.firstname, 'Valentin', 'First name should be updated to Valentin')
        assert.strictEqual(body.lastname, 'Gardev', 'Last name should be updated to Gardev')
    })

    it('DELETE: Delete booking', async() => {

        const { status } = await client.deleteBooking(bookingID)

        assert.strictEqual(status, 201, 'Delete status should be 201')

        const {status: statusGet, headers: headersGet, body: bodyGet } = await client.getNewBooking(bookingID)
        assert.strictEqual(statusGet, 404, 'Status should be 404, doesnt exist')
    })


    
})