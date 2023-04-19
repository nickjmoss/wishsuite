import React, { useEffect } from 'react';
import styles from './friendsItems.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { ModelConnector } from '@app/js/stores';
import FriendsItemsModel from './friendsItems.model';
import WishTable from '@app/js/components/reusableComponents/WishTable/wishTable';
import { Input, Radio, Button, Tag, Dropdown } from 'antd';
import { toLocal } from '@app/js/utils/dayjs';
import ItemDetailsModal from '@app/js/components/Main/Wishlists/WishlistDetails/ItemDetailsModal/itemDetailsModal';
import numeral from 'numeral';

const cx = classNames.bind(styles);

const FriendsItems = observer(({ model }) => {
	const { wishlist_id } = useParams();
	useEffect(() => {
		if (wishlist_id) {
			model.fetchWishlist(wishlist_id);
		}
	}, [wishlist_id]);

	const columns = [
		{
			dataIndex: 'title',
			key: 'title',
			title: 'Item Description',
			width: '50%',
			render: (title, record) => (
				<div className={cx('item')}>
					{record.images.length > 0 ?
						<div>
							<img width={60} src={record.images[0].thumbnailImage} crossOrigin="anonymous"/>
						</div>
						:
						<div>
							<img width={60} src="https://res.cloudinary.com/dbtgm7sed/image/upload/v1675713800/logos/icon-color_pekgin.png" crossOrigin="anonymous" />
						</div>
					}
					<div className={cx('item-title')}>
						<div>{title}</div>
						{record.description ?
							<div className={cx('item-description')}>{record.description}</div>
							:
							<div className={cx('item-description')}>Custom Wish</div>
						}
					</div>
				</div>
			),
		},
		{
			dataIndex: 'source',
			key: 'source',
			title: 'Source',
			sorter: true,
		},
		{
			dataIndex: 'price',
			key: 'price',
			title: 'Price',
			sorter: true,
			render: (price) => (
				<div>${numeral(price).format('0,0.00')}</div>
			),
		},
		{
			dataIndex: 'quantity',
			key: 'quantity',
			title: 'Quantity',
			sorter: true,
		},
		{
			dataIndex: 'status',
			key: 'status',
			title: 'Status',
			sorter: true,
			render: (status, record) => (
				<Tag color={tagColors[status]} >{status}{status === 'Reserved' && ` by ${model.isReserver(record.reserverId) ? 'You' : record.reserver.fullName}`}</Tag>
			),
		},
		{
			dataIndex: 'mostWanted',
			key: 'mostWanted',
			title: 'Most Wanted',
			sorter: true,
			render: (mostWanted) => (
				<div>{mostWanted ? 'Yes' : 'No'}</div>
			),
		},
	];

	const tagColors = {
		'Pending': 'yellow',
		'Gifted': 'green',
		'Published': 'green',
		'Unpublished': 'red',
		'Reserved': 'orange',
	};

	return (
		<div className={cx('wrapper')}>
			{model.wishlist &&
				<>
					<div className={cx('header')}>
						<div className={cx('wishlist-name')}>{model.wishlist.name}</div>
					</div>
					<div className={cx('wishlist-details')}>
						<div className={cx('detail')}>
							<span className={cx('detail-title')}>Occasion: </span>
							<span className={cx('detail-value')}>{model.wishlist.occasion ? model.wishlist.occasion.name : 'None'}</span>
						</div>
						<div className={cx('detail')}>
							<span className={cx('detail-title')}>Date of Creation: </span>
							<span className={cx('detail-value')}>
								{toLocal(model.wishlist.createdAt).format('MM/DD/YYYY')}
							</span>
						</div>
						<div className={cx('detail')}>
							<span className={cx('detail-title')}>Number of Items: </span>
							<span className={cx('detail-value')}>
								{model.wishlist.items.length}
							</span>
						</div>
					</div>
					<div className={cx('description')}>
						{model.wishlist.description}
					</div>
					<div className={cx('filter-wrapper')}>
						<div className={cx('filter')}>
							{model.selectedRows.length > 0 &&
								<Dropdown
									trigger="click"
									menu={{
										items: [
											{
												label: <span className={cx('reserved')}>{`Reserve ${model.itemTextCaps}`}</span>,
												key: 1,
												onClick: model.reserveItem,
											},
											{
												label: `Unreserve ${model.itemTextCaps}`,
												key: 2,
												onClick: model.unreserveItem,
												danger: true,
											},
										],
									}}
								>
									<Button type="default" >Item Actions</Button>
								</Dropdown>
							}
						</div>
						<div className={cx('filter')}>
							<Radio.Group defaultValue="all" buttonStyle="solid" onChange={(e) => model.setFilter(e.target.value)}>
								<Radio.Button value="all">All</Radio.Button>
								<Radio.Button value="Pending">Pending</Radio.Button>
								<Radio.Button value="Gifted">Gifted</Radio.Button>
								<Radio.Button value="Reserved">Reserved</Radio.Button>
							</Radio.Group>
						</div>
						<div className={cx('filter')}>
							<Input.Search onSearch={model.setSearch}/>
						</div>
					</div>
					<WishTable
						dataSource={[...model.items]}
						columns={columns}
						pagination={model.pagination}
						rowKey={(record) => record.id}
						rowSelection={{
							selectedRowKeys: [...model.selectedRows],
							onSelect: (_, __, rows) => model.setSelectedRows(rows, _),
							onSelectAll: (_, rows) => model.setSelectedRows(rows),
							getCheckboxProps: (record) => ({
								disabled: record.status === 'Gifted' || (record.reserved && !model.isReserver(record.reserverId)),
							}),
						}}
						onRow={(record) => {
							return {
								onClick: () => {
									model.openItemDetailsModal(record);
								},
							};
						}}
						loading={model.isLoading}
						onChange={model.onTableChange}
					/>
				</>
			}
			{model.itemDetails &&
				<ItemDetailsModal
					open={model.showItemDetailsModal}
					onCancel={model.closeItemDetailsModal}
					item={model.itemDetails}
					wishlistName={model.wishlistName}
				/>
			}
		</div>
	);
});

export default ModelConnector(FriendsItems, { model: FriendsItemsModel });
