// import { guardarDatos, obtenerTodos } from "./indexedDB.js";

export class Reserva {
  constructor() {
    this.apiurl = 'https://sistemareservasback-production.up.railway.app/api';
  }

  // Método para hacer la reserva en el backend
  async makeReservation(payload) {

    // guardarDatos(payload)
    const response = await fetch(`${this.apiurl}/reservation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data;
  }

  // Método para obtener las reservas por fecha
  async getReservationsForSpaceByDate(date, spaceId) {
    // const data = obtenerTodos()
    const response = await fetch(`${this.apiurl}/reservations?fechaReserva=${encodeURIComponent(date)}&spaceId=${encodeURIComponent(spaceId)}`);
    const data = await response.json();
    return data;
  }

  async getReservationsById(identification, fechaReserva) {
    const response = await fetch(`${this.apiurl}/reservationById?identification=${identification}&fechaReserva=${fechaReserva}`);
    const data = await response.json();
    return data;
  }

  async deleteReservationById(id_reserva, identification){
    const response = await fetch(`${this.apiurl}/reservation?id_reserva=${encodeURIComponent(id_reserva)}&identification=${encodeURIComponent(identification)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }
}


