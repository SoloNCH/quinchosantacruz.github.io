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
            
            // Separar filas
            const rows = csvText.split('\n');
            
            rows.forEach((row, index) => {
                if (index === 0) return; 
                
               
                const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
                const fecha = cols[0];
                const apellido = cols[1] || ''; 
                
                if (fecha && fecha.length >= 8) {
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
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

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

                const nameSpan = document.createElement('span');
                nameSpan.classList.add('day-name');
                nameSpan.textContent = apellido;

                dayDiv.appendChild(numSpan);
                dayDiv.appendChild(nameSpan);

                dayDiv.title = apellido ? `Reservado por ${apellido}` : "Reservado";
            } else {
                dayDiv.textContent = day;
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

    cargarDiasOcupados();
});
