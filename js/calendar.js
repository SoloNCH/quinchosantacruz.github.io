document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------
    // CONFIGURACIÓN DE DISPONIBILIDAD
    // Agregá las fechas ocupadas en formato 'YYYY-MM-DD'
    // -----------------------------------------
    const diasOcupados = [
        '2026-08-15',
        '2026-08-22',
        '2026-08-28'
    ];

    // Número de teléfono para las reservas (sin el '+')
    const numeroWhatsApp = '5493884662267'; 

    // Elementos del DOM
    const monthYearDisplay = document.getElementById('monthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    let currentDate = new Date(); // Mes actual a mostrar

    const renderCalendar = () => {
        calendarGrid.innerHTML = '';
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0 a 11

        // Nombre del mes y año en español
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

        // Obtener el primer día del mes y la cantidad total de días
        const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Dom, 1=Lun...
        const totalDays = new Date(year, month + 1, 0).getDate();

        // 1. Rellenar los espacios vacíos antes del día 1
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('cal-day', 'empty');
            calendarGrid.appendChild(emptyDiv);
        }

        // 2. Renderizar los días del mes
        for (let day = 1; day <= totalDays; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('cal-day');
            dayDiv.textContent = day;

            // Formatear fecha a 'YYYY-MM-DD' (usando padStart para rellenar con ceros)
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            if (diasOcupados.includes(dateString)) {
                // Día ocupado
                dayDiv.classList.add('booked');
                dayDiv.title = "Reservado";
            } else {
                // Día libre
                dayDiv.classList.add('free');
                dayDiv.title = "Libre - Haz clic para reservar";
                
                // Evento click: Abrir WhatsApp prearmado
                dayDiv.addEventListener('click', () => {
                    // Formatear la fecha para que sea legible en el mensaje (ej: 15/08/2026)
                    const fechaLegible = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
                    const mensaje = `Hola! Quiero reservar el quincho para el día ${fechaLegible}.`;
                    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
                    window.open(url, '_blank');
                });
            }

            calendarGrid.appendChild(dayDiv);
        }
    };

    // Listeners de navegación de meses
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Render inicial
    renderCalendar();
});
