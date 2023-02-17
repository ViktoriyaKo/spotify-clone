import axios from 'axios';


async function getToken() {
    let token;
    console.log(token)
    const res = await axios({
        method: 'PUT',
        url: '/api/v1/spotyApi/getToken',
    })
    if(res.data.status === 'success') {
        token = res.data.token;
    }

    return token;
}

async function setDeviceId(deviceId) {
    const res = await axios({
        method: 'PATCH',
        url: '/api/v1/spotyApi/setDeviceId',
        data: {
            deviceId
        }
    })
    if(res.data.status === 'success') {
    }
}

window.onSpotifyWebPlaybackSDKReady = async () => {
    const token = await getToken();

    const player = new Spotify.Player({
        name: 'Spotify Copy',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    player.addListener('ready', async ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        const res = await axios({
            method: 'PUT',
            url: '/api/v1/spotyApi/changeDevice',
            data: {
                deviceId: device_id,
            }
        })
        if(res.data.status === 'success') {
            console.log('device changed');
            await setDeviceId(device_id);
        }
    });

    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });
    player.addListener('initialization_error', ({ message }) => { 
        console.error(message);
    });
  
    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });
  
    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    player.connect();
};
