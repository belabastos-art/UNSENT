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
    });

});