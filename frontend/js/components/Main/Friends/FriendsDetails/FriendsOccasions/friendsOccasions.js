import React, { useEffect } from 'react';
import styles from './friendsOccasions.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { List } from 'antd';
import OccasionCard from '../../../Occasions/OccasionCard/occasionCard';
import { ModelConnector } from '@app/js/stores';
import FriendOccasionsModel from './friendsOccasions.model';
import { useParams } from 'react-router-dom';
import OccasionDetailsModal from '@app/js/components/reusableComponents/OccasionDetailsModal/occasionDetailsModal';

const cx = classNames.bind(styles);

const FriendOccasions = observer(({ model }) => {
	const { friend_id } = useParams();
	useEffect(() => {
		if (friend_id) {
			model.setFriendId(friend_id);
			model.fetchOccasions();
		}
	}, [friend_id]);

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
							onClick={() => model.openDetailsModal(`${occasion.id}`)}
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
			{model.occasionToDetail &&
				<OccasionDetailsModal
					open={model.showDetailsModal}
					onCancel={model.closeDetailsModal}
					occasion={model.occasionToDetail}
				/>
			}
		</>
	);
});

export default ModelConnector(FriendOccasions, { model: FriendOccasionsModel });
