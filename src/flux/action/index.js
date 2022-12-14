import { Peer } from 'peerjs';

import { PEER_JS_SERVER_HOST, PEER_JS_SERVER_PATH, PEER_JS_SERVER_PORT } from '../../constant/system';

import * as type from '../type';

import { getLog } from '../../util/log';

const log = getLog('flux.action.index.');

// const doesNothing = ({
// 	type: type.NO_OP
// });

export const connect = tokenPeer => dispatch => {
	const peer = new Peer({
		host: PEER_JS_SERVER_HOST,
		port: PEER_JS_SERVER_PORT,
		path: PEER_JS_SERVER_PATH
	});
	peer.on('open', id => {
		log('connect.open', { id });
		window.history.pushState('', '', `${window.location.pathname}?id=${id}`);
		dispatch(setToken(id, peer));
		if (tokenPeer) {
			dispatch({
				type: type.ADD_PEER,
				peer: tokenPeer
			});
			let connection = peer.connect(tokenPeer);
			connection.on('open', () => {
				log(`peer.${tokenPeer}.open`);
				connection.on('data', data => {
					log(`peer.${tokenPeer}.data`, { data });
				});
			});
			connection.on('close', () => {
				log(`peer.${tokenPeer}.close`);
				dispatch({
					type: type.REMOVE_PEER,
					peer: tokenPeer
				});
			});
			connection.on('error', err => {
				log(`peer.${tokenPeer}.error`, { err });
			});
		}
	});
	peer.on('connection', dataConnection => {
		log('connect.connection', { dataConnection });
	});
	peer.on('call', mediaConnection => {
		log('connect.call', { mediaConnection });
	});
	peer.on('close', () => {
		log('connect.close');
	});
	peer.on('disconnected', () => {
		log('connect.disconnected');
		// TODO error with type 'network' also fires this; decide what to do if it happens by other means and after finding a way to differentiate them
	});
	peer.on('error', err => {
		log('connect.error', { err });
		if (err && err.type) {
			switch (err.type) {
				// fired when the server is stopped or when creating a new Peer with the server offline
				case 'network':
					alert(err.message);
					dispatch(setToken(null, null));
					break;
				default:
			}
		}
	});
};

export const disconnect = () => dispatch => {
	window.history.pushState('', '', window.location.pathname);
	dispatch(setToken(null, null));
};

export const restoreFromLocalStorage = () => ({
	type: type.RESTORE_FROM_LOCAL_STORAGE
});

export const setToken = (token, peer) => dispatch => {
	log('setToken', { token });
	dispatch({
		type: type.SET_TOKEN,
		token,
		peer
	});
};

export const toggleTheme = () => ({
	type: type.TOGGLE_THEME
});
