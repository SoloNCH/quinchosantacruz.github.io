document.addEventListener('DOMContentLoaded', () => {
    const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUXsb_KvJIHZmlDHH-LhGmaQ_uL1c_zLDhpCLJX43TLdojfTd1pQSDolHBxTUX2v_0wF4rrIMFtYcS/pub?gid=0&single=true&output=csv';
    const numeroWhatsApp = '5493884662267'; 

    const monthYearDisplay = document.getElementById('monthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    let currentDate = new Date();
    let reservas = {};

    const cargarDiasOcupados = async () => {
        try {
            const response = await fetch(SHEET_CSV_URL);
            const csvText = await response.text();
            
            reservas = {};
            const lines = csvText.split('\n');
            
            lines.forEach((line) => {
                const row = line.trim();
                if (!row) return;

                const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
                const fecha = cols[0];
                const apellido = cols[1] || '';

                if (fecha && fecha.toLowerCase() !== 'fecha') {
                    reservas[fecha] = apellido;
                }
            });

            renderCalendar();
        } catch (error) {
            console.error('Error al cargar las reservas:', error);
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

        let monthTitle = `${monthNames[month]} ${year}`;
        monthYearDisplay.textContent = monthTitle;

        const promoBadgeExistente = document.getElementById('promoBadge');
        if (promoBadgeExistente) promoBadgeExistente.remove();

        if (month === 7) {
            const promoBadge = document.createElement('div');
            promoBadge.id = 'promoBadge';
            promoBadge.classList.add('promo-badge');
            promoBadge.innerHTML = '🔥 ¡MES DE PROMOCIÓN! 🔥';
            monthYearDisplay.insertAdjacentElement('afterend', promoBadge);
        }

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('cal-day', 'empty');
            calendarGrid.appendChild(emptyDiv);
        }

        for (let day = 1; day <= totalDays; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('cal-day');

            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            if (dateString in reservas) {
                const apellido = reservas[dateString];
                dayDiv.classList.add('booked');

                const numSpan = document.createElement('span');
                numSpan.classList.add('day-number');
                numSpan.textContent = day;
                dayDiv.appendChild(numSpan);

                if (apellido) {
                    const nameSpan = document.createElement('span');
                    nameSpan.classList.add('day-name');
                    nameSpan.textContent = apellido;
                    dayDiv.appendChild(nameSpan);
                    dayDiv.title = `Reservado por ${apellido}`;
                } else {
                    dayDiv.title = "Reservado";
                }
            } else {
                dayDiv.textContent = day;
                dayDiv.classList.add('free');
                
                if (month === 7) {
                    dayDiv.title = "¡Día en Promo! Clic para consultar precio promocional";
                } else {
                    dayDiv.title = "Libre - Haz clic para reservar";
                }
                
                dayDiv.addEventListener('click', () => {
                    const fechaLegible = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
                    let mensaje = `Hola! Quiero reservar el quincho para el día ${fechaLegible}.`;
                    
                    if (month === 7) {
                        mensaje = `Hola! Vengo por la promo de Agosto, quiero consultar para reservar el día ${fechaLegible}.`;
                    }

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

    cargarDiasOcupados();
});
