import React, { useEffect } from 'react';
import styles from './searchResults.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { ModelConnector } from '@app/js/stores';
import SearchResultsModel from './searchResults.model';
import { useSearchParams } from 'react-router-dom';
import { List, Select } from 'antd';
import ItemCard from '@reusableComponents/ItemCard/itemCard';
import AddItemModal from './AddItemModal/addItemModal';

const cx = classNames.bind(styles);

const SearchResults = observer(({ model }) => {
	const [searchParams] = useSearchParams();
	const query = searchParams.get('query');

	useEffect(() => {
		if (query) {
			model.setSearchTerm(query);
			model.searchForItems();
		}
	}, [query]);

	const sortByOptions = [
		{ label: 'Price: Lowest to Highest', value: 'price_asc', col: 'price', direction: 'asc' },
		{ label: 'Price: Highest to Lowest', value: 'price_desc', col: 'price', direction: 'desc' },
		{ label: 'A-Z', value: 'title', col: 'title', direction: 'asc' },
		{ label: 'Rating: Highest to Lowest', value: 'reviews_desc', col: 'reviews', direction: 'desc' },
		{ label: 'Rating: Lowest to Highest', value: 'reviews_asc', col: 'reviews', direction: 'asc' },
	];

	return (
		<div className={cx('wrapper')}>
			<div className={cx('title')}>
				<span>Showing Results for </span>
				<span className={cx('search-string')}>{`'${query}'`}</span>
			</div>
			<div className={cx('filters-sort')}>
				<div className={cx('filters')}>
					<Select
						placeholder="Brand"
						dropdownMatchSelectWidth={false}
						allowClear
						className={cx('select')}
						onSelect={model.setBrand}
						onClear={model.clearBrand}
					>
						{model.brands.map((brand, i) => (
							<Select.Option value={brand} label={brand} key={i} />
						))}
					</Select>
					<Select
						placeholder="Color"
						dropdownMatchSelectWidth={false}
						allowClear
						className={cx('select')}
						onSelect={model.setColor}
						onClear={model.clearColor}
					>
						{model.colors.map((brand, i) => (
							<Select.Option value={brand} label={brand} key={i} />
						))}
					</Select>
				</div>
				<div className={cx('sort')}>
					<Select
						placeholder="Sort By"
						className={cx('select')}
						options={sortByOptions}
						onChange={(_, node) => model.onSort(node)}
						dropdownMatchSelectWidth={false}
						allowClear
					/>
				</div>
			</div>
			<div>
				<List
					dataSource={[...model.itemsList]}
					renderItem={
						(item) => (
							<div className={cx('item-card')}>
								<ItemCard onPrimary={model.openAddItemModal} item={item}/>
							</div>
						)
					}
					grid={{
						xs: 1,
						sm: 2,
						md: 3,
						lg: 3,
						xl: 4,
						xxl: 4,
					}}
					className={cx('item-list')}
					pagination={{
						...model.pagination,
						position: 'bottom',
						onChange: model.onPageChange,
						pageSizeOptions: [
							'12',
							'15',
							'20',
							'25',
						],
					}}
					loading={model.isLoading}
				/>
			</div>
			{model.itemToAdd &&
				<AddItemModal
					open={model.showAddItemModal}
					onCancel={model.closeAddItemModal}
					item={model.itemToAdd}
				/>
			}
		</div>
	);
});

export default ModelConnector(SearchResults, { model: SearchResultsModel });
