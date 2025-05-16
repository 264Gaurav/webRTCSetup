let peerConnection = new RTCPeerConnection();
let localStream;
let remoteStream;

let init = async () => {
    // Request both video and audio from the user's media devices
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    remoteStream = new MediaStream();

    // Set the local and remote streams to the respective video elements
    document.getElementById('user-1').srcObject = localStream;
    document.getElementById('user-2').srcObject = remoteStream;

    // Add all tracks (video + audio) from the local stream to the peer connection
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    // Handle incoming tracks from the remote peer and add them to the remote stream
    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };
};

let createOffer = async () => {
    peerConnection.onicecandidate = async (event) => {
        // Event that fires off when a new offer ICE candidate is created
        if (event.candidate) {

            //to check if the candidate is a local IP or public IP or relay IP
            const candidate = event.candidate;
            console.log('ICE Candidate:', candidate);

            // Parse the candidate to determine the type of IP
            const candidateType = candidate.type; // 'host', 'srflx', or 'relay'
            const candidateAddress = candidate.address || candidate.ip; // IP address of the candidate

            if (candidateType === 'host') {
                console.log(`Local IP: ${candidateAddress}`);
            } else if (candidateType === 'srflx') {
                console.log(`Public IP (via STUN): ${candidateAddress}`);
            } else if (candidateType === 'relay') {
                console.log(`Relay IP (via TURN): ${candidateAddress}`);
            }




            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription);
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};

let createAnswer = async () => {
    let offer = JSON.parse(document.getElementById('offer-sdp').value);

    peerConnection.onicecandidate = async (event) => {
        // Event that fires off when a new answer ICE candidate is created
        if (event.candidate) {
            console.log('Adding answer candidate...:', event.candidate);

            //to check if the candidate is a local IP or public IP or relay IP
            const candidate = event.candidate;
            console.log('ICE Candidate:', candidate);

            // Parse the candidate to determine the type of IP
            const candidateType = candidate.type; // 'host', 'srflx', or 'relay'
            const candidateAddress = candidate.address || candidate.ip; // IP address of the candidate

            if (candidateType === 'host') {
                console.log(`Local IP: ${candidateAddress}`);
            } else if (candidateType === 'srflx') {
                console.log(`Public IP (via STUN): ${candidateAddress}`);
            } else if (candidateType === 'relay') {
                console.log(`Relay IP (via TURN): ${candidateAddress}`);
            }


            document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription);
        }
    };

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
};

let addAnswer = async () => {
    console.log('Add answer triggered');
    let answer = JSON.parse(document.getElementById('answer-sdp').value);
    console.log('answer:', answer);
    if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer);
    }
};

init();

document.getElementById('create-offer').addEventListener('click', createOffer);
document.getElementById('create-answer').addEventListener('click', createAnswer);
document.getElementById('add-answer').addEventListener('click', addAnswer);





















// let peerConnection = new RTCPeerConnection()
// let localStream;
// let remoteStream;

// let init = async () => {
//     localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
//     remoteStream = new MediaStream()
//     document.getElementById('user-1').srcObject = localStream
//     document.getElementById('user-2').srcObject = remoteStream

//     localStream.getTracks().forEach((track) => {
//         peerConnection.addTrack(track, localStream);
//     });

//     peerConnection.ontrack = (event) => {
//         event.streams[0].getTracks().forEach((track) => {
//         remoteStream.addTrack(track);
//         });
//     };
// }

// let createOffer = async () => {


//     peerConnection.onicecandidate = async (event) => {
//         //Event that fires off when a new offer ICE candidate is created
//         if(event.candidate){
//             document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
//         }
//     };

//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
// }

// let createAnswer = async () => {

//     let offer = JSON.parse(document.getElementById('offer-sdp').value)

//     peerConnection.onicecandidate = async (event) => {
//         //Event that fires off when a new answer ICE candidate is created
//         if(event.candidate){
//             console.log('Adding answer candidate...:', event.candidate)
//             document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription)
//         }
//     };

//     await peerConnection.setRemoteDescription(offer);

//     let answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer); 
// }

// let addAnswer = async () => {
//     console.log('Add answer triggerd')
//     let answer = JSON.parse(document.getElementById('answer-sdp').value)
//     console.log('answer:', answer)
//     if (!peerConnection.currentRemoteDescription){
//         peerConnection.setRemoteDescription(answer);
//     }
// }

// init()

// document.getElementById('create-offer').addEventListener('click', createOffer)
// document.getElementById('create-answer').addEventListener('click', createAnswer)
// document.getElementById('add-answer').addEventListener('click', addAnswer)
