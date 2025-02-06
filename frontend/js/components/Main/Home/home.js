import React from 'react';
import Spinner from '@reusableComponents/Spinner/spinner';
import styles from './home.scss';
import classNames from 'classnames/bind';
import UpcomingEvents from './UpcomingEvents/upcomingEvents';
import { UpcomingEventsModel } from './UpcomingEvents/upcomingEvents.model';

const cx = classNames.bind(styles);

const Home = () => {
	return (
		<div>
			<UpcomingEvents model={UpcomingEventsModel.create({})}/>
		</div>
	);
};

export default Home;
