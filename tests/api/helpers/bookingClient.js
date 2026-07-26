

export class BookingClient {

    constructor(urlBase) {
        this.token = null
        this.URL_Base = urlBase 
    }

    setToken(token) {
        this.token = token
    }


    async createToken(username, password) {
        const response = await fetch(`${this.URL_Base}/auth`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })

        return {
            status: response.status,
            headers: response.headers,
            body: await response.json()
        }
    }

    async createNewBooking(bookingSetup) {
        const response = await fetch(`${this.URL_Base}/booking`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body : JSON.stringify(bookingSetup)
        })
        return {
            status: response.status,
            headers: response.headers,
            body: await response.json()
        }
    }
}