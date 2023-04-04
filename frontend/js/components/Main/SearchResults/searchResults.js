import React, { useEffect } from 'react';
import styles from './searchResults.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { ModelConnector } from '@app/js/stores';
import SearchResultsModel from './searchResults.model';
import { useSearchParams } from 'react-router-dom';
import { List, Rate, Select, Slider, Button } from 'antd';
import ItemCard from '@reusableComponents/ItemCard/itemCard';

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

	const reviewOptions = [
		{ label: '5 Stars', value: 5 },
		{ label: '4 Stars', value: 4 },
		{ label: '3 Stars', value: 3 },
		{ label: '2 Stars', value: 2 },
		{ label: '1 Stars', value: 1 },
	];

	return (
		<div className={cx('wrapper')}>
			<div className={cx('title')}>
				<span>Showing Results for </span>
				<span className={cx('search-string')}>{`'${query}'`}</span>
			</div>
			<div className={cx('filters-sort')}>
				<div className={cx('filters')}>
					<div>
						<Select
							placeholder="Price"
							className={cx('select')}
							onClick={model.openPriceRange}
							allowClear
							dropdownMatchSelectWidth={false}
							open={model.showPriceRange}
							dropdownRender={(menu) => (
								<div onClick={(e) => e.stopPropagation()}>
									{model.totalMin && model.totalMax &&
										<Slider
											className={cx('slider')}
											range={{ draggableTrack: true }}
											min={model.totalMin}
											max={model.totalMax}
											defaultValue={[model.totalMin, model.totalMax]}
											onChange={model.setPriceRange}
											marks={{
												[model.totalMin]: {
													style: { marginTop: '10px' },
													label: `$${model.totalMin.toLocaleString()}`,
												},
												[model.totalMax]: {
													style: { marginTop: '10px' },
													label: `$${model.totalMax.toLocaleString()}`,
												},
											}}
										/>
									}
									<div className={cx('slider-buttons')}>
										<Button className={cx('slider-button')} type="default" onClick={(e) => { e.stopPropagation(); model.cancelPriceRange() }}>Cancel</Button>
										<Button className={cx('slider-button')} type="primary" onClick={(e) => { e.stopPropagation(); model.applyPriceRange() }}>Apply</Button>
									</div>
								</div>
							)}
						/>
					</div>
					<div>
						<Select
							placeholder="Reviews"
							dropdownMatchSelectWidth={false}
							allowClear
							className={cx('select')}
						>
							{reviewOptions.map((option, i) => (
								<Select.Option key={i} value={option.value} label={option.label}>
									<Rate disabled value={option.value}/>
								</Select.Option>
							))}
						</Select>
					</div>
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
					renderItem={(item) => ( <div className={cx('item-card')}><ItemCard item={item}/></div> )}
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
		</div>
	);
});

export default ModelConnector(SearchResults, { model: SearchResultsModel });
