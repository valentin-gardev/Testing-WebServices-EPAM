

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

    async getNewBooking(bookingID) {
        const response = await fetch(`${this.URL_Base}/booking/${bookingID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        let body = null
        if(response.status === 200) {
            body = await response.json()
        }else {
            body = await response.text()
        }
        return {
            status: response.status,
            headers: response.headers,
            body: body
        }
    }

    async updateBooking(bookingID, bookingUpdate) {
        const response = await fetch(`${this.URL_Base}/booking/${bookingID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${this.token}`
            },
            body: JSON.stringify(bookingUpdate)
        })

        return {
            status: response.status,
            headers: response.headers,
            body: await response.json()
        }
    }

    async deleteBooking(bookingID) {
         const deleteResponse = await fetch(`${this.URL_Base}/booking/${bookingID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${this.token}`
            }
        })
        
        return {
            status: deleteResponse.status
        }
    }


}