window.addEventListener('load', function () {

    //Open and connect socket
    let socket = io();
    //Listen for connection confirmation
    socket.on('connect', function () {
        console.log('Connected');
    });

    //Recieve socket message from server
    let inputBox = this.document.getElementById('confession-responses');

    //Listen for messages named "msg" from the server
    socket.on('msg', function (data) {
        console.log('The message has arrived!');
        console.log(data);

        //Create a message string and page element
        let receivedMsg = (data.name || "Anonymous") + ": " + data.msg;
        let msgElement = document.createElement('p');
        msgElement.innerHTML = receivedMsg;

        //Add the element with the message to the page
        inputBox.appendChild(msgElement);
        inputBox.scrollTop = inputBox.scrollHeight;

    });

    //Send a socket message to the server

    let msgInput = document.getElementById('confession-input');
    let submitButton = document.getElementById('confession-submit');

    submitButton.addEventListener('click', function () {
        let currentMsg = msgInput.value;
        let msgObj = { "msg": currentMsg };

        //Send the message object to the server
        socket.emit('msg', msgObj);

        //Clear input box
        msgInput.value = "";
        // ===== RANDOM CONFESSION BUTTON =====
        let randomBtn = document.getElementById('randomBtn');
        let randomDisplay = document.getElementById('randomDisplay');

        // When button is clicked
        randomBtn.addEventListener('click', function () {
            console.log('Random button clicked');

            // Fetch all confessions from server (which reads from Gist)
            fetch('/getData')
                .then(response => response.json())
                .then(data => {
                    console.log('Data received:', data);

                    // Get the array of confessions
                    let confessions = data.data;

                    // Check if there are any confessions
                    if (confessions.length > 0) {
                        // Pick a random confession
                        let randomIndex = Math.floor(Math.random() * confessions.length);
                        let randomConfession = confessions[randomIndex];

                        // Display it
                        randomDisplay.innerHTML = `<p>"${randomConfession.msg}"</p>`;
                    } else {
                        randomDisplay.innerHTML = '<p>No confessions yet! Submit one first.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching confessions:', error);
                    randomDisplay.innerHTML = '<p>Error loading confessions.</p>';
                });
        });
    });

});


