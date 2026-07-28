document.addEventListener('DOMContentLoaded', () => {
    const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTAO1leoxWng7d_lstp4CesbnYWW3HGkbnjGUwDgILrQFIMmsuHFRl2jRNEfsKOY1lrhkCILGmVuHV4/pub?gid=0&single=true&output=csv';
    
    const numeroWhatsApp = '5493884662267'; 

    // Elementos del DOM
    const monthYearDisplay = document.getElementById('monthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    let currentDate = new Date();
    let diasOcupados = [];

    // Función para descargar las fechas de Google Sheets en tiempo real
    const cargarDiasOcupados = async () => {
        try {
            const response = await fetch(SHEET_CSV_URL);
            const csvText = await response.text();
            
            // Convertimos el texto CSV en un array limpio de fechas
            diasOcupados = csvText
                .split('\n')
                .map(row => row.trim())
                .filter(fecha => fecha.length > 0 && fecha !== 'fecha'); // Ignora el encabezado y líneas vacías

            renderCalendar(); // Una vez cargados los datos, dibujamos el calendario
        } catch (error) {
            console.error('Error al cargar las reservas:', error);
            // Si falla la red, renderiza igual para que la web no se rompa
            renderCalendar();
        }
    };

    const renderCalendar = () => {
        calendarGrid.innerHTML = '';
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        // 1. Espacios vacíos antes del día 1
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('cal-day', 'empty');
            calendarGrid.appendChild(emptyDiv);
        }

        // 2. Días del mes
        for (let day = 1; day <= totalDays; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('cal-day');
            dayDiv.textContent = day;

            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            if (diasOcupados.includes(dateString)) {
                dayDiv.classList.add('booked');
                dayDiv.title = "Reservado";
            } else {
                dayDiv.classList.add('free');
                dayDiv.title = "Libre - Haz clic para reservar";
                
                dayDiv.addEventListener('click', () => {
                    const fechaLegible = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
                    const mensaje = `Hola! Quiero reservar el quincho para el día ${fechaLegible}.`;
                    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
                    window.open(url, '_blank');
                });
            }

            calendarGrid.appendChild(dayDiv);
        }
    };

    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Iniciar el proceso descargando los datos de la planilla
    cargarDiasOcupados();
});
