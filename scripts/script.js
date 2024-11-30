// Google Sheets のデータを取得する関数
async function fetchData() {
    const sheetId = '1lG8omAGpw_dRGv39mDlRTUxrPmohV4CefHXhrX4iQ5M'; // Google スプレッドシートのIDをここに入力
    const range = '最終選考投票日一覧!B3:I'; // データ範囲
    const apiKey = 'AIzaSyB8RK1pZlJHB6htOi_xxXRxdunTjP6KEuc'; // Google API キーをここに入力
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.values;
}

// FullCalendarを初期化する関数
async function initCalendar() {
    const events = await fetchData();
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        customButtons: {
            futabaButton: {
                text: 'ふたば',
                click: function () {
                    location.href = './futaba.html';
                }
            }
        },
        themeSystem: 'standard',
        initialView: 'dayGridMonth',
        locale: 'ja',
        firstDay: 0,
        fixedWeekCount: false,
        headerToolbar: {
            start: 'prev,next',
            center: 'title',
            end: 'futabaButton,dayGridMonth,dayGridWeek,dayGridDay',
        },
        eventOrder: '0',
        contentHeight: 'auto',
        buttonText: {
            week: '週',
            day: '日',
            month: '月',
            list: 'リスト'
        },
        allDayText: '終日',
        validRange: function () {
            return {
                start: '2024-12-01',
                end: '2024-12-14'
            }
        },
        events: events.map(row => ({
            title: row[1] + '　[' + row[2] + ']　予選 ' + row[0] + '位',
            start: row[3],
            description: row[1] + '\n予選 ' + row[0] + '位\n所属：' + row[2] + '\n' + '\n出演場所：' + row[4],
            textColor: row[5],
            backgroundColor: row[6],
            borderColor: row[7],
        })),
        eventClick: function (info) {
            alert(info.event.extendedProps.description);
        },
        views: {
            dayGridMonth: {
                titleFormat: { month: 'long', }
            },
            dayGridWeek: {
                titleFormat: { month: 'long', }
            },
            dayGridDay: {
                titleFormat: { month: 'long', day: 'numeric', }
            },
        }
    });

    calendar.render();
    calendar.updateSize();
}