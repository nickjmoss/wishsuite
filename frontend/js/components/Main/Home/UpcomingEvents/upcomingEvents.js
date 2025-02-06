import React from 'react';
import styles from './upcomingEvents.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';

const cx = classNames.bind(styles);

const UpcomingEvents = observer(({ model }) => {
	return (
		<div>
			<div className={cx('title')}>Upcoming Events</div>
		</div>
	);
});

export default UpcomingEvents;