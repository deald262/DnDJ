window.addEventListener('load', () => {
    const socket = io(); // Connect to the server via Socket.io
    const audioPlayers = document.getElementsByClassName('audioPlayer');
    let index = 0;
/*
    const playButton = document.getElementById('playButton');
    console.log(playButton);
    // Event listener for play button
    playButton.addEventListener('click', () => {
        // Emit the 'play-audio' event to the server
        index=0;
        socket.emit('play-audio');
    });

*/
    socket.on("global-updated", (data) => {
        index = data.index;
    })
    socket.on('play-audio', () => {
        // Play the audio when the event is received
        console.log(index);
        let ap = audioPlayers[index];
        ap.play().catch(error => {
            console.log('Autoplay failed:', error);
        });
    });
    // Listen for the 'play-audio' event from the server


    google.charts.load('current', {packages: ['corechart']});


    const drawDanielChart = () => {
        const data = google.visualization.arrayToDataTable([
            ['button', 'part'],
            ['option 1',    1],
            ['option 2',    1],
            ['option 3',    1],
            ['option 4',    1],
        ]);

        const options = {
            pieHole: 0.3,
            chartArea: { width: '90%', height: '80%'},
            legend: {position: 'none'},
            slices: [{color: 'cyan'}, {color: "pink"}, {}, {color: "gold"}],
            tooltip: {trigger:"none"},

        };


        const chart = new google.visualization.PieChart(document.getElementById('soundboard'));
        google.visualization.events.addListener(chart, 'select', function() {
            var selectedItem = chart.getSelection()[0];
            if (selectedItem) {
                var item = selectedItem.row;
                handleClick(item);
            }
        });

        chart.draw(data, options);

    };

    function handleClick(item) {
        switch (item) {
            case 0:
                socket.emit("setIndex", 0);
                break;
            case 1:
                socket.emit("setIndex", 1);
                break;
            case 2:
                socket.emit("setIndex", 2);
                break;
            case 3:
                socket.emit("setIndex", 3);
                break;
            default:
                alert("Invalid selection");
                break;
        }
        socket.emit('play-audio');
    }
    google.charts.setOnLoadCallback(drawDanielChart);


})


// Handle click events based on the selected slice
