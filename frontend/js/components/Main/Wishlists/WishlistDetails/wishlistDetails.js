import React, { useEffect } from 'react';
import styles from './wishlistDetails.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { ModelConnector } from '@app/js/stores';
import WishlistDetailsModel from './wishlistDetails.model';
import WishTable from '@app/js/components/reusableComponents/WishTable/wishTable';
import { Input, Radio, Button, Tag, Dropdown, Select } from 'antd';
import { toLocal } from '@app/js/utils/dayjs';
import { PlusOutlined } from '@ant-design/icons';
import DeleteModal from '@app/js/components/reusableComponents/DeleteModal/deleteModal';
import WishModal from '@app/js/components/reusableComponents/WishModal/wishModal';
import CustomWishModal from './CustomWishModal/customWishModal';
import ItemDetailsModal from './ItemDetailsModal/itemDetailsModal';
import numeral from 'numeral';
import UpdateWishlistsModal from './UpdateWishlistModal/updateWishlistModal';

const cx = classNames.bind(styles);

const WishlistDetails = observer(({ model }) => {
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
			render: (source) => {
				if (source) {
					return (
						<div>{source}</div>
					);
				}
				return (
					<div>None</div>
				);
			},
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
			render: (status) => (
				<Tag color={tagColors[status]}>{status}</Tag>
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
	};

	return (
		<div className={cx('wrapper')}>
			{model.wishlist &&
				<>
					<div className={cx('header')}>
						<div className={cx('wishlist-name')}>{model.wishlist.name}</div>
						<div className={cx('header-buttons')}>
							<Button className={cx('button')} onClick={model.openUpdateWishlistModal} type="default">Edit Wishlist</Button>
							<Button
								className={cx('button', model.wishlist.isPublished ? 'unpublish' : 'publish')}
								type="primary"
								onClick={model.wishlist.isPublished ? model.unpublishWishlist : model.publishWishlist}
							>
								{model.wishlist.isPublished ? 'Unpublish' : 'Publish'}
							</Button>
						</div>
					</div>
					<div className={cx('wishlist-details')}>
						<div className={cx('detail')}>
							<span className={cx('detail-title')}>Occasion: </span>
							<span className={cx('detail-value')}>{model.wishlist.occasion ? model.wishlist.occasion.name : 'None'}</span>
						</div>
						<div className={cx('detail')}>
							<span className={cx('detail-title')}>Wishlist Status: </span>
							<span className={cx('detail-value')}>
								<Tag color={tagColors[model.isPublished]}>{model.isPublished}</Tag>
							</span>
						</div>
						<div className={cx('detail')}>
							<span className={cx('detail-title')}>Date of Creation: </span>
							<span className={cx('detail-value')}>
								{toLocal(model.wishlist.createdAt).format('MM/DD/YYYY')}
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
												label: <span className={cx('gifted')}>{`Mark ${model.itemTextCaps} as Gifted`}</span>,
												key: 1,
												onClick: () => model.updateItemStatus('Gifted'),
											},
											{
												label: <span className={cx('pending')}>{`Mark ${model.itemTextCaps} as Pending`}</span>,
												key: 2,
												onClick: () => model.updateItemStatus('Pending'),
											},
											{
												label: `Copy ${model.itemTextCaps}`,
												key: 3,
												onClick: model.openCopyModal,
											},
											{
												label: `Delete ${model.itemTextCaps}`,
												key: 4,
												danger: true,
												onClick: model.openDeleteModal,
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
							</Radio.Group>
						</div>
						<div className={cx('filter')}>
							<Input.Search onSearch={model.setSearch}/>
						</div>
						<div className={cx('filter')}>
							<Button type="primary" onClick={model.openCustomWishModal} icon={<PlusOutlined/>}>Add Custom Wish</Button>
						</div>
					</div>
					<WishTable
						dataSource={[...model.items]}
						columns={columns}
						pagination={model.pagination}
						rowKey={(record) => record.id}
						rowSelection={{
							selectedRowKeys: [...model.selectedRows],
							onSelect: (_, __, rows) => model.setSelectedRows(rows),
							onSelectAll: (_, rows) => model.setSelectedRows(rows),
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
			<DeleteModal
				deleteText={`Are you sure you would like to remove the selected ${model.itemText} from this wishlist? This action cannot be undone.`}
				deleteTitle={`Delete ${model.itemTextCaps} from Wishlist`}
				onCancel={model.closeDeleteModal}
				onDelete={model.deleteItems}
				open={model.showDeleteModal}
			/>
			<WishModal
				title={`Copy ${model.itemTextCaps} to Another Wishlist`}
				onPrimary={model.copyItems}
				onCancel={model.closeCopyModal}
				primaryButtonText={`Copy ${model.itemTextCaps}`}
				primaryButtonProps={{ disabled: !model.copyToWishlist }}
				open={model.showCopyModal}
			>
				<div>
					<div className={cx('copy-text')}>{`Which wishlist would you like to copy your ${model.itemText} to?`}</div>
					<Select
						options={model.wishlistsView && [...model.wishlistsView]}
						placeholder="Select a Wishlist"
						onSelect={model.setCopyToWishlist}
						allowClear
						onClear={model.clearCopyToWishlist}
						showSearch
						className={cx('copy-select')}
					/>
				</div>
			</WishModal>
			<CustomWishModal
				open={model.showCustomWishModal}
				onPrimary={model.addCustomWish}
				onCancel={model.closeCustomWishModal}
				setLink={model.setLink}
				setMostWanted={model.setMostWanted}
				setName={model.setName}
				setNotes={model.setNotes}
				setQuantity={model.setQuantity}
				setSource={model.setSource}
				setPrice={model.setPrice}
			/>
			{model.itemDetails &&
				<ItemDetailsModal
					open={model.showItemDetailsModal}
					onCancel={model.closeItemDetailsModal}
					item={model.itemDetails}
					wishlistName={model.wishlistName}
				/>
			}
			{model.wishlist &&
				<UpdateWishlistsModal
					open={model.showUpdateWishlistModal}
					onPrimary={model.updateWishlist}
					onCancel={model.closeUpdateWishlistModal}
					occasionList={[...model.occasionList]}
					wishlist={model.wishlist}
					setWishlistName={model.setWishlistName}
					setWishlistDescription={model.setWishlistDescription}
					setWishlistIsPublished={model.setWishlistIsPublished}
					setWishlistOccasion={model.setWishlistOccasion}
				/>
			}
		</div>
	);
});

export default ModelConnector(WishlistDetails, { model: WishlistDetailsModel });
