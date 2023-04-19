import React from 'react';
import { Card, Dropdown } from 'antd';
import styles from './occasionCard.scss';
import classNames from 'classnames/bind';
import { EllipsisOutlined } from '@ant-design/icons';
import { toLocal } from '@app/js/utils/dayjs';
import { observer } from 'mobx-react-lite';

const cx = classNames.bind(styles);

const OccasionCard = observer(({ occasion, onDelete, onEdit, readOnly }) => {
	return (
		<>
			{occasion &&
				<Card
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
							<div className={cx('menu')} onClick={(e) => e.stopPropagation()}>
								{!readOnly &&
									<Dropdown
										trigger={['click']}
										menu={{ items: [
											{
												key: '1',
												label: (
													<div onClick={() => onEdit(occasion.id)}>
														Edit Occasion
													</div>
												),
											},
											{
												key: '2',
												label: (
													<div onClick={() => onDelete(occasion.id)}>
														Delete Occasion
													</div>
												),
												danger: true,
											},
										],
										}}
										placement="bottom"
									>
										<div onClick={(e) => e.stopPropagation() }><EllipsisOutlined /></div>
									</Dropdown>
								}
							</div>
						</div>
						<div className={cx('dates', 'spacing')}>
							<div style={{ marginRight: '50px' }}>
								<div className={cx('label')}>Celebration Date</div>
								<div className={cx('date-title')}>
									{toLocal(occasion.celebrateDate).format('MM/DD/YYYY')}
								</div>
							</div>
							{occasion.originalDate &&
								<div>
									<div className={cx('label')}>Original Date</div>
									<div className={cx('date-title')}>
										{toLocal(occasion.originalDate).format('MM/DD/YYYY')}
									</div>
								</div>
							}
						</div>
					</div>
				</Card>
			}
		</>
	);
});

export default OccasionCard;
