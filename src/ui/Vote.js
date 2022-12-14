import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { disconnect } from '../flux/action';

import { getLog } from '../util/log';

import './Vote.css';

const log = getLog('Vote.');

function componentDidMount(props, dispatch, token) {

	log('componentDidMount', { props, token });
}

function componentDidUpdate(props, prevProps, dispatch, token) {

	log('componentDidUpdate', { props, prevProps });
}

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

function Vote(props) {

	const didMountRef = useRef(false);
	const dispatch = useDispatch();
	const prevProps = usePrevious(props);

	const token = useSelector(state => ((state || {}).reducer || {}).token);

	log('Vote', { props, prevProps, token });

	useEffect(() => {
		if (didMountRef.current) {
			componentDidUpdate(props, prevProps, dispatch, token);
		} else {
			didMountRef.current = true;
			componentDidMount(props, dispatch, token);
		}
	});

	let shareUrl = `${window.location.origin}${window.location.pathname}?id=${token}`;

	return <div className='vote-main'><div className='placeholder' /><p className='share'>Share this session: <a href={shareUrl}>{shareUrl}</a></p><input
		className='disconnect-button'
		onClick={() => dispatch(disconnect())}
		type='button'
		value='Disconnect'
	/></div>;
}

export default Vote;
