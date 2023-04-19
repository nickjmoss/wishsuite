import React, { useEffect } from 'react';
import styles from './friendsOccasions.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { List } from 'antd';
import OccasionCard from '../../../Occasions/OccasionCard/occasionCard';
import { ModelConnector } from '@app/js/stores';
import FriendOccasionsModel from './friendsOccasions.model';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

const FriendOccasions = observer(({ model }) => {
	const { friend_id } = useParams();
	useEffect(() => {
		if (friend_id) {
			model.setFriendId(friend_id);
			model.fetchOccasions();
		}
	}, [friend_id]);

	const navigate = useNavigate();

	return (
		<>
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 2,
					md: 3,
					lg: 3,
					xl: 3,
					xxl: 4,
				}}
				dataSource={[...model.occasionList]}
				renderItem={(occasion) => {
					return (
						<List.Item
							key={occasion.id}
							onClick={() => navigate(`${occasion.id}`)}
						>
							<OccasionCard
								occasion={occasion}
								onDelete={(occasion_id) => model.openDeleteModal(occasion_id)}
								onEdit={(occasion_id) => model.openOccasionModal(false, occasion_id)}
								readOnly
							/>
						</List.Item>
					);
				}}
			/>
		</>
	);
});

export default ModelConnector(FriendOccasions, { model: FriendOccasionsModel });
