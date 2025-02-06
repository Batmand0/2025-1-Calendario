class Calendar {
    constructor() {
        // Inicializa los meses y días de la semana, así como la lista de eventos y el contenedor del calendario
        this.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'];
        this.weekDays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        this.events = [];
        this.container = document.getElementById('calendar-container');
    }

    // Método asíncrono que inicia la carga de eventos y renderiza el calendario
    async init() {
        await this.loadEvents();
        this.render();
    }

    // Método asíncrono que carga los eventos desde una API
    async loadEvents() {
        try {
            const year = new Date().getFullYear();
            const timeMin = new Date(`${year}-01-01T00:00:00`).toISOString();
            const timeMax = new Date(`${year}-08-31T23:59:59`).toISOString();
            
            //console.log('Solicitando eventos desde:', timeMin, 'hasta:', timeMax);
            const response = await fetch(`http://localhost:3000/api/events?timeMin=${timeMin}&timeMax=${timeMax}`);
            const data = await response.json();
            
            // Añade este log para ver la estructura exacta de cada evento
            console.log('Estructura de un evento:', data[0]);
            
            this.events = data.map(event => {
                // Asegúrate de que las fechas estén en el formato correcto
                const startDate = event.start?.dateTime || event.start?.date || event.start;
                //Usa el operador ?. para evitar errores si start o end son undefined
                const endDate = event.end?.dateTime || event.end?.date || event.end;
                //Proporciona múltiples fallbacks (alternativas) para obtener la fecha
                
                return {
                    //Convierte cualquier formato de fecha en un objeto Date y lo convierte en formato ISO
                    date: new Date(startDate).toISOString().split('T')[0], // Formato YYYY-MM-DD
                    title: event.title || event.summary || '',
                    description: event.description || '',
                    location: event.location || '',
                    start: startDate,
                    end: endDate,
                    htmlLink: event.htmlLink
                };
            });
            
            // Añade este log para verificar cómo quedaron formateados los eventos
            //console.log('Eventos procesados:', this.events);
            
        } catch (error) {
            console.error('Error completo:', error);
            this.events = [];
        }
    }
    
    // Modifica el método getEventsForDate para ser más flexible
    getEventsForDate(date) {
        /*console.log('Buscando eventos para la fecha:', date);
        console.log('Eventos disponibles:', this.events);*/
        
        //Se hace una comparación de fechas y las registra.
        return this.events.filter(event => {
            const eventDate = event.date;
            //console.log('Comparando:', eventDate, 'con', date);
            return eventDate === date;
        });
    }

    // Método que obtiene la cantidad de días en un mes específico
    getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    // Método que obtiene el primer día de un mes específico
    getFirstDayOfMonth(month, year) {
        return new Date(year, month, 1).getDay();
    }

    // Método que renderiza un mes específico
    renderMonth(monthIndex) {
        //Crea el Card del mes.
        const year = new Date().getFullYear();
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';

        //Crea el título del mes.
        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.textContent = this.months[monthIndex];
        monthCard.appendChild(monthTitle);

        //Letras de cada día de la semana (D-L-M...)
        const weekdaysDiv = document.createElement('div');
        weekdaysDiv.className = 'weekdays';
        this.weekDays.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            weekdaysDiv.appendChild(dayDiv);
        });
        monthCard.appendChild(weekdaysDiv);

        //Días del mes.
        const daysDiv = document.createElement('div');
        daysDiv.className = 'days';

        //Para obtener el dia del primer mes y dejar espacios vacíos.
        const firstDay = this.getFirstDayOfMonth(monthIndex, year);
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            daysDiv.appendChild(emptyDay);
        }

        //Obtiene la cantidad de días en el mes específico
        const daysInMonth = this.getDaysInMonth(monthIndex, year);
        //Se recorre cada día del mes
        for (let day = 1; day <= daysInMonth; day++) { 
            const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = this.getEventsForDate(dateStr);

            //console.log(`Eventos encontrados para ${dateStr}:`, dayEvents);
            const dayDiv = document.createElement('div');
            dayDiv.className = `day ${dayEvents.length > 0 ? 'has-events' : ''}`;
            dayDiv.textContent = day;

            if (dayEvents.length > 0) {
                const tooltip = document.createElement('div');
                tooltip.className = 'event-tooltip'; // Cambiado de 'tooltip' a 'event-tooltip'
                // En la parte donde creas el tooltip
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    return date.toLocaleString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                };
                tooltip.innerHTML = dayEvents.map(event => 
                    `<div class="event-item">
                        <strong class="text-primary">${event.title}</strong>
                         <a href="${event.htmlLink}">
                            <i class="bi bi-link"></i>
                         </a> 
                        <br>
                        <strong class="text-secondary">${formatDate(event.start)} -</strong>
                        <strong class="text-secondary">${formatDate(event.end)}</strong>
                        <br>
                        <small class="text-muted">${event.description}</small>
                        <br>
                        <small class="text-muted">${event.location}</small>
                    </div>`
                ).join('<hr>');
                dayDiv.appendChild(tooltip);
            }

            daysDiv.appendChild(dayDiv);
        }

        monthCard.appendChild(daysDiv);
        return monthCard;
    }

    // Método que renderiza todo el calendario
    render() {
        this.container.innerHTML = '';
        this.months.forEach((_, index) => {
            this.container.appendChild(this.renderMonth(index));
        });
    }
}

// Inicializa el calendario cuando el contenido de la página ha sido cargado
document.addEventListener('DOMContentLoaded', () => {
    const calendar = new Calendar();
    calendar.init();
});