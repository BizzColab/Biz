import { useEffect, useState, useMemo } from 'react';
import { AutoComplete, Input, Empty } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { useErpContext } from '@/context/erp';
import { selectSearchedItems } from '@/redux/erp/selectors';
import useDebounce from '@/hooks/useDebounce';


export default function Search({ config }) {
  const { entity, searchConfig } = config;
  const { displayLabels, searchFields, outputValue = '_id' } = searchConfig;
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [options, setOptions] = useState([]);
  const debouncedSearchText = useDebounce(searchText, 500);

  const { erpContextAction } = useErpContext();
  const { panel, collapsedBox, readBox } = erpContextAction;

  const { result, isLoading, isSuccess } = useSelector(selectSearchedItems);

  useEffect(() => {
    if (debouncedSearchText) {
      dispatch(
        erp.search(entity, {
          question: debouncedSearchText,
          fields: searchFields,
        })
      );
    }
  }, [debouncedSearchText, entity, searchFields, dispatch]);

  useEffect(() => {
    const optionResults = result.map((item) => {
      const labels = displayLabels.map((x) => item[x]).join(' ');
      return { label: labels, value: item[outputValue] };
    });
    setOptions(optionResults);
  }, [result, displayLabels, outputValue]);

  const onSelect = (data) => {
    const currentItem = result.find((item) => item[outputValue] === data);
    dispatch(erp.currentItem({ data: currentItem }));
    panel.open();
    collapsedBox.open();
    readBox.open();
    setSearchText('');
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  return (
    <AutoComplete
      value={searchText}
      options={options}
      onSelect={onSelect}
      onSearch={onSearch}
      notFoundContent={isLoading ? <div className="searching-loader"><LoadingOutlined /> Searching...</div> : (isSuccess && searchText && options.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No results found" /> : null)}
      allowClear={true}
      popupClassName="search-popup-midnight"
      style={{ width: '100%' }}
    >
      <Input
        prefix={<SearchOutlined className="search-icon-glow" />}
        placeholder="Search items..."
        className="midnight-input"
        variant="borderless"
      />
    </AutoComplete>
  );
}
