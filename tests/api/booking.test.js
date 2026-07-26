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
    "firstname" : "Valelntin",
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
        const response = await fetch(`${URL_Base}/booking/${bookingID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        assert.strictEqual(response.status, 200, 'Getting booking should be 200')
        const body = await response.json()
        assert.strictEqual(body.firstname, bookingSetup.firstname, 'First names do not match')
    })


    it('PUT: Update booking name', async() => {
        const response = await fetch(`${URL_Base}/booking/${bookingID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            body: JSON.stringify(bookingUpdate)
        })

        assert.strictEqual(response.status, 200, 'Update booking should be 200')
    })

    it('DELETE: Delete booking', async() => {
        
        assert.ok(bookingID, 'ID must exist')
        assert.ok(token, 'Token must exist')

        const deleteResponse = await fetch(`${URL_Base}/booking/${bookingID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            }
        })

        assert.strictEqual(deleteResponse.status, 201, 'Delete status should be 201')

        const getDeletedResponse = await fetch(`${URL_Base}/booking/${bookingID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        assert.strictEqual(getDeletedResponse.status, 404, 'Status should be 404, doesnt exist')
    })


    
})