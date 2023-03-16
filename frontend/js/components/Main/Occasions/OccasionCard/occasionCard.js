import React from 'react';
import { Card, Dropdown } from 'antd';
import styles from './occasionCard.scss';
import classNames from 'classnames/bind';
import { EllipsisOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

const cx = classNames.bind(styles);

const OccasionCard = ({ occasion, isLoading, onDelete }) => {
	return (
		<>
			{occasion &&
				<Card
					loading={isLoading}
					title={null}
					className={cx('occasion-card-wrapper')}
				>
					<div className={cx('content-wrapper')}>
						<div className={cx('title-actions-wrapper')}>
							<div>
								<div className={cx('label')}>Occasion</div>
								<div className={cx('title')}>
									{occasion.name}
								</div>
							</div>
							<Dropdown
								trigger={['click']}
							>
								<div className={cx('menu')} onMouseDown={(e) => e.preventDefault()}><EllipsisOutlined /></div>
							</Dropdown>
						</div>
						<div className={cx('dates', 'spacing')}>
							<div style={{ marginRight: '50px' }}>
								<div className={cx('label')}>Celebration Date</div>
								<div className={cx('date-title')}>
									{dayjs(occasion.celebrate_date).format('MM/DD/YYYY')}
								</div>
							</div>
							{occasion.original_date &&
								<div>
									<div className={cx('label')}>Original Date</div>
									<div className={cx('date-title')}>
										{dayjs(occasion.original_date).format('MM/DD/YYYY')}
									</div>
								</div>
							}
						</div>
					</div>
				</Card>
			}
		</>
	);
};

export default OccasionCard;
