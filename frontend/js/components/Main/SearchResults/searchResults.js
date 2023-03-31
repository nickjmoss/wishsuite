import React, { useEffect } from 'react';
import styles from './searchResults.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { ModelConnector } from '@app/js/stores';
import SearchResultsModel from './searchResults.model';
import { useSearchParams } from 'react-router-dom';
import { List, Select } from 'antd';
import ItemCard from '@reusableComponents/ItemCard/itemCard';

const cx = classNames.bind(styles);

const SearchResults = observer(({ model }) => {
	const [searchParams] = useSearchParams();
	const query = searchParams.get('query');

	useEffect(() => {
		if (query) {
			model.searchForItems(query);
		}
	}, [query]);

	return (
		<div className={cx('wrapper')}>
			<div className={cx('title')}>
				<span>Showing Results for </span>
				<span className={cx('search-string')}>{`'${query}'`}</span>
			</div>
			<div className={cx('filters-sort')}>
				<div className={cx('filters')}>
					<div className={cx('select')}>
						<Select
						/>
					</div>
					<div className={cx('select')}>
						<Select
						/>
					</div>
				</div>
				<div>Sort</div>
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
					pagination={model.pagination}
					loading={model.isLoading}
				/>
			</div>
		</div>
	);
});

export default ModelConnector(SearchResults, { model: SearchResultsModel });
