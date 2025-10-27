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

//LOWDB IMPLEMENTATION
window.addEventListener('load', () => {
    document.getElementById('confession-submit').addEventListener('click', () => {
        //get input value
        let newData = document.getElementById('confession-input').value;
        console.log(newData);

        //create object
        let obj = { "confession-responses": newData };

        //stringify object
        let jsonData = JSON.stringify(obj);

        //Make a fetch request of type POST so we can send confessions data to the server
        fetch('/newData', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: jsonData
        })
        .then(response => response.json())
        .then(data => { console.log(data) });
    })

    document.getElementById('get-tracker').addEventListener('click', () => {
        //get info of ALL confessions so far
        fetch('/getData')
        .then(response => response.json())
        .then(data => {
            document.getElementById('confession-responses').innerHTML = '';
            console.log(data.data);
            for (let i = 0; i<data.data.length; i++) {
                let string = data.data[i] + " : " + data.data[i].msg;
                let elt = document.createElement('p');
                elt.innerHTML = string;
                document.getElementById('confession-responses').appendChild(elt);
            }
        })
    })

});
